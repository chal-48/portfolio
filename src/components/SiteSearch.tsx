import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search } from 'lucide-react'
import { portfolio } from '@/content'
import { motion, useIsPresent, useReducedMotion } from 'framer-motion'

const destinations = [
  { title:'About Me', path:'/about', keywords:'education university student biography' },
  { title:'Technical Skills', path:'/skills', keywords:'languages frameworks databases tools' },
  { title:'Projects', path:'/projects', keywords:'work' },
  { title:'Resume', path:'/resume', keywords:'download pdf cv' },
  { title:'Contact', path:'/contact', keywords:'email github message' },
  ...portfolio.projects.map(project => ({ title:project.title.en, path:`/projects/${project.id}`, keywords:project.tech.join(' ') })),
]

export default function SiteSearch({ close }: { close: () => void }) {
  const [query, setQuery] = useState('')
  const reduced = useReducedMotion()
  const present = useIsPresent()
  const dialog = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!present) return
    input.current?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close() }
      if (event.key !== 'Tab') return
      const targets = [...dialog.current!.querySelectorAll<HTMLElement>('input,button,a')]
      const first = targets[0], last = targets[targets.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keyboard)
    return () => document.removeEventListener('keydown', keyboard)
  }, [close,present])
  const results = destinations.filter(item => `${item.title} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <motion.div className="search-backdrop" data-lenis-prevent initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:reduced ? 0 : .35 }} style={{ pointerEvents:present ? 'auto' : 'none' }} onPointerDown={event => { if (event.currentTarget === event.target) close() }}><motion.div className="search-dialog" initial={{ opacity:0,y:reduced ? 0 : 12,scale:reduced ? 1 : .985 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:reduced ? 0 : 6,scale:reduced ? 1 : .99 }} transition={{ duration:reduced ? 0 : .4,ease:[.16,1,.3,1] }} ref={dialog} role="dialog" aria-modal="true" aria-label="Search this site" aria-hidden={!present} inert={!present}><div className="search-input-row"><Search size={20}/><input ref={input} aria-label="Search pages and projects" placeholder="Search pages and projects…" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); dialog.current?.querySelector<HTMLAnchorElement>('a')?.focus() } }}/><button type="button" aria-label="Close search" onClick={close}>ESC</button></div><div className="search-results">{results.length ? results.map(item => <Link to={item.path} key={item.path} onClick={close}>{item.title}<ArrowUpRight size={16}/></Link>) : <p>No results found.</p>}</div></motion.div></motion.div>
}
