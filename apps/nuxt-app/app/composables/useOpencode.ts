export const OPENCODE_SERVER_URL = 'http://localhost:4096'
export const OPENCODE_MODEL = { providerID: 'anthropic', modelID: 'claude-3-5-sonnet-20241022' }
export const OPENCODE_CONNECT_ERROR = `Couldn't reach the OpenCode server at ${OPENCODE_SERVER_URL} — make sure \`opencode serve\` is running.`

export type SessionInfo = { id: string; title?: string }
export type Part = { type: string; text?: string }
export type ChatMessage = { info: { id: string; role: 'user' | 'assistant' }; parts: Part[] }
export type OpencodeClient = Awaited<ReturnType<typeof createOpencodeClient>>

/** Lazily create the OpenCode SDK client (browser-only — imported dynamically to keep SSR clean). */
export async function createOpencodeClient(): Promise<any> {
  const { createOpencodeClient: factory } = await import('@opencode-ai/sdk/client')
  return factory({ baseUrl: OPENCODE_SERVER_URL })
}

export function partsText(parts: Part[]): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('\n')
}

/** SDK calls return either the payload directly or `{ data }` — normalize both. */
export function unwrap<T>(res: unknown): T {
  return ((res as { data?: T })?.data ?? res) as T
}
