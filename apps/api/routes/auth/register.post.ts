import bcrypt from 'bcryptjs'
import { addMember, createOrganization, personalOrgName } from '../../db/orgs'
import { createUser, findUserByEmail } from '../../db/users'
import { ensureMachine } from '../../utils/machines'
import { createSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readJsonBody<{ email?: unknown; password?: unknown; name?: unknown }>(event)

  if (typeof email !== 'string' || typeof password !== 'string' || !email.includes('@') || password.length < 8) {
    setResponseStatus(event, 400)
    return { error: 'Enter a valid email and a password with at least 8 characters.' }
  }

  const normalized = email.trim().toLowerCase()
  if (findUserByEmail(normalized)) {
    setResponseStatus(event, 409)
    return { error: 'An account with this email already exists.' }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = createUser(normalized, passwordHash, typeof name === 'string' && name.trim() ? name.trim() : null)

  const organization = createOrganization(personalOrgName(user.name, user.email))
  addMember(organization.id, user.id, 'owner')
  // Provisioning moment: every account gets its own OpenCode machine.
  ensureMachine(user.id)

  await createSessionCookie(event, { userId: user.id, email: user.email })
  return { user: { id: user.id, email: user.email, name: user.name } }
})
