import { inject, provide, type InjectionKey } from "vue"

const DialogDepthKey: InjectionKey<number> = Symbol("DialogDepth")

export function provideDialogDepth(depth: number) {
  provide(DialogDepthKey, depth)
}

export function useDialogDepth(): number {
  return inject(DialogDepthKey, 0)
}

export function dialogOverlayZ(depth: number): number {
  const level = Math.max(1, depth)
  return 9998 + (level - 1) * 20
}

export function dialogContentZ(depth: number): number {
  const level = Math.max(1, depth)
  return 9999 + (level - 1) * 20
}

export function floatingZ(depth: number): number {
  if (depth <= 0) return 10001
  return dialogContentZ(depth) + 2
}
