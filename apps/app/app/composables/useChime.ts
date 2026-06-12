/** Synthesized UI chimes — short sine notes, no audio assets. The up interval
 *  marks completion, the down interval an error, the repeated note a question
 *  waiting for input. */

let ctx: AudioContext | null = null

export type ChimeKind = 'complete' | 'error' | 'input'

const NOTES: Record<ChimeKind, [frequency: number, offset: number][]> = {
  complete: [
    [659.25, 0], // E5
    [987.77, 0.12], // B5
  ],
  error: [
    [392.0, 0], // G4
    [261.63, 0.16], // C4
  ],
  input: [
    [880.0, 0], // A5
    [880.0, 0.18], // A5 again — a knock, not a melody
  ],
}

export function playChime(kind: ChimeKind, volume: number): void {
  if (import.meta.server) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    return
  }

  const start = ctx.currentTime
  const peak = Math.min(Math.max(volume, 0), 1) * 0.25
  if (peak <= 0) return

  for (const [frequency, offset] of NOTES[kind]) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, start + offset)
    gain.gain.linearRampToValueAtTime(peak, start + offset + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start + offset)
    osc.stop(start + offset + 0.4)
  }
}
