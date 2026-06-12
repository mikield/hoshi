import type { Ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  unwrap,
  partsText,
  turnItems,
  fetchSessionStatuses,
  fetchQuestions,
  replyQuestion,
  rejectQuestion,
  filePartsFrom,
  OPENCODE_MODEL,
  OPENCODE_CONNECT_ERROR,
  type OpencodeClient,
  type OpencodeEvent,
  type QuestionRequest,
  type SessionInfo,
  type SessionStatus,
  type ChatMessage,
  type Part,
  type OutgoingFile,
} from '~/composables/useOpencode'
import { registerProjectSession } from '~/composables/useProjects'

/** The message thread of the open session: history loading (with revert
 *  marker), live event application, optimistic dispatch, fork/rewind, and the
 *  busy/activity readouts. The page feeds `applyEvent` from its event stream
 *  and renders the computed `turns`. */
export function useSessionThread(
  client: () => OpencodeClient | null,
  projectId: Ref<string>,
  sessionId: Ref<string>,
) {
  const messages = ref<ChatMessage[]>([])
  const loadingMessages = ref(true)
  const sending = ref(false)
  /** Server-reported session activity (session.status / session.idle events). */
  const sessionBusy = ref(false)
  /** Human-readable detail of the retry/backoff state, when the server reports one. */
  const statusDetail = ref<string | null>(null)
  const connectError = ref<string | null>(null)
  const busy = computed(() => sending.value || sessionBusy.value)

  const sessionsStore = useSessionsStore()
  const { sessions } = storeToRefs(sessionsStore)
  const { selectedModel, selectedAgent } = storeToRefs(useChatStore())

  const promptModel = computed(() => {
    const [providerID, ...rest] = (selectedModel.value ?? '').split('/')
    return providerID && rest.length ? { providerID, modelID: rest.join('/') } : OPENCODE_MODEL
  })

  /** Group the flat message list into turns: one user message + the assistant
   *  messages that follow it (mirrors suna's turn-based renderer). */
  const turns = computed(() => {
    const out: { user: ChatMessage | null; assistant: ChatMessage[] }[] = []
    for (const m of messages.value) {
      if (m.info.role === 'user') {
        out.push({ user: m, assistant: [] })
      } else {
        if (out.length === 0) out.push({ user: null, assistant: [] })
        out[out.length - 1]!.assistant.push(m)
      }
    }
    return out.filter((t) => (t.user && partsText(t.user.parts)) || turnItems(t.assistant).length > 0)
  })

  /** One minimap entry per user message — the history anchors on the right rail. */
  const minimapItems = computed(() =>
    turns.value
      .filter((turn) => turn.user && partsText(turn.user.parts).trim())
      .map((turn) => ({ id: turn.user!.info.id, text: partsText(turn.user!.parts).trim() })),
  )

  /** What the agent is doing right now — the last still-running tool call. The
   *  generic thinking animation is the fallback when nothing concrete is known. */
  const activity = computed(() => {
    if (statusDetail.value) return statusDetail.value
    for (let m = messages.value.length - 1; m >= 0; m--) {
      const message = messages.value[m]!
      if (message.info.role !== 'assistant') continue
      for (let p = message.parts.length - 1; p >= 0; p--) {
        const part = message.parts[p]!
        if (part.type !== 'tool') continue
        const status = part.state?.status
        if (status === 'running' || status === 'pending') {
          const detail = part.state?.title
          return detail ? `${part.tool} · ${detail}` : part.tool ?? null
        }
      }
      break
    }
    return null
  })

  // ── History ────────────────────────────────────────────────────────────────

  async function loadMessages(id: string) {
    loadingMessages.value = messages.value.length === 0
    try {
      const [res, info] = await Promise.all([
        client()!.session.messages({ path: { id } }),
        client()!.session.get({ path: { id } }),
      ])
      let list = unwrap<ChatMessage[]>(res)
      if (!Array.isArray(list)) throw new Error('Session not found')
      // A revert marker hides everything from that message on (until unrevert).
      const revertID = unwrap<SessionInfo & { revert?: { messageID: string } }>(info)?.revert?.messageID
      if (revertID) {
        const cut = list.findIndex((m) => m.info.id === revertID)
        if (cut !== -1) list = list.slice(0, cut)
      }
      // Queued prompts may not be persisted until their turn starts — keep
      // optimistic locals visible unless the server already has their text.
      // (Text equality is a heuristic; it can drop a deliberately repeated
      // queued prompt from view, but the server still runs it.)
      const serverTexts = new Set(list.filter((m) => m.info.role === 'user').map((m) => partsText(m.parts)))
      const locals = messages.value.filter(
        (m) => m.info.id.startsWith('local-') && !serverTexts.has(partsText(m.parts)),
      )
      messages.value = [...list, ...locals]
      contentVersion.value++
      syncSelectorsToSession(list)
    } catch {
      messages.value = []
      // A dead or foreign session link lands on the project home, like Suna.
      if (!sessions.value.some((s) => s.id === id)) await navigateTo(`/projects/${projectId.value}`)
    } finally {
      loadingMessages.value = false
    }
  }

  /** A session is bound to one agent/model — reflect what it actually ran with. */
  function syncSelectorsToSession(list: ChatMessage[]) {
    const latest = [...list].reverse().find((m) => m.info.role === 'assistant')
    if (!latest) return
    if (latest.info.providerID && latest.info.modelID) {
      selectedModel.value = `${latest.info.providerID}/${latest.info.modelID}`
    }
    if (latest.info.agent) selectedAgent.value = latest.info.agent
  }

  /** Replay the session's live state on open: if the agent is still mid-turn
   *  (thinking, running tools), the UI shows it immediately — the message
   *  history holds the in-flight parts, the status map holds busy/retry, and
   *  a question the agent is waiting on comes back as the pending prompt. */
  async function replayStatus(id: string) {
    try {
      const statuses = await fetchSessionStatuses(client()!)
      const status = statuses[id]
      sessionBusy.value = !!status && status.type !== 'idle'
      statusDetail.value = status?.type === 'retry' ? status.message : null
    } catch {
      /* status is best-effort — events keep it current from here */
    }
    try {
      pendingQuestion.value = (await fetchQuestions()).find((q) => q.sessionID === id) ?? null
    } catch {
      /* question replay is best-effort — the question.asked event still lands */
    }
  }

  /** Clear per-session state before swapping to another thread — including
   *  messages, so optimistic locals can never leak into the next session. */
  function resetForSession() {
    messages.value = []
    sessionBusy.value = false
    statusDetail.value = null
    pendingQuestion.value = null
  }

  // ── Questions — the agent waiting on the user ────────────────────────────────

  const pendingQuestion = ref<QuestionRequest | null>(null)

  async function answerQuestion(requestID: string, answers: string[][]) {
    try {
      await replyQuestion(requestID, answers)
      pendingQuestion.value = null
    } catch {
      toast.error('Failed to send the answer')
    }
  }

  async function dismissQuestion(requestID: string) {
    try {
      await rejectQuestion(requestID)
      pendingQuestion.value = null
    } catch {
      toast.error('Failed to dismiss the question')
    }
  }

  // ── Live events ────────────────────────────────────────────────────────────

  /** Bumped whenever the open thread's content grows — the page watches this
   *  (instead of a deep watch over all messages) to drive auto-scroll. */
  const contentVersion = ref(0)

  function applyEvent(event: OpencodeEvent) {
    const props = event.properties
    switch (event.type) {
      case 'server.connected':
        // First event of every (re)subscription. Anything emitted while the
        // stream was down is gone — reload the snapshot to close the gap.
        void loadMessages(sessionId.value)
        void replayStatus(sessionId.value)
        break
      case 'message.updated':
        if (props.info?.sessionID === sessionId.value) contentVersion.value++
        upsertMessageInfo(props.info as ChatMessage['info'])
        break
      case 'message.removed':
        if (props.sessionID === sessionId.value) {
          messages.value = messages.value.filter((m) => m.info.id !== props.messageID)
        }
        break
      case 'message.part.updated':
        if (props.part?.sessionID === sessionId.value) contentVersion.value++
        upsertPart(props.part as Part)
        break
      case 'message.part.removed':
        if (props.sessionID === sessionId.value) {
          const message = messages.value.find((m) => m.info.id === props.messageID)
          if (message) message.parts = message.parts.filter((p) => p.id !== props.partID)
        }
        break
      case 'session.status':
        if (props.sessionID === sessionId.value) {
          const status = props.status as SessionStatus
          sessionBusy.value = status.type !== 'idle'
          statusDetail.value = status.type === 'retry' ? status.message : null
        }
        break
      case 'session.idle':
        if (props.sessionID === sessionId.value) {
          sessionBusy.value = false
          statusDetail.value = null
          // Reconcile once the turn settles — catches anything events missed.
          void loadMessages(sessionId.value)
        }
        break
      case 'session.error':
        if (!props.sessionID || props.sessionID === sessionId.value) {
          const error = props.error as { name?: string; data?: { message?: string } } | undefined
          toast.error(error?.data?.message ?? error?.name ?? 'The session hit an error.')
          sessionBusy.value = false
        }
        break
      case 'question.asked':
        if (props.sessionID === sessionId.value) {
          pendingQuestion.value = event.properties as unknown as QuestionRequest
        }
        break
      case 'question.replied':
      case 'question.rejected':
        // Answered elsewhere (another tab, the TUI) — drop the stale prompt.
        if (props.sessionID === sessionId.value || props.requestID === pendingQuestion.value?.id) {
          pendingQuestion.value = null
        }
        break
    }
  }

  /** Events nearly always target the newest message — check it first so the
   *  per-token hot path stays O(1) instead of scanning the whole thread. */
  function findMessage(id: string): ChatMessage | undefined {
    const last = messages.value[messages.value.length - 1]
    if (last?.info.id === id) return last
    return messages.value.find((m) => m.info.id === id)
  }

  /** Apply a message.updated event: refresh info in place, or insert the new
   *  message. A confirmed user message takes the SLOT of the oldest optimistic
   *  local — replacing in place keeps queued sends in their real order. */
  function upsertMessageInfo(info: ChatMessage['info']) {
    if (info.sessionID !== sessionId.value) return
    const existing = findMessage(info.id)
    if (existing) {
      existing.info = info
      return
    }
    const next = [...messages.value]
    if (info.role === 'user') {
      const localIndex = next.findIndex((m) => m.info.id.startsWith('local-'))
      if (localIndex !== -1) {
        next.splice(localIndex, 1, { info, parts: [] })
        messages.value = next
        return
      }
    }
    next.push({ info, parts: [] })
    messages.value = next
  }

  /** Apply a message.part.updated event: replace the part by id, or append —
   *  events arrive in creation order, so append preserves part order. */
  function upsertPart(part: Part) {
    if (part.sessionID !== sessionId.value || !part.messageID) return
    const message = findMessage(part.messageID)
    if (!message) return
    const index = message.parts.findIndex((p) => p.id === part.id)
    if (index === -1) message.parts.push(part)
    else message.parts[index] = part
  }

  // ── Dispatch ───────────────────────────────────────────────────────────────

  /** Monotonic suffix for optimistic ids — Date.now() collides on same-ms sends. */
  let localSeq = 0

  /** Shared dispatch: optimistic user message, then a fire-and-forget call. The
   *  reply streams in through applyEvent; the session.idle event reconciles.
   *  Sending while busy is fine — the server queues it for the next turn. */
  async function dispatch(optimisticParts: ChatMessage['parts'], call: () => Promise<unknown>) {
    const localId = `local-${++localSeq}`
    sending.value = true
    sessionBusy.value = true
    messages.value = [...messages.value, { info: { id: localId, role: 'user' }, parts: optimisticParts }]
    try {
      await call()
    } catch {
      // The send never reached the server — a stuck bubble would lie.
      messages.value = messages.value.filter((m) => m.info.id !== localId)
      connectError.value = OPENCODE_CONNECT_ERROR
      sessionBusy.value = false
    } finally {
      sending.value = false
    }
  }

  /** Abort the running turn — queued prompts stay queued on the server. */
  async function stop() {
    try {
      await client()!.session.abort({ path: { id: sessionId.value } })
    } catch {
      toast.error('Failed to stop the agent')
    }
  }

  async function send(text: string, files: OutgoingFile[]) {
    // A pending question consumes the next send — every entry point (text,
    // attachments, any caller) goes through this one gate.
    if (pendingQuestion.value) {
      const [question] = pendingQuestion.value.questions
      if (files.length > 0) {
        toast.error('Answer the question first — attachments can come after.')
        return
      }
      if (pendingQuestion.value.questions.length > 1 || question?.multiple) {
        toast.error('Use the options above to answer.')
        return
      }
      if (question?.custom === false) {
        toast.error('Pick one of the options above.')
        return
      }
      await answerQuestion(pendingQuestion.value.id, [[text]])
      return
    }

    const parts = [...filePartsFrom(files), ...(text ? [{ type: 'text', text }] : [])]
    // promptAsync returns as soon as the server accepts — streaming does the rest.
    await dispatch(parts, () =>
      client()!.session.promptAsync({
        path: { id: sessionId.value },
        body: {
          model: promptModel.value,
          ...(selectedAgent.value ? { agent: selectedAgent.value } : {}),
          parts,
        },
      }),
    )
  }

  async function runCommand(name: string, args: string) {
    // Commands execute immediately — unlike prompts they do not queue, so
    // firing one mid-turn would interleave with the running work.
    if (busy.value) {
      toast.error('Wait for the current turn to finish before running a command.')
      return
    }
    await dispatch([{ type: 'text', text: `/${name}${args ? ` ${args}` : ''}` }], () =>
      client()!.session.command({
        path: { id: sessionId.value },
        body: {
          command: name,
          arguments: args,
          model: `${promptModel.value.providerID}/${promptModel.value.modelID}`,
          ...(selectedAgent.value ? { agent: selectedAgent.value } : {}),
        },
      }),
    )
  }

  // ── History actions ────────────────────────────────────────────────────────

  /** Roll the session back to the state before a user message — undoable. */
  async function rewindTo(messageID: string) {
    try {
      await client()!.session.revert({ path: { id: sessionId.value }, body: { messageID } })
      await loadMessages(sessionId.value)
      toast('Session rewound', {
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              await client()!.session.unrevert({ path: { id: sessionId.value } })
              await loadMessages(sessionId.value)
            } catch {
              toast.error('Failed to undo the rewind')
            }
          },
        },
      })
    } catch {
      toast.error('Failed to rewind the session')
    }
  }

  /** Branch a new session that keeps history through this turn. The server
   *  copies everything *before* the anchor, so anchor at the next user message —
   *  or copy everything when forking from the latest turn. */
  async function forkFrom(messageID: string) {
    const index = messages.value.findIndex((m) => m.info.id === messageID)
    const nextUser = index === -1
      ? undefined
      : messages.value.slice(index + 1).find((m) => m.info.role === 'user')
    try {
      const forked = unwrap<SessionInfo>(
        await client()!.session.fork({
          path: { id: sessionId.value },
          body: nextUser ? { messageID: nextUser.info.id } : {},
        }),
      )
      await registerProjectSession(projectId.value, forked.id)
      sessionsStore.add(forked)
      toast.success('Forked into a new session')
      await navigateTo(`/projects/${projectId.value}/sessions/${forked.id}`)
    } catch {
      toast.error('Failed to fork the session')
    }
  }

  return {
    messages,
    loadingMessages,
    busy,
    connectError,
    turns,
    minimapItems,
    activity,
    pendingQuestion,
    contentVersion,
    loadMessages,
    replayStatus,
    resetForSession,
    applyEvent,
    send,
    runCommand,
    stop,
    rewindTo,
    forkFrom,
    answerQuestion,
    dismissQuestion,
  }
}
