import { ArrowUpRight, CalendarDays, Code2, Folder, Check, Sun, Activity } from 'lucide-react'
import { portfolio } from '@/content'

export function Logo({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 44 40" fill="none" aria-hidden="true"><path d="M19 5c2-3 5-3 7 0l13 22c2 4 0 7-4 7H10c-4 0-6-3-4-7L19 5Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" /><circle cx="39" cy="35" r="3.4" fill="var(--accent)" /></svg>
}

export function Avatar({ large = false }: { large?: boolean }) {
  return <span className={`avatar ${large ? 'avatar-large' : ''}`}>
    {portfolio.portrait ? <img src={portfolio.portrait} alt="" /> : <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <rect width="100" height="100" rx="27" fill="#e9e6dd" />
      <path d="M14 100c2-22 14-37 36-37s34 15 36 37" fill="#69725d" />
      <path d="M40 59h20v18c-4 8-16 8-20 0V59Z" fill="#d29b79" />
      <ellipse cx="50" cy="42" rx="22" ry="27" fill="#e3b595" />
      <path d="M27 40c-2-23 11-32 25-32 22 0 27 21 24 39l-8-16c-15 5-24-2-26-7-3 7-8 12-15 16Z" fill="#353830" />
      <path d="M34 43h13m6 0h13" stroke="#353830" strokeWidth="3" strokeLinecap="round" />
      <rect x="32" y="37" width="16" height="13" rx="5" stroke="#353830" strokeWidth="2.5" /><rect x="52" y="37" width="16" height="13" rx="5" stroke="#353830" strokeWidth="2.5" />
      <path d="M48 42h4m-9 16c4 3 10 3 14 0" stroke="#353830" strokeWidth="2" strokeLinecap="round" />
    </svg>}
  </span>
}

export function ProjectVisual({ variant, compact = false }: { variant: string; compact?: boolean }) {
  return <div className={`project-art art-${variant} ${compact ? 'art-compact' : ''}`} aria-hidden="true">
    {variant === 'campus' ? <div className="mini-app">
      <div className="mini-sidebar"><span className="mini-brand"><Folder size={14} /></span><span /><span /><span /><span /></div>
      <div className="mini-content"><div className="mini-top"><span>campus.</span><span className="mini-avatar">C</span></div><div className="mini-greeting">A little more organized.</div><div className="mini-calendar"><div className="mini-date"><CalendarDays size={14} /><span>MON, 12</span></div><div className="mini-event"><span className="mini-dot" /><span>Creative coding</span><span>09:00</span></div><div className="mini-event"><span className="mini-dot blue" /><span>Digital systems</span><span>13:00</span></div></div><div className="mini-task"><Check size={11} /><span>One thing at a time.</span><ArrowUpRight size={12} /></div></div>
    </div> : variant === 'sensor' ? <div className="sensor-scene"><div className="sensor-heading"><span className="mini-dot" /> roomsense<Sun size={16} /></div><div className="sensor-gauge"><span className="gauge-value">24<span>°</span></span><span className="gauge-label">COMFORT ZONE</span></div><div className="sensor-bottom"><Activity size={14} /><span>Connected to your space.</span><span className="mini-dot" /></div></div> : <div className="chip-scene"><svg viewBox="0 0 340 230"><g stroke="#b5906c" strokeWidth="1.5" fill="none">{[0,1,2,3,4].map(i => <g key={i}><path d={`M${120+i*25} 65V${20+i%2*15}M${120+i*25} 165v${40-i%2*15}M115 ${80+i*18}H${35+i%2*15}M225 ${80+i*18}h${80-i%2*15}`} /><circle cx={120+i*25} cy={20+i%2*15} r="3"/><circle cx={120+i*25} cy={205-i%2*15} r="3" /></g>)}</g><rect x="115" y="65" width="110" height="100" rx="12" fill="#413c33"/><rect x="124" y="74" width="92" height="82" rx="6" fill="#544c40" stroke="#766956"/><text x="170" y="110" textAnchor="middle" fill="#eddbbd" fontSize="13" fontFamily="monospace">tiny CPU</text><text x="170" y="133" textAnchor="middle" fill="#a69984" fontSize="9" fontFamily="monospace">0100 1011</text></svg><span className="chip-caption"><Code2 size={13} /> small chip. big curiosity.</span></div>}
  </div>
}
