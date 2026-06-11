import type { ScheduleRow, WebhookRow } from './db'

/** Wire shapes for the trigger surfaces (schedules + webhooks). */

export function scheduleToApi(schedule: ScheduleRow) {
  return {
    id: schedule.id,
    projectId: schedule.project_id,
    name: schedule.name,
    prompt: schedule.prompt,
    intervalMinutes: schedule.interval_minutes,
    enabled: schedule.enabled === 1,
    lastRunAt: schedule.last_run_at,
    nextRunAt: schedule.next_run_at,
    createdAt: schedule.created_at,
  }
}

export function webhookToApi(webhook: WebhookRow) {
  return {
    id: webhook.id,
    projectId: webhook.project_id,
    name: webhook.name,
    token: webhook.token,
    prompt: webhook.prompt,
    enabled: webhook.enabled === 1,
    hits: webhook.hits,
    lastTriggeredAt: webhook.last_triggered_at,
    createdAt: webhook.created_at,
  }
}

export function validateTriggerFields(name: unknown, prompt: unknown): { name: string; prompt: string } {
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a name (1–120 characters).' })
  }
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.trim().length > 4000) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a prompt (1–4000 characters).' })
  }
  return { name: name.trim(), prompt: prompt.trim() }
}
