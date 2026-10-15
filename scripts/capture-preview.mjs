import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173','--strictPort'], { stdio:'ignore', windowsHide:true })
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch('http://127.0.0.1:4173/')).ok) { ready = true; break } } catch { /* Wait for Vite. */ }
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  if (!ready) throw new Error('Preview server did not become ready.')
  await mkdir('artifacts', { recursive:true })
  browser = await chromium.launch({ executablePath:process.env.PORTFOLIO_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true })
  const page = await browser.newPage({ viewport:{ width:1440,height:1080 }, deviceScaleFactor:1, reducedMotion:'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const size of ['desktop', 'mobile']) {
    await page.setViewportSize(size === 'desktop' ? { width:1440,height:1080 } : { width:390,height:844 })
    for (const route of ['', 'about', 'skills', 'projects', 'projects/vanvan', 'resume', 'contact', 'credits']) {
      await page.goto(`http://127.0.0.1:4173/${route}`)
      await page.locator('#page-title').waitFor({ state:'visible' })
      await page.evaluate(() => document.fonts.ready)
      if (!route) await page.waitForFunction(() => document.querySelector('.github-activity')?.getAttribute('aria-busy') === 'false', undefined, { timeout:16000 })
      await page.evaluate(() => window.scrollTo({ top:0,behavior:'instant' }))
      await page.screenshot({ path:`artifacts/${route.replaceAll('/', '-') || 'home'}-${size}.png`, fullPage:true, animations:'disabled' })
    }
  }
  await page.setViewportSize({ width:1440,height:1080 })
  await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('button', { name:'Switch to light theme' }).click()
  await page.screenshot({ path:'artifacts/home-light-desktop.png', fullPage:true, animations:'disabled' })
  await page.getByRole('button', { name:'Switch to dark theme' }).click()
  await page.emulateMedia({ reducedMotion:'no-preference' })
  const calendar = page.locator('.github-activity')
  await calendar.scrollIntoViewIfNeeded()
  await page.waitForFunction(() => document.querySelector('.github-activity')?.getAttribute('data-animation-running') === 'true')
  const snake = page.locator('.snake-segment-0')
  const initial = await snake.evaluate(element => getComputedStyle(element).transform)
  await page.waitForFunction(initial => getComputedStyle(document.querySelector('.snake-segment-0')).transform !== initial, initial)
  await calendar.screenshot({ path:'artifacts/github-snake-desktop.png',animations:'allow' })
  console.log(JSON.stringify({ screenshots:'artifacts/', pageErrors:errors }))
} finally {
  await browser?.close()
  server.kill()
}
