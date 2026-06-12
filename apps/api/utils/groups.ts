import type { H3Event } from 'h3'
import { createError } from 'h3'
import { findGroup, type GroupRow } from '../db/groups'
import { requireMembership } from './orgs'
import type { OrgRole } from '../db/orgs'

/** Resolve a group and require org membership (admin for mutations). */
export async function requireGroupAccess(
  event: H3Event,
  groupId: string,
  minRole: OrgRole = 'member',
): Promise<GroupRow> {
  const group = findGroup(groupId)
  if (!group) throw createError({ statusCode: 404, statusMessage: 'Group not found.' })
  await requireMembership(event, group.org_id, minRole)
  return group
}
