import { db } from './connection'

// ── Schedules ────────────────────────────────────────────────────────────────
// Recurring prompts fired into fresh sessions on the owner's machine.

export interface ScheduleRow {
  id: string
  user_id: number
  project_id: string | null
  name: string
  prompt: string
  interval_minutes: number
  enabled: number
  last_run_at: string | null
  next_run_at: string
  created_at: string
}

export function listSchedulesForUser(userId: number): ScheduleRow[] {
  return db
    .prepare('SELECT * FROM schedules WHERE user_id = ? ORDER BY created_at ASC')
    .all(userId) as ScheduleRow[]
}

export function findSchedule(id: string): ScheduleRow | undefined {
  return db.prepare('SELECT * FROM schedules WHERE id = ?').get(id) as ScheduleRow | undefined
}

export function createSchedule(
  userId: number,
  fields: { name: string; prompt: string; intervalMinutes: number; projectId: string | null },
): ScheduleRow {
  const id = crypto.randomUUID()
  db.prepare(
    `INSERT INTO schedules (id, user_id, project_id, name, prompt, interval_minutes, next_run_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+' || ? || ' minutes'))`,
  ).run(id, userId, fields.projectId, fields.name, fields.prompt, fields.intervalMinutes, fields.intervalMinutes)
  return findSchedule(id)!
}

export function updateSchedule(
  id: string,
  fields: Partial<{ name: string; prompt: string; interval_minutes: number; enabled: number }>,
): ScheduleRow | undefined {
  const schedule = findSchedule(id)
  if (!schedule) return undefined
  db.prepare(
    'UPDATE schedules SET name = ?, prompt = ?, interval_minutes = ?, enabled = ? WHERE id = ?',
  ).run(
    fields.name ?? schedule.name,
    fields.prompt ?? schedule.prompt,
    fields.interval_minutes ?? schedule.interval_minutes,
    fields.enabled ?? schedule.enabled,
    id,
  )
  return findSchedule(id)
}

export function deleteSchedule(id: string): boolean {
  return db.prepare('DELETE FROM schedules WHERE id = ?').run(id).changes > 0
}

export function listDueSchedules(): ScheduleRow[] {
  return db
    .prepare("SELECT * FROM schedules WHERE enabled = 1 AND next_run_at <= datetime('now')")
    .all() as ScheduleRow[]
}

/** Stamp a run and roll next_run_at forward from now (not from the missed
 *  slot, so a backlog never causes a burst of catch-up runs). */
export function markScheduleRun(id: string, intervalMinutes: number): void {
  db.prepare(
    `UPDATE schedules SET last_run_at = datetime('now'),
     next_run_at = datetime('now', '+' || ? || ' minutes') WHERE id = ?`,
  ).run(intervalMinutes, id)
}

// ── Webhooks ─────────────────────────────────────────────────────────────────
// Inbound trigger URLs: POST /hooks/<token> starts a session on the owner's machine.

export interface WebhookRow {
  id: string
  user_id: number
  project_id: string | null
  name: string
  token: string
  prompt: string
  enabled: number
  hits: number
  last_triggered_at: string | null
  created_at: string
}

export function listWebhooksForUser(userId: number): WebhookRow[] {
  return db
    .prepare('SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at ASC')
    .all(userId) as WebhookRow[]
}

export function findWebhook(id: string): WebhookRow | undefined {
  return db.prepare('SELECT * FROM webhooks WHERE id = ?').get(id) as WebhookRow | undefined
}

export function findWebhookByToken(token: string): WebhookRow | undefined {
  return db.prepare('SELECT * FROM webhooks WHERE token = ?').get(token) as WebhookRow | undefined
}

export function createWebhook(
  userId: number,
  fields: { name: string; prompt: string; projectId: string | null },
): WebhookRow {
  const id = crypto.randomUUID()
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll('-', '')
  db.prepare(
    'INSERT INTO webhooks (id, user_id, project_id, name, token, prompt) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(id, userId, fields.projectId, fields.name, token, fields.prompt)
  return findWebhook(id)!
}

export function updateWebhook(
  id: string,
  fields: Partial<{ name: string; prompt: string; enabled: number }>,
): WebhookRow | undefined {
  const webhook = findWebhook(id)
  if (!webhook) return undefined
  db.prepare('UPDATE webhooks SET name = ?, prompt = ?, enabled = ? WHERE id = ?').run(
    fields.name ?? webhook.name,
    fields.prompt ?? webhook.prompt,
    fields.enabled ?? webhook.enabled,
    id,
  )
  return findWebhook(id)
}

export function deleteWebhook(id: string): boolean {
  return db.prepare('DELETE FROM webhooks WHERE id = ?').run(id).changes > 0
}

export function recordWebhookHit(id: string): void {
  db.prepare("UPDATE webhooks SET hits = hits + 1, last_triggered_at = datetime('now') WHERE id = ?").run(id)
}
