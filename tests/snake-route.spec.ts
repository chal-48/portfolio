import { test, expect } from '@playwright/test'
import { createSnakeRoute } from '../src/lib/snake-route'

test('snake targets sparse contributions without sweeping empty months', () => {
  const cells = [{ x:640,y:32,count:3 },{ x:656,y:32,count:1 },{ x:656,y:48,count:5 },{ x:704,y:0,count:2 }]
  const route = createSnakeRoute(cells,848)
  expect(route.visits.get('640,32')).toBe(1)
  expect(route.visits.size).toBe(cells.length)
  expect(route.points.length).toBeLessThan(50)
  // Never visit the empty left-hand months, including the return trip.
  expect(Math.min(...route.points.map(point => point.x))).toBeGreaterThan(500)
})

test('snake eats every target, takes adjacent steps and loops without body collisions', () => {
  for (const startColumn of [0,22,49]) {
    const cells = Array.from({ length:24 },(_,index) => ({ x:(startColumn+Math.floor(index/7))*16,y:(index%7)*16,count:index%4+1 }))
    const { points,visits } = createSnakeRoute(cells,848)
    expect(visits.size).toBe(cells.length)
    const body = [points[0],...[1,2,3].map(index => ({ x:points[0].x-index*16,y:points[0].y }))]
    for (const point of [...points.slice(1),...points.slice(1,6)]) {
      expect(Math.abs(point.x-body[0].x)+Math.abs(point.y-body[0].y)).toBe(16)
      expect(body.slice(0,-1).some(segment => segment.x===point.x && segment.y===point.y)).toBe(false)
      body.unshift(point); body.pop()
    }
    for (const cell of cells) {
      const step = visits.get(`${cell.x},${cell.y}`)!
      expect(points[step]).toEqual({ x:cell.x,y:cell.y })
    }
  }
})

test('an empty calendar does not create food or a pointless snake route', () => {
  const route = createSnakeRoute([{ x:0,y:0,count:0 }],848)
  expect(route.points).toEqual([])
  expect(route.visits.size).toBe(0)
})
