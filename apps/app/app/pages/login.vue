<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input, cn } from '@hoshi/ui'
import { AlertCircle, Loader2 } from 'lucide-vue-next'

const fieldClass = 'border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/30 focus:ring-white/20'

const method = ref<'magic' | 'password'>('magic')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const info = ref<string | null>(null)
const pending = ref(false)

const description = computed(() =>
  method.value === 'magic' ? 'We will email you a secure sign-in link' : 'Your AI Computer',
)

async function onSubmit() {
  error.value = null
  info.value = null

  if (method.value === 'magic') {
    info.value = "Magic links aren't available in this gallery build — use a password to sign in instead."
    return
  }

  pending.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await navigateTo('/projects')
  } catch (e: any) {
    error.value = e?.data?.error ?? 'Something went wrong. Please try again.'
  } finally {
    pending.value = false
  }
}

function toggleMethod() {
  method.value = method.value === 'magic' ? 'password' : 'magic'
  error.value = null
  info.value = null
}
</script>

<template>
  <AuthShell mode="signin" title="Sign in to Kortix" :description="description">
    <form class="space-y-3" @submit.prevent="onSubmit">
      <div
        v-if="error"
        class="mb-1 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-destructive"
      >
        <AlertCircle class="h-4 w-4 shrink-0" />
        <span class="text-sm">{{ error }}</span>
      </div>
      <div
        v-if="info"
        class="mb-1 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 text-white/70"
      >
        <AlertCircle class="h-4 w-4 shrink-0" />
        <span class="text-sm">{{ info }}</span>
      </div>
      <Input
        v-model="email"
        type="email"
        placeholder="Email address"
        required
        :class="cn('text-sm', fieldClass)"
      />
      <Input
        v-if="method === 'password'"
        v-model="password"
        type="password"
        placeholder="Password"
        required
        :class="cn('text-sm', fieldClass)"
      />
      <Button type="submit" size="lg" :disabled="pending" class="w-full rounded-xl text-sm">
        <Loader2 v-if="pending" class="size-4 animate-spin" />
        <template v-else-if="method === 'magic'">Email me a sign-in link</template>
        <template v-else>Sign in</template>
      </Button>
    </form>

    <div class="mt-4 text-center">
      <button
        type="button"
        class="text-xs text-white/40 underline-offset-4 transition-colors hover:text-white/70 hover:underline"
        @click="toggleMethod"
      >
        {{ method === 'magic' ? 'Use password instead' : 'Use email link instead' }}
      </button>
    </div>
  </AuthShell>
</template>
