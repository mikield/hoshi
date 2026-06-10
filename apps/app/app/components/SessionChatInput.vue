<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Button, Tooltip, TooltipTrigger, TooltipContent, cn } from '@hoshi/ui'
import { ArrowUp, Paperclip } from 'lucide-vue-next'

const props = defineProps<{
  busy?: boolean
  placeholder?: string
  autofocus?: boolean
}>()

const emit = defineEmits<{ send: [text: string] }>()

const text = defineModel<string>({ default: '' })
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function resize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

watch(text, () => nextTick(resize))

function submit() {
  const t = text.value.trim()
  if (!t || props.busy) return
  emit('send', t)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

defineExpose({ focus: () => textareaRef.value?.focus() })
</script>

<template>
  <div class="relative z-10 mx-auto w-full max-w-208 shrink-0 px-2 pb-6 sm:px-4">
    <div class="relative z-10 w-full overflow-visible rounded-3xl border border-border bg-card transition-colors focus-within:border-foreground/20">
      <div class="relative flex w-full flex-col gap-2 overflow-visible">
        <div class="flex max-h-80 flex-col gap-1 px-3.5">
          <div class="relative w-full">
            <textarea
              ref="textareaRef"
              v-model="text"
              rows="1"
              :placeholder="placeholder ?? 'Ask anything…'"
              :autofocus="autofocus"
              class="relative max-h-50 min-h-18 w-full resize-none overflow-y-auto rounded-3xl border-none bg-transparent px-0.5 pb-6 pt-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50 sm:text-sm"
              @keydown="onKeydown"
            />
          </div>
        </div>

        <!-- Bottom toolbar -->
        <div class="mb-1.5 flex items-center justify-between gap-1 overflow-visible pl-2 pr-1.5">
          <div class="flex min-w-0 items-center gap-0 overflow-visible">
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Paperclip class="h-4 w-4" :stroke-width="2" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach files</TooltipContent>
            </Tooltip>
          </div>

          <div class="flex shrink-0 items-center gap-0">
            <Button
              size="sm"
              :disabled="!text.trim() || busy"
              class="h-8 w-8 shrink-0 rounded-full p-0"
              @click="submit"
            >
              <div v-if="busy" :class="cn('size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent')" />
              <ArrowUp v-else class="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
