import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fonts = path.join(root, 'public', 'fonts')
const output = path.join(root, 'public', 'resume')
await mkdir(fonts, { recursive: true })
await mkdir(output, { recursive: true })
const fontPath = path.join(fonts, 'NotoSansThai.ttf')
try { await access(fontPath) } catch {
  if (!process.argv.includes('--fetch-fonts')) throw new Error('Font missing. Run pnpm resume -- --fetch-fonts once to download the licensed font.')
  for (const [filename, url] of [
    ['NotoSansThai.ttf', 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansthai/NotoSansThai%5Bwdth,wght%5D.ttf'],
    ['OFL-NotoSansThai.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansthai/OFL.txt'],
  ]) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Font download failed: ${response.status} ${url}`)
    await writeFile(path.join(fonts, filename), Buffer.from(await response.arrayBuffer()))
  }
}

const data = JSON.parse(await readFile(path.join(root, 'src/content/portfolio.json'), 'utf8'))
const fontBytes = await readFile(fontPath)
const labels = {
  th: { about: 'เกี่ยวกับฉัน', education: 'การศึกษา', skills: 'ทักษะ', projects: 'โปรเจกต์', contact: 'ติดต่อ', sample: 'เอกสารตัวอย่าง — ข้อมูลส่วนตัวและผลงานยังเป็นตัวอย่าง', pending: 'รอเพิ่มข้อมูล', role: 'บทบาท', goals: 'เป้าหมาย' },
  en: { about: 'ABOUT ME', education: 'EDUCATION', skills: 'TECHNICAL SKILLS', projects: 'PROJECTS', contact: 'CONTACT', sample: 'SAMPLE DOCUMENT — personal details and projects are illustrative.', pending: 'To be added', role: 'Role', goals: 'GOALS' },
}
const ink = rgb(.16,.17,.14)
const muted = rgb(.43,.46,.39)
const accent = rgb(.85,.42,.19)

for (const language of ['th', 'en']) {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const font = await doc.embedFont(fontBytes, { subset: true })
  doc.setTitle(`${data.name[language]} — Resume (${language.toUpperCase()})`)
  doc.setSubject(data.isDemo ? labels[language].sample : data.role[language])
  doc.setAuthor(data.isDemo ? 'Sample Portfolio' : data.name[language])
  doc.setLanguage(language)
  let page = doc.addPage([595.28,841.89])
  let y = 789
  const width = 493
  const line = (text, size=10, color=ink) => {
    if (y < 57) { page = doc.addPage([595.28,841.89]); y=790 }
    page.drawText(text, { x: 51, y, size, font, color })
    y-=size*1.7
  }
  const wrap = (text, size=10, color=muted) => {
    const units = [...new Intl.Segmenter(language, { granularity: 'word' }).segment(text)].map(part=>part.segment)
    let current = ''
    for (const unit of units) {
      if (font.widthOfTextAtSize(current+unit,size)>width && current) { line(current.trimEnd(),size,color); current='' }
      current+=unit
    }
    if (current) line(current.trimEnd(),size,color)
  }
  const heading = text => { y-=14; line(text,12,accent); y-=3 }
  line(data.name[language],27)
  line(data.role[language],11,muted)
  y-=5; page.drawLine({start:{x:51,y},end:{x:544,y},thickness:1.6,color:accent}); y-=21
  if (data.isDemo) { wrap(labels[language].sample,8,accent); y-=5 }
  heading(labels[language].about); wrap(data.bio[language])
  heading(labels[language].education)
  line(data.education.university[language],11)
  wrap(`${data.education.degree[language]} · ${data.education.period[language]}`)
  if (data.education.gpa) line(`GPA: ${data.education.gpa}`,10,muted)
  heading(labels[language].skills)
  for (const group of data.skills) wrap(`${group.label[language]}: ${group.items.join(' · ')}`,9)
  heading(labels[language].projects)
  for (const project of data.projects) {
    line(project.title[language],11)
    wrap(project.summary[language],9)
    wrap(`${labels[language].role}: ${project.role[language]}`,9)
    wrap(project.tech.join(' · '),8)
    y-=7
  }
  heading(labels[language].contact)
  wrap([data.email,data.github,data.linkedin].filter(Boolean).join(' · ') || labels[language].pending,9)
  const pages = doc.getPages()
  pages.forEach((current,index)=>current.drawText(`${index+1} / ${pages.length}`,{x:515,y:28,size:8,font,color:muted}))
  const bytes = await doc.save()
  await writeFile(path.join(output,`resume-${language}.pdf`),bytes)
  console.log(`Created resume-${language}.pdf (${pages.length} page${pages.length===1?'':'s'}, ${bytes.length} bytes)`)
}
