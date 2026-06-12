import { requireAuth } from '../../utils/auth'
import { updateMachine } from '../../db/machines'
import { ensureMachine, machineToApi } from '../../utils/machines'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const { name, upstreamUrl } = await readBody<{ name?: unknown; upstreamUrl?: unknown }>(event)

  const fields: { name?: string; upstream_url?: string } = {}

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) {
      throw createError({ statusCode: 400, statusMessage: 'Enter a machine name (1–120 characters).' })
    }
    fields.name = name.trim()
  }

  if (upstreamUrl !== undefined) {
    if (typeof upstreamUrl !== 'string' || !/^https?:\/\//.test(upstreamUrl.trim())) {
      throw createError({ statusCode: 400, statusMessage: 'The upstream must be an http(s) URL.' })
    }
    fields.upstream_url = upstreamUrl.trim().replace(/\/+$/, '')
  }

  if (Object.keys(fields).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Nothing to update.' })
  }

  ensureMachine(session.userId)
  return { machine: machineToApi(updateMachine(session.userId, fields)!) }
})
