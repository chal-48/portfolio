import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ArrowRight, GraduationCap, Code2, Lightbulb } from 'lucide-react'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { Avatar, ProjectVisual } from '@/components/visuals'
import { OrbitNavigator } from '@/components/OrbitNavigator'

const stepKeys = [
  { label: 'step1', title: 'step1Title', body: 'step1Body' },
  { label: 'step2', title: 'step2Title', body: 'step2Body' },
  { label: 'step3', title: 'step3Title', body: 'step3Body' },
  { label: 'step4', title: 'step4Title', body: 'step4Body' },
] as const

export default function Home() {
  const { t, localize, language } = useLanguage()
  const [step, setStep] = useState(0)
  const stepButtons = useRef<(HTMLButtonElement | null)[]>([])
  const featured = portfolio.projects.find(project => project.featured) ?? portfolio.projects[0]
  return <div className="home-page">
    <motion.section className="hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
      <p className="hero-kicker"><span className="status-dot" />{t('currently')}<span className="kicker-line"/>COMPUTER ENGINEERING</p>
      <h1 id="page-title" tabIndex={-1}><span className="hero-intro">{t('greeting')} <Avatar /><span>{localize(portfolio.name)}{language === 'en' ? '.' : ''}</span></span><span className="hero-muted">{t('studentPrefix')}</span><span className="hero-last-line"><span className="accent-text">{t('engineering')}</span><span className="status-pill"><span className="status-dot"/>{t('availability')}</span></span></h1>
      <div className="hero-bottom"><Link className="button button-dark" to="/projects">{t('viewWork')}<ArrowUpRight size={17}/></Link><p>{t('heroNote')}</p></div>
    </motion.section>

    <motion.section className="bento-grid" aria-label={t('about')} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .5 }}>
      <Link className="bento-card education-bento" to="/about"><span className="bento-label">{t('education')}</span><div className="education-timeline"><div className="timeline-marker"/><div><small>{localize(portfolio.education.period)}</small><strong>{localize(portfolio.education.degree)}</strong><p>{localize(portfolio.education.university)}</p></div></div><span className="education-bottom"><GraduationCap size={23}/><ArrowUpRight size={17}/></span></Link>
      <Link className="bento-card featured-bento" to={featured ? `/projects/${featured.id}` : '/projects'}><span className="bento-label">{portfolio.isDemo ? t('featured') : t('projects')}</span>{featured && <ProjectVisual variant={featured.visual} compact />}<span className="featured-caption"><strong>{featured ? localize(featured.title) : t('projects')}</strong><ArrowUpRight size={16}/></span></Link>
      <div className="bento-card interests-bento"><span className="bento-label">{t('focus')}</span><div className="orbit-decoration" aria-hidden="true"><div/><div/><div/><span><Lightbulb size={25} strokeWidth={1.5}/></span><i/></div><div className="interest-preview">{portfolio.interests.slice(0,2).map(interest => <span key={interest.en}>{localize(interest)}</span>)}</div></div>
      <Link className="bento-card learning-bento" to="/skills"><span className="bento-label">{t('learning')}</span><div className="code-decoration" aria-hidden="true"><span className="code-bracket">{'{'}</span><Code2 size={43} strokeWidth={1.3}/><span className="code-bracket">{'}'}</span></div><p>{t('learningNote')}</p><span className="learning-tags">React<span>·</span>Python<span>·</span>Git<ArrowUpRight size={15}/></span></Link>
      <div className="bento-card process-bento"><span className="bento-label">{t('process')}</span><div className="process-copy" id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${step}`}><span className="process-number">0{step+1}</span><h2>{t(stepKeys[step].title)}</h2><p>{t(stepKeys[step].body)}</p></div><div className="process-tabs" role="tablist" aria-label={t('process')}>{stepKeys.map((item,index) => <button key={item.label} type="button" id={`process-tab-${index}`} ref={element => { stepButtons.current[index] = element }} role="tab" aria-selected={step === index} aria-controls="process-panel" tabIndex={step === index ? 0 : -1} className={step === index ? 'active' : ''} onClick={() => setStep(index)} onKeyDown={event => { let next = index; if (event.key === 'ArrowRight') next = (index+1)%4; else if (event.key === 'ArrowLeft') next = (index+3)%4; else if (event.key === 'Home') next=0; else if (event.key === 'End') next=3; else return; event.preventDefault(); setStep(next); stepButtons.current[next]?.focus() }}>{t(item.label)}</button>)}</div></div>
    </motion.section>

    <div className="explore-divider"><span/><a href="#explore" aria-label={t('exploreTitle')}><ArrowDown size={18}/></a><span/></div>
    <section className="explore-section" id="explore"><p className="eyebrow">{t('exploreEyebrow')}</p><h2>{t('exploreTitle')}</h2><p className="section-description">{t('exploreNote')}</p><OrbitNavigator/><Link to="/contact" className="text-link explore-contact">{t('getInTouch')}<ArrowRight size={15}/></Link></section>
  </div>
}
