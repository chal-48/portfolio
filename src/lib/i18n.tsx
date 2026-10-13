import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'th' | 'en'
export type Localized = { th: string; en: string }

const messages = {
  th: {
    home: 'หน้าหลัก', about: 'เกี่ยวกับฉัน', skills: 'ทักษะ', projects: 'ผลงาน', resume: 'เรซูเม่', contact: 'ติดต่อ',
    demo: 'ข้อมูลตัวอย่าง', demoNote: 'เนื้อหาส่วนตัวและโปรเจกต์ในหน้านี้เป็นตัวอย่าง รออัปเดตเป็นข้อมูลจริง',
    menu: 'เปิดเมนู', closeMenu: 'ปิดเมนู', skip: 'ข้ามไปยังเนื้อหา', back: 'กลับหน้าหลัก',
    greeting: 'สวัสดี ฉันคือ', studentPrefix: 'กำลังเรียนรู้และสร้างสรรค์ในสาย', engineering: 'วิศวกรรมคอมพิวเตอร์',
    heroNote: 'ยินดีต้อนรับสู่พื้นที่เล็ก ๆ ของฉัน มาทำความรู้จักกันผ่านสิ่งที่เรียนรู้และลงมือทำ',
    viewWork: 'ดูผลงาน', getInTouch: 'มาคุยกัน', currently: 'กำลังศึกษา', education: 'การศึกษา',
    featured: 'โปรเจกต์ตัวอย่าง', discover: 'สำรวจโปรเจกต์', focus: 'สิ่งที่สนใจ', learning: 'เรียนรู้ไปทีละนิด',
    learningNote: 'ลองผิด ลองถูก แล้วสร้างให้ดีขึ้น', process: 'วิธีที่ฉันอยากทำงาน',
    step1: 'ทำความเข้าใจ', step2: 'ออกแบบ', step3: 'ลงมือสร้าง', step4: 'ปรับปรุง',
    step1Title: 'เริ่มจากคำถามที่ดี', step1Body: 'ทำความเข้าใจปัญหาและคนที่ใช้งาน ก่อนเลือกว่าจะสร้างอะไร',
    step2Title: 'ทำไอเดียให้เห็นภาพ', step2Body: 'วางโครงสร้าง ร่างหน้าตา และแบ่งปัญหาใหญ่ให้เป็นส่วนที่จัดการได้',
    step3Title: 'เปลี่ยนไอเดียให้ใช้งานได้', step3Body: 'ลงมือทำทีละส่วน ทดสอบ และเรียนรู้จากสิ่งที่เกิดขึ้นจริง',
    step4Title: 'รายละเอียดเล็ก ๆ มีความหมาย', step4Body: 'รับฟังความคิดเห็น ทบทวนสิ่งที่ทำ และค่อย ๆ ปรับให้ดีขึ้น',
    exploreEyebrow: 'อีกนิดเกี่ยวกับฉัน', exploreTitle: 'อยากรู้จักฉันด้านไหน?', exploreNote: 'เลือกการ์ด แล้วเปิดดูเรื่องราวด้านที่คุณสนใจ', cardHint: 'วางเมาส์เพื่อกางการ์ด · กดเพื่อเปิด', mobileCardHint: 'แตะหัวข้อที่อยากสำรวจ',
    open: 'เปิดดู', footer: 'สร้างด้วยความตั้งใจ และความอยากรู้อยากเห็น', footerNote: 'พอร์ตโฟลิโอนักศึกษาวิศวกรรมคอมพิวเตอร์',
    previous: 'หัวข้อก่อนหน้า', next: 'หัวข้อถัดไป', allSections: 'สำรวจหัวข้ออื่น',
    aboutEyebrow: 'คนที่อยู่เบื้องหลังโปรเจกต์', aboutTitle: 'ยินดีที่ได้รู้จัก', aboutIntro: 'เรื่องราว ความสนใจ และเส้นทางที่กำลังเดิน',
    story: 'เรื่องราวของฉัน', goals: 'สิ่งที่อยากทำต่อ', interests: 'ความสนใจ', courses: 'วิชาที่เกี่ยวข้อง', year: 'ชั้นปี', gpa: 'GPA', pending: 'รอเพิ่มข้อมูล',
    skillsEyebrow: 'เครื่องมือในกระเป๋า', skillsTitle: 'เรียนรู้ แล้วลงมือใช้', skillsIntro: 'ภาษา เทคโนโลยี และเครื่องมือที่ใช้เปลี่ยนไอเดียให้เป็นผลงาน',
    skillsNote: 'รายการทักษะนี้เป็นตัวอย่าง และจะปรับตามเทคโนโลยีที่คุณใช้งานจริง', skillProjects: 'ดูตัวอย่างการนำไปใช้',
    projectsEyebrow: 'สิ่งที่เกิดจากการลงมือทำ', projectsTitle: 'ไอเดียที่กลายเป็นโปรเจกต์', projectsIntro: 'สำรวจสิ่งที่สร้าง วิธีคิด และบทเรียนระหว่างทาง',
    all: 'ทั้งหมด', web: 'เว็บ', iot: 'IoT และฮาร์ดแวร์', systems: 'ระบบดิจิทัล', search: 'ค้นหาโปรเจกต์หรือเทคโนโลยี', searchLabel: 'ค้นหาโปรเจกต์',
    noResults: 'ยังไม่พบโปรเจกต์ที่ตรงกัน', noResultsNote: 'ลองเปลี่ยนคำค้นหรือเลือกหมวดหมู่อื่น', clearFilters: 'ล้างตัวกรอง', results: 'โปรเจกต์',
    readProject: 'อ่านรายละเอียด', projectOverview: 'เกี่ยวกับโปรเจกต์', role: 'บทบาทของฉัน', responsibilities: 'สิ่งที่รับผิดชอบ', outcome: 'ผลลัพธ์และสิ่งที่เรียนรู้', tech: 'เทคโนโลยีที่ใช้', source: 'ดูโค้ด', liveDemo: 'เปิดเดโม', backProjects: 'กลับไปดูโปรเจกต์',
    resumeEyebrow: 'ข้อมูลโดยสรุป', resumeTitle: 'Resume ของฉัน', resumeIntro: 'ดาวน์โหลด Resume ในภาษาที่คุณกำลังเลือกใช้งาน',
    downloadResume: 'ดาวน์โหลด Resume',
    contactEyebrow: 'ทุกบทสนทนาเริ่มได้ที่นี่', contactTitle: 'มีไอเดียอะไร มาคุยกัน', contactIntro: 'เกี่ยวกับโปรเจกต์ โอกาสเรียนรู้ หรือแค่อยากทักทาย',
    emailLabel: 'อีเมล', copyEmail: 'คัดลอกอีเมล', copied: 'คัดลอกแล้ว', copyFailed: 'คัดลอกไม่ได้ ลองเลือกและคัดลอกอีเมลโดยตรง', unsetContact: 'ยังไม่ได้เพิ่มช่องทางนี้',
    draftTitle: 'เขียนข้อความถึงฉัน', draftNote: 'กรอกข้อความ แล้วเปิดแอปอีเมลของคุณเพื่อส่ง', senderName: 'ชื่อของคุณ', senderEmail: 'อีเมลของคุณ', subject: 'หัวข้อ', message: 'ข้อความ',
    namePlaceholder: 'ให้ฉันเรียกคุณว่าอะไร?', emailPlaceholder: 'you@example.com', subjectPlaceholder: 'อยากคุยเรื่อง…', messagePlaceholder: 'เล่าไอเดียหรือสิ่งที่อยากคุยได้เลย',
    compose: 'เปิดแอปอีเมล', contactPending: 'รอเพิ่มอีเมลของเจ้าของพอร์ต จึงจะเปิดข้อความพร้อมผู้รับได้', draftOpened: 'เปิดร่างในแอปอีเมลแล้ว หากไม่เปิด ให้ตรวจสอบแอปอีเมลเริ่มต้นของอุปกรณ์',
    invalidEmail: 'กรุณากรอกอีเมลให้ถูกต้อง', invalidName: 'กรุณากรอกชื่อ', invalidSubject: 'กรุณากรอกหัวข้อ', invalidMessage: 'กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร',
    notFound: 'หน้านี้ยังไม่มีในพอร์ต', notFoundNote: 'กลับไปเลือกหัวข้อที่อยากรู้จักจากหน้าหลักได้เลย',
    scrollTop: 'กลับด้านบน', close: 'ปิด', readMore: 'อ่านต่อ', availability: 'เปิดรับการเรียนรู้ใหม่ ๆ', language: 'เลือกภาษา',
  },
  en: {
    home: 'Home', about: 'About Me', skills: 'Technical Skills', projects: 'Projects', resume: 'Resume', contact: 'Contact',
    demo: 'Sample content', demoNote: 'Personal details and projects on this page are illustrative, awaiting your real information.',
    menu: 'Open menu', closeMenu: 'Close menu', skip: 'Skip to content', back: 'Back to home',
    greeting: "Hi, I'm", studentPrefix: 'Learning, exploring, and building in', engineering: 'Computer Engineering.',
    heroNote: 'Welcome to my little corner of the internet. Get to know me through the things I learn and build.',
    viewWork: 'Explore my work', getInTouch: "Let's talk", currently: 'Currently studying', education: 'My education',
    featured: 'Sample project', discover: 'Explore project', focus: "What I'm into", learning: 'Always learning',
    learningNote: 'Try. Learn. Make it better.', process: 'How I approach a project',
    step1: 'Understand', step2: 'Design', step3: 'Build', step4: 'Refine',
    step1Title: 'Start with a good question.', step1Body: 'Understand the problem and the people using the solution before deciding what to build.',
    step2Title: 'Give an idea its shape.', step2Body: 'Sketch the structure, explore the interface, and break a big problem into manageable pieces.',
    step3Title: 'Make something that works.', step3Body: 'Build one piece at a time, test it, and learn from what happens in practice.',
    step4Title: 'The little details matter.', step4Body: 'Listen to feedback, revisit the decisions, and keep making the experience a little better.',
    exploreEyebrow: 'A little more about me', exploreTitle: 'Which side of me interests you?', exploreNote: 'Pick a card. There is a little story behind each one.', cardHint: 'Hover to spread · Click to explore', mobileCardHint: 'Tap a topic to explore',
    open: 'Explore', footer: 'Made with care. Powered by curiosity.', footerNote: 'A computer engineering student portfolio',
    previous: 'Previous chapter', next: 'Next chapter', allSections: 'Explore another chapter',
    aboutEyebrow: 'The person behind the projects', aboutTitle: 'Nice to meet you.', aboutIntro: 'A little about my story, my interests, and where I am heading.',
    story: 'My story', goals: "What's next", interests: 'Things that interest me', courses: 'Relevant coursework', year: 'Year', gpa: 'GPA', pending: 'To be added',
    skillsEyebrow: 'My everyday toolkit', skillsTitle: 'Learn it. Then build with it.', skillsIntro: 'Languages, technologies, and tools for turning an idea into something tangible.',
    skillsNote: 'These skills are examples and will be updated to reflect the technologies you actually use.', skillProjects: 'See them in action',
    projectsEyebrow: 'Learning through making', projectsTitle: 'Ideas, brought to life.', projectsIntro: 'Explore the builds, the thinking, and the lessons along the way.',
    all: 'All projects', web: 'Web', iot: 'IoT & hardware', systems: 'Digital systems', search: 'Find a project or technology', searchLabel: 'Search projects',
    noResults: 'No projects found.', noResultsNote: 'Try another search or a different category.', clearFilters: 'Clear filters', results: 'projects',
    readProject: 'View project', projectOverview: 'The project', role: 'My role', responsibilities: 'What I worked on', outcome: 'Outcome & takeaways', tech: 'Built with', source: 'View code', liveDemo: 'Live demo', backProjects: 'Back to projects',
    resumeEyebrow: 'At a glance', resumeTitle: 'My Resume', resumeIntro: 'Download my resume in the language currently selected.',
    downloadResume: 'Download Resume',
    contactEyebrow: 'Every conversation starts somewhere', contactTitle: "Have an idea? Let's talk.", contactIntro: 'About a project, a learning opportunity, or just to say hello.',
    emailLabel: 'Email', copyEmail: 'Copy email', copied: 'Copied', copyFailed: 'Could not copy. Please select and copy the email directly.', unsetContact: 'This contact has not been added yet',
    draftTitle: 'Drop me a note', draftNote: 'Write your message, then open your email app to send it.', senderName: 'Your name', senderEmail: 'Your email', subject: 'Subject', message: 'Message',
    namePlaceholder: 'What should I call you?', emailPlaceholder: 'you@example.com', subjectPlaceholder: 'I would love to talk about…', messagePlaceholder: 'Tell me a little about your idea or what is on your mind.',
    compose: 'Open email app', contactPending: "The portfolio owner's email is needed before a draft can be addressed.", draftOpened: 'Your draft has been opened in your email app. If it did not open, check your device’s default email application.',
    invalidEmail: 'Please enter a valid email address.', invalidName: 'Please enter your name.', invalidSubject: 'Please enter a subject.', invalidMessage: 'Please enter a message of at least 10 characters.',
    notFound: 'This page is not in the portfolio.', notFoundNote: 'Head home and pick something you would like to explore.',
    scrollTop: 'Back to top', close: 'Close', readMore: 'Read more', availability: 'Open to new learning opportunities', language: 'Choose language',
  },
} as const

type MessageKey = keyof typeof messages.en
type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: MessageKey) => string
  localize: (value: Localized) => string
}
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'th' } catch { return 'th' }
  })
  useEffect(() => {
    document.documentElement.lang = language
    try { localStorage.setItem('portfolio-language', language) } catch { /* Still usable without storage. */ }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage, t: (key) => messages[language][key], localize: (value) => value[language] }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage requires LanguageProvider')
  return value
}
