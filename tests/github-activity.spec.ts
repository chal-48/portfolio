import { test, expect } from '@playwright/test'

const endpoint = '**/github-contributions-api.jogruber.de/v4/chal-48?y=last'
test('GitHub calendar uses returned dates and counts and keeps data when the theme changes', async ({ page }) => {
  let requests = 0
  await page.route(endpoint, route => {
    requests++
    return route.fulfill({ json:{ contributions:[
      { date:'2026-10-12',count:0,level:0 },
      { date:'2026-10-13',count:2,level:1 },
      { date:'2026-10-14',count:4,level:4 },
      { date:'2026-10-15',count:1,level:2 },
    ] } })
  })
  await page.goto('/')
  const activity = page.getByRole('region', { name:'GitHub contributions',exact:true })
  await expect(activity.getByRole('img')).toHaveAttribute('aria-label', /7 contributions in the last year/)
  await expect(activity.locator('.activity-cell')).toHaveCount(4)
  await expect(activity.locator('.activity-cell').nth(2).locator('title')).toHaveText('4 contributions on Oct 14, 2026')
  await expect(activity.getByRole('link')).toHaveAttribute('href', 'https://github.com/chal-48')
  await page.getByRole('button', { name:'Switch to light theme' }).click()
  await expect(activity.locator('.activity-level-4').first()).toBeVisible()
  expect(requests).toBeLessThanOrEqual(2) // React StrictMode may abort the first request.
  if (test.info().project.name === 'mobile') {
    await page.setViewportSize({ width:320,height:800 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1)
  }
})

test('GitHub calendar fails honestly and retries successfully', async ({ page }) => {
  let failed = true
  await page.route(endpoint, route => failed ? route.fulfill({ status:503,json:{ error:'Unavailable' } }) : route.fulfill({ json:{ contributions:[{ date:'2026-10-15',count:3,level:2 }] } }))
  await page.goto('/')
  const activity = page.getByRole('region', { name:'GitHub contributions',exact:true })
  await expect(activity.getByRole('status')).toContainText('GitHub activity is unavailable.')
  await expect(activity.locator('rect')).toHaveCount(0)
  failed = false
  await activity.getByRole('button', { name:'Retry' }).click()
  await expect(activity.getByRole('img')).toHaveAttribute('aria-label', /3 contributions in the last year/)
})

test('snake moves automatically without a pause button and respects reduced motion', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json:{ contributions:[
    { date:'2026-10-11',count:2,level:3 },
    { date:'2026-10-12',count:1,level:1 },
  ] } }))
  await page.goto('/')
  const activity = page.getByRole('region', { name:'GitHub contributions',exact:true })
  await expect(activity.locator('.snake-segment-0')).toBeAttached()
  await activity.scrollIntoViewIfNeeded()
  await expect(activity).toHaveAttribute('data-animation-running','true')
  const head = activity.locator('.snake-segment-0')
  const position = () => head.evaluate(element => getComputedStyle(element).transform)
  const initial = await position()
  await expect.poll(position).not.toBe(initial)
  await expect(activity.getByRole('button', { name:/Pause|Play contribution/ })).toHaveCount(0)
  await expect(activity.locator('.activity-footer')).toContainText('3 contributions in the last year')
  await page.emulateMedia({ reducedMotion:'reduce' })
  await expect(activity.locator('.snake-decoration')).toBeHidden()
  await expect(activity.locator('.activity-cell')).toHaveCount(2)
  expect(await activity.locator('.activity-cell').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none')
})
