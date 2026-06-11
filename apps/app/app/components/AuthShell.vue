<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { Logo, WallpaperBackground } from '@hoshi/ui'

const props = defineProps<{
  wallpaperId?: string
  /** 'lock' starts on the clock screen (used by the inactivity lock). */
  initialPhase?: 'lock' | 'form'
}>()

// ── Phase management ────────────────────────────────────────────────────
const phase = ref<'lock' | 'form'>(props.initialPhase ?? 'form')

function openForm() { phase.value = 'form' }
function closeForm() { phase.value = 'lock' }

function onKeydown(e: KeyboardEvent) {
  if (phase.value === 'lock' && (e.key === 'Enter' || e.key === ' ')) openForm()
  if (phase.value === 'form' && e.key === 'Escape') closeForm()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ── Live clock ──────────────────────────────────────────────────────────
const now = ref<Date | null>(null)
let clockTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = new Date()
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
})
onUnmounted(() => { if (clockTimer) clearInterval(clockTimer) })

function fmtDate(d: Date) {
  const day   = d.toLocaleDateString('en-US', { weekday: 'short' })
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  return `${day} ${month} ${d.getDate()}`
}
function fmtTime(d: Date) {
  const h = d.getHours() % 12 || 12
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden cursor-pointer"
    @click="phase === 'lock' && openForm()"
  >
    <WallpaperBackground :wallpaper-id="wallpaperId ?? 'brandmark'" />

    <!-- ── Lock phase ────────────────────────────────────────────────── -->
    <Transition name="lock-phase">
      <div
        v-if="phase === 'lock'"
        key="lock"
        class="absolute inset-0 z-10 flex flex-col pointer-events-none"
      >
        <!-- Clock -->
        <Transition name="clock-slide" appear>
          <div class="flex justify-center pt-[12vh] sm:pt-[14vh]">
            <div class="flex flex-col items-center select-none">
              <p class="text-foreground/35 text-sm font-light tracking-widest">
                {{ now ? fmtDate(now) : '--- --- --' }}
              </p>
              <p class="text-foreground/80 text-7xl sm:text-8xl font-extralight leading-none tracking-[-0.02em] tabular-nums">
                {{ now ? fmtTime(now) : '--:--' }}
              </p>
            </div>
          </div>
        </Transition>

        <!-- Hint -->
        <Transition name="hint-slide" appear>
          <div class="absolute bottom-[10vh] left-0 right-0 flex flex-col items-center gap-3">
            <div class="flex flex-col items-center gap-2.5">
              <Logo variant="logo" class="h-4 w-auto opacity-70" />
              <p class="text-foreground/45 text-xs tracking-widest uppercase">Click or press Enter to sign in</p>
            </div>
            <ChevronDown class="size-3.5 text-foreground/40 animate-bounce-x" />
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ── Form phase ─────────────────────────────────────────────────── -->
    <Transition name="form-phase">
      <div
        v-if="phase === 'form'"
        key="form"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-default"
        @click.self="closeForm()"
      >
        <!-- Backdrop blur overlay -->
        <Transition name="backdrop-fade" appear>
          <div class="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
        </Transition>

        <!-- Frosted glass card -->
        <Transition name="card-slide" appear>
          <div
            class="relative z-10 w-full max-w-100 mx-4"
            @click.stop
          >
            <div class="bg-background/75 dark:bg-background/70 backdrop-blur-2xl border border-foreground/8 rounded-2xl p-7 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Lock phase fade */
.lock-phase-enter-active  { transition: opacity 0.4s; }
.lock-phase-leave-active  { transition: opacity 0.4s; }
.lock-phase-enter-from,
.lock-phase-leave-to      { opacity: 0; }

/* Clock slide up on appear */
.clock-slide-enter-active {
  transition: opacity 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.clock-slide-enter-from { opacity: 0; transform: translateY(-12px); }

/* Hint slide up on appear */
.hint-slide-enter-active {
  transition: opacity 0.7s 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.hint-slide-enter-from { opacity: 0; transform: translateY(12px); }

/* Form phase overlay fade */
.form-phase-enter-active  { transition: opacity 0.3s; }
.form-phase-leave-active  { transition: opacity 0.3s; }
.form-phase-enter-from,
.form-phase-leave-to      { opacity: 0; }

/* Backdrop fade */
.backdrop-fade-enter-active { transition: opacity 0.4s; }
.backdrop-fade-enter-from   { opacity: 0; }

/* Card slide up + scale */
.card-slide-enter-active {
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-slide-enter-from  { opacity: 0; transform: translateY(40px) scale(0.97); }
.card-slide-leave-active {
  transition: opacity 0.3s,
              transform 0.3s;
}
.card-slide-leave-to    { opacity: 0; transform: translateY(20px) scale(0.97); }

/* Chevron bounce */
@keyframes bounce-x {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateY(5px); }
}
.animate-bounce-x { animation: bounce-x 1.8s ease-in-out infinite; }
</style>
