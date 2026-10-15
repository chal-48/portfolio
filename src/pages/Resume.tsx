import { Download, FileText } from 'lucide-react'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, ChapterNavigation } from '@/components/ui'

export default function Resume() {
  const { t } = useLanguage()
  const url = portfolio.resume.en
  return <>
    <PageHeading title={t('resume')}/>
    <section className="card resume-download"><span className="resume-icon"><FileText size={34} strokeWidth={1.3}/></span><div><h2>{portfolio.name.en}</h2><p>Resume · English PDF</p></div><a className="button button-dark" href={url} download="Chalisa-Langchai-Resume.pdf"><Download size={16}/>{t('downloadResume')}</a></section>
    <ChapterNavigation current="resume"/>
  </>
}
