import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { portfolio } from '@/content'
import GithubActivity from '@/components/GithubActivity'

const technologies = [
  ['C', 'c-original.svg', '#172437', '#ddeaf8'],
  ['C++', 'cplusplus-plain.svg', '#172943', '#dce8f8'],
  ['Python', 'python-original.svg', '#1a2632', '#e0ecf5'],
  ['HTML', 'html5-original.svg', '#2d1d19', '#fbe8dc'],
  ['CSS', 'css3-original.svg', '#17273f', '#dce8f8'],
  ['JavaScript', 'javascript-original.svg', '#2d2a18', '#faf8dc'],
  ['TypeScript', 'typescript-original.svg', '#17283f', '#dce8f8'],
  ['Git', 'git-original.svg', '#2d211c', '#fbe8dc'],
  ['GitHub', 'github-original.svg', '#20232c', '#e8e8ec'],
  ['VS Code', 'vscode-original.svg', '#172635', '#dce8f5'],
  ['Docker', 'docker-original.svg', '#14293c', '#d8e8f8'],
  ['Dart', 'dart-original.svg', '#172b35', '#dce8f5'],
  ['Flutter', 'flutter-original.svg', '#172b3e', '#dce8f8'],
]

function TechnologyIcon({ technology, small = false }: { technology: string[]; small?: boolean }) {
  return <span className={`technology-icon ${technology[0] === 'GitHub' ? 'technology-github' : ''}`} style={{ '--tile-dark':technology[2], '--tile-light':technology[3] } as CSSProperties}><img src={`/assets/icons/${technology[1]}`} alt="" width={small ? 18 : 52} height={small ? 18 : 52}/></span>
}

function ShapeBadge({ shape, color }: { shape: string; color: string }) {
  const [active, setActive] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  return <button type="button" className={`badge-shape badge-shape--${shape} ${active ? 'shape-morph' : ''}`} aria-label={`Animate ${shape} decoration`} style={{ background:color }} onClick={() => { clearTimeout(timer.current); setActive(true); timer.current = setTimeout(() => setActive(false), 620) }}/>
}

function HeroFace() {
  const reduced = useReducedMotion()
  const track = useRef<HTMLButtonElement>(null)
  const [wink, setWink] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const follow = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === 'touch' || !track.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    track.current.style.transform = `translate(${Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) * .04))}px, ${Math.max(-6, Math.min(6, (event.clientY - bounds.top - bounds.height / 2) * .04))}px)`
  }
  return <div className="hero-side" onPointerMove={follow} onPointerLeave={() => { if (track.current) track.current.style.transform = '' }}><button type="button" ref={track} className="hero-face-mouse face-button" aria-label="Animate decorative face" onClick={() => { clearTimeout(timer.current); setWink(true); timer.current = setTimeout(() => setWink(false), 300) }}><span className="hero-face-track"><span className="hero-face" aria-hidden="true" data-face={wink ? '= > ω ᗜ.=' : '= ᗜ ω ᗜ.='}/></span></button></div>
}

function ProfileCard() {
  return <aside className="profile"><div className="profile-card">
<div className="profile-banner image-slot" data-image-slot="profile-banner" aria-label="Profile banner image space">
  <img src="/project-placeholders/bg-home.jpg" alt="" />
</div>    <div className="profile-body"><div className="avatar-row"><div className="avatar-wrap"><div className="avatar image-slot" data-image-slot="profile-avatar" aria-label="Profile photo space">{portfolio.portrait && <img className="avatar-image" src={portfolio.portrait} alt={portfolio.name.en}/>}</div></div><div className="badges"><ShapeBadge shape="circle" color="var(--blue)"/><ShapeBadge shape="triangle" color="var(--purple)"/><ShapeBadge shape="square" color="var(--dim)"/><ShapeBadge shape="diamond" color="var(--blue)"/></div></div>
      <div className="name-row"><h2 className="name">{portfolio.name.en}</h2></div><p className="handle">chal-48</p>
      <div className="divider"/>
      <div className="label">Studying</div><div className="field">{portfolio.education.degree.en}</div>
      <div className="label mt16">Focus</div><div className="roles"><div className="role-row"><span className="role-chip"><span className="role-dot blue"/>Student</span><span className="role-chip"><span className="role-dot blue"/>Full Stack</span></div><div className="role-row"><span className="role-chip"><span className="role-dot purple"/>Backend</span><span className="role-chip"><span className="role-dot purple"/>Embedded</span></div></div>
      <div className="label mt16">Education</div><div className="field profile-facts"><span>{portfolio.education.university.en}</span><span>Year {portfolio.education.year} · GPA {portfolio.education.gpa} / 4.00</span><span>{portfolio.education.period.en}</span></div>
    </div>
  </div></aside>
}

function RotatingName() {
  return <span className="name-rotator hero-name-rotator" aria-hidden="true"><span className="hero-name-track"><b className="hero-name hero-name-primary">Chalisa</b><b className="hero-name hero-name-alternate">Aom</b><b className="hero-name hero-name-clone">Chalisa</b></span></span>
}

export default function Home() {
  const upper = technologies.filter((_, index) => index % 2 === 0)
  const lower = technologies.filter((_, index) => index % 2 === 1)
  return <section className="home-grid"><ProfileCard/><div className="right-col">
    <section className="card hero"><div className="hero-main"><p className="hero-greet">Hello there.</p><h1 id="page-title" className="hero-title" tabIndex={-1} aria-label="I'm Chalisa, also known as Aom"><span className="hero-intro-prefix">I'm</span><RotatingName/></h1><p className="hero-sub">A student interested in full-stack development.</p><div className="hero-actions"><Link to="/about" className="btn-primary">About me<span className="btn-arrow dark"><ArrowRight size={17}/></span></Link><Link to="/projects" className="btn-ghost">Projects<span className="btn-arrow inset"><ArrowRight size={17}/></span></Link></div></div><HeroFace/></section>
    <Link to="/skills" className="card quote-card" data-testid="index-skills" aria-label="Technical skills"><div className="quote-main"><p className="quote-text">Web, mobile<br/>&amp; embedded.</p></div><div className="tiles-strip" aria-hidden="true">{[upper,lower].map((row,index) => <div className={`tiles-row ${index ? 'tiles-row-lower' : ''}`} key={index}>{[0,1].map(group => <div className="tiles-row-group" key={group}>{row.map(technology => <div className="tile" key={technology[0]}><TechnologyIcon technology={technology}/></div>)}</div>)}</div>)}</div><div className="quote-tech-panel">{technologies.map(technology => <div className="quote-tech-item" key={technology[0]}><span className="quote-tech-icon"><TechnologyIcon technology={technology} small/></span><span className="quote-tech-name">{technology[0]}</span></div>)}</div></Link>
    <div className="bento home-bento">
      <Link to="/skills" className="bento-thoughts nav-card"><div><div className="card-kicker">TECHNICAL</div><h2 className="nav-card-title">Skills</h2></div><span className="nav-card-ghost" aria-hidden="true">S</span><span className="nav-card-arrow" aria-hidden="true">↗</span></Link>
      <Link to="/about" className="bento-likes card-likes" data-testid="index-about"><div className="card-likes-img image-slot" data-image-slot="home-about" aria-label="About card image space"/><div className="card-body"><div className="card-kicker">ABOUT</div><h2 className="card-title-lg">About<br/>me</h2></div><span className="card-arrow-lg" aria-hidden="true">↗</span></Link>
      <Link to="/contact" className="bento-friends nav-card" data-testid="index-contact"><div><div className="card-kicker">CONTACT</div><h2 className="nav-card-title">Contact</h2></div><span className="nav-card-ghost" aria-hidden="true">@</span><span className="nav-card-arrow" aria-hidden="true">↗</span></Link>
      <Link to="/resume" className="bento-experience nav-card" data-testid="index-resume"><div><div className="card-kicker">RESUME</div><h2 className="nav-card-title">Resume</h2></div><span className="nav-card-ghost" aria-hidden="true">R</span><span className="nav-card-arrow" aria-hidden="true">↗</span></Link>
      <Link to="/projects" className="bento-projects card-projects" data-testid="index-projects"><img className="card-projects-glyph git-projects-glyph" src="/assets/icons/git-original.svg" alt="" aria-hidden="true"/><div className="card-body-sm"><div className="card-kicker">PROJECTS</div><h2 className="card-title-md">My projects</h2></div><span className="card-arrow-sm" aria-hidden="true">↗</span></Link>
    </div>
    <GithubActivity/>
  </div></section>
}
