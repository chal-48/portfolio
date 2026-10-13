import { Link } from 'react-router-dom'
import { chapters } from '@/lib/navigation'
import { useLanguage } from '@/lib/i18n'
import { OrbitCardStack } from './ui/orbit-card-stack'

export function OrbitNavigator() {
  const { t } = useLanguage()
  return <div className="orbit-navigator"><OrbitCardStack label={t('allSections')} items={chapters.map(chapter => ({ id: chapter.id, name: t(chapter.label), href: chapter.path, accent: chapter.accent, ink: chapter.ink, number: chapter.number, icon: <chapter.icon size={34} strokeWidth={1.3}/> }))}/><p className="orbit-hint"><span className="desktop-hint">{t('cardHint')}</span><span className="mobile-hint">{t('mobileCardHint')}</span></p><nav className="orbit-index" aria-label={t('allSections')}>{chapters.map(chapter => <Link key={chapter.id} to={chapter.path}><span>{chapter.number}</span>{t(chapter.label)}</Link>)}</nav></div>
}
