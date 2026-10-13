import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header, SectionTabs, Footer, PageEffects } from '@/components/Layout'
import { useLanguage } from '@/lib/i18n'
import Home from '@/pages/Home'

const About = lazy(() => import('@/pages/About'))
const Skills = lazy(() => import('@/pages/Skills'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetail = lazy(() => import('@/pages/Projects').then(module => ({ default: module.ProjectDetail })))
const Resume = lazy(() => import('@/pages/Resume'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  const location = useLocation()
  const { t } = useLanguage()
  return <><a className="skip-link" href="#main-content">{t('skip')}</a><Header/><main id="main-content" className={`site-main ${location.pathname === '/' ? 'site-main-home' : ''}`}>
    {location.pathname !== '/' && <SectionTabs/>}
    <Suspense fallback={<div className="page-loading" aria-busy="true"><span/><span/><span/></div>}>
      <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={{ opacity: 0, clipPath: 'inset(0 0 22px 0)', y: 14 }} animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)', y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}><PageEffects/><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/skills" element={<Skills/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="/resume" element={<Resume/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.div></AnimatePresence>
    </Suspense>
  </main><Footer/></>
}
