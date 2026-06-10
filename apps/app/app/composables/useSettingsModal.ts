/** Shared open-state for the user settings modal — any menu can open it,
 *  the single instance lives in app.vue. */
export function useSettingsModal() {
  const open = useState('settings-modal:open', () => false)
  return {
    open,
    show: () => (open.value = true),
  }
}
