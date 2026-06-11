import { requireAuth } from '../../../utils/auth'
import { updateMachine } from '../../../utils/db'
import { ensureMachine, machineToApi, probeMachine } from '../../../utils/machines'

/** Live reachability check — also keeps the stored status honest. */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const machine = ensureMachine(session.userId)
  const reachable = await probeMachine(machine)
  const status = reachable ? 'ready' : 'offline'
  const updated = status === machine.status ? machine : updateMachine(session.userId, { status })!
  return { machine: machineToApi(updated), reachable }
})
