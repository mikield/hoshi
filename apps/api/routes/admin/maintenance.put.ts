import { requireAdmin, getMaintenance, setMaintenance } from '../../utils/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { enabled, message } = await readBody<{ enabled?: unknown; message?: unknown }>(event)
  if (typeof enabled !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'enabled must be a boolean.' })
  }
  setMaintenance({
    enabled,
    message: typeof message === 'string' && message.trim() ? message.trim().slice(0, 280) : null,
  })
  return { maintenance: getMaintenance() }
})
