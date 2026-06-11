import { requireAdmin } from '../../../utils/admin'
import { deleteUser, findUserById } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (id === admin.id) throw createError({ statusCode: 400, statusMessage: "You can't delete your own account." })
  if (!findUserById(id)) throw createError({ statusCode: 404, statusMessage: 'User not found.' })
  deleteUser(id)
  return { ok: true }
})
