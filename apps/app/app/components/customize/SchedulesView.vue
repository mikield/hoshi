<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Skeleton,
  Switch,
  Textarea,
} from '@hoshi/ui'
import { Loader2, Plus, Timer, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Schedule {
  id: string
  projectId: string | null
  name: string
  prompt: string
  intervalMinutes: number
  enabled: boolean
  lastRunAt: string | null
  nextRunAt: string | null
  createdAt: string
}

const api = useApi()
const route = useRoute()
const { projects } = storeToRefs(useProjectsStore())

const schedules = ref<Schedule[]>([])
const loading = ref(true)

const creating = ref(false)
const saving = ref(false)
const name = ref('')
const prompt = ref('')
const interval = ref('1440')

const INTERVALS = [
  { value: '60', label: 'Every hour' },
  { value: '1440', label: 'Every day' },
  { value: '10080', label: 'Every week' },
]

/** Schedules created while a project is open run inside that project. */
const projectId = computed(() => (route.params.id as string | undefined) ?? null)
const projectName = computed(() => projects.value.find((p) => p.id === projectId.value)?.name ?? null)

function projectLabel(id: string | null): string | null {
  if (!id) return null
  return projects.value.find((p) => p.id === id)?.name ?? 'a project'
}

function cadenceLabel(minutes: number): string {
  const preset = INTERVALS.find((i) => Number(i.value) === minutes)
  return preset?.label ?? `Every ${minutes} min`
}

onMounted(load)

async function load() {
  loading.value = true
  try {
    schedules.value = (await api<{ schedules: Schedule[] }>('/schedules')).schedules
  } catch {
    toast.error('Failed to load schedules')
  } finally {
    loading.value = false
  }
}

async function create() {
  if (saving.value || !name.value.trim() || !prompt.value.trim()) return
  saving.value = true
  try {
    const res = await api<{ schedule: Schedule }>('/schedules', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        prompt: prompt.value.trim(),
        intervalMinutes: Number(interval.value),
        ...(projectId.value ? { projectId: projectId.value } : {}),
      },
    })
    schedules.value = [...schedules.value, res.schedule]
    creating.value = false
    name.value = ''
    prompt.value = ''
    toast.success('Schedule created')
  } catch (e: any) {
    toast.error(e?.data?.statusMessage ?? 'Failed to create the schedule')
  } finally {
    saving.value = false
  }
}

async function toggle(schedule: Schedule, enabled: boolean) {
  try {
    const res = await api<{ schedule: Schedule }>(`/schedules/${schedule.id}`, {
      method: 'PATCH',
      body: { enabled },
    })
    schedules.value = schedules.value.map((s) => (s.id === schedule.id ? res.schedule : s))
  } catch {
    toast.error('Failed to update the schedule')
  }
}

async function remove(schedule: Schedule) {
  try {
    await api(`/schedules/${schedule.id}`, { method: 'DELETE' })
    schedules.value = schedules.value.filter((s) => s.id !== schedule.id)
    toast.success('Schedule deleted')
  } catch {
    toast.error('Failed to delete the schedule')
  }
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Timer" title="Schedules" :count="schedules.length">
      <template #actions>
        <Button size="sm" variant="outline" class="gap-1.5" @click="creating = !creating">
          <Plus class="size-3.5" />
          New schedule
        </Button>
      </template>
    </CustomizeSectionHeader>

    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <!-- Create card -->
        <div
          v-if="creating"
          class="space-y-4 rounded-2xl border border-border/60 bg-card p-5 animate-in fade-in-0 zoom-in-[0.99] duration-150"
        >
          <div class="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div class="space-y-1.5">
              <label for="schedule-name" class="text-xs font-medium text-muted-foreground">Name</label>
              <Input id="schedule-name" v-model="name" placeholder="Daily triage" maxlength="120" autofocus />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-muted-foreground">Runs</label>
              <Select v-model="interval">
                <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="option in INTERVALS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-1.5">
            <label for="schedule-prompt" class="text-xs font-medium text-muted-foreground">Prompt</label>
            <Textarea
              id="schedule-prompt"
              v-model="prompt"
              rows="3"
              maxlength="4000"
              placeholder="Summarize yesterday's commits and flag anything risky…"
            />
            <p class="text-xs text-muted-foreground/70">
              Each run starts a fresh session on your machine{{ projectName ? ` in ${projectName}` : '' }}.
            </p>
          </div>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="ghost" @click="creating = false">Cancel</Button>
            <Button size="sm" class="gap-1.5" :disabled="saving || !name.trim() || !prompt.trim()" @click="create">
              <Loader2 v-if="saving" class="size-3.5 animate-spin" />
              Create schedule
            </Button>
          </div>
        </div>

        <!-- List -->
        <div v-if="loading" class="space-y-3">
          <Skeleton v-for="i in 3" :key="i" class="h-16 rounded-2xl" />
        </div>

        <EmptyState v-else-if="schedules.length === 0 && !creating" :icon="Timer" title="No schedules yet" class="py-16">
          <template #description>Run a prompt on a recurring schedule — daily triage, weekly reports, anything.</template>
          <template #action>
            <Button variant="outline" class="gap-1.5" @click="creating = true">
              <Plus class="size-3.5" />
              New schedule
            </Button>
          </template>
        </EmptyState>

        <div v-else class="space-y-3">
          <div
            v-for="schedule in schedules"
            :key="schedule.id"
            class="flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-medium text-foreground">{{ schedule.name }}</span>
                <Badge variant="secondary">{{ cadenceLabel(schedule.intervalMinutes) }}</Badge>
                <Badge v-if="projectLabel(schedule.projectId)" variant="outline" class="max-w-40 truncate">
                  {{ projectLabel(schedule.projectId) }}
                </Badge>
              </div>
              <p class="mt-1 truncate text-xs text-muted-foreground">{{ schedule.prompt }}</p>
              <p class="mt-1 text-xs text-muted-foreground/60">
                {{ schedule.enabled ? `Next run ${formatMoment(schedule.nextRunAt)}` : 'Paused' }}
                <template v-if="schedule.lastRunAt"> · last ran {{ formatMoment(schedule.lastRunAt) }}</template>
              </p>
            </div>
            <Switch
              :model-value="schedule.enabled"
              :aria-label="schedule.enabled ? 'Pause schedule' : 'Resume schedule'"
              @update:model-value="(value) => toggle(schedule, Boolean(value))"
            />
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Delete schedule"
              @click="remove(schedule)"
            >
              <Trash2 class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
