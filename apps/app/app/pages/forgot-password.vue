<script setup lang="ts">
import { ref } from 'vue'
import { Button, Divider, HoshiLoader, InfoBanner, Input, Logo } from '@hoshi/ui'
import { ArrowLeft, MailCheck, AlertCircle } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })

const email = ref('')
const pending = ref(false)
const sent = ref(false)
const error = ref<string | null>(null)
/** Returned by the API in non-production builds where no email goes out. */
const devLink = ref<string | null>(null)
const api = useApi()

async function onSubmit() {
  if (pending.value || !email.value.includes('@')) return
  pending.value = true
  error.value = null
  try {
    const res = await api<{ devLink?: string }>('/auth/forgot', {
      method: 'POST',
      body: { email: email.value.trim() },
    })
    devLink.value = res.devLink ?? null
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div>
    <Logo class="mb-8" />

    <Divider>Reset your password</Divider>

    <template v-if="!sent">
      <p class="mb-4 text-center text-sm text-muted-foreground">
        Enter your account email and we'll send you a link to set a new password.
      </p>

      <InfoBanner v-if="error" :icon="AlertCircle" tone="destructive" title="Heads up">
        {{ error }}
      </InfoBanner>

      <form class="space-y-3" @submit.prevent="onSubmit">
        <Input v-model="email" type="email" placeholder="Email address" required autofocus class="text-sm" />
        <Button type="submit" size="lg" :disabled="pending" class="w-full rounded-full text-sm">
          <HoshiLoader v-if="pending" size="small" variant="white" />
          {{ pending ? 'Sending link…' : 'Email me a reset link' }}
        </Button>
      </form>
    </template>

    <div v-else class="flex flex-col items-center gap-3 text-center">
      <MailCheck class="size-8 text-muted-foreground/40" :stroke-width="1.25" />
      <p class="text-sm text-muted-foreground">
        If an account exists for <span class="font-medium text-foreground">{{ email }}</span
        >, a reset link is on its way. It expires in 30 minutes.
      </p>
      <NuxtLink
        v-if="devLink"
        :to="devLink.replace(/^https?:\/\/[^/]+/, '')"
        class="mt-1 max-w-full truncate rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Dev build — open your reset link
      </NuxtLink>
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
