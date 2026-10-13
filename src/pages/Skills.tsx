import { Link } from 'react-router-dom'
import { ArrowUpRight, Braces, Layers3, Database, Wrench } from 'lucide-react'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, DemoNote, ChapterNavigation } from '@/components/ui'

const icons = [Braces, Layers3, Database, Wrench]

export default function Skills() {
  const { t, localize } = useLanguage()
  return <><PageHeading eyebrow={t('skillsEyebrow')} title={t('skillsTitle')} description={t('skillsIntro')}/><DemoNote/>
    <div className="skills-grid">{portfolio.skills.map((group,index) => { const Icon = icons[index%icons.length]; return <section key={group.id} className={`panel skill-panel skill-${group.id}`}><div className="skill-heading"><span className="panel-icon"><Icon size={22}/></span><span className="chapter-number">0{index+1}</span></div><h2>{localize(group.label)}</h2><p>{localize(group.description)}</p><div className="skill-chips">{group.items.map(item => <span key={item}>{item}</span>)}</div></section> })}</div>
    <div className="skills-bottom"><p>{portfolio.isDemo ? t('skillsNote') : localize(portfolio.tagline)}</p><Link to="/projects" className="button button-dark">{t('skillProjects')}<ArrowUpRight size={17}/></Link></div><ChapterNavigation current="skills"/></>
}
