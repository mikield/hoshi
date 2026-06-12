<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, MessageCircleQuestion, X } from 'lucide-vue-next'
import { cn } from '../lib/utils'

interface QuestionOption {
  label: string
  description?: string
}

interface QuestionInfo {
  question: string
  header?: string
  options: QuestionOption[]
  multiple?: boolean
  custom?: boolean
}

/** Inline card the agent's question tool raises above the composer: pick an
 *  option (single-select submits immediately), toggle several and confirm, or
 *  type a custom answer into the main composer — the parent routes it through
 *  `submitCustom`. Multi-question requests step through one at a time. */
const props = defineProps<{
  /** Question request id (que_…). */
  requestId: string
  questions: QuestionInfo[]
}>()

const emit = defineEmits<{
  /** One answers array per question, each holding the selected labels. */
  reply: [requestId: string, answers: string[][]]
  reject: [requestId: string]
}>()

const tab = ref(0)
const answers = ref<string[][]>(props.questions.map(() => []))

const current = computed(() => props.questions[tab.value])
const isLast = computed(() => tab.value === props.questions.length - 1)
const selected = computed(() => answers.value[tab.value] ?? [])
const acceptsCustom = computed(() => current.value?.custom !== false)

// The card stays interactive until the PARENT confirms the reply landed and
// unmounts it — latching a local "replying" flag would brick the card (and
// silently eat composer answers) the first time a reply request failed.
function submit() {
  emit('reply', props.requestId, props.questions.map((_, i) => answers.value[i] ?? []))
}

function pick(label: string) {
  answers.value[tab.value] = [label]
  if (isLast.value) {
    submit()
    return
  }
  tab.value += 1
}

function toggle(label: string) {
  const list = answers.value[tab.value] ?? []
  answers.value[tab.value] = list.includes(label) ? list.filter((l) => l !== label) : [...list, label]
}

function choose(option: QuestionOption) {
  if (current.value?.multiple) toggle(option.label)
  else pick(option.label)
}

function next() {
  if (selected.value.length === 0) return
  if (isLast.value) submit()
  else tab.value += 1
}

function reject() {
  emit('reject', props.requestId)
}
</script>

<template>
  <div
    v-if="current"
    class="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-border/40 px-4 py-2.5">
      <MessageCircleQuestion class="size-4 shrink-0 text-muted-foreground" />
      <span class="min-w-0 flex-1 truncate text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
        {{ current.header || 'The agent needs your input' }}
        <template v-if="questions.length > 1"> · {{ tab + 1 }} of {{ questions.length }}</template>
      </span>
      <button
        type="button"
        aria-label="Dismiss question"
        class="flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        @click="reject"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <div class="space-y-3 px-4 py-3">
      <p class="text-sm leading-relaxed text-foreground">{{ current.question }}</p>

      <!-- Options -->
      <div class="space-y-1.5">
        <button
          v-for="option in current.options"
          :key="option.label"
          type="button"
          :class="cn(
            'flex w-full cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors',
            selected.includes(option.label)
              ? 'border-foreground/30 bg-primary/10'
              : 'border-border/60 bg-background hover:border-foreground/30 hover:bg-muted/30',
          )"
          @click="choose(option)"
        >
          <span
            :class="cn(
              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
              selected.includes(option.label) ? 'border-foreground bg-foreground text-background' : 'border-border',
            )"
          >
            <Check v-if="selected.includes(option.label)" class="size-3" />
          </span>
          <span class="min-w-0 flex-1 leading-tight">
            <span class="block text-sm font-medium text-foreground">{{ option.label }}</span>
            <span v-if="option.description" class="mt-0.5 block text-xs text-muted-foreground">{{ option.description }}</span>
          </span>
        </button>
      </div>

      <!-- Footer: confirm for multi-select / stepper, custom hint -->
      <div
        v-if="current.multiple || questions.length > 1 || acceptsCustom"
        class="flex items-center justify-between gap-3"
      >
        <p v-if="acceptsCustom" class="text-xs text-muted-foreground/70">…or type your own answer below.</p>
        <span v-else />
        <!-- Single-select advances on pick; only multi-select needs a confirm. -->
        <button
          v-if="current.multiple"
          type="button"
          :disabled="selected.length === 0"
          class="shrink-0 cursor-pointer rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          @click="next"
        >
          {{ isLast ? 'Confirm' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>
