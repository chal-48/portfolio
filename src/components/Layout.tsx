import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { Link, NavLink, useLocation, useNavigationType } from 'react-router-dom'
import { ArrowUp, Moon, Sun, Search } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/i18n'
import { chapters } from '@/lib/navigation'
import { portfolio } from '@/content'
import SiteSearch from './SiteSearch'

export function Header() {
  const lenis = useLenis()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()
  const trigger = useRef<HTMLButtonElement>(null)
  const searchTrigger = useRef<HTMLButtonElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const closeSearch = useCallback(() => { setSearchOpen(false); searchTrigger.current?.focus() }, [])
  useEffect(() => { setOpen(false); setSearchOpen(false) }, [pathname])
  useEffect(() => {
    if (!open && !searchOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => { document.body.style.overflow = previous; lenis?.start() }
  }, [open, searchOpen, lenis])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(false); setSearchOpen(value => !value) } }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])
  useEffect(() => {
    if (!open) return
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
      if (event.key === 'Tab') {
        const targets = [trigger.current!, ...overlay.current!.querySelectorAll<HTMLAnchorElement>('a')]
        if (event.shiftKey && document.activeElement === targets[0]) { event.preventDefault(); targets[targets.length-1].focus() }
        if (!event.shiftKey && document.activeElement === targets[targets.length-1]) { event.preventDefault(); targets[0].focus() }
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [open])
  const label = (id: string) => id === 'skills' ? 'Skills' : id === 'about' ? 'About' : id === 'contact' ? 'Contact' : id === 'resume' ? 'Resume' : 'Projects'
  return <><header className="site-header header"><div className="header-inner">
    <Link to="/" className="logo" aria-label="Chalisa — Home">Chalisa</Link>
    <div className="header-right"><nav className="site-nav nav" aria-label="Main navigation">
      {chapters.map(chapter => <NavLink className="nav-link" key={chapter.id} to={chapter.path}>{label(chapter.id)}</NavLink>)}
    </nav><button className="theme-btn search-toggle" ref={searchTrigger} type="button" onClick={() => { setOpen(false); setSearchOpen(true) }} aria-label="Search (Ctrl+K)"><Search size={18}/></button><button className="theme-btn theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}</button>
    <button className={`nav-toggle menu-toggle ${open ? 'is-open' : ''}`} ref={trigger} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}><span className="nav-toggle-bar"/><span className="nav-toggle-bar"/></button></div>
  </div></header><div id="site-menu" className={`nav-overlay ${open ? 'is-open' : ''}`} ref={overlay} aria-hidden={!open} inert={!open} role="dialog" aria-modal="true" aria-label="Main menu" onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}><span className="nav-overlay-decoration" aria-hidden="true">= ᗜ ω ᗜ.=</span><nav className="nav-overlay-links" aria-label="Mobile navigation">{chapters.map((chapter,index) => <NavLink to={chapter.path} className="nav-overlay-link" key={chapter.id} style={{ '--i':index } as CSSProperties}><span className="nav-overlay-index" aria-hidden="true">0{index+1}</span>{label(chapter.id)}</NavLink>)}</nav></div><AnimatePresence>{searchOpen && <SiteSearch key="site-search" close={closeSearch}/>}</AnimatePresence><div className="noise-overlay" aria-hidden="true"/></>
}

export function Footer() {
  const lenis = useLenis()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <><footer className="site-credits">Based on <a href="https://github.com/itousouta15/itouSouta.me" target="_blank" rel="noopener noreferrer">itouSouta.me</a> by <a href="https://github.com/itousouta15" target="_blank" rel="noopener noreferrer">itousouta15</a><span aria-hidden="true"> · </span><Link to="/credits">Credits</Link></footer>{visible && <button className="icon-button scroll-top" aria-label="Back to top" onClick={() => lenis ? lenis.scrollTo(0,{ lock:true }) : window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowUp size={20}/></button>}</>
}

const positions = new Map<string, number>()
export function PageEffects({ pathname }: { pathname: string }) {
  const lenis = useLenis()
  const location = useLocation()
  const type = useNavigationType()
  const { t } = useLanguage()
  useLayoutEffect(() => {
    if (pathname !== location.pathname) return
    const chapter = chapters.find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))
    document.title = `${pathname === '/credits' ? 'Credits · ' : chapter ? t(chapter.label) + ' · ' : ''}${portfolio.name.en}`
    document.documentElement.lang = 'en'
    document.querySelector('meta[name="description"]')?.setAttribute('content', portfolio.bio.en.split('\n')[0])
    const saved = positions.get(location.pathname) ?? 0
    const top = type === 'POP' || location.state?.restoreHome ? saved : 0
    if (lenis) { lenis.resize(); lenis.scrollTo(top,{ immediate:true,force:true }) }
    else window.scrollTo({ top, behavior:'instant' })
    const frame = requestAnimationFrame(() => document.getElementById('page-title')?.focus({ preventScroll: true }))
    const remember = () => positions.set(location.pathname, window.scrollY)
    window.addEventListener('scroll', remember, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', remember) }
  }, [pathname, location.pathname, location.state, type, t, lenis])
  return null
}
