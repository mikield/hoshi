import type { H3Event } from 'h3'
import { readBody } from 'h3'

/** readBody that never explodes: an empty or malformed JSON body becomes {},
 *  so route validation returns its intended 400 instead of a destructure 500. */
export async function readJsonBody<T extends object>(event: H3Event): Promise<Partial<T>> {
  const body = await readBody<T>(event).catch(() => null)
  return (body && typeof body === 'object' ? body : {}) as Partial<T>
}
