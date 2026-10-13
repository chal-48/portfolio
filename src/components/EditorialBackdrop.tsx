import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import {
  BadgeCheck,
  BookOpen,
  Braces,
  Code2,
  Database,
  Download,
  FileText,
  FolderKanban,
  GitBranch,
  Github,
  GraduationCap,
  Layers3,
  Mail,
  MonitorPlay,
  PanelsTopLeft,
  Send,
  Sparkles,
  UserRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

type Scene = {
  id: 'home' | 'about' | 'skills' | 'projects' | 'resume' | 'contact'
  icons: [LucideIcon, LucideIcon, LucideIcon, LucideIcon]
}

const scenes: Record<Scene['id'], Scene> = {
  home: { id: 'home', icons: [Code2, PanelsTopLeft, Braces, Sparkles] },
  about: { id: 'about', icons: [UserRound, GraduationCap, BookOpen, Sparkles] },
  skills: { id: 'skills', icons: [Braces, Database, Layers3, Wrench] },
  projects: { id: 'projects', icons: [FolderKanban, GitBranch, MonitorPlay, Code2] },
  resume: { id: 'resume', icons: [FileText, Download, BadgeCheck, BookOpen] },
  contact: { id: 'contact', icons: [Mail, Send, Github, UserRound] },
}

function sceneFromPath(pathname: string): Scene {
  if (pathname.startsWith('/about')) return scenes.about
  if (pathname.startsWith('/skills')) return scenes.skills
  if (pathname.startsWith('/projects')) return scenes.projects
  if (pathname.startsWith('/resume')) return scenes.resume
  if (pathname.startsWith('/contact')) return scenes.contact
  return scenes.home
}

export function EditorialBackdrop() {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const scene = sceneFromPath(pathname)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 22, mass: .7 })
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 22, mass: .7 })
  const farX = useTransform(smoothX, value => value * 34)
  const farY = useTransform(smoothY, value => value * 28)
  const nearX = useTransform(smoothX, value => value * -52)
  const nearY = useTransform(smoothY, value => value * -38)
  const rotate = useTransform(smoothX, value => value * 5)

  useEffect(() => {
    if (reduceMotion) {
      pointerX.set(0)
      pointerY.set(0)
      return
    }
    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX / Math.max(window.innerWidth, 1) - .5)
      pointerY.set(event.clientY / Math.max(window.innerHeight, 1) - .5)
    }
    const reset = () => { pointerX.set(0); pointerY.set(0) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', reset)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerleave', reset) }
  }, [pointerX, pointerY, reduceMotion])

  const [Primary, Secondary, Tertiary, Detail] = scene.icons

  return <div className={`editorial-backdrop backdrop-${scene.id}`} aria-hidden="true">
    <div className="backdrop-grid" />
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div className="backdrop-scene" key={scene.id} initial={{ opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="backdrop-symbol symbol-primary" style={{ x: farX, y: farY, rotate }}><Primary /></motion.div>
        <motion.div className="backdrop-symbol symbol-secondary" style={{ x: nearX, y: nearY }}><Secondary /></motion.div>
        <motion.div className="backdrop-symbol symbol-tertiary" style={{ x: farX, y: nearY }}><Tertiary /></motion.div>
        <motion.div className="backdrop-symbol symbol-detail" style={{ x: nearX, y: farY }}><Detail /></motion.div>
        <div className="backdrop-route-mark"><span>01</span><i/><span>05</span></div>
        <div className="backdrop-dot-field">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>
      </motion.div>
    </AnimatePresence>
    <div className="backdrop-grain" />
  </div>
}
