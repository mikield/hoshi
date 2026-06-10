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
  | 'sandbox'
  | 'dev'
  | 'members'
  | 'settings'

/** Shared open-state for the full-screen Customize overlay — the instance
 *  configuration surface (agents, skills, commands, connectors, …). */
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
