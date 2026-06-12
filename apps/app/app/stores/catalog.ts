import {
  createOpencodeClient,
  fetchModels,
  fetchAgents,
  fetchCommands,
  OPENCODE_MODEL,
  type ModelOption,
  type AgentOption,
  type CommandOption,
} from '~/composables/useOpencode'

/** Server-global selector data (models, agents, commands) shared by every
 *  composer surface — loaded once, tolerates failure (composers degrade to
 *  plain inputs). Also seeds the chat store's default model/agent. */
export const useCatalogStore = defineStore('catalog', () => {
  const models = ref<ModelOption[]>([])
  const agents = ref<AgentOption[]>([])
  const commands = ref<CommandOption[]>([])
  const loading = ref(true)

  let inflight: Promise<void> | null = null
  let loaded = false

  function load(): Promise<void> {
    if (loaded) return Promise.resolve()
    if (inflight) return inflight
    inflight = (async () => {
      try {
        const client = await createOpencodeClient()
        ;[models.value, agents.value, commands.value] = await Promise.all([
          fetchModels(client),
          fetchAgents(client),
          fetchCommands(client),
        ])
        seedDefaults()
        loaded = true
      } catch {
        /* composer degrades to plain input */
      } finally {
        loading.value = false
        inflight = null
      }
    })()
    return inflight
  }

  /** Pin defaults so the pills always show what prompts will actually use:
   *  the configured model if this server has it (else the first), first agent. */
  function seedDefaults() {
    const { selectedModel, selectedAgent } = storeToRefs(useChatStore())
    if (!selectedModel.value && models.value.length > 0) {
      const fallback = `${OPENCODE_MODEL.providerID}/${OPENCODE_MODEL.modelID}`
      const exists = models.value.some((m) => `${m.providerID}/${m.modelID}` === fallback)
      const first = models.value[0]!
      selectedModel.value = exists ? fallback : `${first.providerID}/${first.modelID}`
    }
    if (!selectedAgent.value && agents.value.length > 0) {
      selectedAgent.value = agents.value[0]!.name
    }
  }

  function reset() {
    models.value = []
    agents.value = []
    commands.value = []
    loading.value = true
    inflight = null
    loaded = false
  }

  return { models, agents, commands, loading, load, reset }
})
