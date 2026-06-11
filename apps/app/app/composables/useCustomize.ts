export type CustomizeSection =
  | 'agents'
  | 'skills'
  | 'commands'
  | 'connectors'
  | 'secrets'
  | 'channels'
  | 'schedules'
  | 'webhooks'
  | 'changes'
  | 'files'
  | 'machine'
  | 'dev'
  | 'members'
  | 'settings'

/** Shared open-state for the full-screen Customize overlay — the surface that
 *  configures the user's machine (agents, skills, commands, connectors, …). */
export function useCustomize() {
  const open = useState('customize:open', () => false)
  const section = useState<CustomizeSection>('customize:section', () => 'agents')
  return {
    open,
    section,
    show: (target?: CustomizeSection) => {
      if (target) section.value = target
      open.value = true
    },
  }
}
