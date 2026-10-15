import { Braces, Layers3, Database, Wrench } from 'lucide-react'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { PageHeading, ChapterNavigation } from '@/components/ui'
import type { PointerEvent } from 'react'

const icons = [Braces, Layers3, Database, Wrench]
const followPointer = (event: PointerEvent<HTMLElement>) => {
  if (event.pointerType === 'touch') return
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--pointer-x',`${event.clientX-bounds.left}px`)
  event.currentTarget.style.setProperty('--pointer-y',`${event.clientY-bounds.top}px`)
}

export default function Skills() {
  const { t, localize } = useLanguage()
  return <><PageHeading title={t('skills')}/>
    <div className="skills-grid">{portfolio.skills.map((group,index) => { const Icon = icons[index%icons.length]; return <section key={group.id} onPointerMove={followPointer} className={`panel skill-panel skill-${group.id}`}><div className="skill-heading"><span className="panel-icon"><Icon size={22}/></span></div><h2>{localize(group.label)}</h2><div className="skill-chips">{group.items.map(item => <span key={item}>{item}</span>)}</div></section> })}</div>
    <ChapterNavigation current="skills"/></>
}
