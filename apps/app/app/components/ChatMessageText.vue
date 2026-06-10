<script setup lang="ts">
import { computed } from 'vue'
import { segmentChatText } from '~/composables/useChatSegments'
import type { AgentOption } from '~/composables/useOpencode'

const props = defineProps<{
  text: string
  agents: AgentOption[]
}>()

const segments = computed(() => segmentChatText(props.text, props.agents))
</script>

<template>
  <p class="min-w-0 whitespace-pre-wrap wrap-break-word px-4 py-3 text-sm leading-relaxed">
    <template v-for="(segment, i) in segments" :key="i">
      <a
        v-if="segment.kind === 'url'"
        :href="segment.text"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-foreground underline decoration-foreground/30 underline-offset-3 transition-colors hover:decoration-foreground/70"
      >{{ segment.text }}</a>
      <span
        v-else-if="segment.kind === 'mention'"
        class="rounded-md bg-primary/10 px-1 py-0.5 font-medium text-foreground"
      >{{ segment.text }}</span>
      <template v-else>{{ segment.text }}</template>
    </template>
  </p>
</template>
