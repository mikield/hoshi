/** Composer preferences shared across the project home and session pages. */
export const useChatStore = defineStore('chat', () => {
  /** "providerID/modelID" key of the active model. */
  const selectedModel = ref<string | null>(null)
  const selectedAgent = ref<string | null>(null)

  function reset() {
    selectedModel.value = null
    selectedAgent.value = null
  }

  return { selectedModel, selectedAgent, reset }
})
