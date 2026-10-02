// Real-time GPU fluid simulation (stable fluids / Navier–Stokes) with
// vorticity confinement, shading and bloom. Raw WebGL — no dependencies.
// Velocity and dye live in half-float framebuffers; every step runs:
// curl → vorticity → divergence → pressure (Jacobi) → gradient subtract
// → advection. Splats inject force + colored dye at a point.

const DEFAULTS = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 0.36,
  velocityDissipation: 0.22,
  pressure: 0.8,
  pressureIterations: 20,
  curl: 34,
  splatRadius: 0.22,
  shading: true,
  bloom: true,
  bloomIterations: 8,
  bloomResolution: 256,
  bloomIntensity: 0.6,
  bloomThreshold: 0.55,
  bloomSoftKnee: 0.7,
  exposure: 1.3,
  background: [0.027, 0.02, 0.05],
};

const BASE_VERTEX = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const HEADER = `
  precision highp float;
  precision highp sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
`;

const SHADERS = {
  copy: `${HEADER}
    uniform sampler2D uTexture;
    void main () { gl_FragColor = texture2D(uTexture, vUv); }`,

  clear: `${HEADER}
    uniform sampler2D uTexture;
    uniform float value;
    void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,

  splat: `${HEADER}
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
      vec2 p = vUv - point.xy;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
    }`,

  advection: `${HEADER}
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;
    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5;
      vec2 iuv = floor(st);
      vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }
    void main () {
    #ifdef MANUAL_FILTERING
      vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
      vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      vec4 result = texture2D(uSource, coord);
    #endif
      gl_FragColor = result / (1.0 + dissipation * dt);
    }`,

  divergence: `${HEADER}
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; }
      if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; }
      if (vB.y < 0.0) { B = -C.y; }
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,

  curl: `${HEADER}
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,

  vorticity: `${HEADER}
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
      velocity = min(max(velocity, -1000.0), 1000.0);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }`,

  pressure: `${HEADER}
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float divergence = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
    }`,

  gradientSubtract: `${HEADER}
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }`,

  bloomPrefilter: `${HEADER}
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;
    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      float br = max(c.r, max(c.g, c.b));
      float rq = clamp(br - curve.x, 0.0, curve.y);
      rq = curve.z * rq * rq;
      c *= max(rq, br - threshold) / max(br, 0.0001);
      gl_FragColor = vec4(c, 0.0);
    }`,

  bloomBlur: `${HEADER}
    uniform sampler2D uTexture;
    void main () {
      vec4 sum = texture2D(uTexture, vL) + texture2D(uTexture, vR)
               + texture2D(uTexture, vT) + texture2D(uTexture, vB);
      gl_FragColor = sum * 0.25;
    }`,

  bloomFinal: `${HEADER}
    uniform sampler2D uTexture;
    uniform float intensity;
    void main () {
      vec4 sum = texture2D(uTexture, vL) + texture2D(uTexture, vR)
               + texture2D(uTexture, vT) + texture2D(uTexture, vB);
      gl_FragColor = sum * 0.25 * intensity;
    }`,

  display: `${HEADER}
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform vec2 texelSize;
    uniform vec3 background;
    uniform float exposure;
    vec3 linearToGamma (vec3 color) {
      color = max(color, vec3(0.0));
      return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0.0));
    }
    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
    #ifdef SHADING
      vec3 lc = texture2D(uTexture, vL).rgb;
      vec3 rc = texture2D(uTexture, vR).rgb;
      vec3 tc = texture2D(uTexture, vT).rgb;
      vec3 bc = texture2D(uTexture, vB).rgb;
      float dx = length(rc) - length(lc);
      float dy = length(tc) - length(bc);
      vec3 n = normalize(vec3(dx, dy, length(texelSize)));
      float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
      c *= diffuse;
    #endif
    #ifdef BLOOM
      c += linearToGamma(texture2D(uBloom, vUv).rgb);
    #endif
      // Filmic roll-off: bright cores glow but never clip to flat white.
      c = 1.0 - exp(-c * exposure);
      gl_FragColor = vec4(background + c * (1.0 - background), 1.0);
    }`,
};

function getContext(canvas) {
  const params = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
  let gl = canvas.getContext('webgl2', params);
  const isWebGL2 = !!gl;
  if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
  if (!gl) return null;

  let halfFloatType;
  let linear;
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    linear = !!gl.getExtension('OES_texture_float_linear');
    halfFloatType = gl.HALF_FLOAT;
  } else {
    const hf = gl.getExtension('OES_texture_half_float');
    linear = !!gl.getExtension('OES_texture_half_float_linear');
    halfFloatType = hf && hf.HALF_FLOAT_OES;
  }
  if (!halfFloatType) return null;

  const supports = (internalFormat, format) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, halfFloatType, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(tex);
    return ok;
  };
  const pick = (candidates) => candidates.find(([i, f]) => supports(i, f)) || null;

  const rgba = isWebGL2 ? pick([[gl.RGBA16F, gl.RGBA]]) : pick([[gl.RGBA, gl.RGBA]]);
  const rg = isWebGL2 ? pick([[gl.RG16F, gl.RG], [gl.RGBA16F, gl.RGBA]]) : rgba;
  const r = isWebGL2 ? pick([[gl.R16F, gl.RED], [gl.RG16F, gl.RG], [gl.RGBA16F, gl.RGBA]]) : rgba;
  if (!rgba || !rg || !r) return null;

  return { gl, halfFloatType, linear, formats: { rgba, rg, r } };
}

/**
 * Creates the simulation on `canvas`. Returns null when WebGL / half-float
 * render targets are unavailable so the caller can fall back gracefully.
 */
export function createFluid(canvas, options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  const ctx = getContext(canvas);
  if (!ctx) return null;
  const { gl, halfFloatType, linear, formats } = ctx;
  if (!linear) {
    cfg.dyeResolution = Math.min(cfg.dyeResolution, 512);
    cfg.shading = false;
    cfg.bloom = false;
  }

  // ---- Programs -----------------------------------------------------------
  function compile(type, source, defines = []) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, defines.map((d) => `#define ${d}\n`).join('') + source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'shader compile failed');
    }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, BASE_VERTEX);
  function program(name, defines) {
    const p = gl.createProgram();
    gl.attachShader(p, vertex);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, SHADERS[name], defines));
    gl.bindAttribLocation(p, 0, 'aPosition');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link failed');
    const uniforms = {};
    const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const { name: u } = gl.getActiveUniform(p, i);
      uniforms[u] = gl.getUniformLocation(p, u);
    }
    return { use: () => gl.useProgram(p), u: uniforms };
  }

  const displayDefines = [cfg.shading && 'SHADING', cfg.bloom && 'BLOOM'].filter(Boolean);
  const P = {
    copy: program('copy'),
    clear: program('clear'),
    splat: program('splat'),
    advection: program('advection', linear ? [] : ['MANUAL_FILTERING']),
    divergence: program('divergence'),
    curl: program('curl'),
    vorticity: program('vorticity'),
    pressure: program('pressure'),
    gradientSubtract: program('gradientSubtract'),
    bloomPrefilter: program('bloomPrefilter'),
    bloomBlur: program('bloomBlur'),
    bloomFinal: program('bloomFinal'),
    display: program('display', displayDefines),
  };

  // ---- Fullscreen quad ----------------------------------------------------
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function blit(target) {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  // ---- Framebuffers -------------------------------------------------------
  function createFBO(w, h, [internalFormat, format], filter) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, halfFloatType, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
      dispose() {
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(fbo);
      },
    };
  }
  function createDoubleFBO(w, h, fmt, filter) {
    let a = createFBO(w, h, fmt, filter);
    let b = createFBO(w, h, fmt, filter);
    return {
      width: w,
      height: h,
      texelSizeX: a.texelSizeX,
      texelSizeY: a.texelSizeY,
      get read() { return a; },
      get write() { return b; },
      swap() { [a, b] = [b, a]; },
      dispose() { a.dispose(); b.dispose(); },
    };
  }
  // Resize while keeping current contents (e.g. mobile URL bar show/hide).
  function resizeDoubleFBO(target, w, h, fmt, filter) {
    if (target.width === w && target.height === h) return target;
    const next = createDoubleFBO(w, h, fmt, filter);
    P.copy.use();
    gl.uniform2f(P.copy.u.texelSize, 1 / w, 1 / h);
    gl.uniform1i(P.copy.u.uTexture, target.read.attach(0));
    blit(next.write);
    next.swap();
    target.dispose();
    return next;
  }

  function resolution(res) {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(res);
    const max = Math.round(res * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? [max, min] : [min, max];
  }

  const filtering = linear ? gl.LINEAR : gl.NEAREST;
  let dye;
  let velocity;
  let divergence;
  let curl;
  let pressure;
  let bloom;
  let bloomChain = [];

  function initFramebuffers() {
    const [simW, simH] = resolution(cfg.simResolution);
    const [dyeW, dyeH] = resolution(cfg.dyeResolution);
    gl.disable(gl.BLEND);

    dye = dye ? resizeDoubleFBO(dye, dyeW, dyeH, formats.rgba, filtering) : createDoubleFBO(dyeW, dyeH, formats.rgba, filtering);
    velocity = velocity
      ? resizeDoubleFBO(velocity, simW, simH, formats.rg, filtering)
      : createDoubleFBO(simW, simH, formats.rg, filtering);

    divergence?.dispose();
    curl?.dispose();
    pressure?.dispose();
    divergence = createFBO(simW, simH, formats.r, gl.NEAREST);
    curl = createFBO(simW, simH, formats.r, gl.NEAREST);
    pressure = createDoubleFBO(simW, simH, formats.r, gl.NEAREST);

    bloom?.dispose();
    bloomChain.forEach((f) => f.dispose());
    bloomChain = [];
    const [bw, bh] = resolution(cfg.bloomResolution);
    bloom = createFBO(bw, bh, formats.rgba, filtering);
    for (let i = 0; i < cfg.bloomIterations; i++) {
      const w = bw >> (i + 1);
      const h = bh >> (i + 1);
      if (w < 2 || h < 2) break;
      bloomChain.push(createFBO(w, h, formats.rgba, filtering));
    }
  }

  // ---- Simulation ---------------------------------------------------------
  function step(dt) {
    gl.disable(gl.BLEND);
    const tx = velocity.texelSizeX;
    const ty = velocity.texelSizeY;

    P.curl.use();
    gl.uniform2f(P.curl.u.texelSize, tx, ty);
    gl.uniform1i(P.curl.u.uVelocity, velocity.read.attach(0));
    blit(curl);

    P.vorticity.use();
    gl.uniform2f(P.vorticity.u.texelSize, tx, ty);
    gl.uniform1i(P.vorticity.u.uVelocity, velocity.read.attach(0));
    gl.uniform1i(P.vorticity.u.uCurl, curl.attach(1));
    gl.uniform1f(P.vorticity.u.curl, cfg.curl);
    gl.uniform1f(P.vorticity.u.dt, dt);
    blit(velocity.write);
    velocity.swap();

    P.divergence.use();
    gl.uniform2f(P.divergence.u.texelSize, tx, ty);
    gl.uniform1i(P.divergence.u.uVelocity, velocity.read.attach(0));
    blit(divergence);

    P.clear.use();
    gl.uniform1i(P.clear.u.uTexture, pressure.read.attach(0));
    gl.uniform1f(P.clear.u.value, cfg.pressure);
    blit(pressure.write);
    pressure.swap();

    P.pressure.use();
    gl.uniform2f(P.pressure.u.texelSize, tx, ty);
    gl.uniform1i(P.pressure.u.uDivergence, divergence.attach(0));
    for (let i = 0; i < cfg.pressureIterations; i++) {
      gl.uniform1i(P.pressure.u.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    P.gradientSubtract.use();
    gl.uniform2f(P.gradientSubtract.u.texelSize, tx, ty);
    gl.uniform1i(P.gradientSubtract.u.uPressure, pressure.read.attach(0));
    gl.uniform1i(P.gradientSubtract.u.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    const A = P.advection;
    A.use();
    gl.uniform2f(A.u.texelSize, tx, ty);
    if (!linear) gl.uniform2f(A.u.dyeTexelSize, tx, ty);
    const vid = velocity.read.attach(0);
    gl.uniform1i(A.u.uVelocity, vid);
    gl.uniform1i(A.u.uSource, vid);
    gl.uniform1f(A.u.dt, dt);
    gl.uniform1f(A.u.dissipation, cfg.velocityDissipation);
    blit(velocity.write);
    velocity.swap();

    if (!linear) gl.uniform2f(A.u.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(A.u.uVelocity, velocity.read.attach(0));
    gl.uniform1i(A.u.uSource, dye.read.attach(1));
    gl.uniform1f(A.u.dissipation, cfg.densityDissipation);
    blit(dye.write);
    dye.swap();
  }

  function applyBloom() {
    if (bloomChain.length < 2) return;
    gl.disable(gl.BLEND);
    let last = bloom;

    const knee = cfg.bloomThreshold * cfg.bloomSoftKnee + 0.0001;
    P.bloomPrefilter.use();
    gl.uniform3f(P.bloomPrefilter.u.curve, cfg.bloomThreshold - knee, knee * 2, 0.25 / knee);
    gl.uniform1f(P.bloomPrefilter.u.threshold, cfg.bloomThreshold);
    gl.uniform1i(P.bloomPrefilter.u.uTexture, dye.read.attach(0));
    blit(last);

    P.bloomBlur.use();
    for (const dest of bloomChain) {
      gl.uniform2f(P.bloomBlur.u.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(P.bloomBlur.u.uTexture, last.attach(0));
      blit(dest);
      last = dest;
    }
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);
    for (let i = bloomChain.length - 2; i >= 0; i--) {
      const dest = bloomChain[i];
      gl.uniform2f(P.bloomBlur.u.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(P.bloomBlur.u.uTexture, last.attach(0));
      blit(dest);
      last = dest;
    }
    gl.disable(gl.BLEND);

    P.bloomFinal.use();
    gl.uniform2f(P.bloomFinal.u.texelSize, last.texelSizeX, last.texelSizeY);
    gl.uniform1i(P.bloomFinal.u.uTexture, last.attach(0));
    gl.uniform1f(P.bloomFinal.u.intensity, cfg.bloomIntensity);
    blit(bloom);
  }

  function render() {
    if (cfg.bloom) applyBloom();
    const D = P.display;
    D.use();
    gl.uniform2f(D.u.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
    gl.uniform1i(D.u.uTexture, dye.read.attach(0));
    if (cfg.bloom) gl.uniform1i(D.u.uBloom, bloom.attach(1));
    gl.uniform3f(D.u.background, ...cfg.background);
    gl.uniform1f(D.u.exposure, cfg.exposure);
    blit(null);
  }

  // x, y in 0..1 (y up). dx, dy are force in sim units. color is linear RGB.
  function splat(x, y, dx, dy, color, radiusScale = 1) {
    const aspect = canvas.width / canvas.height;
    let radius = (cfg.splatRadius * radiusScale) / 100;
    if (aspect > 1) radius *= aspect;
    const S = P.splat;
    S.use();
    gl.uniform1f(S.u.aspectRatio, aspect);
    gl.uniform2f(S.u.point, x, y);
    gl.uniform1f(S.u.radius, radius);

    gl.uniform1i(S.u.uTarget, velocity.read.attach(0));
    gl.uniform3f(S.u.color, dx, dy, 0);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(S.u.uTarget, dye.read.attach(0));
    gl.uniform3f(S.u.color, color[0], color[1], color[2]);
    blit(dye.write);
    dye.swap();
  }

  function resize(width, height) {
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    initFramebuffers();
  }

  initFramebuffers();

  return {
    step,
    render,
    splat,
    resize,
    get aspect() {
      return canvas.width / canvas.height;
    },
    destroy() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
