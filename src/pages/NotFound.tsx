import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export default function NotFound() {
  const { t } = useLanguage()
  return <div className="not-found"><Compass size={46} strokeWidth={1.3}/><p className="eyebrow">404</p><h1 id="page-title" tabIndex={-1}>{t('notFound')}</h1><p>{t('notFoundNote')}</p><Link to="/" className="button button-dark"><ArrowLeft size={17}/>{t('back')}</Link></div>
}
