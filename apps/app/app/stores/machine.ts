export type MachineStatus = 'provisioning' | 'ready' | 'error' | 'offline'

export interface Machine {
  id: string
  name: string
  upstreamUrl: string
  status: MachineStatus
  createdAt: string
  updatedAt: string
}

/** The signed-in user's own OpenCode machine — the thing Customize configures
 *  and every project session runs on (docs/ARCHITECTURE.md). */
export const useMachineStore = defineStore('machine', () => {
  const machine = ref<Machine | null>(null)
  const loading = ref(false)
  const api = useApi()

  let inflight: Promise<void> | null = null

  function load(force = false): Promise<void> {
    if (machine.value && !force) return Promise.resolve()
    if (inflight) return inflight
    loading.value = true
    inflight = (async () => {
      try {
        const res = await api<{ machine: Machine }>('/machines/me')
        machine.value = res.machine
      } finally {
        loading.value = false
        inflight = null
      }
    })()
    return inflight
  }

  async function update(fields: { name?: string; upstreamUrl?: string }): Promise<void> {
    const res = await api<{ machine: Machine }>('/machines/me', { method: 'PATCH', body: fields })
    machine.value = res.machine
  }

  /** Ping the machine's OpenCode server and refresh the stored status. */
  async function checkStatus(): Promise<boolean> {
    const res = await api<{ machine: Machine; reachable: boolean }>('/machines/me/status')
    machine.value = res.machine
    return res.reachable
  }

  function reset() {
    machine.value = null
    loading.value = false
    inflight = null
  }

  return { machine, loading, load, update, checkStatus, reset }
})
