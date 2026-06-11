<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Badge, Button, Input, Skeleton, cn } from '@hoshi/ui'
import { Bot, Loader2, Plug, RefreshCw, Server, Sparkles, SquareSlash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const store = useMachineStore()
const { machine, loading } = storeToRefs(store)

const name = ref('')
const upstreamUrl = ref('')
const saving = ref(false)
const checking = ref(false)

watch(
  machine,
  (m) => {
    if (m) {
      name.value = m.name
      upstreamUrl.value = m.upstreamUrl
    }
  },
  { immediate: true },
)

onMounted(() => void store.load())

const dirty = computed(
  () => machine.value !== null && (name.value.trim() !== machine.value.name || upstreamUrl.value.trim() !== machine.value.upstreamUrl),
)

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  ready: { dot: 'bg-emerald-500', label: 'Ready' },
  provisioning: { dot: 'animate-pulse bg-amber-500', label: 'Provisioning' },
  offline: { dot: 'bg-destructive', label: 'Offline' },
  error: { dot: 'bg-destructive', label: 'Error' },
}
const status = computed(() => STATUS_STYLES[machine.value?.status ?? 'offline']!)

async function save() {
  if (saving.value || !dirty.value) return
  saving.value = true
  try {
    await store.update({ name: name.value.trim(), upstreamUrl: upstreamUrl.value.trim() })
    toast.success('Machine updated')
  } catch (e: any) {
    toast.error(e?.data?.statusMessage ?? 'Failed to update the machine')
  } finally {
    saving.value = false
  }
}

async function checkConnection() {
  if (checking.value) return
  checking.value = true
  try {
    const reachable = await store.checkStatus()
    if (reachable) toast.success('Machine is reachable')
    else toast.error("Couldn't reach the machine's OpenCode server")
  } catch {
    toast.error('Connection check failed')
  } finally {
    checking.value = false
  }
}

/** What actually lives on the machine — the rest of Customize edits these. */
const HOSTED = [
  { icon: Bot, label: 'Agents' },
  { icon: Sparkles, label: 'Skills' },
  { icon: SquareSlash, label: 'Commands' },
  { icon: Plug, label: 'Connectors' },
]
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="Server" title="Machine">
      <template #actions>
        <Button size="sm" variant="outline" class="gap-1.5" :disabled="checking || !machine" @click="checkConnection">
          <Loader2 v-if="checking" class="size-3.5 animate-spin" />
          <RefreshCw v-else class="size-3.5" />
          Check connection
        </Button>
      </template>
    </CustomizeSectionHeader>

    <div class="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div class="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
        <!-- Identity -->
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
            <div>
              <h2 class="text-base font-semibold text-foreground">Your machine</h2>
              <p class="mt-0.5 text-xs text-muted-foreground">
                A personal cloud machine running OpenCode — every project you open works on it.
              </p>
            </div>
            <Badge v-if="machine" variant="secondary" class="gap-1.5">
              <span :class="cn('size-1.5 rounded-full', status.dot)" />
              {{ status.label }}
            </Badge>
            <Skeleton v-else class="h-5 w-16 rounded-full" />
          </div>

          <div v-if="machine" class="space-y-5 px-6 py-5">
            <div class="space-y-1.5">
              <label for="machine-name" class="text-xs font-medium text-muted-foreground">Name</label>
              <Input id="machine-name" v-model="name" class="max-w-sm text-sm" maxlength="120" />
            </div>
            <div class="space-y-1.5">
              <label for="machine-upstream" class="text-xs font-medium text-muted-foreground">OpenCode upstream</label>
              <Input id="machine-upstream" v-model="upstreamUrl" class="max-w-sm font-mono text-sm" placeholder="http://localhost:4096" />
              <p class="text-xs text-muted-foreground/70">
                Where this machine's OpenCode server lives. Change it to point at another machine.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <Button size="sm" :disabled="!dirty || saving" class="gap-1.5" @click="save">
                <Loader2 v-if="saving" class="size-3.5 animate-spin" />
                Save changes
              </Button>
              <span class="text-xs text-muted-foreground/70">
                Provisioned {{ new Date(machine.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>
          <div v-else class="space-y-5 px-6 py-5">
            <Skeleton class="h-9 w-full max-w-sm rounded-lg" />
            <Skeleton class="h-9 w-full max-w-sm rounded-lg" />
            <Skeleton class="h-8 w-32 rounded-lg" />
          </div>
        </div>

        <!-- What lives here -->
        <div class="rounded-2xl border border-border/60 bg-card">
          <div class="border-b border-border/60 px-6 py-4">
            <h2 class="text-base font-semibold text-foreground">On this machine</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">
              Everything you configure in Customize is stored on your machine — teammates have their own.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-px overflow-hidden rounded-b-2xl bg-border/40 sm:grid-cols-4">
            <div
              v-for="item in HOSTED"
              :key="item.label"
              class="flex flex-col items-center gap-1.5 bg-card px-4 py-4"
            >
              <component :is="item.icon" class="size-4 text-muted-foreground" />
              <span class="text-xs text-muted-foreground">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
