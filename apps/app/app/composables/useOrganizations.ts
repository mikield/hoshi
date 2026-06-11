export type OrgRole = 'owner' | 'admin' | 'member'

export interface Organization {
  id: string
  name: string
  role: OrgRole
  member_count: number
  created_at: string
}

export interface OrgMember {
  user_id: number
  email: string
  name: string | null
  role: OrgRole
  created_at: string
}

export interface OrgInvite {
  token: string
  email: string
  role: Exclude<OrgRole, 'owner'>
  created_at: string
  expires_at: string
}

// State lives in stores/organizations.ts — this file holds the org domain
// types and the stateless per-org API helpers (fetched on demand by tabs).

// ── Members & invites ────────────────────────────────────────────────────────

export async function fetchMembers(orgId: string): Promise<OrgMember[]> {
  const res = await useApi()<{ members: OrgMember[] }>(`/orgs/${orgId}/members`)
  return res.members
}

export async function updateMemberRole(orgId: string, userId: number, role: 'admin' | 'member'): Promise<void> {
  await useApi()(`/orgs/${orgId}/members/${userId}`, { method: 'PATCH', body: { role } })
}

export async function removeMember(orgId: string, userId: number): Promise<void> {
  await useApi()(`/orgs/${orgId}/members/${userId}`, { method: 'DELETE' })
}

export async function fetchInvites(orgId: string): Promise<OrgInvite[]> {
  const res = await useApi()<{ invites: OrgInvite[] }>(`/orgs/${orgId}/invites`)
  return res.invites
}

export async function createInvite(
  orgId: string,
  email: string,
  role: 'admin' | 'member',
): Promise<{ invite: OrgInvite }> {
  return await useApi()<{ invite: OrgInvite }>(`/orgs/${orgId}/invites`, {
    method: 'POST',
    body: { email, role },
  })
}

export async function revokeInvite(orgId: string, token: string): Promise<void> {
  await useApi()(`/orgs/${orgId}/invites/${token}`, { method: 'DELETE' })
}

// ── Groups ───────────────────────────────────────────────────────────────────

export interface OrgGroup {
  id: string
  name: string
  member_count: number
  created_at: string
}

export async function fetchGroups(orgId: string): Promise<OrgGroup[]> {
  const res = await useApi()<{ groups: OrgGroup[] }>(`/orgs/${orgId}/groups`)
  return res.groups
}

export async function createGroup(orgId: string, name: string): Promise<OrgGroup> {
  const res = await useApi()<{ group: OrgGroup }>(`/orgs/${orgId}/groups`, { method: 'POST', body: { name } })
  return res.group
}

export async function renameGroup(groupId: string, name: string): Promise<OrgGroup> {
  const res = await useApi()<{ group: OrgGroup }>(`/groups/${groupId}`, { method: 'PATCH', body: { name } })
  return res.group
}

export async function deleteGroup(groupId: string): Promise<void> {
  await useApi()(`/groups/${groupId}`, { method: 'DELETE' })
}

export async function fetchGroupMembers(groupId: string): Promise<OrgMember[]> {
  const res = await useApi()<{ members: OrgMember[] }>(`/groups/${groupId}/members`)
  return res.members
}

export async function addGroupMember(groupId: string, userId: number): Promise<void> {
  await useApi()(`/groups/${groupId}/members`, { method: 'POST', body: { userId } })
}

export async function removeGroupMember(groupId: string, userId: number): Promise<void> {
  await useApi()(`/groups/${groupId}/members/${userId}`, { method: 'DELETE' })
}
