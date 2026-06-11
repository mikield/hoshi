import { removeProjectSession } from '../../../../utils/db'
import { requireProjectAccess } from '../../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireProjectAccess(event, id)
  removeProjectSession(id, getRouterParam(event, 'sessionId')!)
  return { ok: true }
})
