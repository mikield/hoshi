import { listProjects } from '../../utils/db'
import { requireMembership } from '../../utils/orgs'

export default defineEventHandler(async (event) => {
  const { org } = getQuery(event)
  if (typeof org !== 'string' || !org) {
    throw createError({ statusCode: 400, statusMessage: 'org query parameter is required.' })
  }
  await requireMembership(event, org)
  return { projects: listProjects(org) }
})
