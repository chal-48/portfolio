type Point = { x: number; y: number }
type Food = Point & { count: number }
const key = (point: Point) => `${point.x},${point.y}`
const directions = [{ x:1,y:0 },{ x:0,y:1 },{ x:0,y:-1 },{ x:-1,y:0 }]

/** Find the closest remaining contribution by BFS, avoiding the snake's body. */
export function createSnakeRoute(cells: Food[], width: number) {
  const food = new Map(cells.filter(cell => cell.count>0).map(cell => [key(cell),cell]))
  const visits = new Map<string,number>()
  const first = food.values().next().value as Food | undefined
  if (!first) return { points:[] as Point[],visits }

  // Enter immediately beside the first contribution, instead of crossing empty months.
  const entry = { x:first.x-16,y:first.y }
  const points: Point[] = [entry]
  let body = [entry,...[1,2,3].map(index => ({ x:entry.x-index*16,y:entry.y }))]
  const maxX = Math.ceil(width/16)*16
  const pathTo = (targets: Set<string>, forbidden = new Set<string>()): Point[] | null => {
    const blocked = new Set(body.slice(1,-1).map(key))
    const queue: Point[] = [body[0]]
    const parents = new Map<string,Point | null>([[key(body[0]),null]])
    for (let index=0; index<queue.length; index++) {
      const point = queue[index]
      if (index>0 && targets.has(key(point))) {
        const path: Point[] = []
        let current = point
        while (parents.get(key(current))) { path.push(current); current=parents.get(key(current))! }
        return path.reverse()
      }
      for (const direction of directions) {
        const next = { x:point.x+direction.x*16,y:point.y+direction.y*16 }
        const position = key(next)
        if (next.x < -64 || next.x > maxX || next.y < -16 || next.y > 112 || blocked.has(position) || forbidden.has(position) || parents.has(position)) continue
        parents.set(position,point)
        queue.push(next)
      }
    }
    return null
  }
  const advance = (point: Point) => {
    points.push(point)
    body = [point,...body.slice(0,3)]
    if (food.delete(key(point))) visits.set(key(point),points.length-1)
  }
  while (food.size) {
    const path = pathTo(new Set(food.keys()))
    if (!path) throw new Error('Unable to reach a contribution cell')
    path.forEach(advance)
  }
  // Approach from behind so the next loop starts with the same body direction.
  const approach = { x:entry.x-48,y:entry.y }
  const corridor = [32,16,0].map(distance => ({ x:entry.x-distance,y:entry.y }))
  const home = pathTo(new Set([key(approach)]),new Set(corridor.map(key)))
  if (!home) throw new Error('Unable to close the snake route')
  home.forEach(advance)
  corridor.forEach(advance)
  return { points,visits }
}
