import { useId, useMemo } from 'react'
import { createSnakeRoute } from '@/lib/snake-route'

export type ContributionCell = { date: string; count: number; level: number; x: number; y: number }
const label = (cell: ContributionCell) => `${cell.count} ${cell.count === 1 ? 'contribution' : 'contributions'} on ${new Date(`${cell.date}T00:00:00Z`).toLocaleDateString('en-US', { month:'short',day:'numeric',year:'numeric',timeZone:'UTC' })}`

// Pursue the closest contribution using the real calendar, rather than sweeping it.
export default function ContributionSnake({ cells, width, description, select }: { cells: ContributionCell[]; width: number; description: string; select: (cell: ContributionCell) => void }) {
  const id = `snake-${useId().replace(/[^a-z\d]/gi,'')}`
  const motion = useMemo(() => {
    const { points,visits:visited } = createSnakeRoute(cells,width)
    if (!points.length) return null
    const steps = points.length-1
    // Reference SVG travels one 16px cell in approximately 100ms.
    const duration = steps*.1
    const percentage = (step: number) => (step/steps*100).toFixed(4)
    let css = `@keyframes ${id}-move {${points.map((point,index) => `${percentage(index)}%{transform:translate(${point.x}px,${point.y}px)}`).join('')}}`
    const food = cells.filter(cell => cell.count>0).map(cell => ({ ...cell, step:visited.get(`${cell.x},${cell.y}`)! })).sort((a,b) => a.step-b.step)
    for (const cell of food) {
      css += `@keyframes ${id}-eat-${cell.step}{0%,${percentage(cell.step-.05)}%{fill:var(--activity-color)}${percentage(cell.step)}%,100%{fill:var(--activity-0)}}`
    }
    const total = food.reduce((sum,cell) => sum+cell.count,0)
    let collected = 0
    const bar = food.map(cell => { const before=collected; collected+=cell.count; return `${percentage(cell.step-.05)}%{transform:scaleX(${before/total})}${percentage(cell.step)}%{transform:scaleX(${collected/total})}` }).join('')
    css += `@keyframes ${id}-collect{0%{transform:scaleX(0)}${bar}100%{transform:scaleX(${total ? 1 : 0})}}`
    return { css,duration,visited,start:points[0] }
  }, [cells,width,id])
  return <svg className="activity-graph activity-snake-graph" viewBox={`-16 -16 ${width+32} 184`} role="img" aria-label={description}>
    {motion && <style>{motion.css}</style>}
    {cells.map(cell => <rect key={cell.date} x={cell.x} y={cell.y} width={12} height={12} rx={2} className={`activity-cell activity-level-${cell.level}`} style={cell.count && motion ? { animationName:`${id}-eat-${motion.visited.get(`${cell.x},${cell.y}`)}`,animationDuration:`${motion.duration}s` } : undefined} onPointerEnter={() => select(cell)} onClick={() => select(cell)}><title>{label(cell)}</title></rect>)}
    {motion && <g className="snake-decoration" aria-hidden="true" pointerEvents="none"><rect className="snake-bar-track" x={0} y={144} width={width} height={12} rx={1}/><rect className="snake-bar-fill" x={0} y={144} width={width} height={12} rx={1} style={{ animationName:`${id}-collect`,animationDuration:`${motion.duration}s` }}/>
      {[3,2,1,0].map(segment => <rect key={segment} className={`contribution-snake snake-segment-${segment}`} x={-(1-segment*.12)} y={-(1-segment*.12)} width={14-segment*1.2} height={14-segment*1.2} rx={4-segment*.2} style={{ animationName:`${id}-move`,animationDuration:`${motion.duration}s`,animationDelay:`${segment*.1}s`,transform:`translate(${motion.start.x}px,${motion.start.y}px)` }}/>)}</g>}
  </svg>
}
