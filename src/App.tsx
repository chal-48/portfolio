import { Route, Routes, useLocation } from 'react-router-dom'
import SmoothScroll from '@/components/SmoothScroll'
import { Header, Footer, PageEffects } from '@/components/Layout'
import { useLanguage } from '@/lib/i18n'
import Home from '@/pages/Home'

import About from '@/pages/About'
import Skills from '@/pages/Skills'
import Projects, { ProjectDetail } from '@/pages/Projects'
import Resume from '@/pages/Resume'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'
import Credits from '@/pages/Credits'

export default function App() {
  const location = useLocation()
  const { t } = useLanguage()
  return <><SmoothScroll/><a className="skip-link" href="#main-content">{t('skip')}</a><Header/><main id="main-content" className={`site-main ${location.pathname === '/' ? 'site-main-home' : ''}`}>
      <div className="page-content page-transition" key={location.pathname}><PageEffects pathname={location.pathname}/><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/skills" element={<Skills/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="/resume" element={<Resume/>}/><Route path="/contact" element={<Contact/>}/><Route path="/credits" element={<Credits/>}/><Route path="*" element={<NotFound/>}/></Routes></div>
  </main><Footer/></>
}
