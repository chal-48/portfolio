import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigationType } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'
import { chapters } from '@/lib/navigation'
import { portfolio } from '@/content'
import { Logo } from './visuals'

export function Header() {
  const { t, language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const trigger = useRef<HTMLButtonElement>(null)
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    const onPointer = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [open])
  return <header className="site-header"><div className="header-inner">
    <Link to="/" className="brand" aria-label={t('home')}><Logo /><span>PORTFOLIO <span className="brand-divider">/</span> 2026</span></Link>
    <div className="header-right"><div className="language-toggle" role="group" aria-label={t('language')}>
      {(['th', 'en'] as const).map(value => <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)} lang={value}>{value.toUpperCase()}</button>)}
    </div><div className="menu-container" ref={container}><button className="icon-button menu-toggle" ref={trigger} type="button" aria-label={open ? t('closeMenu') : t('menu')} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      <AnimatePresence>{open && <motion.nav id="site-menu" className="site-menu" aria-label={t('menu')} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .16 }}><NavLink to="/" end><span>{t('home')}</span><ArrowUpRight size={15}/></NavLink>{chapters.map(chapter => <NavLink to={chapter.path} key={chapter.id}><span><chapter.icon size={15}/>{t(chapter.label)}</span><ArrowUpRight size={15}/></NavLink>)}</motion.nav>}</AnimatePresence>
    </div></div>
  </div></header>
}

export function SectionTabs() {
  const { t } = useLanguage()
  return <nav className="section-tabs" aria-label={t('allSections')}>{chapters.map(chapter => <NavLink to={chapter.path} key={chapter.id} className={({ isActive }) => isActive ? 'section-tab active' : 'section-tab'}><small>{chapter.number}</small><span>{t(chapter.label)}</span></NavLink>)}</nav>
}

export function Footer() {
  const { t } = useLanguage()
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 400)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <><footer className="site-footer"><div><Logo /><span>PORTFOLIO INDEX</span></div><p>{t('footer')}</p><small>© {new Date().getFullYear()} · {t('footerNote')}</small></footer>{showTop && <button className="scroll-top icon-button" aria-label={t('scrollTop')} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowUp size={18}/></button>}</>
}

const positions = new Map<string, number>()

export function PageEffects() {
  const location = useLocation()
  const type = useNavigationType()
  const { language, localize, t } = useLanguage()
  useEffect(() => {
    const page = chapters.find(chapter => location.pathname === chapter.path || location.pathname.startsWith(chapter.path + '/'))
    document.title = `${page ? t(page.label) : t('home')} · ${localize(portfolio.name)} — Portfolio`
    document.querySelector('meta[name="description"]')?.setAttribute('content', localize(portfolio.tagline))
  }, [location.pathname, language, localize, t])
  useEffect(() => {
    const key = location.pathname
    let saved = positions.get(key) ?? 0
    try { saved = Number(sessionStorage.getItem(`portfolio-scroll:${key}`)) || saved } catch { /* Optional storage. */ }
    const shouldRestore = type === 'POP' || location.state?.restoreHome
    window.scrollTo({ top: shouldRestore ? saved : 0, behavior: 'instant' })
    const frame = requestAnimationFrame(() => {
      document.getElementById('page-title')?.focus({ preventScroll: true })
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    })
    const remember = () => {
      positions.set(key, window.scrollY)
      try { sessionStorage.setItem(`portfolio-scroll:${key}`, String(window.scrollY)) } catch { /* Optional storage. */ }
    }
    window.addEventListener('scroll', remember, { passive: true })
    window.addEventListener('pagehide', remember)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', remember); window.removeEventListener('pagehide', remember) }
  }, [location.pathname, location.hash])
  return null
}
