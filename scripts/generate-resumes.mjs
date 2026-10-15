import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(await readFile(path.join(root, 'src/content/portfolio.json'), 'utf8'))
const resume = JSON.parse(await readFile(path.join(root, 'src/content/resume.json'), 'utf8'))
const output = path.join(root, 'public/resume')
const previews = path.join(root, 'artifacts')
await mkdir(output, { recursive: true })
await mkdir(previews, { recursive: true })
const thaiFont = (await readFile(path.join(root, 'public/fonts/NotoSansThai.ttf'))).toString('base64')
const requestedLanguage = process.argv.find(arg => arg.startsWith('--language='))?.split('=')[1]
if (requestedLanguage && !['th', 'en'].includes(requestedLanguage)) throw new Error('Language must be th or en')
const languages = requestedLanguage ? [requestedLanguage] : ['th', 'en']
let embeddedFontFaces = ''
{
  const serif = languages.includes('th') ? (await readFile(path.join(root, 'public/fonts/NotoSerifThai.ttf'))).toString('base64') : null
  const cambriaRegular = (await readFile(process.env.RESUME_CAMBRIA_REGULAR || 'C:/Windows/Fonts/cambria.ttc')).toString('base64')
  const cambriaBold = (await readFile(process.env.RESUME_CAMBRIA_BOLD || 'C:/Windows/Fonts/cambriab.ttf')).toString('base64')
  embeddedFontFaces = `
    @font-face { font-family: ResumeCambria; src: url(data:font/collection;base64,${cambriaRegular}) format('truetype'); font-weight: 400; }
    @font-face { font-family: ResumeCambria; src: url(data:font/ttf;base64,${cambriaBold}) format('truetype'); font-weight: 700; }
    ${serif ? `@font-face { font-family: ResumeThaiSerif; src: url(data:font/ttf;base64,${serif}) format('truetype'); font-weight: 100 900; }` : ''}
  `
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const safeLink = value => {
  try { return new URL(value).protocol === 'https:' ? value : null } catch { return null }
}
const labels = {
  th: { summary: 'ประวัติโดยสรุป', education: 'การศึกษา', skills: 'ทักษะทางเทคนิค', projects: 'โครงการ', courses: 'รายวิชาที่เกี่ยวข้อง', code: 'โค้ด', demo: 'เว็บสาธิต' },
  en: { summary: 'SUMMARY', education: 'EDUCATION', skills: 'TECHNICAL SKILLS', projects: 'ACADEMIC PROJECTS', courses: 'Relevant Coursework', code: 'Source', demo: 'Live Demo' },
}
const browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
  for (const language of languages) {
    const l = labels[language]
    const local = value => escape(value[language])
    const section = (title, content) => `<section><h2>${escape(title)}</h2>${content}</section>`
    const projects = data.projects.map(project => {
      const highlight = resume.projectHighlights[project.id]
      if (!highlight) throw new Error(`Missing resume highlights: ${project.id}`)
      const links = [
        safeLink(project.sourceUrl) && `<a href="${escape(project.sourceUrl)}">${l.code}</a>`,
        safeLink(project.demoUrl) && `<a href="${escape(project.demoUrl)}">${l.demo}</a>`,
      ].filter(Boolean).join(' · ')
      return `<article><div class="project-title"><h3>${local(highlight.title)}</h3><span class="project-links">${links}</span></div><p class="technologies">${escape(highlight.tech.join(' · '))} <span class="year">| ${escape(project.year)}</span></p><ul>${highlight.bullets.map(bullet => `<li>${local(bullet)}</li>`).join('')}</ul></article>`
    }).join('')
    const github = safeLink(data.github)
    const html = `<!doctype html><html lang="${language}"><head><meta charset="UTF-8"><title>${escape(resume.name.en)} — Resume (${language.toUpperCase()})</title><style>
      @font-face { font-family: ResumeThai; src: url(data:font/ttf;base64,${thaiFont}) format('truetype'); font-weight: 100 900; }
      @page { size: A4; margin: 13mm 15mm; }
      * { box-sizing: border-box; }
      html { font-family: ${language === 'th' ? 'ResumeThai, Arial' : 'Arial, sans-serif'}; color: #202020; background: white; font-size: 11pt; line-height: ${language === 'th' ? '1.55' : '1.4'}; }
      body { margin: 0; }
      main { width: 180mm; }
      header { text-align: center; padding-bottom: 10px; }
      h1 { font-size: 23pt; line-height: 1.2; font-weight: 750; margin: 0 0 9px; letter-spacing: .035em; }
      .contact { font-size: 9.2pt; color: #393939; margin: 0; }
      a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
      section { border-top: .8pt solid #444; padding-top: 7px; margin-top: 9px; }
      h2 { font-size: 11.2pt; font-weight: 750; margin: 0 0 6px; line-height: 1.3; letter-spacing: ${language === 'th' ? '0' : '.05em'}; }
      h3, p { margin: 0; }
      h3 { font-size: 10.5pt; font-weight: 700; line-height: 1.4; }
      .education-heading { display: flex; gap: 14px; align-items: baseline; justify-content: space-between; }
      .education-heading h3 { max-width: 74%; }
      .period { white-space: nowrap; font-size: 9pt; }
      .university { margin-top: 3px; }
      .courses { margin-top: 5px; font-size: 9.8pt; }
      .skill-row { font-size: 10pt; margin-bottom: 2px; }
      article { margin-top: 9px; break-inside: avoid; }
      article:first-of-type { margin-top: 0; }
      .project-title { display: flex; align-items: baseline; gap: 10px; justify-content: space-between; }
      .project-title h3 { flex: 1; }
      .project-links { white-space: nowrap; font-size: 8.2pt; }
      .technologies { font-size: 9.5pt; color: #4a4a4a; margin-top: 2px; }
      .year { color: #555; }
      ul { padding-left: 15px; margin: 4px 0 0; }
      li { padding-left: 1px; margin: 1px 0; }
      ${embeddedFontFaces}
      ${language === 'th' ? `
        html { font-family: ResumeCambria, ResumeThaiSerif, serif; font-size: 11.5pt; font-weight: 400; line-height: 1.43; color: #171717; }
        main { min-height: 267mm; display: flex; flex-direction: column; justify-content: space-between; }
        header { padding-bottom: 0; }
        h1 { font-size: 22pt; font-weight: 700; letter-spacing: 0; margin-bottom: 8px; }
        h2 { font-size: 15pt; font-weight: 700; line-height: 1.3; margin-bottom: 6px; }
        h3 { font-size: 14pt; font-weight: 700; line-height: 1.3; }
        strong { font-weight: 700; }
        .contact, .period { font-size: 10.5pt; }
        .courses, .skill-row { font-size: 10.5pt; font-weight: 400; }
        .technologies, .project-links { font-size: 10pt; font-weight: 400; }
        .courses { line-height: 1.45; }
        section { padding-top: 7px; margin-top: 8px; }
        article { margin-top: 11px; }
        .education-heading { display: block; }
        .education-heading h3 { max-width: none; font-size: 12pt; }
        .period { display: block; margin-top: 3px; }
        ul { margin-top: 4px; }
        li { font-weight: 400; text-align: justify; text-justify: inter-word; }
        section > p:not(.skill-row) { text-align: justify; text-justify: inter-word; }
      ` : `
        /* English resume: font family, point sizes, and weights. */
        html { font-family: ResumeCambria, Cambria, serif; font-size: 11.5pt; font-weight: 400; line-height: 1.42; color: #171717; }
        main { min-height: 267mm; display: flex; flex-direction: column; justify-content: space-between; }
        header { padding-bottom: 0; }
        h1 { font-size: 22pt; font-weight: 700; letter-spacing: .02em; margin-bottom: 8px; }
        h2 { font-size: 15pt; font-weight: 700; line-height: 1.3; margin-bottom: 6px; letter-spacing: .03em; }
        h3 { font-size: 14pt; font-weight: 700; line-height: 1.3; }
        strong { font-weight: 700; }
        .education-heading h3 { font-size: 12pt; }
        .contact, .period, .courses, .skill-row { font-size: 10.5pt; }
        .technologies, .project-links { font-size: 10pt; font-weight: 400; }
        section { padding-top: 7px; margin-top: 8px; }
        article { margin-top: 10px; }
        li { font-weight: 400; text-align: justify; }
        section > p:not(.skill-row) { text-align: justify; }
      `}
    </style></head><body><main>
      <header><h1>${local(resume.name)}</h1><p class="contact">${local(resume.location)} &nbsp;|&nbsp; <a href="mailto:${escape(data.email)}">${escape(data.email)}</a>${github ? ` &nbsp;|&nbsp; <a href="${escape(github)}">${escape(github.replace(/^https:\/\//, ''))}</a>` : ''}</p></header>
      ${section(l.summary, `<p>${local(resume.summary)}</p>`)}
      ${section(l.education, `<div class="education-heading"><h3>${local(resume.degree)}</h3><span class="period">${local(data.education.period)}</span></div><p class="university">${local(data.education.university)}</p><p>GPA: ${escape(data.education.gpa)}/4.00</p><p class="courses"><strong>${l.courses}:</strong> ${local(resume.coursework)}</p>`)}
      ${section(l.skills, resume.skills.map(group => `<p class="skill-row"><strong>${local(group.label)}:</strong> ${escape(group.items.join(', '))}</p>`).join(''))}
      ${section(l.projects, projects)}
    </main></body></html>`
    const htmlPath = path.join(previews, `resume-${language}.html`)
    await writeFile(htmlPath, html, 'utf8')
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 })
    await page.goto(pathToFileURL(htmlPath).href)
    await page.evaluate(() => document.fonts.ready)
    await page.emulateMedia({ media: 'print' })
    const height = await page.locator('main').evaluate(element => element.getBoundingClientRect().height)
    const available = (297 - 26) * 96 / 25.4
    if (height > available) throw new Error(`Resume ${language} exceeds one A4 page: ${height.toFixed(1)} > ${available.toFixed(1)} px`)
    const pdfPath = path.join(output, `resume-${language}.pdf`)
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true })
    const pdf = await PDFDocument.load(bytes)
    if (pdf.getPageCount() !== 1) throw new Error(`Resume ${language} must fit one page`)
    pdf.setTitle(`${resume.name.en} — Resume (${language.toUpperCase()})`)
    pdf.setAuthor(resume.name.en)
    pdf.setSubject('Full Stack Software Development Portfolio')
    pdf.setLanguage(language)
    await writeFile(pdfPath, await pdf.save())
    await page.close()
    console.log(`Created ${path.relative(root, pdfPath)} (content: ${height.toFixed(0)} / ${available.toFixed(0)} px)`)
  }
} finally {
  await browser.close()
}
