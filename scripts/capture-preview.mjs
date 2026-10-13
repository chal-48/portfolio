import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173','--strictPort'], { stdio:'ignore',windowsHide:true })
let browser
try {
let ready = false
for (let attempt=0; attempt<60; attempt++) {
  try { if ((await fetch('http://127.0.0.1:4173/')).ok) { ready=true; break } } catch { /* Wait for the local server. */ }
  await new Promise(resolve=>setTimeout(resolve,250))
}
if (!ready) throw new Error('Preview server did not become ready.')

await mkdir('artifacts', { recursive: true })
browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(error.message))
for (const language of ['th','en']) {
  await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('button', { name: language.toUpperCase(), exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.bento-grid').waitFor({ state: 'visible' })
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}))
  await page.screenshot({ path: `artifacts/home-${language}-desktop.png`, fullPage: true, animations: 'disabled' })
}
await page.goto('http://127.0.0.1:4173/#explore')
await page.locator('.orbit-stage').hover({ position: { x: 400, y: 20 } })
await page.screenshot({ path: 'artifacts/cards-desktop.png', fullPage: true, animations: 'disabled' })
await page.setViewportSize({ width: 390, height: 844 })
await page.getByRole('button', { name:'TH',exact:true }).click()
await page.goto('http://127.0.0.1:4173/')
await page.evaluate(() => document.fonts.ready)
await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}))
await page.screenshot({ path:'artifacts/home-th-mobile.png',fullPage:true,animations:'disabled' })
for (const route of ['about','skills','projects','resume','contact']) {
  await page.goto(`http://127.0.0.1:4173/${route}`)
  await page.locator('#page-title').waitFor({ state:'visible' })
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}))
  await page.screenshot({ path:`artifacts/${route}-mobile.png`,fullPage:true,animations:'disabled' })
}
console.log(JSON.stringify({ screenshots:'artifacts/', pageErrors:errors }))
} finally {
  await browser?.close()
  server.kill()
}
