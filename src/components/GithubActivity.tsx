import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { portfolio, safeExternalUrl } from '@/content'
import ContributionSnake from './ContributionSnake'

type Day = { date: string; count: number; level: number }
const cache = new Map<string, { days: Day[]; expires: number }>()
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month:'short',day:'numeric',year:'numeric',timeZone:'UTC' })

function readDays(value: unknown): Day[] {
  if (!value || typeof value !== 'object' || !('contributions' in value) || !Array.isArray(value.contributions)) throw new Error('Invalid contribution data')
  const days = value.contributions as unknown[]
  if (!days.length || days.length > 371) throw new Error('Invalid contribution range')
  const parsed = days.map(day => {
    if (!day || typeof day !== 'object') throw new Error('Invalid day')
    const item = day as Record<string, unknown>
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !Number.isFinite(Date.parse(item.date)) || !Number.isInteger(item.count) || Number(item.count) < 0 || !Number.isInteger(item.level) || Number(item.level) < 0 || Number(item.level) > 4) throw new Error('Invalid day')
    return { date:item.date, count:Number(item.count), level:Number(item.level) }
  }).sort((a,b) => a.date.localeCompare(b.date))
  if (new Set(parsed.map(day => day.date)).size !== parsed.length) throw new Error('Duplicate dates')
  return parsed
}

export default function GithubActivity() {
  const profile = safeExternalUrl(portfolio.github)
  const username = profile && new URL(profile).hostname === 'github.com' ? new URL(profile).pathname.match(/^\/([a-z\d-]+)\/?$/i)?.[1] : null
  const [days, setDays] = useState<Day[] | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [selected, setSelected] = useState<Day | null>(null)
  const [visible, setVisible] = useState(false)
  const calendar = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = calendar.current
    if (!element) return
    let intersecting = true
    const sync = () => setVisible(intersecting && document.visibilityState === 'visible')
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; sync() })
    observer.observe(element)
    document.addEventListener('visibilitychange',sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange',sync) }
  }, [])
  useEffect(() => {
    if (!username) return
    const saved = cache.get(username)
    if (saved && saved.expires > Date.now()) { setDays(saved.days); return }
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12000)
    let current = true
    setError(false)
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, { signal:controller.signal })
      .then(response => { if (!response.ok) throw new Error('Contribution service unavailable'); return response.json() })
      .then(value => { const result = readDays(value); if (current) { cache.set(username,{ days:result,expires:Date.now()+3600000 }); setDays(result) } })
      .catch(() => { if (current) setError(true) })
      .finally(() => window.clearTimeout(timeout))
    return () => { current = false; controller.abort(); window.clearTimeout(timeout) }
  }, [username, attempt])
  const total = days?.reduce((sum,day) => sum+day.count,0) ?? 0
  const first = days ? new Date(`${days[0].date}T00:00:00Z`) : null
  const offset = first?.getUTCDay() ?? 0
  const cells = useMemo(() => days?.map(day => {
    const position = Math.round((Date.parse(`${day.date}T00:00:00Z`)-first!.getTime())/86400000)+offset
    return { ...day, x:Math.floor(position/7)*16, y:(position%7)*16 }
  }), [days, offset])
  const width = cells ? Math.max(848, cells[cells.length-1].x+12) : 848
  const description = `${total.toLocaleString('en-US')} contributions in the last year`
  if (!username || !profile) return null
  return <section ref={calendar} className="card card-github github-activity" data-animation-running={visible} aria-label="GitHub contributions" aria-busy={!days && !error}>
    <div className="activity-heading"><a href={profile} target="_blank" rel="noopener noreferrer">GitHub · {username}<ArrowUpRight size={14} aria-hidden="true"/></a></div>
    {days && cells ? <><div className="activity-scroll" tabIndex={0} role="region" aria-label="Contribution calendar. Scroll horizontally to explore." onPointerLeave={() => setSelected(null)}><ContributionSnake cells={cells} width={width} description={`${description}, ${dateLabel(days[0].date)} to ${dateLabel(days[days.length-1].date)}`} select={setSelected}/></div><div className="activity-footer"><span>{selected ? `${selected.count} ${selected.count === 1 ? 'contribution' : 'contributions'} · ${dateLabel(selected.date)}` : description}</span><span className="activity-legend" aria-label="Color intensity: fewer to more contributions">Less{[0,1,2,3,4].map(level => <i key={level} className={`activity-level-${level}`}/>)}More</span></div></> : error ? <div className="activity-state" role="status"><span>GitHub activity is unavailable.</span><button type="button" onClick={() => { setError(false); setAttempt(value => value+1) }}><RefreshCw size={13}/>Retry</button></div> : <div className="activity-state" role="status">Loading GitHub activity…</div>}
  </section>
}
