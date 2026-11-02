import type { GanttTask, GanttLink } from './gantt'

export interface Snapshot { tasks: GanttTask[]; links: GanttLink[] }
export interface History { past: Snapshot[]; present: Snapshot; future: Snapshot[] }
export function createHistory(present: Snapshot): History { return {past: [], present, future: []} }
export function commit(history: History, next: Snapshot, baseline = history.present): History {
  if (JSON.stringify(baseline) === JSON.stringify(next)) return {...history, present: next}
  return {past: [...history.past, baseline].slice(-100), present: next, future: []}
}
export function undo(history: History): History {
  if (!history.past.length) return history
  return {past: history.past.slice(0,-1), present: history.past.at(-1)!, future: [history.present,...history.future]}
}
export function redo(history: History): History {
  if (!history.future.length) return history
  return {past: [...history.past,history.present], present: history.future[0], future: history.future.slice(1)}
}
