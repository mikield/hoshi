<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  text?: string
}
const props = defineProps<Props>()

const SHORTCUT_TOKEN_GLYPHS: Record<string, string> = {
  ctrl: "⌃", control: "⌃", cmd: "⌘", command: "⌘", meta: "⌘", shift: "⇧",
  alt: "⌥", option: "⌥", opt: "⌥", enter: "↵", return: "↵", esc: "esc",
  escape: "esc", tab: "⇥", backspace: "⌫", delete: "⌦", space: "␣",
  up: "↑", down: "↓", left: "←", right: "→",
}

function formatShortcutToken(token: string): string {
  const key = token.trim().toLowerCase()
  return SHORTCUT_TOKEN_GLYPHS[key] ?? token.trim()
}

const tokens = computed(() => (props.text ? props.text.split("+").map((t) => t.trim()).filter(Boolean) : null))
</script>
<template>
  <span data-slot="command-shortcut" :class="cn('ml-auto inline-flex items-center gap-1', props.class)">
    <template v-if="tokens">
      <kbd
        v-for="(t, i) in tokens"
        :key="`${t}-${i}`"
        class="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1.5 rounded-[5px] bg-foreground/[0.04] border border-border/40 text-xs font-medium text-muted-foreground/60 leading-none font-sans"
      >{{ formatShortcutToken(t) }}</kbd>
    </template>
    <slot v-else />
  </span>
</template>
