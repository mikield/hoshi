<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Logo,
  Button,
  MarkdownContent,
  MediaPreviewDialog,
  ThinkingBlock,
  ToolCallCard,
  ToolCallGroup,
  CompactionDivider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@hoshi/ui'
import { toast } from 'vue-sonner'
import {
  Check,
  Copy,
  Edit3,
  FileText,
  FolderOpen,
  GitFork,
  Globe,
  History,
  ListChecks,
  Search,
  Terminal,
  Wrench,
  type LucideIcon,
} from 'lucide-vue-next'
import {
  partsText,
  turnItems,
  isCompaction,
  type AgentOption,
  type ChatMessage,
  type Part,
} from '~/composables/useOpencode'

const props = withDefaults(
  defineProps<{
    user: ChatMessage | null
    assistant: ChatMessage[]
    agents?: AgentOption[]
    /** This is the live turn — the model may still be producing output. */
    busy?: boolean
  }>(),
  { agents: () => [] },
)

const emit = defineEmits<{
  /** Branch a new session starting from this user message. */
  fork: [messageID: string]
  /** Roll the session back to the state before this user message. */
  rewind: [messageID: string]
}>()

/** History actions need a server-side message id — optimistic ones don't have it yet. */
const persistedUserId = computed(() => {
  const id = props.user?.info.id
  return id && !id.startsWith('local-') ? id : null
})

const items = computed(() => turnItems(props.assistant))
const compaction = computed(() => props.assistant.some(isCompaction))
const userText = computed(() => (props.user ? partsText(props.user.parts) : ''))
const userFiles = computed(() => (props.user?.parts ?? []).filter((p) => p.type === 'file' && p.url))
const responseText = computed(() =>
  items.value
    .filter((item) => item.kind === 'text')
    .map((item) => item.text)
    .join('\n\n'),
)

// ── Copy actions ─────────────────────────────────────────────────────────────

const copied = ref<'user' | 'assistant' | null>(null)

async function copy(which: 'user' | 'assistant') {
  const content = which === 'user' ? userText.value : responseText.value
  if (!content) return
  try {
    await navigator.clipboard.writeText(content)
  } catch {
    toast.error('Clipboard unavailable')
    return
  }
  copied.value = which
  setTimeout(() => {
    if (copied.value === which) copied.value = null
  }, 1500)
}

// ── Media preview ────────────────────────────────────────────────────────────

const preview = ref<Part | null>(null)
const previewOpen = computed({
  get: () => preview.value !== null,
  set: (open) => {
    if (!open) preview.value = null
  },
})

// ── Tool presentation ────────────────────────────────────────────────────────

const TOOL_ICONS: Record<string, LucideIcon> = {
  read: FileText,
  write: Edit3,
  edit: Edit3,
  apply_patch: Edit3,
  bash: Terminal,
  grep: Search,
  glob: Search,
  list: FolderOpen,
  webfetch: Globe,
  web_search: Globe,
  todowrite: ListChecks,
  todoread: ListChecks,
}

function toolIcon(part: Part): LucideIcon {
  return TOOL_ICONS[normalizedTool(part)] ?? Wrench
}

function normalizedTool(part: Part): string {
  return (part.tool ?? 'tool').replace(/^oc-/, '').replace(/-/g, '_')
}

function toolLabel(part: Part): string {
  const tool = normalizedTool(part).replace(/_/g, ' ')
  return tool.charAt(0).toUpperCase() + tool.slice(1)
}

/** One-line context for the call: the server-provided title, or the most
 *  recognizable input field (file path, pattern, command, …). */
function toolSubtitle(part: Part): string {
  if (part.state?.title) return part.state.title
  const input = part.state?.input ?? {}
  for (const field of ['filePath', 'path', 'pattern', 'command', 'url', 'description', 'query']) {
    const value = input[field]
    if (typeof value === 'string' && value.trim()) return value
  }
  return ''
}

function toolStatus(part: Part): 'running' | 'completed' | 'error' {
  const status = part.state?.status
  if (status === 'pending' || status === 'running') return 'running'
  return status === 'error' ? 'error' : 'completed'
}

function groupSummary(parts: Part[]): string {
  const counts = new Map<string, number>()
  for (const part of parts) {
    const tool = normalizedTool(part)
    counts.set(tool, (counts.get(tool) ?? 0) + 1)
  }
  return [...counts.entries()].map(([tool, n]) => (n > 1 ? `${tool} ×${n}` : tool)).join(', ')
}

function groupRunning(parts: Part[]): boolean {
  return parts.some((part) => toolStatus(part) === 'running')
}

/** Reasoning preview — the first non-empty line, used as the collapsed label. */
function reasoningPreview(text: string): string {
  return text.split('\n').find((line) => line.trim()) ?? 'Thinking'
}

function isLastItem(index: number): boolean {
  return index === items.value.length - 1
}
</script>

<template>
  <div class="group/turn space-y-3">
    <CompactionDivider v-if="compaction" />

    <!-- User message -->
    <div v-if="userText || userFiles.length > 0">
      <div class="flex justify-end">
        <div class="flex max-w-[90%] flex-col overflow-hidden rounded-3xl rounded-br-lg border bg-card">
          <div v-if="userFiles.length > 0" class="flex flex-wrap gap-2 p-3 pb-0">
            <template v-for="file in userFiles" :key="file.url">
              <button
                v-if="file.mime?.startsWith('image/')"
                type="button"
                class="cursor-zoom-in overflow-hidden rounded-lg border border-border/50 transition-opacity hover:opacity-90"
                :aria-label="`Preview ${file.filename ?? 'attachment'}`"
                @click="preview = file"
              >
                <img :src="file.url" :alt="file.filename ?? 'Attachment'" class="max-h-32 max-w-48 object-cover" />
              </button>
              <a
                v-else
                :href="file.url"
                :download="file.filename"
                class="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
              >
                <FileText class="size-4 text-muted-foreground" />
                <span class="text-xs text-muted-foreground">{{ file.filename ?? 'File' }}</span>
              </a>
            </template>
          </div>
          <ChatMessageText v-if="userText" :text="userText" :agents="agents" />
        </div>
      </div>
      <!-- Hover actions -->
      <div v-if="userText" class="mt-1 flex justify-end gap-0.5 opacity-0 transition-opacity duration-150 group-hover/turn:opacity-100">
        <Tooltip v-if="persistedUserId">
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon-xs" aria-label="Fork from here" @click="emit('fork', persistedUserId)">
              <GitFork class="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fork from here</TooltipContent>
        </Tooltip>
        <Tooltip v-if="persistedUserId">
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon-xs" aria-label="Rewind to here" @click="emit('rewind', persistedUserId)">
              <History class="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rewind to here</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon-xs" :aria-label="copied === 'user' ? 'Copied' : 'Copy message'" @click="copy('user')">
              <Check v-if="copied === 'user'" class="size-3.5" />
              <Copy v-else class="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ copied === 'user' ? 'Copied!' : 'Copy' }}</TooltipContent>
        </Tooltip>
      </div>
    </div>

    <!-- Assistant flow: thinking, tool calls, and text in their real order -->
    <div v-if="items.length > 0">
      <div class="relative flex flex-row">
        <Logo variant="symbol" class="absolute -left-7 top-1 h-4 w-auto shrink-0" />
        <div class="min-w-0 flex-1 space-y-2">
          <template v-for="(item, index) in items" :key="item.key">
            <ThinkingBlock
              v-if="item.kind === 'thinking'"
              :preview="reasoningPreview(item.text)"
              :streaming="!!busy && isLastItem(index)"
            >
              <MarkdownContent class="text-xs [&_p]:my-2">
                <MDC :value="item.text" />
              </MarkdownContent>
            </ThinkingBlock>

            <ToolCallGroup
              v-else-if="item.kind === 'tools' && item.parts.length > 1"
              :count="item.parts.length"
              :summary="groupSummary(item.parts)"
              :running="groupRunning(item.parts)"
            >
              <ToolCallCard
                v-for="part in item.parts"
                :key="part.callID"
                :title="toolLabel(part)"
                :subtitle="toolSubtitle(part)"
                :status="toolStatus(part)"
              >
                <template #icon><component :is="toolIcon(part)" /></template>
                <template v-if="part.state?.output" #default>{{ part.state.output }}</template>
              </ToolCallCard>
            </ToolCallGroup>

            <ToolCallCard
              v-else-if="item.kind === 'tools'"
              :title="toolLabel(item.parts[0]!)"
              :subtitle="toolSubtitle(item.parts[0]!)"
              :status="toolStatus(item.parts[0]!)"
            >
              <template #icon><component :is="toolIcon(item.parts[0]!)" /></template>
              <template v-if="item.parts[0]!.state?.output" #default>{{ item.parts[0]!.state.output }}</template>
            </ToolCallCard>

            <MarkdownContent v-else-if="item.kind === 'text'">
              <MDC :value="item.text" />
            </MarkdownContent>
          </template>
        </div>
      </div>
      <!-- Hover actions -->
      <div v-if="responseText" class="mt-1 flex opacity-0 transition-opacity duration-150 group-hover/turn:opacity-100">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon-xs" :aria-label="copied === 'assistant' ? 'Copied' : 'Copy response'" @click="copy('assistant')">
              <Check v-if="copied === 'assistant'" class="size-3.5" />
              <Copy v-else class="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ copied === 'assistant' ? 'Copied!' : 'Copy' }}</TooltipContent>
        </Tooltip>
      </div>
    </div>

    <MediaPreviewDialog
      v-if="preview"
      v-model:open="previewOpen"
      :src="preview.url!"
      :alt="preview.filename"
    />
  </div>
</template>
