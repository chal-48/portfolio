import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, ArrowLeft, ExternalLink, Github, Code2, Smartphone, Ship } from 'lucide-react'
import { portfolio, safeExternalUrl } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, ChapterNavigation } from '@/components/ui'
import NotFound from './NotFound'

export default function Projects() {
  const { t, localize } = useLanguage()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const categories = [{ id: 'web', label: 'Web' }, { id: 'mobile', label: 'Mobile' }, { id: 'iot', label: 'Embedded' }]
  const filtered = portfolio.projects.filter(project => (!category || project.category === category) && `${project.title.en} ${project.summary.en} ${project.tech.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <><PageHeading title={t('projects')} />
    <div className="project-toolbar"><input aria-label="Search projects" type="search" placeholder="Search projects…" value={query} onChange={event => setQuery(event.target.value)} /><div className="project-filters" aria-label="Project categories"><button type="button" aria-pressed={!category} onClick={() => setCategory(null)}>All</button>{categories.map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(previous => previous === item.id ? null : item.id)}>{item.label}</button>)}</div></div>
    <div className="project-gallery">{filtered.map(project => {
      const Icon = project.category === 'web' ? Code2 : project.category === 'mobile' ? Smartphone : Ship; return <article className="project-tile case-study-card" key={project.id}>
        <Link className="proj-card" to={`/projects/${project.id}`}><div className="proj-top"><div className="proj-top-left"><span className="proj-icon"><Icon size={18} /></span><span className="proj-kicker blue">{project.category === 'iot' ? 'EMBEDDED' : project.category.toUpperCase()}</span></div><span className="proj-arrow" aria-hidden="true">↗</span></div><div className="project-tile-image proj-cover-wrap"><img className="proj-cover project-screenshot" src={project.coverImage} alt={`${project.title.en} screenshot`} data-image-slot={`project-${project.id}`} /></div><h2 className="proj-title">{localize(project.title)}</h2><p className="proj-desc">{localize(project.summary)}</p><div className="proj-tags">{project.tech.slice(0, 3).map(tech => <span className="proj-tag" key={tech}>{tech}</span>)}</div></Link>
      </article>
    })}</div>{!filtered.length && <p className="project-empty" role="status">No projects found.</p>}
    <ChapterNavigation current="projects" /></>
}

export function ProjectDetail() {
  const { id } = useParams()
  const { t, localize } = useLanguage()
  const project = portfolio.projects.find(item => item.id === id)
  if (!project) return <NotFound />
  const source = safeExternalUrl(project.sourceUrl)
  const demo = safeExternalUrl(project.demoUrl)
  return <><div className="project-detail-heading"><Link to="/projects" className="back-link"><ArrowLeft size={16} />{t('backProjects')}</Link><h1 id="page-title" tabIndex={-1}>{localize(project.title)}</h1><p className="page-description">{localize(project.summary)}</p><div className="project-tech">{project.tech.map(item => <span key={item}>{item}</span>)}</div></div>
    <div className="project-detail-art has-image" data-image-slot={`project-detail-${project.id}`}><img src={project.coverImage} alt={`${project.title.en} screenshot`} className="project-detail-screenshot"/></div>
    <div className="project-detail-grid"><section className="project-story"><h2>{t('projectOverview')}</h2><p>{localize(project.description)}</p><h2>{t('responsibilities')}</h2><ul className="responsibility-list">{project.responsibilities.map(item => <li key={item.en}>{localize(item)}</li>)}</ul><h2>{t('outcome')}</h2><p>{localize(project.outcome)}</p></section><aside className="panel project-facts"><h3>{t('role')}</h3><p>{localize(project.role)}</p><h3>{t('tech')}</h3><div className="skill-chips">{project.tech.map(item => <span key={item}>{item}</span>)}</div>{(source || demo) && <div className="project-actions">{source && <a className="button button-light" href={source} target="_blank" rel="noopener noreferrer"><Github size={16} />{t('source')}<ExternalLink size={14} /></a>}{demo && <a className="button button-dark" href={demo} target="_blank" rel="noopener noreferrer">{t('liveDemo')}<ArrowUpRight size={16} /></a>}</div>}</aside></div><ChapterNavigation current="projects" /></>
}
