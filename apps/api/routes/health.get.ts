import { getMaintenance } from '../utils/admin'

/** Liveness + maintenance status — exempt from the maintenance gate, so the
 *  client's maintenance overlay can poll it to know when to come back. */
export default defineEventHandler(() => ({ ok: true, maintenance: getMaintenance() }))
