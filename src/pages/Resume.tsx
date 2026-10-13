import { Download } from 'lucide-react'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, ChapterNavigation } from '@/components/ui'

export default function Resume() {
  const { t, language } = useLanguage()
  const url = portfolio.resume[language]
  return <>
    <PageHeading
      eyebrow={t('resumeEyebrow')}
      title={t('resumeTitle')}
      description={t('resumeIntro')}
      action={
        <a className="button button-dark" href={url} download={`resume-${language}.pdf`}>
          <Download size={16}/>{t('downloadResume')}
        </a>
      }
    />
    <ChapterNavigation current="resume"/>
  </>
}
