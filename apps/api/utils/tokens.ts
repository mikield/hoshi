import type { ApiTokenRow } from '../db/tokens'

/** Wire shape for personal access tokens — never includes the hash. */
export function tokenToApi(token: ApiTokenRow) {
  return {
    id: token.id,
    name: token.name,
    prefix: token.prefix,
    lastUsedAt: token.last_used_at,
    createdAt: token.created_at,
  }
}
