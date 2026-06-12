import { listProjectSessionIds } from '../../../db/projects'
import { requireProjectAccess } from '../../../utils/orgs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await requireProjectAccess(event, id)
  return { sessionIds: listProjectSessionIds(id) }
})
