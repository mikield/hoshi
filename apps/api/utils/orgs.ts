import type { H3Event } from 'h3'
import { createError } from 'h3'
import { requireAuth } from './auth'
import { getMembership, type OrgRole } from '../db/orgs'
import { findProject, type ProjectRow } from '../db/projects'
import type { SessionPayload } from './session'

const ROLE_RANK: Record<OrgRole, number> = { member: 0, admin: 1, owner: 2 }

/** Resolve the caller's membership in an org, requiring at least `minRole`. */
export async function requireMembership(
  event: H3Event,
  orgId: string,
  minRole: OrgRole = 'member',
): Promise<{ session: SessionPayload; role: OrgRole }> {
  const session = await requireAuth(event)
  const membership = getMembership(orgId, session.userId)
  if (!membership) throw createError({ statusCode: 404, statusMessage: 'Organization not found.' })
  if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
    throw createError({ statusCode: 403, statusMessage: 'You need a higher role for that.' })
  }
  return { session, role: membership.role }
}

/** Resolve a project the caller can access through org membership,
 *  optionally demanding an org role (e.g. 'admin' for management actions). */
export async function requireProjectAccess(
  event: H3Event,
  projectId: string,
  minRole: OrgRole = 'member',
): Promise<{ session: SessionPayload; project: ProjectRow; role: OrgRole }> {
  const session = await requireAuth(event)
  const project = findProject(projectId)
  const membership = project && getMembership(project.org_id, session.userId)
  if (!project || !membership) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found.' })
  }
  if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
    throw createError({ statusCode: 403, statusMessage: 'You need a higher role for that.' })
  }
  return { session, project, role: membership.role }
}
