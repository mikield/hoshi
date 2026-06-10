<script setup lang="ts">
import { computed } from 'vue'
import { MarkdownContent } from '@hoshi/ui'
import { SquareSlash } from 'lucide-vue-next'
import type { CommandOption } from '~/composables/useOpencode'

const props = defineProps<{ commands: CommandOption[] }>()

const items = computed(() =>
  props.commands.map((command) => ({ id: command.name, label: command.name, sublabel: command.description })),
)

function commandByName(name: string): CommandOption | undefined {
  return props.commands.find((command) => command.name === name)
}
</script>

<template>
  <CustomizeListDetailSection :icon="SquareSlash" title="Commands" :items="items" search-placeholder="Search commands…">
    <template #row="{ item }">
      <span class="inline-flex h-4 min-w-4 items-center justify-center rounded font-mono text-xs font-medium">/</span>
      <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ item.label }}</span>
    </template>
    <template #detail="{ item }">
      <div class="mx-auto w-full max-w-3xl px-6 py-8">
        <h2 class="font-mono text-lg font-semibold tracking-tight text-foreground">/{{ item.label }}</h2>
        <p v-if="item.sublabel" class="mt-1 text-sm text-muted-foreground">{{ item.sublabel }}</p>
        <template v-if="commandByName(item.id)?.template">
          <h3 class="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Template</h3>
          <MarkdownContent class="mt-2">
            <pre><code>{{ commandByName(item.id)!.template }}</code></pre>
          </MarkdownContent>
        </template>
      </div>
    </template>
  </CustomizeListDetailSection>
</template>
