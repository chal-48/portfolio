import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Download, Mail } from 'lucide-react'
import { portfolio } from '@/content'
import { useLanguage } from '@/lib/i18n'
import { chapters } from '@/lib/navigation'

type ChapterId = (typeof chapters)[number]['id']

const copy = {
  th: {
    edition: 'PORTFOLIO / 2026',
    discipline: 'นักศึกษาวิศวกรรมคอมพิวเตอร์',
    role: 'FULL STACK DEVELOPER',
    index: 'สารบัญ',
    instruction: 'วางเมาส์หรือใช้แป้นพิมพ์เพื่อดูตัวอย่าง',
    open: 'เปิดหัวข้อ',
    photo: 'พื้นที่สำหรับรูปถ่าย',
    replace: 'เพิ่มรูปของคุณภายหลัง',
    scroll: 'สำรวจหัวข้อ',
    previews: {
      about: 'ประวัติ การศึกษา และทิศทางที่ต้องการพัฒนาต่อ',
      skills: 'ภาษา Framework ฐานข้อมูล และเครื่องมือที่ใช้งาน',
      projects: 'ผลงานที่คัดเลือก บทบาท เทคโนโลยี และผลลัพธ์',
      resume: 'ข้อมูลโดยสรุปในรูปแบบ PDF พร้อมดาวน์โหลด',
      contact: 'Email, GitHub, LinkedIn และช่องทางพูดคุย',
    },
  },
  en: {
    edition: 'PORTFOLIO / 2026',
    discipline: 'Computer Engineering Student',
    role: 'FULL STACK DEVELOPER',
    index: 'Index',
    instruction: 'Hover or use the keyboard to preview each chapter.',
    open: 'Open chapter',
    photo: 'Portrait placeholder',
    replace: 'Add your photo later',
    scroll: 'Explore the index',
    previews: {
      about: 'Background, education, and the direction I want to grow in.',
      skills: 'Languages, frameworks, databases, and tools I work with.',
      projects: 'Selected work, responsibilities, technology, and outcomes.',
      resume: 'A concise PDF version of my background, ready to download.',
      contact: 'Email, GitHub, LinkedIn, and a direct way to reach me.',
    },
  },
} as const

const projectCovers = [
  '/project-placeholders/project-01.svg',
  '/project-placeholders/project-02.svg',
  '/project-placeholders/project-03.svg',
]

function ChapterPreview({ id, photoLabel, replaceLabel }: { id: ChapterId; photoLabel: string; replaceLabel: string }) {
  if (id === 'about') return <div className="index-portrait-preview">
    <div className="portrait-placeholder" aria-label={photoLabel}>
      <span className="portrait-index">01</span>
      <span className="portrait-initials">{portfolio.initials}</span>
      <span className="portrait-label">{replaceLabel}</span>
    </div>
    <div className="portrait-rule"><span />{photoLabel}</div>
  </div>

  if (id === 'skills') return <div className="index-skills-preview">
    {portfolio.skills.map((group, index) => <div className="skill-preview-row" key={group.id}>
      <span>0{index + 1}</span>
      <strong>{group.items.slice(0, 3).join(' / ')}</strong>
      <i>{String(group.items.length).padStart(2, '0')}</i>
    </div>)}
    <div className="skill-preview-orbit" aria-hidden="true"><span /><span /><span /></div>
  </div>

  if (id === 'projects') return <div className="index-project-preview">
    {projectCovers.map((src, index) => <div className={`project-sheet sheet-${index + 1}`} key={src}>
      <img src={src} alt="" />
      <span>0{index + 1}</span>
    </div>)}
  </div>

  if (id === 'resume') return <div className="index-resume-preview">
    <div className="resume-sheet">
      <div className="resume-sheet-top"><span>CURRICULUM VITAE</span><Download size={18} /></div>
      <strong>{portfolio.initials}</strong>
      <div className="resume-lines"><span /><span /><span /><span /></div>
      <small>PDF · A4 · 01 PAGE</small>
    </div>
  </div>

  return <div className="index-contact-preview">
    <span className="contact-pulse" />
    <Mail size={42} strokeWidth={1.25} />
    <p>EMAIL<br />GITHUB<br />LINKEDIN</p>
    <ArrowDownRight size={54} strokeWidth={1.1} />
  </div>
}

export default function Home() {
  const { t, localize, language } = useLanguage()
  const content = copy[language]
  const [active, setActive] = useState<ChapterId>('projects')
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const activeChapter = chapters.find(chapter => chapter.id === active) ?? chapters[2]

  const movePreview = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--pointer-x', x.toFixed(3))
    event.currentTarget.style.setProperty('--pointer-y', y.toFixed(3))
  }

  const resetPreview = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '0')
    event.currentTarget.style.setProperty('--pointer-y', '0')
  }

  const moveIndexRow = (event: PointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
    event.currentTarget.style.setProperty('--row-x', ((event.clientX - bounds.left) / bounds.width - .5).toFixed(3))
  }

  const resetIndexRow = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--spot-x', '50%')
    event.currentTarget.style.setProperty('--spot-y', '50%')
    event.currentTarget.style.setProperty('--row-x', '0')
  }

  const moveRowFocus = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % chapters.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + chapters.length - 1) % chapters.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = chapters.length - 1
    else return
    event.preventDefault()
    setActive(chapters[next].id)
    rowRefs.current[next]?.focus()
  }

  return <div className="editorial-home">
    <section className="editorial-cover" aria-labelledby="page-title">
      <motion.div className="cover-heading" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .075 } } }}>
        <motion.div className="cover-meta" variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          <span>{content.edition}</span>
          <span className="cover-meta-line" />
          <span>{content.discipline}</span>
        </motion.div>
        <motion.h1 id="page-title" tabIndex={-1} variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}>
          <span>{localize(portfolio.name)}</span>
          <strong>{content.role}</strong>
        </motion.h1>
      </motion.div>

      <motion.div className="editorial-index-layout" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, duration: .55 }}>
        <nav className="editorial-index" aria-label={t('allSections')}>
          <div className="index-intro"><span>{content.index}</span><small>{content.instruction}</small></div>
          <div className="index-rows">
            {chapters.map((chapter, index) => <Link
              to={chapter.path}
              key={chapter.id}
              ref={element => { rowRefs.current[index] = element }}
              className={`index-row ${active === chapter.id ? 'is-active' : ''}`}
              data-testid={`index-${chapter.id}`}
              onMouseEnter={() => setActive(chapter.id)}
              onFocus={() => setActive(chapter.id)}
              onTouchStart={() => setActive(chapter.id)}
              onKeyDown={event => moveRowFocus(event, index)}
              onPointerMove={moveIndexRow}
              onPointerLeave={resetIndexRow}
            >
              <span className="index-number">{chapter.number}</span>
              <span className="index-title">{t(chapter.label)}</span>
              <span className="index-description">{content.previews[chapter.id]}</span>
              <ArrowUpRight className="index-arrow" size={25} strokeWidth={1.35} />
            </Link>)}
          </div>
        </nav>

        <aside className="editorial-preview" onPointerMove={movePreview} onPointerLeave={resetPreview} aria-live="polite">
          <div className="preview-topline"><span>{activeChapter.number} / 05</span><span>{content.open}</span></div>
          <AnimatePresence mode="wait">
            <motion.div className="preview-stage" key={active} initial={{ opacity: 0, y: 16, rotate: .4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .26, ease: [0.22, 1, 0.36, 1] }}>
              <ChapterPreview id={active} photoLabel={content.photo} replaceLabel={content.replace} />
            </motion.div>
          </AnimatePresence>
          <div className="preview-caption"><strong>{t(activeChapter.label)}</strong><span>{content.previews[active]}</span></div>
        </aside>
      </motion.div>

      <div className="cover-footer">
        <span className="cover-meter"><b>01</b><i><em /></i><b>05</b></span>
        <span>{content.scroll}<ArrowDownRight size={16} /></span>
      </div>
    </section>
  </div>
}
