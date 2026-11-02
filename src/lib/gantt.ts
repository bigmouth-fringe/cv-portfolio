export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF'
export interface GanttTask { id: string; start: number; duration: number }
export interface GanttLink { id: string; from: string; to: string; type: DependencyType; lag: number }
export const dependencyTypes: DependencyType[] = ['FS', 'SS', 'FF', 'SF']
export const initialTasks: GanttTask[] = [
  { id: 'model', start: 0, duration: 3 },
  { id: 'api', start: 3, duration: 4 },
  { id: 'ui', start: 0, duration: 6 },
  { id: 'tests', start: 5, duration: 2 },
  { id: 'legacy', start: -2, duration: 2 },
]
export const initialLinks: GanttLink[] = [
  { id: 'fs', from: 'model', to: 'api', type: 'FS', lag: 0 },
  { id: 'ss', from: 'model', to: 'ui', type: 'SS', lag: 0 },
  { id: 'ff', from: 'api', to: 'tests', type: 'FF', lag: 0 },
  { id: 'sf', from: 'ui', to: 'legacy', type: 'SF', lag: 0 },
]

/** Earliest permissible successor start. Intervals are [start, finish). */
export function minimumStart(predecessor: GanttTask, successor: GanttTask, link: GanttLink) {
  const anchor = predecessor.start + (link.type[0] === 'F' ? predecessor.duration : 0)
  return anchor + link.lag - (link.type[1] === 'F' ? successor.duration : 0)
}

/** Push successors forward in topological order; keep existing slack. */
export function schedule(tasks: readonly GanttTask[], links: readonly GanttLink[]): GanttTask[] {
  const byId = new Map(tasks.map(task => [task.id, { ...task }]))
  if (byId.size !== tasks.length) throw new Error('Duplicate task ID')
  for (const task of tasks) {
    if (!Number.isSafeInteger(task.start) || !Number.isSafeInteger(task.duration) || task.duration < 1) throw new Error('Invalid task interval')
  }
  const incoming = new Map(tasks.map(task => [task.id, [] as GanttLink[]]))
  const outgoing = new Map(tasks.map(task => [task.id, [] as GanttLink[]]))
  for (const link of links) {
    if (!byId.has(link.from) || !byId.has(link.to)) throw new Error('Unknown task')
    if (!dependencyTypes.includes(link.type) || !Number.isSafeInteger(link.lag)) throw new Error('Invalid dependency')
    incoming.get(link.to)!.push(link)
    outgoing.get(link.from)!.push(link)
  }
  const degree = new Map(tasks.map(task => [task.id, incoming.get(task.id)!.length]))
  const queue = tasks.filter(task => degree.get(task.id) === 0).map(task => task.id)
  let visited = 0
  for (let index = 0; index < queue.length; index++) {
    const id = queue[index]
    const task = byId.get(id)!
    for (const link of incoming.get(id)!) task.start = Math.max(task.start, minimumStart(byId.get(link.from)!, task, link))
    if (!Number.isSafeInteger(task.start)) throw new Error('Schedule exceeds safe range')
    visited++
    for (const link of outgoing.get(id)!) {
      const remaining = degree.get(link.to)! - 1
      degree.set(link.to, remaining)
      if (!remaining) queue.push(link.to)
    }
  }
  if (visited !== tasks.length) throw new Error('Cyclic dependency')
  return tasks.map(task => byId.get(task.id)!)
}
