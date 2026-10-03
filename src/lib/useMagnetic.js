import { useEffect, useRef } from 'react'
import { device, subscribe } from './motion'

// Spring-pulls an element toward the cursor while hovered, then settles back.
// Writes transform directly — no React state, no re-renders.
export function useMagnetic(strength = 0.25, max = 10) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !device.finePointer || device.reducedMotion) return
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, settled = true

    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      tx = Math.max(-max, Math.min(max, dx * strength))
      ty = Math.max(-max, Math.min(max, dy * strength))
      settled = false
    }
    const leave = () => { tx = 0; ty = 0 }

    const unsub = subscribe((_, dt) => {
      if (settled) return
      vx += (120 * (tx - x) - 14 * vx) * dt
      vy += (120 * (ty - y) - 14 * vy) * dt
      x += vx * dt
      y += vy * dt
      if (!tx && !ty && Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) < 0.02) {
        x = y = vx = vy = 0
        settled = true
      }
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    })

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      unsub()
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength, max])

  return ref
}

// Feeds local cursor coords into --mx / --my so CSS can draw a highlight that tracks it.
export function useLocalLight() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !device.finePointer) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return ref
}
