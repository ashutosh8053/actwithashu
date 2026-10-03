import { useEffect, useRef, useState } from 'react'
import { device, pointer, subscribe } from '../lib/motion'

/*
 * Full-screen aurora rendered by a single fragment shader on one quad.
 * Raw WebGL instead of Three.js: one quad doesn't justify ~150 KB of library.
 *
 *  - 6 gaussian colour fields (purple / blue / cyan / pink / emerald / violet),
 *    domain-warped by low-frequency noise so they read as light, not circles
 *  - screen ("lighten") blending between fields
 *  - one thin luminous ribbon, echoing the light-streak visuals in the reference
 *  - every field sits on its own depth for cursor + scroll parallax
 *  - cursor: fields near the spring-smoothed pointer expand and brighten, local
 *    saturation lifts, and a soft bloom picks up the hue underneath it
 *
 * Rendered at a fraction of device resolution (the image is all soft gradients),
 * which is what keeps it cheap. Grain is a separate CSS layer at full resolution.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }
`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uEnergy;
uniform float uScroll;
uniform float uParallax;
uniform float uIntensity;

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y);
}
vec3 screenB(vec3 a, vec3 b){ return 1.0-(1.0-a)*(1.0-b); }

float aspect;
vec2 m;

// Drifting centre with its own parallax depth.
vec2 ctr(vec2 a, vec2 amp, float sp, float ph, float depth){
  vec2 c = vec2(a.x*aspect, a.y);
  c += amp*vec2(sin(uTime*sp+ph), cos(uTime*sp*0.83+ph*1.7));
  c += (m - vec2(0.5*aspect,0.5)) * depth * 0.07 * uParallax;
  c.y += uScroll * depth * 0.00022;
  return c;
}

vec3 field(vec2 p, vec2 c, float r, vec3 col){
  vec2 dm = c - m;
  float prox = exp(-dot(dm,dm)/0.32) * uEnergy;   // how close the cursor is to this field
  r *= 1.0 + 0.22*prox;                            // expand
  vec2 d = p - c;
  return col * exp(-dot(d,d)/(r*r)) * (0.85 + 0.55*prox); // brighten
}

void main(){
  aspect = uRes.x/uRes.y;
  vec2 p = vec2(vUv.x*aspect, vUv.y);
  m = vec2(uMouse.x*aspect, 1.0-uMouse.y);
  float t = uTime;

  vec2 warp = vec2(noise(p*1.5+vec2(t*0.045,0.0)), noise(p*1.5+vec2(5.2,t*0.038))) - 0.5;
  vec2 pw = p + warp*0.38;

  vec3 purple  = vec3(0.46,0.22,0.92);
  vec3 blue    = vec3(0.14,0.30,0.95);
  vec3 cyan    = vec3(0.10,0.62,0.76);
  vec3 pink    = vec3(0.86,0.28,0.62);
  vec3 emerald = vec3(0.08,0.70,0.48);
  vec3 violet  = vec3(0.33,0.18,0.70);

  vec3 g = vec3(0.0);
  g = screenB(g, field(pw, ctr(vec2(0.08,0.88), vec2(0.10,0.06), 0.11, 0.0, 0.35), 0.44, purple));
  g = screenB(g, field(pw, ctr(vec2(0.88,0.92), vec2(0.08,0.07), 0.09, 1.7, 0.55), 0.42, blue));
  g = screenB(g, field(pw, ctr(vec2(0.97,0.38), vec2(0.07,0.10), 0.12, 3.1, 0.80), 0.34, cyan));
  g = screenB(g, field(pw, ctr(vec2(0.12,0.12), vec2(0.09,0.06), 0.10, 4.4, 0.60), 0.36, pink));
  g = screenB(g, field(pw, ctr(vec2(0.56,-0.02),vec2(0.12,0.05), 0.08, 2.3, 1.00), 0.32, emerald));
  g = screenB(g, field(pw, ctr(vec2(0.62,0.58), vec2(0.10,0.08), 0.13, 5.6, 0.25), 0.24, violet));

  // Thin aurora ribbon — slow, low, never the main event.
  float ry = 0.7 + 0.10*sin(pw.x*2.1 + t*0.13) + 0.05*sin(pw.x*4.3 - t*0.21) - uScroll*0.00012;
  float ribbon = exp(-pow((pw.y-ry)/0.035,2.0)) * (0.35+0.65*noise(vec2(pw.x*3.0 - t*0.2, 1.0)));
  vec3 ribbonCol = mix(cyan, purple, smoothstep(0.0, aspect, pw.x));
  vec2 rd = vec2(p.x,ry) - m;
  ribbon *= 0.22 + 0.5*exp(-dot(rd,rd)/0.12)*uEnergy;
  g = screenB(g, ribbonCol*ribbon);

  g *= uIntensity;

  // Local cursor field: luminance + saturation lift, then a hue-matched bloom.
  vec2 dc = p - m;
  float near = exp(-dot(dc,dc)/0.085) * uEnergy;
  g *= 1.0 + near*0.75;
  float l = dot(g, vec3(0.299,0.587,0.114));
  g = max(mix(vec3(l), g, 1.0 + near*0.45), 0.0);
  g += (g*0.7 + vec3(0.045,0.04,0.075)) * near * 0.55;
  g += vec3(0.62,0.58,0.95) * exp(-dot(dc,dc)/0.0035) * uEnergy * 0.07;

  // Gamma pushes the mids back toward black: colour lives in pools of light,
  // the reference's deep black stays the dominant surface.
  g = pow(g, vec3(1.55));
  vec3 col = screenB(vec3(0.010,0.010,0.018), g);

  // Vignette + soft shoulder so highlights roll off instead of clipping.
  vec2 v = vUv - 0.5;
  col *= mix(0.7, 1.0, smoothstep(1.0, 0.2, length(v*vec2(1.0,1.15))));
  col = col / (1.0 + col*0.6);
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 160.0; // dither against banding
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s))
    return null
  }
  return s
}

export default function AuroraBackground() {
  const canvasRef = useRef(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' })
    if (!gl || gl.isContextLost()) return setFallback(true)

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return setFallback(true)
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = {}
    for (const n of ['uRes', 'uTime', 'uMouse', 'uEnergy', 'uScroll', 'uParallax', 'uIntensity']) {
      u[n] = gl.getUniformLocation(prog, n)
    }

    // Soft gradients need very few pixels; mobile gets fewer still.
    const scale = device.lowPower ? 0.32 : 0.5
    const resize = () => {
      const w = Math.max(1, Math.round(window.innerWidth * scale))
      const h = Math.max(1, Math.round(window.innerHeight * scale))
      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(u.uRes, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    gl.uniform1f(u.uParallax, device.finePointer ? 1 : 0.35)
    gl.uniform1f(u.uIntensity, device.finePointer ? 0.82 : 0.62)

    // Motion speed: mobile drifts a little slower; reduced-motion freezes drift.
    const speed = device.reducedMotion ? 0 : device.lowPower ? 0.8 : 1
    let time = 12 // start mid-drift so the first frame is already composed
    let frame = 0

    const draw = (p, dt) => {
      frame++
      time += dt * speed
      // Touch devices: render at ~30fps — the motion is slow enough that it's invisible.
      if (device.lowPower && frame % 2) return
      gl.uniform1f(u.uTime, time)
      gl.uniform2f(u.uMouse, p.x, p.y)
      gl.uniform1f(u.uEnergy, p.energy)
      gl.uniform1f(u.uScroll, p.scroll)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const unsub = subscribe(draw)

    const onLost = (e) => {
      e.preventDefault()
      setFallback(true)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      unsub()
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('webglcontextlost', onLost)
      // Free GL objects but keep the context: a canvas can only ever hand out one,
      // so losing it here would break a remount (e.g. React StrictMode).
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-[#030305]">
      {fallback ? (
        <div className="aurora-fallback absolute inset-0" />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
      <div className="grain pointer-events-none absolute -inset-[50%]" />
    </div>
  )
}
