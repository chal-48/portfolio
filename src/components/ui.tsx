import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { chapters } from '@/lib/navigation'
import type { ReactNode } from 'react'

export function PageHeading({ title, action }: { title: string; action?: ReactNode }) {
  const { t } = useLanguage()
  return <div className="page-head"><Link className="back-btn" to="/" state={{ restoreHome: true }} aria-label={t('back')}><ArrowLeft size={18}/></Link><div><h1 className="page-title" id="page-title" tabIndex={-1}>{title}</h1></div>{action}</div>
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
