import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Search, ArrowUpRight, ArrowLeft, ExternalLink, Github, FolderSearch, X } from 'lucide-react'
import { portfolio, safeExternalUrl } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, DemoNote, ChapterNavigation } from '@/components/ui'
import { ProjectVisual } from '@/components/visuals'
import NotFound from './NotFound'

const categories = ['all', 'web', 'iot', 'systems'] as const

export default function Projects() {
  const { t, localize } = useLanguage()
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const category = categories.find(value => value === params.get('category')) ?? 'all'
  const filtered = portfolio.projects.filter(project => (category === 'all' || project.category === category) && [project.title.th, project.title.en, project.summary.th, project.summary.en, ...project.tech].join(' ').toLowerCase().includes(search.trim().toLowerCase()))
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if (!value || value === 'all') next.delete(key); else next.set(key,value); setParams(next, { replace: true, preventScrollReset: true }) }
  return <><PageHeading eyebrow={t('projectsEyebrow')} title={t('projectsTitle')} description={t('projectsIntro')}/><DemoNote/>
    <div className="project-toolbar"><div className="filter-tabs" role="group" aria-label={t('projects')}>{categories.map(value => <button type="button" key={value} aria-pressed={category===value} className={category===value ? 'active' : ''} onClick={() => update('category',value)}>{t(value)}</button>)}</div><div className="search-field"><Search size={17}/><input aria-label={t('searchLabel')} placeholder={t('search')} value={search} onChange={event => update('search',event.target.value)}/>{search && <button className="icon-button" aria-label={t('clearFilters')} onClick={() => update('search','')}><X size={15}/></button>}</div></div>
    <p className="result-count" role="status" aria-live="polite">{filtered.length} {t('results')}</p>
    {filtered.length ? <div className="projects-grid">{filtered.map(project => <Link className="project-card" to={`/projects/${project.id}`} key={project.id}><ProjectVisual variant={project.visual}/><div className="project-card-copy"><div className="project-meta"><span>{t(categories.find(value => value === project.category) ?? 'web')}</span><span>{project.year === 'DEMO' ? t('demo') : project.year}</span></div><h2>{localize(project.title)}<ArrowUpRight size={21}/></h2><p>{localize(project.summary)}</p><div className="project-tech">{project.tech.slice(0,3).map(item => <span key={item}>{item}</span>)}</div><span className="project-read">{t('readProject')}<ArrowUpRight size={15}/></span></div></Link>)}</div> : <div className="empty-state"><FolderSearch size={36} strokeWidth={1.4}/><h2>{t('noResults')}</h2><p>{t('noResultsNote')}</p><button type="button" className="button button-light" onClick={() => setParams({})}>{t('clearFilters')}</button></div>}
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
