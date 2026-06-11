<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Divider, HoshiLoader, InfoBanner, Input } from '@hoshi/ui'
import { AlertCircle } from 'lucide-vue-next'

const auth = useAuthStore()
const { user, locked } = storeToRefs(auth)

const password = ref('')
const pending = ref(false)
const error = ref<string | null>(null)

watch(locked, (isLocked) => {
  if (!isLocked) {
    password.value = ''
    error.value = null
  }
})

async function onSubmit() {
  if (pending.value || !password.value) return
  pending.value = true
  error.value = null
  try {
    await auth.unlock(password.value)
  } catch (e: any) {
    error.value = e?.data?.error ?? 'Incorrect password.'
    pending.value = false
  }
}

async function signOut() {
  if (pending.value) return
  pending.value = true
  try {
    await auth.logout()
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lock-screen">
      <!-- Solid backdrop — nothing behind the lock may shine through. -->
      <div v-if="locked && user" class="fixed inset-0 z-[100] bg-background">
        <AuthShell initial-phase="lock">
          <div class="flex flex-col items-center text-center">
            <span
              class="flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-base font-semibold text-foreground"
            >
              {{ (user.name ?? user.email).slice(0, 1).toUpperCase() }}
            </span>
            <p class="mt-3 text-sm font-medium text-foreground">{{ user.name ?? user.email }}</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Locked after inactivity</p>
          </div>

          <Divider class="my-5">Enter your password to continue</Divider>

          <InfoBanner v-if="error" :icon="AlertCircle" tone="destructive" title="Heads up">
            {{ error }}
          </InfoBanner>

          <form class="space-y-3" @submit.prevent="onSubmit">
            <Input v-model="password" type="password" placeholder="Password" required autofocus class="text-sm" />
            <Button type="submit" size="lg" :disabled="pending" class="w-full rounded-full text-sm">
              <HoshiLoader v-if="pending" size="small" variant="white" />
              {{ pending ? 'Unlocking…' : 'Unlock' }}
            </Button>
          </form>

          <div class="mt-5 text-center">
            <button
              type="button"
              class="text-xs text-foreground/40 underline-offset-4 transition-colors hover:text-foreground/70 hover:underline"
              @click="signOut"
            >
              Not you? Sign in as someone else
            </button>
          </div>
        </AuthShell>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lock-screen-enter-active {
  transition: opacity 0.3s ease-out;
}
.lock-screen-leave-active {
  transition: opacity 0.25s ease-in;
}
.lock-screen-enter-from,
.lock-screen-leave-to {
  opacity: 0;
}
</style>
