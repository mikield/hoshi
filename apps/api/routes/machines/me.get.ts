import { requireAuth } from '../../utils/auth'
import { ensureMachine, machineToApi } from '../../utils/machines'

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  return { machine: machineToApi(ensureMachine(session.userId)) }
})
