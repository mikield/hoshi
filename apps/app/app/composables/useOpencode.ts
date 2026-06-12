export const OPENCODE_MODEL = { providerID: 'github-copilot', modelID: 'claude-sonnet-4.6' }
export const OPENCODE_CONNECT_ERROR =
  "Couldn't reach the OpenCode server — make sure the Hoshi API and `opencode serve` are running."

/** OpenCode endpoint on the Hoshi API server — every request goes through the
 *  authenticated proxy, never to the OpenCode upstream directly. */
export function opencodeUrl(path = ''): string {
  return apiUrl(`/opencode${path}`)
}

/** Transport for every OpenCode call (SDK and plain): credentialed, and a 503
 *  raises the maintenance overlay — the proxy 503s during maintenance, and
 *  without this hook the most-used surface would never show the screen. */
export function opencodeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, { credentials: 'include', ...init }).then((res) => {
    if (res.status === 503) useMaintenanceStore().raise()
    return res
  })
}

/** JSON request against the OpenCode proxy — shared by every non-SDK helper. */
async function ocJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await opencodeFetch(opencodeUrl(path), init)
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`)
  // Some endpoints (reply/reject) answer with an empty body.
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export type SessionInfo = {
  id: string
  title?: string
  parentID?: string
  time?: { created?: number; updated?: number }
}

export type ToolState = {
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: Record<string, unknown>
  output?: string
  title?: string
}

export type Part = {
  type: string
  text?: string
  callID?: string
  tool?: string
  state?: ToolState
  // file parts
  mime?: string
  filename?: string
  url?: string
  // present on streamed parts (message.part.updated events)
  id?: string
  messageID?: string
  sessionID?: string
}

export type TokenUsage = {
  total?: number
  input?: number
  output?: number
  reasoning?: number
  cache?: { read?: number; write?: number }
}

export type ChatMessage = {
  info: {
    id: string
    role: 'user' | 'assistant'
    sessionID?: string
    summary?: boolean
    providerID?: string
    modelID?: string
    /** Agent the turn ran under — sessions are effectively bound to one. */
    agent?: string
    tokens?: TokenUsage
  }
  parts: Part[]
}

export type ModelOption = {
  providerID: string
  providerName: string
  modelID: string
  name: string
  contextLimit: number
  /** True when the provider charges nothing for this model. */
  free: boolean
}

export type AgentOption = {
  name: string
  description?: string
}

export type CommandOption = {
  name: string
  description?: string
  /** The prompt template the command expands to (shown in Customize). */
  template?: string
}

export type SkillInfo = {
  name: string
  description?: string
}

export type McpServerInfo = {
  name: string
  status: string
}

/** A file staged in the composer, ready to send as an opencode file part. */
export type OutgoingFile = {
  id: string
  filename: string
  mime: string
  /** data: URL — the opencode server accepts inline payloads. */
  url: string
}

export function filePartsFrom(files: OutgoingFile[]): Part[] {
  return files.map(({ mime, filename, url }) => ({ type: 'file', mime, filename, url }))
}

export type OpencodeClient = Awaited<ReturnType<typeof createOpencodeClient>>

/** Lazily create the OpenCode SDK client (browser-only — imported dynamically to keep SSR clean). */
export async function createOpencodeClient(): Promise<any> {
  // Resolve before the await — runtime config needs the Nuxt context.
  const baseUrl = opencodeUrl()
  const { createOpencodeClient: factory } = await import('@opencode-ai/sdk/client')
  return factory({ baseUrl, credentials: 'include', fetch: opencodeFetch })
}

export function partsText(parts: Part[]): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('\n')
}

/** A turn marks a compaction point when the model summarized prior history. */
export function isCompaction(message: ChatMessage): boolean {
  return message.info.summary === true || message.parts.some((p) => p.type === 'compaction')
}

/** Ordered renderable content of an assistant turn. Consecutive reasoning
 *  parts fold into one thinking item; consecutive tool calls fold into one
 *  tools item (a text part breaks the run). */
export type TurnItem =
  | { kind: 'thinking'; key: string; text: string }
  | { kind: 'tools'; key: string; parts: Part[] }
  | { kind: 'text'; key: string; text: string }

export function turnItems(messages: ChatMessage[]): TurnItem[] {
  const items: TurnItem[] = []
  const last = () => items[items.length - 1]

  for (const message of messages) {
    for (const [index, part] of message.parts.entries()) {
      const key = `${message.info.id}:${index}`
      if (part.type === 'reasoning' && part.text?.trim()) {
        const tail = last()
        if (tail?.kind === 'thinking') tail.text += `\n\n${part.text}`
        else items.push({ kind: 'thinking', key, text: part.text })
      } else if (part.type === 'tool') {
        const tail = last()
        if (tail?.kind === 'tools') tail.parts.push(part)
        else items.push({ kind: 'tools', key, parts: [part] })
      } else if (part.type === 'text' && part.text?.trim()) {
        items.push({ kind: 'text', key, text: part.text })
      }
    }
  }
  return items
}

export type FileNode = {
  name: string
  path: string
  absolute: string
  type: 'file' | 'directory'
  ignored: boolean
}

export type FileContent = {
  type: 'text' | 'binary'
  content: string
  encoding?: 'base64'
  mimeType?: string
}

export type FileStatusEntry = {
  path: string
  added: number
  removed: number
  status: 'added' | 'deleted' | 'modified'
}

/** Direct children of a directory in the OpenCode workspace. */
export async function fetchFileTree(client: OpencodeClient, path: string): Promise<FileNode[]> {
  return unwrap<FileNode[]>(await client.file.list({ query: { path } }))
}

export async function readFile(client: OpencodeClient, path: string): Promise<FileContent> {
  return unwrap<FileContent>(await client.file.read({ query: { path } }))
}

/** Files changed since the last git commit (the workspace's working tree). */
export async function fetchFileStatus(client: OpencodeClient): Promise<FileStatusEntry[]> {
  return unwrap<FileStatusEntry[]>(await client.file.status())
}

/** Server-sent event from /event — discriminated by `type`, payload in `properties`. */
export type OpencodeEvent = { type: string; properties: Record<string, any> }

export type SessionStatus = { type: 'idle' } | { type: 'busy' } | { type: 'retry'; attempt: number; message: string; next: number }

/** Live status of every session on the server — the replay source when a
 *  session page opens while the agent is still mid-turn. */
export async function fetchSessionStatuses(client: OpencodeClient): Promise<Record<string, SessionStatus>> {
  return unwrap<Record<string, SessionStatus>>(await client.session.status())
}

/** The server heartbeats every ~10s — three missed beats means the proxied
 *  connection died silently (upstream gone, client socket still open). */
const STREAM_WATCHDOG_MS = 30_000

/** Long-lived /event subscription over plain fetch — the SDK's subscribe
 *  iterator proved unreliable through the proxy, so the SSE framing is parsed
 *  by hand. Delivers every event to `onEvent` and resubscribes on dropped
 *  connections until the signal aborts. Two failure modes are handled
 *  deliberately: each attempt's controller is ALWAYS aborted on exit (an
 *  attempt that dies without releasing its socket leaks zombie connections
 *  until the browser's 6-per-origin pool starves), and a heartbeat watchdog
 *  kills attempts that go silent without closing. */
export async function streamEvents(
  url: string,
  onEvent: (event: OpencodeEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  while (!signal.aborted) {
    const attempt = new AbortController()
    const onOuterAbort = () => attempt.abort()
    signal.addEventListener('abort', onOuterAbort)
    let watchdog = setTimeout(() => attempt.abort(), STREAM_WATCHDOG_MS)
    const armWatchdog = () => {
      clearTimeout(watchdog)
      watchdog = setTimeout(() => attempt.abort(), STREAM_WATCHDOG_MS)
    }
    try {
      const res = await opencodeFetch(url, {
        headers: { accept: 'text/event-stream' },
        signal: attempt.signal,
      })
      if (!res.ok || !res.body) throw new Error(`event stream failed: ${res.status}`)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        armWatchdog()
        buffer += decoder.decode(value, { stream: true })
        let frameEnd
        while ((frameEnd = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, frameEnd)
          buffer = buffer.slice(frameEnd + 2)
          for (const line of frame.split('\n')) {
            if (!line.startsWith('data: ')) continue
            try {
              onEvent(JSON.parse(line.slice(6)) as OpencodeEvent)
            } catch {
              /* malformed frame — skip it, keep the stream */
            }
          }
        }
      }
    } catch {
      /* dropped connection — resubscribe below */
    } finally {
      clearTimeout(watchdog)
      attempt.abort()
      signal.removeEventListener('abort', onOuterAbort)
    }
    if (!signal.aborted) await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}

type ProviderModel = {
  id: string
  name?: string
  limit?: { context?: number }
  cost?: { input?: number; output?: number }
}
type ProviderEntry = { id: string; name?: string; models: Record<string, ProviderModel> }

/** All selectable models across providers, flattened from /config/providers. */
export async function fetchModels(client: OpencodeClient): Promise<ModelOption[]> {
  const res = unwrap<{ providers: ProviderEntry[] }>(await client.config.providers())
  return (res.providers ?? []).flatMap((provider) =>
    Object.values(provider.models ?? {}).map((model) => ({
      providerID: provider.id,
      providerName: provider.name ?? provider.id,
      modelID: model.id,
      name: model.name ?? model.id,
      contextLimit: model.limit?.context ?? 0,
      free: (model.cost?.input ?? 0) === 0 && (model.cost?.output ?? 0) === 0,
    })),
  )
}

/** Agents the user can address — primaries only. Subagents are tool-spawned
 *  and `hidden` marks internal system agents (compaction, summary, title, …). */
export async function fetchAgents(client: OpencodeClient): Promise<AgentOption[]> {
  const res = unwrap<Array<{ name: string; description?: string; mode?: string; hidden?: boolean }>>(
    await client.app.agents(),
  )
  return (res ?? [])
    .filter((agent) => agent.mode !== 'subagent' && !agent.hidden)
    .map(({ name, description }) => ({ name, description }))
}

/** Slash commands registered on the server (templates, custom commands, …). */
export async function fetchCommands(client: OpencodeClient): Promise<CommandOption[]> {
  const res = unwrap<Array<{ name: string; description?: string; template?: string }>>(
    await client.command.list(),
  )
  return (res ?? []).map(({ name, description, template }) => ({ name, description, template }))
}

/** Skills installed on the server. Plain fetch — the SDK has no skill namespace. */
export async function fetchSkills(): Promise<SkillInfo[]> {
  const skills = await ocJson<Array<{ name: string; description?: string }>>('/skill')
  return skills.map(({ name, description }) => ({ name, description }))
}

/** Per-agent override stored in the machine's global config. */
export type AgentConfigPatch = {
  description?: string
  prompt?: string
  model?: string
  disable?: boolean
}

/** Command definition stored in the machine's global config. */
export type CommandConfigPatch = {
  template: string
  description?: string
  agent?: string
  model?: string
}

/** The machine's global OpenCode config — the source of truth Customize edits. */
export function fetchGlobalConfig(): Promise<Record<string, any>> {
  return ocJson('/global/config')
}

/** Merge a partial config into the machine's global config (persists on the
 *  machine and takes effect immediately). Note: merge-only — the OpenCode API
 *  has no key deletion, so "remove" is expressed as `disable` where supported. */
export async function patchGlobalConfig(patch: Record<string, unknown>): Promise<void> {
  await ocJson('/global/config', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
}

// ── Questions — the agent asking the user to choose ──────────────────────────

export type QuestionOption = { label: string; description?: string }

export type QuestionInfo = {
  question: string
  header?: string
  options: QuestionOption[]
  /** Allow selecting several options. */
  multiple?: boolean
  /** Allow a free-text answer (defaults to allowed). */
  custom?: boolean
}

export type QuestionRequest = {
  id: string
  sessionID: string
  questions: QuestionInfo[]
  /** The tool call in the thread this question belongs to. */
  tool?: { messageID: string; callID: string }
}

/** All pending question requests on the server — the replay source when a
 *  session opens while the agent is waiting on an answer. */
export function fetchQuestions(): Promise<QuestionRequest[]> {
  return ocJson('/question')
}

/** One answers array per question, each holding the selected labels. */
export async function replyQuestion(requestID: string, answers: string[][]): Promise<void> {
  await ocJson(`/question/${requestID}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
}

export async function rejectQuestion(requestID: string): Promise<void> {
  await ocJson(`/question/${requestID}/reject`, { method: 'POST' })
}

/** Configured MCP servers with their connection status. */
export async function fetchMcpServers(): Promise<McpServerInfo[]> {
  const servers = await ocJson<Record<string, { status: string }>>('/mcp')
  return Object.entries(servers).map(([name, info]) => ({ name, status: info.status }))
}

/** Everything the model held in its window on a turn: prompt (fresh + cached)
 *  plus what it generated. `total` alone undercounts on providers that report
 *  cache reads separately, so sum the parts. */
export function tokensInWindow(tokens: TokenUsage): number {
  const summed =
    (tokens.input ?? 0) +
    (tokens.cache?.read ?? 0) +
    (tokens.cache?.write ?? 0) +
    (tokens.output ?? 0) +
    (tokens.reasoning ?? 0)
  return summed > 0 ? summed : (tokens.total ?? 0)
}

/** Context-window usage: tokens held by the newest assistant message vs the
 *  active model's limit. Returns null until both sides are known. */
export function contextUsage(
  messages: ChatMessage[],
  models: ModelOption[],
): { used: number; limit: number } | null {
  // Backwards loop, no copies — this recomputes on every streamed event.
  for (let i = messages.length - 1; i >= 0; i--) {
    const { info } = messages[i]!
    if (info.role !== 'assistant' || !info.tokens || tokensInWindow(info.tokens) === 0) continue
    const model = models.find((m) => m.providerID === info.providerID && m.modelID === info.modelID)
    return model?.contextLimit ? { used: tokensInWindow(info.tokens), limit: model.contextLimit } : null
  }
  return null
}

/** SDK calls return either the payload directly or `{ data }` — normalize both. */
export function unwrap<T>(res: unknown): T {
  return ((res as { data?: T })?.data ?? res) as T
}
