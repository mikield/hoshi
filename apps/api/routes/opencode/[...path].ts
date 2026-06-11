import { requireAuth } from '../../utils/auth'
import { resolveOpencodeUpstream } from '../../utils/opencode'

/** Authenticated pass-through to the OpenCode server. Streams everything,
 *  including the `/event` SSE feed. The session cookie stays on our side —
 *  OpenCode never sees it. */
export default defineEventHandler(async (event) => {
  const session = await requireAuth(event)
  const upstream = resolveOpencodeUpstream(session)
  const path = event.context.params?.path ?? ''
  const { search } = getRequestURL(event)

  return proxyRequest(event, `${upstream}/${path}${search}`, {
    headers: { cookie: '' },
  })
})
