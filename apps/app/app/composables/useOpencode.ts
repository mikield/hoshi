export const OPENCODE_SERVER_URL = 'http://localhost:4096'
export const OPENCODE_MODEL = { providerID: 'github-copilot', modelID: 'claude-sonnet-4.6' }
export const OPENCODE_CONNECT_ERROR = `Couldn't reach the OpenCode server at ${OPENCODE_SERVER_URL} — make sure \`opencode serve\` is running.`

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
    summary?: boolean
    providerID?: string
    modelID?: string
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
  const { createOpencodeClient: factory } = await import('@opencode-ai/sdk/client')
  return factory({ baseUrl: OPENCODE_SERVER_URL })
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

type ProviderModel = { id: string; name?: string; limit?: { context?: number } }
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
  const res = await fetch(`${OPENCODE_SERVER_URL}/skill`)
  if (!res.ok) throw new Error(`GET /skill failed: ${res.status}`)
  const skills = (await res.json()) as Array<{ name: string; description?: string }>
  return skills.map(({ name, description }) => ({ name, description }))
}

/** Configured MCP servers with their connection status. */
export async function fetchMcpServers(): Promise<McpServerInfo[]> {
  const res = await fetch(`${OPENCODE_SERVER_URL}/mcp`)
  if (!res.ok) throw new Error(`GET /mcp failed: ${res.status}`)
  const servers = (await res.json()) as Record<string, { status: string }>
  return Object.entries(servers).map(([name, info]) => ({ name, status: info.status }))
}

/** Context-window usage: tokens held by the newest assistant message vs the
 *  active model's limit. Returns null until both sides are known. */
export function contextUsage(
  messages: ChatMessage[],
  models: ModelOption[],
): { used: number; limit: number } | null {
  const latest = [...messages].reverse().find((m) => m.info.role === 'assistant' && m.info.tokens?.total)
  if (!latest) return null
  const tokens = latest.info.tokens!
  const used = tokens.total ?? 0
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
