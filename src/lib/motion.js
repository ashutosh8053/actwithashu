// One shared rAF loop + spring-smoothed pointer, used by every animated system.
// Nothing here touches React state: subscribers write to the DOM / GL directly,
// so cursor motion never triggers a re-render.

export const pointer = {
  // target (raw input), normalised 0..1 viewport coords
  tx: 0.5,
  ty: 0.45,
  // spring-smoothed position + velocity
  x: 0.5,
  y: 0.45,
  vx: 0,
  vy: 0,
  // 0..1 "how lit" the cursor area is — rises on movement, decays when idle/away
  energy: 0,
  inside: false,
  // smoothed scroll progress in px
  scroll: 0,
}

const subscribers = new Set()
let rafId = 0
let last = 0
let lastMove = 0
let rawScroll = 0

// Slightly under-damped spring: follows with a soft magnetic overshoot, never snaps.
const STIFFNESS = 70
const DAMPING = 13

function tick(now) {
  rafId = requestAnimationFrame(tick)
  const dt = Math.min((now - (last || now)) / 1000, 1 / 20)
  last = now

  const p = pointer
  const ax = STIFFNESS * (p.tx - p.x) - DAMPING * p.vx
  const ay = STIFFNESS * (p.ty - p.y) - DAMPING * p.vy
  p.vx += ax * dt
  p.vy += ay * dt
  p.x += p.vx * dt
  p.y += p.vy * dt

  // Energy: a resting glow while the pointer is present, a bump while moving,
  // and a slow exponential fade once it stops or leaves.
  const speed = Math.hypot(p.vx, p.vy)
  const idle = (now - lastMove) / 1000
  const target = p.inside ? Math.min(1, 0.55 + speed * 0.9) * (idle > 2.5 ? 0.6 : 1) : 0
  const rate = target > p.energy ? 4 : 1.1
  p.energy += (target - p.energy) * (1 - Math.exp(-rate * dt))

  p.scroll += (rawScroll - p.scroll) * (1 - Math.exp(-8 * dt))

  for (const fn of subscribers) fn(p, dt, now / 1000)
}

function onMove(e) {
  pointer.tx = e.clientX / window.innerWidth
  pointer.ty = e.clientY / window.innerHeight
  pointer.inside = true
  lastMove = performance.now()
}
function onLeave() {
  pointer.inside = false
}
function onScroll() {
  rawScroll = window.scrollY
}

let listening = false
function listen() {
  if (listening) return
  listening = true
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  window.addEventListener('blur', onLeave)
  window.addEventListener('scroll', onScroll, { passive: true })
  // Touch: the glow follows the finger, then fades once it lifts.
  window.addEventListener('pointerup', (e) => e.pointerType === 'touch' && onLeave(), { passive: true })
  onScroll()
}
function unlisten() {
  if (!listening) return
  listening = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
  window.removeEventListener('blur', onLeave)
  window.removeEventListener('scroll', onScroll)
}

export function subscribe(fn) {
  subscribers.add(fn)
  listen()
  if (!rafId) {
    last = 0
    rafId = requestAnimationFrame(tick)
  }
  return () => {
    subscribers.delete(fn)
    if (subscribers.size === 0) {
      cancelAnimationFrame(rafId)
      rafId = 0
      unlisten()
    }
  }
}

// Device capability snapshot — evaluated once, used to scale effects down.
export const device = (() => {
  if (typeof window === 'undefined') return { finePointer: true, reducedMotion: false, lowPower: false }
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency || 4
  const lowPower = !finePointer || cores <= 4 || navigator.connection?.saveData === true
  return { finePointer, reducedMotion, lowPower }
})()
