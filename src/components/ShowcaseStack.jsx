import { useEffect, useRef } from 'react'
import VideoCard from './VideoCard'
import { device, pointer, subscribe } from '../lib/motion'
import { showcase } from '../config/site'

/*
 * The reference's signature element: two website screens, slightly rotated in
 * opposite directions, the front one overlapping the back one's lower-right corner.
 *
 * Desktop: the pair sits in perspective and leans toward the spring-smoothed
 * cursor, each screen on its own depth (parallax).
 * Touch: no cursor, so the front screen drifts a little against scroll instead.
 */
export default function ShowcaseStack() {
  const stage = useRef(null)
  const back = useRef(null)
  const front = useRef(null)

  useEffect(() => {
    if (device.reducedMotion) return
    const s = stage.current, b = back.current, f = front.current

    return subscribe((p) => {
      if (device.finePointer) {
        const rx = (0.5 - p.y) * 7
        const ry = (p.x - 0.5) * 10
        s.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
        const dx = (p.x - 0.5), dy = (p.y - 0.5)
        b.style.translate = `${(dx * -10).toFixed(2)}px ${(dy * -8).toFixed(2)}px`
        f.style.translate = `${(dx * 16).toFixed(2)}px ${(dy * 12).toFixed(2)}px`
      } else {
        const r = s.getBoundingClientRect()
        const k = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight // -1..1
        f.style.translate = `0 ${(k * 18).toFixed(2)}px`
        b.style.translate = `0 ${(k * -6).toFixed(2)}px`
      }
    })
  }, [])

  return (
    <section id="work" aria-label="Selected work" className="relative w-full [perspective:1400px]">
      <div ref={stage} className="stack relative mx-auto aspect-[10/9] w-full [transform-style:preserve-3d]">
        <div ref={back} className="stack-back absolute left-0 top-0 w-[70%]">
          <VideoCard items={showcase.back} className="screen--back" />
        </div>
        <div ref={front} className="stack-front absolute bottom-0 right-0 w-[64%]">
          <VideoCard items={showcase.front} offset={0.45} className="screen--front" />
        </div>
      </div>
    </section>
  )
}
