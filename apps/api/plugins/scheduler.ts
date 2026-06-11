import { listDueSchedules, markScheduleRun } from '../utils/db'
import { dispatchPrompt } from '../utils/dispatch'

const TICK_MS = 60_000

/** Fires due schedules into fresh sessions on their owners' machines. A
 *  schedule always rolls forward even when delivery fails — a dead machine
 *  must not pile up catch-up runs. */
export default defineNitroPlugin(() => {
  let running = false

  async function tick() {
    if (running) return
    running = true
    try {
      for (const schedule of listDueSchedules()) {
        // Roll forward first so a crash mid-dispatch can't double-fire.
        markScheduleRun(schedule.id, schedule.interval_minutes)
        try {
          await dispatchPrompt(schedule.user_id, `⏱ ${schedule.name}`, schedule.prompt, schedule.project_id)
        } catch (error) {
          console.error(`[scheduler] "${schedule.name}" (${schedule.id}) failed:`, error)
        }
      }
    } finally {
      running = false
    }
  }

  const timer = setInterval(() => void tick(), TICK_MS)
  timer.unref?.()
})
