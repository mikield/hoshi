import { toast } from 'vue-sonner'

/** Copy-to-clipboard with the transient "Copied!" state every copy button
 *  needs. `copied` holds the key of the last copy for `duration` ms — pass
 *  distinct keys when one component has several copy targets. */
export function useCopyFeedback(duration = 1500) {
  const copied = ref<string | null>(null)

  async function copy(text: string, key = 'default'): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      toast.error('Clipboard unavailable')
      return false
    }
    copied.value = key
    setTimeout(() => {
      if (copied.value === key) copied.value = null
    }, duration)
    return true
  }

  return { copied, copy }
}
