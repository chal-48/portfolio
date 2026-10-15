import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'

/** Match the reference: desktop wheel smoothing, native touch and reduced motion. */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 761px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(desktop.matches && !reduced.matches)
    update()
    desktop.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      desktop.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])
  return enabled ? <ReactLenis root options={{ wheelMultiplier: .8, lerp: .1 }}/> : null
}
