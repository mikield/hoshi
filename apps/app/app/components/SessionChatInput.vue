<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  AgentSelector,
  Button,
  ModelSelector,
  TokenProgress,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  cn,
} from '@hoshi/ui'
import { ArrowUp, FileText, Paperclip, Terminal, X } from 'lucide-vue-next'
import { segmentChatText, hasRichSegments } from '~/composables/useChatSegments'
import type { AgentOption, CommandOption, ModelOption, OutgoingFile } from '~/composables/useOpencode'

const props = defineProps<{
  busy?: boolean
  placeholder?: string
  autofocus?: boolean
  /** Widens the composer to match the wider thread when the side panel is closed. */
  wide?: boolean
  agents?: AgentOption[]
  models?: ModelOption[]
  commands?: CommandOption[]
  /** Context-window usage shown as a ring next to the send button. */
  context?: { used: number; limit: number } | null
}>()

const emit = defineEmits<{
  send: [text: string, files: OutgoingFile[]]
  command: [name: string, args: string]
}>()

const text = defineModel<string>({ default: '' })
const selectedModel = defineModel<string | null>('model', { default: null })
const selectedAgent = defineModel<string | null>('agent', { default: null })

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const highlightRef = ref<HTMLDivElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// ── Attachments ─────────────────────────────────────────────────────────────

const attachments = ref<OutgoingFile[]>([])

function isImage(file: OutgoingFile): boolean {
  return file.mime.startsWith('image/')
}

async function stageFiles(files: Iterable<File>) {
  for (const file of files) {
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
    attachments.value.push({
      id: crypto.randomUUID(),
      filename: file.name || 'pasted-image.png',
      mime: file.type || 'application/octet-stream',
      url,
    })
  }
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) void stageFiles(input.files)
  input.value = ''
}

function onPaste(event: ClipboardEvent) {
  const images = [...(event.clipboardData?.items ?? [])]
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter((file): file is File => !!file)
  if (images.length) {
    event.preventDefault()
    void stageFiles(images)
  }
}

function removeAttachment(id: string) {
  attachments.value = attachments.value.filter((file) => file.id !== id)
}

// ── /slash commands ──────────────────────────────────────────────────────────

const stagedCommand = ref<CommandOption | null>(null)
const commandIndex = ref(0)

/** The "/query" filter — active only while the input IS a command invocation
 *  (starts with "/", no command staged yet). */
const commandQuery = computed(() => {
  if (stagedCommand.value || !props.commands?.length) return null
  const match = text.value.match(/^\/([\w:-]*)$/)
  return match ? match[1]!.toLowerCase() : null
})

const commandMatches = computed(() => {
  if (commandQuery.value === null) return []
  return (props.commands ?? [])
    .filter((command) => command.name.toLowerCase().includes(commandQuery.value!))
    .slice(0, 10)
})

watch(commandQuery, () => (commandIndex.value = 0))

function selectCommand(command: CommandOption) {
  stagedCommand.value = command
  text.value = ''
  nextTick(() => textareaRef.value?.focus())
}

function clearStagedCommand() {
  stagedCommand.value = null
}

// ── @agent mentions ──────────────────────────────────────────────────────────

const MENTION_PATTERN = /(?:^|\s)@([\w][\w .-]*)?$/

const mentionQuery = ref<string | null>(null)
const mentionIndex = ref(0)

const mentionMatches = computed(() => {
  if (mentionQuery.value === null) return []
  const query = mentionQuery.value.toLowerCase()
  return (props.agents ?? []).filter((agent) => agent.name.toLowerCase().includes(query)).slice(0, 8)
})

function refreshMentionQuery() {
  const el = textareaRef.value
  if (!el || !props.agents?.length) {
    mentionQuery.value = null
    return
  }
  const beforeCaret = text.value.slice(0, el.selectionStart ?? text.value.length)
  const match = beforeCaret.match(MENTION_PATTERN)
  mentionQuery.value = match ? (match[1] ?? '') : null
  if (match) mentionIndex.value = 0
}

function selectMention(agent: AgentOption) {
  const el = textareaRef.value
  if (!el) return
  const caret = el.selectionStart ?? text.value.length
  const beforeCaret = text.value.slice(0, caret)
  const replaced = beforeCaret.replace(MENTION_PATTERN, (full) =>
    `${full.startsWith(' ') ? ' ' : ''}@${agent.name} `,
  )
  text.value = replaced + text.value.slice(caret)
  selectedAgent.value = agent.name
  mentionQuery.value = null
  nextTick(() => {
    el.focus()
    el.setSelectionRange(replaced.length, replaced.length)
  })
}

// ── Highlight overlay (mentions + URLs) ─────────────────────────────────────

const segments = computed(() => segmentChatText(text.value, props.agents ?? []))
const showHighlight = computed(() => hasRichSegments(segments.value))

function syncHighlightScroll() {
  if (highlightRef.value && textareaRef.value) {
    highlightRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

// ── Sizing / submit ──────────────────────────────────────────────────────────

function resize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

watch(text, () => nextTick(() => {
  resize()
  refreshMentionQuery()
}))

const canSubmit = computed(
  () => (stagedCommand.value !== null || text.value.trim().length > 0 || attachments.value.length > 0) && !props.busy,
)

function submit() {
  if (!canSubmit.value) return
  if (stagedCommand.value) {
    emit('command', stagedCommand.value.name, text.value.trim())
    stagedCommand.value = null
  } else {
    emit('send', text.value.trim(), attachments.value)
    attachments.value = []
  }
  mentionQuery.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (commandMatches.value.length > 0) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      commandIndex.value = (commandIndex.value + 1) % commandMatches.value.length
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      commandIndex.value = (commandIndex.value - 1 + commandMatches.value.length) % commandMatches.value.length
      return
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      selectCommand(commandMatches.value[commandIndex.value]!)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      text.value = ''
      return
    }
  }
  if (stagedCommand.value && event.key === 'Escape' && !text.value) {
    event.preventDefault()
    clearStagedCommand()
    return
  }
  if (mentionQuery.value !== null && mentionMatches.value.length > 0) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      mentionIndex.value = (mentionIndex.value + 1) % mentionMatches.value.length
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      mentionIndex.value = (mentionIndex.value - 1 + mentionMatches.value.length) % mentionMatches.value.length
      return
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      selectMention(mentionMatches.value[mentionIndex.value]!)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      mentionQuery.value = null
      return
    }
  }
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submit()
  }
}

defineExpose({ focus: () => textareaRef.value?.focus() })
</script>

<template>
  <div :class="cn('relative z-10 mx-auto w-full shrink-0 px-2 pb-6 transition-[max-width] duration-300 ease-out sm:px-4', wide ? 'max-w-256' : 'max-w-224')">
    <div class="relative z-10 w-full overflow-visible rounded-3xl border border-border bg-card transition-colors focus-within:border-foreground/20">
      <!-- Slash command popover -->
      <div
        v-if="commandMatches.length > 0"
        class="absolute bottom-full left-0 z-30 mb-2 w-96 overflow-hidden rounded-2xl border border-border/60 bg-popover animate-in fade-in-0 zoom-in-[0.97] duration-150"
      >
        <div class="max-h-64 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div class="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">Commands</div>
          <button
            v-for="(command, i) in commandMatches"
            :key="command.name"
            type="button"
            :class="cn(
              'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
              i === commandIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
            )"
            @mouseenter="commandIndex = i"
            @mousedown.prevent="selectCommand(command)"
          >
            <span class="shrink-0 font-mono text-sm font-medium">/{{ command.name }}</span>
            <span v-if="command.description" class="min-w-0 flex-1 truncate text-xs text-muted-foreground/60">{{ command.description }}</span>
          </button>
        </div>
      </div>

      <!-- Mention popover -->
      <div
        v-if="mentionQuery !== null && mentionMatches.length > 0"
        class="absolute bottom-full left-0 z-30 mb-2 w-80 overflow-hidden rounded-2xl border border-border/60 bg-popover animate-in fade-in-0 zoom-in-[0.97] duration-150"
      >
        <div class="max-h-72 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div class="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">Agents</div>
          <button
            v-for="(agent, i) in mentionMatches"
            :key="agent.name"
            type="button"
            :class="cn(
              'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
              i === mentionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
            )"
            @mouseenter="mentionIndex = i"
            @mousedown.prevent="selectMention(agent)"
          >
            <span class="min-w-0 flex-1 truncate font-medium">{{ agent.name }}</span>
            <span v-if="agent.description" class="max-w-44 truncate text-xs text-muted-foreground/60">{{ agent.description }}</span>
          </button>
        </div>
      </div>

      <div class="relative flex w-full flex-col gap-2 overflow-visible">
        <!-- Staged command badge -->
        <div v-if="stagedCommand" class="flex min-w-0 items-center gap-2 px-4 pb-0 pt-3">
          <div class="flex max-w-full shrink-0 items-center gap-1.5 rounded-2xl border border-border/50 bg-muted/60 px-2.5 py-1">
            <Terminal class="size-3 text-muted-foreground" />
            <span class="max-w-55 truncate whitespace-nowrap font-mono text-xs font-medium text-foreground">/{{ stagedCommand.name }}</span>
            <button
              type="button"
              aria-label="Cancel command"
              class="ml-0.5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              @click="clearStagedCommand"
            >
              <X class="size-3" />
            </button>
          </div>
          <span v-if="stagedCommand.description" class="min-w-0 truncate text-xs text-muted-foreground">{{ stagedCommand.description }}</span>
        </div>

        <!-- Attachment chips -->
        <div v-if="attachments.length > 0" class="flex flex-wrap gap-2 px-3 pt-3">
          <div
            v-for="file in attachments"
            :key="file.id"
            class="group/attachment relative flex items-center gap-2 overflow-hidden rounded-2xl border border-border/50 bg-muted/30 transition-colors hover:border-border"
          >
            <img v-if="isImage(file)" :src="file.url" :alt="file.filename" class="h-12 w-12 object-cover" />
            <span v-else class="flex h-12 w-12 items-center justify-center"><FileText class="size-4 text-muted-foreground" /></span>
            <span class="max-w-36 truncate pr-3 text-xs text-muted-foreground">{{ file.filename }}</span>
            <button
              type="button"
              :aria-label="`Remove ${file.filename}`"
              class="absolute right-1 top-1 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/attachment:opacity-100"
              @click="removeAttachment(file.id)"
            >
              <X class="size-3" />
            </button>
          </div>
        </div>

        <div class="flex max-h-80 flex-col gap-1 px-3.5">
          <div class="relative w-full">
            <!-- Highlight overlay — mirrors the textarea, styling mentions + URLs -->
            <div
              v-if="showHighlight"
              ref="highlightRef"
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-0.5 pb-6 pt-4 text-base leading-relaxed text-foreground sm:text-sm"
            >
              <template v-for="(segment, i) in segments" :key="i">
                <span
                  v-if="segment.kind !== 'plain'"
                  class="border-b border-foreground/40 font-medium text-foreground/80"
                >{{ segment.text }}</span>
                <template v-else>{{ segment.text }}</template>
              </template>
            </div>
            <textarea
              ref="textareaRef"
              v-model="text"
              rows="1"
              :placeholder="stagedCommand ? 'Add details and press Enter, or Esc to cancel…' : placeholder ?? 'Ask anything…'"
              :autofocus="autofocus"
              :class="cn(
                'relative max-h-50 min-h-18 w-full resize-none overflow-y-auto rounded-3xl border-none bg-transparent px-0.5 pb-6 pt-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50 sm:text-sm',
                showHighlight && 'text-transparent caret-foreground',
              )"
              @keydown="onKeydown"
              @paste="onPaste"
              @scroll="syncHighlightScroll"
              @click="refreshMentionQuery"
              @keyup="refreshMentionQuery"
            />
          </div>
        </div>

        <!-- Bottom toolbar -->
        <div class="mb-1.5 flex items-center justify-between gap-1 overflow-visible pl-2 pr-1.5">
          <div class="flex min-w-0 items-center gap-0 overflow-visible">
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept="image/*,application/pdf,text/*,.md,.json,.csv,.yaml,.yml"
              class="hidden"
              @change="onFileSelect"
            />
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  @click="fileInputRef?.click()"
                >
                  <Paperclip class="h-4 w-4" :stroke-width="2" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach files</TooltipContent>
            </Tooltip>
            <AgentSelector v-if="agents?.length" v-model="selectedAgent" :agents="agents" />
            <ModelSelector v-if="models?.length" v-model="selectedModel" :models="models" />
          </div>

          <div class="flex shrink-0 items-center gap-0">
            <TokenProgress v-if="context" :used="context.used" :limit="context.limit" />
            <Button
              size="sm"
              :disabled="!canSubmit"
              class="h-8 w-8 shrink-0 rounded-full p-0"
              @click="submit"
            >
              <div v-if="busy" class="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <ArrowUp v-else class="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
