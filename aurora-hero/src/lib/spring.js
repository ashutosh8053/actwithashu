// Damped harmonic spring, integrated with semi-implicit Euler.
// Units: stiffness in 1/s², damping in 1/s, dt in seconds.
export function createSpring(value, { stiffness = 120, damping = 18 } = {}) {
  return { value, velocity: 0, target: value, stiffness, damping };
}

export function stepSpring(s, dt) {
  const accel = -s.stiffness * (s.value - s.target) - s.damping * s.velocity;
  s.velocity += accel * dt;
  s.value += s.velocity * dt;
  return s.value;
}
