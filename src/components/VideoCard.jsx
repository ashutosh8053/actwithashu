import { useEffect, useRef, useState } from 'react'
import MockSite from './MockSite'
import { device } from '../lib/motion'

/*
 * One tilted "browser screen" from the reference. It cycles a playlist with hard
 * cuts (the reference never crossfades), plays only while on screen, and only
 * starts fetching video once it's about to enter the viewport.
 */
export default function VideoCard({ items, offset = 0, className = '', style }) {
  const ref = useRef(null)
  const videos = useRef([])
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [primed, setPrimed] = useState(false)

  // Visibility: prime (start loading) a screen early, play only when actually visible.
  useEffect(() => {
    const el = ref.current
    const prime = new IntersectionObserver(([e]) => e.isIntersecting && setPrimed(true), { rootMargin: '400px' })
    const view = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 })
    prime.observe(el)
    view.observe(el)
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().top < window.innerHeight)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      prime.disconnect()
      view.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // Playlist clock. Offset de-syncs the two cards so cuts never land together.
  useEffect(() => {
    if (!visible || items.length < 2) return
    const ms = (items[index].duration ?? 3) * 1000 * (index === 0 && offset ? 1 + offset : 1)
    const id = setTimeout(() => setIndex((i) => (i + 1) % items.length), ms)
    return () => clearTimeout(id)
  }, [index, visible, items, offset])

  // Restart the active clip on every cut; keep everything else paused.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return
      if (i === index && visible) {
        v.currentTime = 0
        v.play().catch(() => {}) // autoplay refused → poster stays, which is fine
      } else {
        v.pause()
      }
    })
  }, [index, visible])

  return (
    <div ref={ref} className={`screen ${visible ? '' : 'is-paused'} ${className}`} style={style}>
      {items.map((item, i) => {
        const active = i === index
        if (item.type === 'video') {
          return (
            <video
              key={i}
              ref={(v) => (videos.current[i] = v)}
              className="screen-media"
              style={{ visibility: active ? 'visible' : 'hidden', objectPosition: item.position ?? 'top center' }}
              src={primed ? (device.lowPower && item.srcMobile) || item.src : undefined}
              poster={item.poster}
              muted
              playsInline
              loop
              preload={primed ? 'auto' : 'none'}
              disablePictureInPicture
              aria-hidden
            />
          )
        }
        // Mock placeholders: mount only the active one so idle ones cost nothing.
        return active ? (
          <div key={i} className="screen-media">
            <MockSite variant={item.variant} />
          </div>
        ) : null
      })}
      <div className="screen-glare" />
    </div>
  )
}
