import { GraduationCap, ArrowUpRight, Map, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, DemoNote, ChapterNavigation } from '@/components/ui'
import { Avatar } from '@/components/visuals'

export default function About() {
  const { t, localize } = useLanguage()
  return <><PageHeading eyebrow={t('aboutEyebrow')} title={t('aboutTitle')} description={t('aboutIntro')}/><DemoNote/>
    <div className="about-grid"><section className="panel about-story"><Avatar large/><div><span className="eyebrow">{t('story')}</span><h2>{localize(portfolio.name)}</h2><span className="muted role-line">{localize(portfolio.role)}</span><p>{localize(portfolio.bio)}</p></div></section>
      <section className="panel goals-panel"><span className="panel-icon"><Map size={20}/></span><h2>{t('goals')}</h2><p>{localize(portfolio.goal)}</p><Link className="text-link" to="/projects">{t('viewWork')}<ArrowUpRight size={16}/></Link></section>
      <section className="panel education-panel"><div className="panel-heading"><span className="panel-icon"><GraduationCap size={21}/></span><h2>{t('education')}</h2></div><p className="eyebrow education-period">{localize(portfolio.education.period)}</p><h3>{localize(portfolio.education.university)}</h3><p className="muted">{localize(portfolio.education.degree)}</p><div className="education-stats"><div><small>{t('year')}</small><strong>{portfolio.education.year ?? t('pending')}</strong></div><div><small>{t('gpa')}</small><strong>{portfolio.education.gpa ?? t('pending')}</strong></div></div><h4><BookOpen size={15}/>{t('courses')}</h4><ul className="course-list">{portfolio.education.courses.map(course => <li key={course.en}>{localize(course)}</li>)}</ul></section>
      <section className="panel interests-panel"><h2>{t('interests')}</h2><div className="interest-list">{portfolio.interests.map((interest,index) => <div key={interest.en}><span>0{index+1}</span><h3>{localize(interest)}</h3><ArrowUpRight size={17}/></div>)}</div><div className="interest-note"><span className="status-dot"/><span>{localize(portfolio.tagline)}</span></div></section>
    </div><ChapterNavigation current="about"/></>
}
