import { test, expect } from '@playwright/test'

async function fillMessage(page: import('@playwright/test').Page) {
  await page.goto('/contact')
  await page.locator('#sender-name').fill('Test Visitor')
  await page.locator('#sender-email').fill('visitor@example.com')
  await page.locator('#contact-subject').fill('A message from the website')
  await page.locator('#contact-message').fill('This is a test message for request validation.')
}

test('home alternates Chalisa and Aom, uses the Git icon and loads the real profile photo', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero-name-primary')).toHaveText('Chalisa')
  await expect(page.locator('.hero-name-alternate')).toHaveText('Aom')
  const track = page.locator('.hero-name-track')
  await track.evaluate(element => { const animation=element.getAnimations()[0]; animation.pause(); animation.currentTime=4400 })
  const name = await page.locator('.hero-name-alternate').boundingBox()
  const window = await page.locator('.hero-name-rotator').boundingBox()
  expect(Math.abs(name!.y-window!.y)).toBeLessThan(1)
  await expect(page.locator('.git-projects-glyph')).toHaveAttribute('src','/assets/icons/git-original.svg')
  await expect.poll(() => page.locator('.avatar-image').evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion:'reduce' })
  await expect(page.locator('.hero-name-alternate')).toBeHidden()
  await expect(page.locator('.hero-name-primary')).toBeVisible()
})

test('Contact columns align and the hero greeting stays on one baseline', async ({ page }, info) => {
  await page.goto('/')
  const title = page.locator('.hero-title')
  await page.evaluate(() => document.fonts.ready)
  const dimensions = await title.evaluate(element => {
    const prefix=element.querySelector('.hero-intro-prefix')!.getBoundingClientRect()
    const name=element.querySelector('.hero-name-primary')!.getBoundingClientRect()
    return { prefixTop:prefix.top,nameTop:name.top,prefixRight:prefix.right,nameLeft:name.left }
  })
  expect(Math.abs(dimensions.prefixTop-dimensions.nameTop)).toBeLessThan(8)
  expect(dimensions.nameLeft).toBeGreaterThan(dimensions.prefixRight-1)
  await page.goto('/contact')
  if (info.project.name==='desktop') {
    await expect.poll(() => page.locator('.page-content').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
    const left=await page.locator('.contact-channels').boundingBox()
    const right=await page.locator('.contact-form-panel').boundingBox()
    expect(Math.abs(left!.height-right!.height)).toBeLessThan(1)
    expect(Math.abs(left!.width-right!.width)).toBeLessThan(1)
    expect(Math.abs(left!.y-right!.y)).toBeLessThan(1)
  }
})

test('desktop wheel uses Lenis and stops while search is open', async ({ page }, info) => {
  test.skip(info.project.name!=='desktop','The reference keeps native scrolling on phones.')
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/lenis/)
  await page.mouse.move(1000,500)
  await page.mouse.wheel(0,200)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(201)
  await page.getByRole('button',{name:'Search (Ctrl+K)',exact:true}).click()
  await expect(page.locator('html')).toHaveClass(/lenis-stopped/)
  await page.keyboard.press('Escape')
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/)
  await page.emulateMedia({reducedMotion:'reduce'})
  await expect(page.locator('html')).not.toHaveClass(/lenis/)
})

test('About has three aligned facts, one page title and a Computer major', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name:'About Me',exact:true })).toHaveCount(1)
  await expect(page.locator('.stat-grid .stat')).toHaveCount(3)
  await expect(page.locator('.stat-grid')).toContainText('MAJORComputer')
  if (test.info().project.name==='desktop') {
    const tops = await page.locator('.stat-grid .stat').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top))
    expect(Math.max(...tops)-Math.min(...tops)).toBeLessThan(1)
  }
})

test('skill cards lift on mouse hover and share the heading font', async ({ page }, info) => {
  test.skip(info.project.name!=='desktop','Hover is for mouse devices.')
  await page.goto('/skills')
  await expect.poll(() => page.locator('.page-content').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  const card = page.locator('.skill-panel').first()
  const before = await card.boundingBox()
  await card.hover()
  await expect.poll(async () => (await card.boundingBox())!.y).toBeLessThan(before!.y-3)
  const font = await card.locator('h2').evaluate(element => getComputedStyle(element).fontFamily)
  expect(font).toContain('Shippori Mincho')
  expect(font).not.toContain('Georgia')
})

test('contact reports activation honestly without claiming a message was sent', async ({ page }) => {
  await page.route('https://formsubmit.co/ajax/**',route => route.fulfill({ json:{ success:'false',message:'This form needs activation. We have sent an email to activate it.' } }))
  await fillMessage(page)
  await page.getByRole('button', { name:'Send message',exact:true }).click()
  await expect(page.locator('.form-status')).toContainText('awaiting email verification')
  await expect(page.getByText('Your message has been submitted. Thank you.', { exact:true })).toHaveCount(0)
  await expect(page.locator('#contact-message')).toHaveValue('This is a test message for request validation.')
})

test('contact preserves a failed message and accepts a retry without opening an email app', async ({ page }) => {
  let attempts=0
  await page.route('https://formsubmit.co/ajax/**',route => {
    attempts++
    return route.fulfill({ status:attempts===1 ? 503 : 200,json:attempts===1 ? { success:'false' } : { success:'true' } })
  })
  await fillMessage(page)
  await page.getByRole('button', { name:'Send message',exact:true }).click()
  await expect(page.getByRole('alert')).toContainText('Unable to send right now')
  await expect(page.locator('#contact-message')).toHaveValue('This is a test message for request validation.')
  await page.getByRole('button', { name:'Send message',exact:true }).click()
  await expect(page.locator('.form-status')).toContainText('Your message has been submitted.')
  expect(attempts).toBe(2)
  await expect(page).toHaveURL('/contact')
})
