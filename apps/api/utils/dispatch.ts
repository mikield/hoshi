import { addProjectSession, touchProject } from './db'
import { ensureMachine } from './machines'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/** Fire a prompt into a fresh session on the user's machine — the shared
 *  delivery path for schedules and inbound webhooks. Returns the session id. */
export async function dispatchPrompt(
  userId: number,
  title: string,
  prompt: string,
  projectId: string | null,
): Promise<string> {
  const upstream = ensureMachine(userId).upstream_url

  const createRes = await fetch(`${upstream}/session`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ title }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!createRes.ok) throw new Error(`Machine refused session create (${createRes.status}).`)
  const created = (await createRes.json()) as { id: string }

  if (projectId) {
    addProjectSession(projectId, created.id)
    touchProject(projectId)
  }

  const promptRes = await fetch(`${upstream}/session/${created.id}/prompt_async`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ parts: [{ type: 'text', text: prompt }] }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!promptRes.ok) throw new Error(`Machine refused the prompt (${promptRes.status}).`)

  return created.id
}
