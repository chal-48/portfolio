import { test, expect } from '@playwright/test'

test('language changes in place and persists across pages and reloads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your Name')
  await page.getByTestId('index-projects').click()
  await expect(page).toHaveURL('/projects')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ideas, brought to life.')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'TH', exact: true }).click()
  await expect(page).toHaveURL('/projects')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ไอเดียที่กลายเป็นโปรเจกต์')
})

test('all five editorial index entries open separate pages and return home', async ({ page }) => {
  for (const chapter of ['about', 'skills', 'projects', 'resume', 'contact']) {
    await page.goto('/')
    await page.getByTestId(`index-${chapter}`).click()
    await expect(page).toHaveURL(`/${chapter}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('link', { name: 'กลับหน้าหลัก', exact: true }).first().click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('.editorial-index')).toBeVisible()
  }
})

test('chapter navigation supports sequential reading and direct route refresh', async ({ page }) => {
  await page.goto('/about')
  await page.locator('.chapter-next').click()
  await expect(page).toHaveURL('/skills')
  await page.locator('.chapter-next').click()
  await expect(page).toHaveURL('/projects')
  await page.locator('.case-study-card a').first().click()
  await expect(page).toHaveURL('/projects/campus-companion')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Campus Companion')
  await page.getByRole('link', { name: 'กลับไปดูโปรเจกต์', exact: true }).click()
  await expect(page).toHaveURL('/projects')
  await page.goto('/projects/missing-project')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('หน้านี้ยังไม่มีในพอร์ต')
  await page.goto('/missing')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('หน้านี้ยังไม่มีในพอร์ต')
})

test('project case-study stack exposes every project and links to details', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.locator('.case-study-card')).toHaveCount(3)
  await expect(page.locator('.case-study-card').nth(0)).toContainText('Campus Companion')
  await expect(page.locator('.case-study-card').nth(1)).toContainText('RoomSense')
  await expect(page.locator('.case-study-card').nth(2)).toContainText('Tiny CPU')
  await expect(page.locator('.case-study-card a').nth(0)).toHaveAttribute('href', '/projects/campus-companion')
  await expect(page.locator('.case-study-card a').nth(1)).toHaveAttribute('href', '/projects/roomsense')
  await expect(page.locator('.case-study-card a').nth(2)).toHaveAttribute('href', '/projects/tiny-cpu')
  await page.locator('.case-study-card a').first().click()
  await expect(page).toHaveURL('/projects/campus-companion')
})

test('both resume downloads are actual PDFs and follow the selected language', async ({ page, request }) => {
  for (const language of ['th', 'en']) {
    const response = await request.get(`/resume/resume-${language}.pdf`)
    expect(response.status()).toBe(200)
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  }
  await page.goto('/resume')
  const thDownload = page.waitForEvent('download')
  await page.getByRole('link', { name: 'ดาวน์โหลด Resume', exact: true }).click()
  expect((await thDownload).suggestedFilename()).toBe('resume-th.pdf')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  const enDownload = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download Resume', exact: true }).click()
  expect((await enDownload).suggestedFilename()).toBe('resume-en.pdf')
})

test('contact validates input, keeps drafts while translating, and explains missing contact details', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByRole('button', { name: 'คัดลอกอีเมล', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'เปิดแอปอีเมล', exact: true }).click()
  await expect(page.getByText('กรุณากรอกชื่อ', { exact: true })).toBeVisible()
  await expect(page.locator('#sender-name')).toBeFocused()
  await page.locator('#sender-name').fill('Test Visitor')
  await page.locator('#sender-email').fill('visitor@example.com')
  await page.locator('#contact-subject').fill('A project idea')
  await page.locator('#contact-message').fill('Hello, I would like to discuss a project with you.')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('#contact-message')).toHaveValue('Hello, I would like to discuss a project with you.')
  await page.getByRole('button', { name: 'Open email app', exact: true }).click()
  await expect(page.locator('.form-status')).toContainText("The portfolio owner's email is needed")
  await expect(page).toHaveURL('/contact')
})

test('menu closes with Escape and editorial index supports arrow-key navigation', async ({ page }) => {
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'เปิดเมนู', exact: true })
  await menu.click()
  await expect(page.locator('#site-menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#site-menu')).toHaveCount(0)
  await expect(menu).toBeFocused()
  await page.getByTestId('index-about').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('index-skills')).toBeFocused()
  await expect(page.getByTestId('index-skills')).toHaveClass(/is-active/)
  await page.keyboard.press('End')
  await expect(page.getByTestId('index-contact')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/contact')
})

test('all pages fit a narrow screen without console errors', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 320, height: 800 })
  for (const language of ['th', 'en']) {
    for (const route of ['/', '/about', '/skills', '/projects', '/projects/roomsense', '/resume', '/contact']) {
      await page.goto(route)
      await page.getByRole('button', { name: language.toUpperCase(), exact: true }).click()
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${route} (${language}) overflow`).toBeLessThanOrEqual(1)
    }
  }
  expect(errors).toEqual([])
})
