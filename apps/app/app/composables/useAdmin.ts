export interface AdminStats {
  counts: { users: number; organizations: number; projects: number; sessions: number }
  opencode: { reachable: boolean; version: string | null; url: string }
  maintenance: { enabled: boolean; message: string | null }
  uptimeSeconds: number
}

export interface AdminUser {
  id: number
  email: string
  name: string | null
  is_admin: number
  disabled: number
  created_at: string
  org_count: number
  project_count: number
}

export interface AdminOrg {
  id: string
  name: string
  created_at: string
  member_count: number
  project_count: number
}

export async function fetchAdminStats(): Promise<AdminStats> {
  return await useApi()<AdminStats>('/admin/stats')
}

export async function fetchAdminUsers(query?: string): Promise<AdminUser[]> {
  const res = await useApi()<{ users: AdminUser[] }>('/admin/users', { query: query ? { q: query } : undefined })
  return res.users
}

export async function patchAdminUser(
  id: number,
  body: { disabled?: boolean; isAdmin?: boolean },
): Promise<AdminUser> {
  const res = await useApi()<{ user: AdminUser }>(`/admin/users/${id}`, { method: 'PATCH', body })
  return res.user
}

export async function deleteAdminUser(id: number): Promise<void> {
  await useApi()(`/admin/users/${id}`, { method: 'DELETE' })
}

export async function fetchAdminOrgs(): Promise<AdminOrg[]> {
  const res = await useApi()<{ organizations: AdminOrg[] }>('/admin/orgs')
  return res.organizations
}

export async function updateMaintenance(enabled: boolean, message: string | null): Promise<AdminStats['maintenance']> {
  const res = await useApi()<{ maintenance: AdminStats['maintenance'] }>('/admin/maintenance', {
    method: 'PUT',
    body: { enabled, message },
  })
  return res.maintenance
}
