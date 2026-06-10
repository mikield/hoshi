import type { AgentOption } from '~/composables/useOpencode'

export type ChatSegment = { kind: 'plain' | 'mention' | 'url'; text: string }

const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/g

/** Split chat text into plain / @agent-mention / URL segments so both the
 *  composer highlight overlay and message bubbles style them identically.
 *  Mentions match only known agent names (longest first, so "Plan Builder"
 *  wins over "Plan"). */
export function segmentChatText(text: string, agents: AgentOption[]): ChatSegment[] {
  if (!text) return []

  const names = [...agents].map((a) => a.name).sort((a, b) => b.length - a.length)
  const matches: { start: number; end: number; kind: 'mention' | 'url' }[] = []

  for (const match of text.matchAll(URL_PATTERN)) {
    matches.push({ start: match.index, end: match.index + match[0].length, kind: 'url' })
  }
  for (const name of names) {
    const token = `@${name}`
    let from = 0
    while (true) {
      const at = text.indexOf(token, from)
      if (at === -1) break
      const next = text[at + token.length]
      const overlaps = matches.some((m) => at < m.end && at + token.length > m.start)
      // Word boundary after the match — "@Plan" must not highlight inside "@Planning".
      if (!overlaps && (next === undefined || !/\w/.test(next))) {
        matches.push({ start: at, end: at + token.length, kind: 'mention' })
      }
      from = at + token.length
    }
  }

  matches.sort((a, b) => a.start - b.start)

  const segments: ChatSegment[] = []
  let cursor = 0
  for (const { start, end, kind } of matches) {
    if (start > cursor) segments.push({ kind: 'plain', text: text.slice(cursor, start) })
    segments.push({ kind, text: text.slice(start, end) })
    cursor = end
  }
  if (cursor < text.length) segments.push({ kind: 'plain', text: text.slice(cursor) })
  return segments
}

/** True when the text contains anything worth highlighting. */
export function hasRichSegments(segments: ChatSegment[]): boolean {
  return segments.some((s) => s.kind !== 'plain')
}
