import type { Ref } from 'vue'

export interface SelectionQuote {
  x: number
  y: number
  text: string
}

/** Floating "Quote in reply": when text inside `containerRef` is selected, a
 *  button position appears above it; `attach` moves the snippet into `quote`
 *  (the composer chip). Owns its own selectionchange listener. */
export function useQuoteSelection(containerRef: Ref<HTMLElement | null>, quote: Ref<string | null>) {
  const selectionQuote = ref<SelectionQuote | null>(null)

  function onSelectionChange() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) selectionQuote.value = null
  }

  function onMouseUp() {
    // Let the browser finalize the selection before reading it.
    requestAnimationFrame(() => {
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''
      if (!selection || selection.rangeCount === 0 || text.length < 3) return
      const range = selection.getRangeAt(0)
      if (!containerRef.value?.contains(range.commonAncestorContainer)) return
      const rect = range.getBoundingClientRect()
      selectionQuote.value = { x: rect.left + rect.width / 2, y: rect.top, text: text.slice(0, 1000) }
    })
  }

  function attach() {
    quote.value = selectionQuote.value?.text ?? null
    selectionQuote.value = null
    window.getSelection()?.removeAllRanges()
  }

  onMounted(() => document.addEventListener('selectionchange', onSelectionChange))
  onBeforeUnmount(() => document.removeEventListener('selectionchange', onSelectionChange))

  return { selectionQuote, onMouseUp, attach }
}
