import { requireAdmin } from '../../utils/admin'
import { listAllOrganizations } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return { organizations: listAllOrganizations() }
})
