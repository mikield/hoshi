export interface Project {
  id: string
  name: string
  updatedAt: number
}

/** Mock project list shared by the projects index page and the sidebar
 *  project switcher, so names stay consistent everywhere. */
export function useProjects() {
  const now = useState('projects:now', () => Date.now())
  const projects = useState<Project[]>('projects:list', () => [
    { id: 'p1', name: 'Retry logic refactor', updatedAt: now.value - 1000 * 60 * 12 },
    { id: 'p2', name: 'Marketing site redesign', updatedAt: now.value - 1000 * 60 * 60 * 4 },
    { id: 'p3', name: 'Onboarding flow audit', updatedAt: now.value - 1000 * 60 * 60 * 24 * 2 },
    { id: 'p4', name: 'Q3 release notes', updatedAt: now.value - 1000 * 60 * 60 * 24 * 9 },
  ])
  return { projects, now }
}

/** "2 minutes" → "2m" style compact relative time, from a timestamp. */
export function shortRelative(ts: number | undefined, now: number): string {
  if (!ts) return ''
  const diff = Math.max(0, now - ts)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return `${Math.max(1, Math.floor(diff / 1000))}s`
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`
  return `${Math.floor(months / 12)}y`
}
