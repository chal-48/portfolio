import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { portfolio, safeExternalUrl } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, DemoNote, ChapterNavigation } from '@/components/ui'
import { ProjectVisual } from '@/components/visuals'
import { CaseStudyFlipStack } from '@/components/ui/case-study-flip-stack'
import NotFound from './NotFound'

const covers = [
  '/project-placeholders/project-01.svg',
  '/project-placeholders/project-02.svg',
  '/project-placeholders/project-03.svg',
]

const flipColors = [
  { background: '#e9672f', foreground: '#171713' },
  { background: '#173b57', foreground: '#eef5f5' },
  { background: '#d8d0c3', foreground: '#171713' },
]

export default function Projects() {
  const { t, localize, language } = useLanguage()
  const pageCopy = language === 'th' ? {
    hint: 'เลื่อนเพื่อเปิดโปรเจกต์ถัดไป',
    heading: 'ผลงานที่กำลังรอเรื่องราวจริงของคุณ',
    end: 'เลือกโปรเจกต์เพื่ออ่านต่อ',
    image: 'พื้นที่สำหรับภาพโปรเจกต์',
  } : {
    hint: 'Scroll to reveal the next project',
    heading: 'Selected work, ready for your real stories.',
    end: 'Choose a project to read more',
    image: 'Project image placeholder',
  }
  const items = portfolio.projects.map((project, index) => ({
    number: String(index + 1).padStart(2, '0'),
    eyebrow: `${project.tech.slice(0, 2).join(' / ')} · ${project.year === 'DEMO' ? t('demo') : project.year}`,
    title: localize(project.title),
    description: localize(project.summary),
    image: covers[index % covers.length],
    imageAlt: `${pageCopy.image}: ${localize(project.title)}`,
    background: flipColors[index % flipColors.length].background,
    foreground: flipColors[index % flipColors.length].foreground,
    href: `/projects/${project.id}`,
  }))
  return <><PageHeading eyebrow={t('projectsEyebrow')} title={t('projectsTitle')} description={t('projectsIntro')}/><DemoNote/>
    <CaseStudyFlipStack className="portfolio-flip-stack" items={items} hint={pageCopy.hint} heading={pageCopy.heading} endLabel={pageCopy.end}/>
    <ChapterNavigation current="projects"/></>
}

export function ProjectDetail() {
  const { id } = useParams()
  const { t, localize } = useLanguage()
  const project = portfolio.projects.find(item => item.id===id)
  if (!project) return <NotFound/>
  const source = safeExternalUrl(project.sourceUrl)
  const demo = safeExternalUrl(project.demoUrl)
  return <><div className="project-detail-heading"><Link to="/projects" className="back-link"><ArrowLeft size={16}/>{t('backProjects')}</Link><p className="eyebrow">{t('projects')}</p><h1 id="page-title" tabIndex={-1}>{localize(project.title)}</h1><p className="page-description">{localize(project.summary)}</p><div className="project-tech">{project.tech.map(item => <span key={item}>{item}</span>)}</div></div><DemoNote/>
    <div className="project-detail-art"><ProjectVisual variant={project.visual}/></div>
    <div className="project-detail-grid"><section className="project-story"><h2>{t('projectOverview')}</h2><p>{localize(project.description)}</p><h2>{t('responsibilities')}</h2><ul className="responsibility-list">{project.responsibilities.map(item => <li key={item.en}>{localize(item)}</li>)}</ul><h2>{t('outcome')}</h2><p>{localize(project.outcome)}</p></section><aside className="panel project-facts"><h3>{t('role')}</h3><p>{localize(project.role)}</p><h3>{t('tech')}</h3><div className="skill-chips">{project.tech.map(item => <span key={item}>{item}</span>)}</div>{(source || demo) && <div className="project-actions">{source && <a className="button button-light" href={source} target="_blank" rel="noopener noreferrer"><Github size={16}/>{t('source')}<ExternalLink size={14}/></a>}{demo && <a className="button button-dark" href={demo} target="_blank" rel="noopener noreferrer">{t('liveDemo')}<ArrowUpRight size={16}/></a>}</div>}</aside></div><ChapterNavigation current="projects"/></>
}
