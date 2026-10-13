// Adapted from Componentry's Orbit Card Stack, installed with shadcn.
// Original stack/fan layout retained; cards are now accessible chapter links.
import { useMemo, useRef, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OrbitStackItem {
  id: string
  name: string
  href: string
  accent: string
  ink: string
  number: string
  icon: ReactNode
}

interface OrbitCardStackProps {
  items: OrbitStackItem[]
  label: string
  className?: string
  defaultActiveIndex?: number
  spread?: number
  lift?: number
  onActiveChange?: (item: OrbitStackItem, index: number) => void
}

export function OrbitCardStack({ items, label, className, defaultActiveIndex = 2, spread = 144, lift = 28, onActiveChange }: OrbitCardStackProps) {
  const reduceMotion = useReducedMotion() ?? false
  const restingIndex = Math.min(Math.max(0, defaultActiveIndex), Math.max(0, items.length - 1))
  const [activeIndex, setActiveIndex] = useState(restingIndex)
  const [open, setOpen] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const midpoint = (items.length - 1) / 2
  const layouts = useMemo(() => items.map((_, index) => {
    const orbit = index - midpoint
    const stack = index - restingIndex
    return {
      open: { x: orbit * spread, y: Math.abs(orbit) * 23 + Math.max(0, Math.abs(orbit) - 1) * 8, rotation: orbit * 7 },
      closed: { x: stack * 19, y: Math.abs(stack) * 5, rotation: stack * 5 },
    }
  }), [items, midpoint, restingIndex, spread])
  const activate = (index: number) => { setOpen(true); setActiveIndex(index); onActiveChange?.(items[index], index) }
  const close = () => { if (stageRef.current?.contains(document.activeElement)) return; setOpen(false); setActiveIndex(restingIndex) }
  const leaveFocus = (event: FocusEvent<HTMLDivElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActiveIndex(restingIndex) } }
  return <div className={cn('orbit-stack', className)}><div ref={stageRef} className={`orbit-stage ${open ? 'is-open' : ''}`} onMouseEnter={() => setOpen(true)} onMouseLeave={close} onBlur={leaveFocus} role="list" aria-label={label}>
    {items.map((item,index) => {
      const position = open ? layouts[index].open : layouts[index].closed
      const active = index === activeIndex
      const style: CSSProperties = {
        zIndex: active ? 80 : 50 - Math.abs(index - activeIndex),
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y - (open && active ? lift : 0)}px)) rotate(${position.rotation}deg)`,
        transitionDuration: reduceMotion ? '0ms' : '420ms',
        '--card-accent': item.accent,
        '--card-ink': item.ink,
      } as CSSProperties
      return <div key={item.id} className="orbit-item" style={style} role="listitem"><Link className="orbit-card" to={item.href} data-testid={`orbit-${item.id}`} onMouseEnter={() => activate(index)} onFocus={() => activate(index)} onKeyDown={event => {
        let next = index
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index+1)%items.length
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index-1+items.length)%items.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = items.length-1
        else if (event.key === 'Escape') { event.currentTarget.blur(); setOpen(false); setActiveIndex(restingIndex); return }
        else return
        event.preventDefault(); activate(next); stageRef.current?.querySelectorAll<HTMLAnchorElement>('.orbit-card')[next]?.focus()
      }}><span className="orbit-card-top"><span>{item.number}</span><ArrowUpRight size={18}/></span><span className="orbit-card-icon">{item.icon}</span><h3>{item.name}</h3><span className="orbit-card-line"/></Link></div>
    })}
  </div></div>
}
