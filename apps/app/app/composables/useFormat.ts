/** The API stores timestamps as SQLite UTC "YYYY-MM-DD HH:MM:SS" — this is
 *  the one place that quirk is known. */
export function sqliteDate(value: string): Date {
  return new Date(`${value.replace(' ', 'T')}Z`)
}

/** "Jun 11, 2026" in the viewer's locale. */
export function formatDay(value: string | null, fallback = '—'): string {
  if (!value) return fallback
  return sqliteDate(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** "Jun 11, 2:30 PM" in the viewer's locale. */
export function formatMoment(value: string | null, fallback = '—'): string {
  if (!value) return fallback
  return sqliteDate(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
