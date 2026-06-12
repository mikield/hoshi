import { requireAdmin } from '../../../utils/admin'
import { setUserAdmin, setUserDisabled } from '../../../db/admin'
import { findUserById } from '../../../db/users'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const target = findUserById(id)
  if (!target) throw createError({ statusCode: 404, statusMessage: 'User not found.' })

  const { disabled, isAdmin } = await readBody<{ disabled?: unknown; isAdmin?: unknown }>(event)

  if (typeof disabled === 'boolean') {
    if (id === admin.id) throw createError({ statusCode: 400, statusMessage: "You can't disable your own account." })
    setUserDisabled(id, disabled)
  }
  if (typeof isAdmin === 'boolean') {
    if (id === admin.id) throw createError({ statusCode: 400, statusMessage: "You can't change your own admin role." })
    setUserAdmin(id, isAdmin)
  }

  const user = findUserById(id)!
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      disabled: user.disabled,
    },
  }
})
