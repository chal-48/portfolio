import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { portfolio } from '@/content'
import { chapters } from '@/lib/navigation'
import type { ReactNode } from 'react'

export function DemoNote({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage()
  if (!portfolio.isDemo) return null
  return <div className={`demo-note ${compact ? 'demo-note-compact' : ''}`}><Sparkles size={14} aria-hidden="true" /><span>{compact ? t('demo') : t('demoNote')}</span></div>
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  const { t } = useLanguage()
  return <div className="page-heading"><Link className="back-link" to="/" state={{ restoreHome: true }}><ArrowLeft size={16} />{t('back')}</Link><div className="page-heading-content"><div><p className="eyebrow">{eyebrow}</p><h1 id="page-title" tabIndex={-1}>{title}</h1><p className="page-description">{description}</p></div>{action}</div></div>
}

export function ChapterNavigation({ current }: { current: string }) {
  const { t } = useLanguage()
  const index = chapters.findIndex(chapter => chapter.id === current)
  const previous = chapters[index - 1]
  const next = chapters[index + 1]
  return <nav className="chapter-navigation" aria-label={t('allSections')}>
    <div className="chapter-links">{previous ? <Link to={previous.path} className="chapter-link"><ArrowLeft size={18} /><span><small>{t('previous')}</small><strong>{t(previous.label)}</strong></span></Link> : <Link to="/" state={{ restoreHome: true }} className="chapter-link"><ArrowLeft size={18} /><span><small>{t('back')}</small><strong>{t('home')}</strong></span></Link>}
      {next ? <Link to={next.path} className="chapter-link chapter-next"><span><small>{t('next')}</small><strong>{t(next.label)}</strong></span><ArrowRight size={18} /></Link> : <Link to="/" state={{ restoreHome: true }} className="chapter-link chapter-next"><span><small>{t('back')}</small><strong>{t('home')}</strong></span><ArrowUpRight size={18} /></Link>}
    </div>
  </nav>
}
