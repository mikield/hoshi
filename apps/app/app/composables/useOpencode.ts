export const OPENCODE_MODEL = { providerID: 'github-copilot', modelID: 'claude-sonnet-4.6' }
export const OPENCODE_CONNECT_ERROR =
  "Couldn't reach the OpenCode server — make sure the Hoshi API and `opencode serve` are running."

/** OpenCode endpoint on the Hoshi API server — every request goes through the
 *  authenticated proxy, never to the OpenCode upstream directly. */
export function opencodeUrl(path = ''): string {
  return apiUrl(`/opencode${path}`)
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
  return factory({ baseUrl, credentials: 'include' })
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

/** Long-lived /event subscription. Delivers every event to `onEvent` and
 *  resubscribes on dropped connections until the signal aborts. */
export async function streamEvents(
  client: OpencodeClient,
  onEvent: (event: OpencodeEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  while (!signal.aborted) {
    try {
      const { stream } = await client.event.subscribe({ signal })
      for await (const event of stream) {
        onEvent(event as OpencodeEvent)
      }
    } catch {
      /* dropped connection — resubscribe below */
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
  const res = await fetch(opencodeUrl('/skill'), { credentials: 'include' })
  if (!res.ok) throw new Error(`GET /skill failed: ${res.status}`)
  const skills = (await res.json()) as Array<{ name: string; description?: string }>
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
export async function fetchGlobalConfig(): Promise<Record<string, any>> {
  const res = await fetch(opencodeUrl('/global/config'), { credentials: 'include' })
  if (!res.ok) throw new Error(`GET /global/config failed: ${res.status}`)
  return res.json()
}

/** Merge a partial config into the machine's global config (persists on the
 *  machine and takes effect immediately). Note: merge-only — the OpenCode API
 *  has no key deletion, so "remove" is expressed as `disable` where supported. */
export async function patchGlobalConfig(patch: Record<string, unknown>): Promise<void> {
  const res = await fetch(opencodeUrl('/global/config'), {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error(`PATCH /global/config failed: ${res.status}`)
}

/** Configured MCP servers with their connection status. */
export async function fetchMcpServers(): Promise<McpServerInfo[]> {
  const res = await fetch(opencodeUrl('/mcp'), { credentials: 'include' })
  if (!res.ok) throw new Error(`GET /mcp failed: ${res.status}`)
  const servers = (await res.json()) as Record<string, { status: string }>
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
  const latest = [...messages]
    .reverse()
    .find((m) => m.info.role === 'assistant' && m.info.tokens && tokensInWindow(m.info.tokens) > 0)
  if (!latest) return null
  const used = tokensInWindow(latest.info.tokens!)
  const model = models.find(
    (m) => m.providerID === latest.info.providerID && m.modelID === latest.info.modelID,
  )
  if (!model?.contextLimit) return null
  return { used, limit: model.contextLimit }
}

/** SDK calls return either the payload directly or `{ data }` — normalize both. */
export function unwrap<T>(res: unknown): T {
  return ((res as { data?: T })?.data ?? res) as T
}
