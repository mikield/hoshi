import { requireAdmin } from '../../utils/admin'
import { listAllOrganizations } from '../../db/admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return { organizations: listAllOrganizations() }
})
