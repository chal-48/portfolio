import { test, expect } from '@playwright/test'
import portfolio from '../src/content/portfolio.json' with { type: 'json' }

test('English-only identity replaces legacy language and reference content', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-language', 'th'))
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('.profile-body h2')).toHaveText('Chalisa Langchai')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName("I'm Chalisa, also known as Aom")
  await expect(page.locator('.profile-facts')).toContainText('3.24')
  await expect(page.getByRole('button', { name: /^(TH|EN)$/ })).toHaveCount(0)
  const text = await page.locator('main').innerText()
  expect(text).not.toMatch(/[\u0e00-\u0e7f\u3040-\u30ff]|itouSouta|Spotify|visitor count|PORTFOLIO INDEX/i)
  await expect(page.locator('[data-image-slot="profile-avatar"] img')).toHaveAttribute('src',portfolio.portrait)
  await expect(page.locator('[data-image-slot="profile-banner"] img')).toHaveAttribute('src','/project-placeholders/bg-home.jpg')
  await expect(page.locator('.bento>a')).toHaveCount(5)
  await expect(page.locator('.site-credits')).toContainText('itouSouta.me by itousouta15')
})

test('theme toggles, persists across reload, and applies to content pages', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByTestId('index-skills').click()
  await expect(page).toHaveURL('/skills')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('all five home cards open separate pages and return home', async ({ page }) => {
  for (const chapter of ['about', 'skills', 'projects', 'resume', 'contact']) {
    await page.goto('/')
    await page.getByTestId(`index-${chapter}`).click()
    await expect(page).toHaveURL(`/${chapter}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('link', { name: 'Back to home', exact: true }).first().click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('.home-bento')).toBeVisible()
  }
})

test('section navigation, refreshed deep links, and missing routes work', async ({ page }) => {
  await page.goto('/about')
  await page.locator('.chapter-next').click()
  await expect(page).toHaveURL('/skills')
  await page.locator('.chapter-next').click()
  await expect(page).toHaveURL('/projects')
  await page.locator('.case-study-card a').first().click()
  await expect(page).toHaveURL('/projects/vanvan')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(portfolio.projects[0].title.en)
  await page.getByRole('link', { name: 'Back to projects', exact: true }).click()
  await expect(page).toHaveURL('/projects')
  for (const route of ['/projects/missing', '/missing']) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  }
})

test('project cards appear immediately and only VanVan has a live demo', async ({ page }, testInfo) => {
  await page.goto('/projects')
  await expect(page.locator('.project-tile')).toHaveCount(3)
  await expect(page.locator('.project-tile').first()).toBeInViewport()
  if (testInfo.project.name === 'desktop') {
    for (const card of await page.locator('.project-tile').all()) await expect(card).toBeInViewport({ ratio: .9 })
  }
  for (const project of portfolio.projects) {
    await expect(page.locator(`.project-tile a[href="/projects/${project.id}"]`)).toBeVisible()
  }
  for (const project of portfolio.projects) {
    await page.goto(`/projects/${project.id}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title.en)
    await expect(page.locator('.project-story')).toContainText(project.description.en)
    await expect(page.locator('.project-story')).toContainText(project.outcome.en)
    await expect(page.getByRole('link', { name: 'View code' })).toHaveAttribute('href', project.sourceUrl)
    await expect(page.locator('.project-actions a')).toHaveCount(project.demoUrl ? 2 : 1)
    if (project.demoUrl) await expect(page.getByRole('link', { name: 'Live demo' })).toHaveAttribute('href', 'https://vanvan-booking.vercel.app/')
  }
})

test('project search and category filters use real project data', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('button', { name:'Mobile', exact:true }).click()
  await expect(page.locator('.project-tile')).toHaveCount(1)
  await expect(page.locator('.project-tile')).toContainText('Music App')
  await page.getByRole('button', { name:'All', exact:true }).click()
  await page.getByRole('searchbox', { name:'Search projects' }).fill('PostgreSQL')
  await expect(page.locator('.project-tile')).toHaveCount(1)
  await expect(page.locator('.project-tile')).toContainText('VanVan')
  await page.getByRole('searchbox', { name:'Search projects' }).fill('no matching project')
  await expect(page.getByRole('status')).toHaveText('No projects found.')
})

test('header search supports shortcuts, Escape, and project navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name:'Search (Ctrl+K)' }).click()
  await expect(page.getByRole('dialog', { name:'Search this site' })).toBeVisible()
  await expect(page.getByRole('textbox', { name:'Search pages and projects' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name:'Search this site' })).toHaveCount(0)
  await expect(page.getByRole('button', { name:'Search (Ctrl+K)' })).toBeFocused()
  await page.keyboard.press('Control+k')
  await page.getByRole('textbox', { name:'Search pages and projects' }).fill('VanVan')
  await page.getByRole('dialog').getByRole('link', { name:portfolio.projects[0].title.en }).click()
  await expect(page).toHaveURL('/projects/vanvan')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('resume downloads a real English PDF without an embedded preview', async ({ page, request }) => {
  await page.goto('/resume')
  const response = await request.get(portfolio.resume.en)
  expect(response.status()).toBe(200)
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  await expect(page.locator('iframe,embed,object')).toHaveCount(0)
  const downloading = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download Resume', exact: true }).click()
  expect((await downloading).suggestedFilename()).toBe('Chalisa-Langchai-Resume.pdf')
})

test('contact validates fields, copies the real email, and submits directly', async ({ page, context }) => {
  const submissions: Record<string,string>[] = []
  await page.route('https://formsubmit.co/ajax/**',async route => {
    submissions.push(route.request().postDataJSON())
    await route.fulfill({ json:{ success:'true',message:'Form submitted successfully.' } })
  })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/contact')
  await expect(page.getByRole('link', { name: 'chalisa4824@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:chalisa4824@gmail.com')
  await expect(page.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href','https://www.linkedin.com/in/chalisa-langchai-625198429')
  await page.getByRole('button', { name: 'Copy email', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('chalisa4824@gmail.com')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(page.getByText('Please enter your name.', { exact: true })).toBeVisible()
  await expect(page.locator('#sender-name')).toBeFocused()
  await page.locator('#sender-name').fill('Test Visitor')
  await page.locator('#sender-email').fill('invalid')
  await page.locator('#contact-subject').fill('A project idea & question')
  await page.locator('#contact-message').fill('Hello, I would like to discuss a project with you.')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(page.locator('#sender-email')).toBeFocused()
  await page.locator('#sender-email').fill('visitor@example.com')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(page.locator('.form-status')).toContainText('Your message has been submitted.')
  expect(submissions).toHaveLength(1)
  expect(submissions[0]).toMatchObject({ name:'Test Visitor',email:'visitor@example.com',_replyto:'visitor@example.com',subject:'A project idea & question',message:'Hello, I would like to discuss a project with you.' })
  await expect(page.getByRole('button', { name:'Message submitted',exact:true })).toBeDisabled()
  await expect(page).toHaveURL('/contact')
})

test('mobile menu supports Escape, focus return, and link navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Desktop navigation is always visible.')
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open menu', exact: true })
  await menu.click()
  await expect(page.locator('#site-menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#site-menu')).toBeHidden()
  await expect(menu).toBeFocused()
  await menu.click()
  await page.locator('#site-menu').getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page).toHaveURL('/projects')
  await expect(page.locator('#site-menu')).toBeHidden()
})

test('all routes fit narrow screens and both themes without runtime errors or foreign text', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 320, height: 800 })
  for (const theme of ['dark', 'light']) {
    await page.goto('/')
    await page.evaluate(theme => localStorage.setItem('chalisa-theme', theme), theme)
    for (const route of ['/', '/about', '/skills', '/projects', '/projects/vanvan', '/projects/music-app', '/projects/rpi-autonomous-boat', '/resume', '/contact', '/credits']) {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${route} (${theme}) overflow`).toBeLessThanOrEqual(1)
      expect(await page.locator('body').innerText()).not.toMatch(/[\u0e00-\u0e7f\u3040-\u30ff]/)
    }
  }
  expect(errors).toEqual([])
})

test('footer credits preserve attribution and link to the complete original license', async ({ page, request }) => {
  await page.goto('/')
  await page.locator('.site-credits').getByRole('link', { name:'Credits',exact:true }).click()
  await expect(page).toHaveURL('/credits')
  await expect(page).toHaveTitle('Credits · Chalisa Langchai')
  await expect(page.getByRole('heading',{name:'Credits',exact:true})).toBeVisible()
  await expect(page.locator('.credits-panel').getByRole('link',{name:'itouSouta.me',exact:true})).toHaveAttribute('href','https://github.com/itousouta15/itouSouta.me')
  await expect(page.locator('.credits-panel').getByRole('link',{name:'itousouta15',exact:true})).toHaveAttribute('href','https://github.com/itousouta15')
  await expect(page.locator('.credits-panel')).toContainText('Thanks to the original developer for sharing this project.')
  const license=await request.get('/licenses/itouSouta-Apache-2.0.txt')
  expect(license.ok()).toBeTruthy()
  expect(await license.text()).toContain('TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION')
  const notices=await request.get('/third-party-notices.txt')
  expect(notices.ok()).toBeTruthy()
  expect(await notices.text()).toContain('itousouta15')
})
