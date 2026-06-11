<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Divider, HoshiLoader, InfoBanner, Input, Logo } from '@hoshi/ui'
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { AuthUser } from '~/stores/auth'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : null))

const password = ref('')
const confirmPassword = ref('')
const pending = ref(false)
const error = ref<string | null>(null)
const api = useApi()
const auth = useAuthStore()

async function onSubmit() {
  if (pending.value) return
  error.value = null
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  pending.value = true
  try {
    const res = await api<{ user: AuthUser }>('/auth/reset', {
      method: 'POST',
      body: { token: token.value, password: password.value },
    })
    auth.user = res.user
    toast.success('Password updated — welcome back')
    await navigateTo('/projects')
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message ?? 'Something went wrong. Please try again.'
    pending.value = false
  }
}
</script>

<template>
  <div>
    <Logo class="mb-8" />

    <Divider>Choose a new password</Divider>

    <template v-if="token">
      <InfoBanner v-if="error" :icon="AlertCircle" tone="destructive" title="Heads up">
        {{ error }}
      </InfoBanner>

      <form class="space-y-3" @submit.prevent="onSubmit">
        <Input v-model="password" type="password" placeholder="New password" required autofocus class="text-sm" />
        <Input v-model="confirmPassword" type="password" placeholder="Confirm new password" required class="text-sm" />
        <Button type="submit" size="lg" :disabled="pending" class="w-full rounded-full text-sm">
          <HoshiLoader v-if="pending" size="small" variant="white" />
          {{ pending ? 'Updating…' : 'Set new password' }}
        </Button>
      </form>
    </template>

    <div v-else class="flex flex-col items-center gap-3 text-center">
      <AlertCircle class="size-8 text-muted-foreground/40" :stroke-width="1.25" />
      <p class="text-sm text-muted-foreground">
        This reset link is incomplete. Request a fresh one and use the full link from the email.
      </p>
      <Button variant="outline" class="rounded-full" @click="navigateTo('/forgot-password')">Request a new link</Button>
    </div>

    <div class="mt-5 text-center">
      <NuxtLink
        to="/login"
        class="inline-flex items-center gap-1 text-xs text-foreground/40 underline-offset-4 transition-colors hover:text-foreground/70 hover:underline"
      >
        <ArrowLeft class="size-3" />
        Back to sign in
      </NuxtLink>
    </div>
  </div>
</template>
