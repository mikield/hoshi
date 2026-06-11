<script setup lang="ts">
import {ref, computed} from 'vue'
import {AlertCircle} from 'lucide-vue-next'
import {
  Button,
  Input,
  HoshiLoader,
  cn,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Divider,
  Logo,
  InfoBanner
} from '@hoshi/ui'

definePageMeta({layout: false})

type Mode = 'signin' | 'register'
type Method = 'magic' | 'password'

const mode = ref<Mode>('signin')
const method = ref<Method>('magic')

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const error = ref<string | null>(null)
const info = ref<string | null>(null)
const pending = ref(false)

function resetState() {
  error.value = null
  info.value = null
}

function switchMode(m: Mode) {
  mode.value = m
  resetState()
}

function toggleMethod() {
  method.value = method.value === 'magic' ? 'password' : 'magic'
  resetState()
}

const submitLabel = computed(() => {
  if (pending.value) {
    if (method.value === 'magic') return 'Sending link…'
    return mode.value === 'signin' ? 'Signing in…' : 'Creating account…'
  }
  if (method.value === 'magic') return 'Email me a sign-in link'
  return mode.value === 'signin' ? 'Sign in' : 'Create account'
})

async function onSubmit() {
  resetState()

  if (method.value === 'magic') {
    info.value = "Magic links aren't available in this build — use password instead."
    return
  }

  if (mode.value === 'register' && password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  pending.value = true
  try {
    const api = useApi()
    if (mode.value === 'signin') {
      await api('/auth/login', {
        method: 'POST',
        body: {email: email.value, password: password.value},
      })
    } else {
      await api('/auth/register', {
        method: 'POST',
        body: {name: name.value, email: email.value, password: password.value},
      })
    }
    // Deep links (e.g. invite acceptance) round-trip through ?redirect=.
    const redirect = useRoute().query.redirect
    await navigateTo(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/projects')
  } catch (e: any) {
    error.value = e?.data?.error ?? 'Something went wrong. Please try again.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AuthShell>

    <Logo class="mb-8"/>

    <Divider>Welcome</Divider>

    <!-- Mode tabs -->
    <Tabs v-model="mode">
      <TabsList class="flex items-center gap-1 mb-5 bg-foreground/5 rounded-full p-1 w-fit mx-auto">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">

        <InfoBanner
            v-if="info"
            :icon="AlertCircle"
            tone="info"
            title="Heads up">
          {{ info }}
        </InfoBanner>
        <InfoBanner
            v-if="error"
            :icon="AlertCircle"
            tone="destructive"
            title="Heads up">
          {{ error }}
        </InfoBanner>


        <form class="space-y-3" @submit.prevent="onSubmit">
          <Input
              v-model="email"
              type="email"
              placeholder="Email address"
              required
              class="text-sm"
          />
          <template v-if="method === 'password'">
            <Input
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="text-sm"
            />
          </template>

          <Button type="submit" size="lg" :disabled="pending" class="w-full text-sm rounded-full">
            <HoshiLoader v-if="pending" size="small" variant="white"/>
            {{ submitLabel }}
          </Button>
        </form>

        <!-- Toggle method -->
        <div class="mt-4 text-center">
          <button
              type="button"
              class="text-xs text-foreground/40 underline-offset-4 transition-colors hover:text-foreground/70 hover:underline hover:cursor-pointer"
              @click="toggleMethod"
          >
            {{ method === 'magic' ? 'Use password instead' : 'Use email link instead' }}
          </button>
        </div>

        <Divider>or</Divider>

        <!-- Google (disabled placeholder) -->
        <button
            type="button"
            disabled
            title="Google sign-in isn't wired up in this build"
            class="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-foreground/8 bg-foreground/[0.03] text-sm text-foreground/70 transition-colors"
        >
          <svg class="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>


        <div v-if="method === 'password'" class="mt-5 text-center">
          <NuxtLink
              to="/forgot-password"
              class="text-xs text-foreground/40 underline-offset-4 transition-colors hover:text-foreground/70 hover:underline"
          >
            Forgot your password?
          </NuxtLink>
        </div>

      </TabsContent>

      <TabsContent value="register">

        <InfoBanner
            v-if="info"
            :icon="AlertCircle"
            tone="info"
            title="Heads up">
          {{ info }}
        </InfoBanner>
        <InfoBanner
            v-if="error"
            :icon="AlertCircle"
            tone="destructive"
            title="Heads up">
          {{ error }}
        </InfoBanner>

        <!-- Form -->
        <form class="space-y-3" @submit.prevent="onSubmit">
          <Input
              v-if="method === 'password'"
              v-model="name"
              type="text"
              placeholder="Name"
              class="text-sm"
          />
          <Input
              v-model="email"
              type="email"
              placeholder="Email address"
              required
              class="text-sm"
          />
          <template v-if="method === 'password'">
            <Input
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="text-sm"
            />
            <Input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm password"
                required
                class="text-sm"
            />
          </template>

          <Button type="submit" size="lg" :disabled="pending" class="w-full text-sm rounded-full">
            <HoshiLoader v-if="pending" size="small" variant="white"/>
            {{ submitLabel }}
          </Button>
        </form>

        <!-- Toggle method -->
        <div class="mt-4 text-center">
          <button
              type="button"
              class="text-xs text-foreground/40 underline-offset-4 transition-colors hover:text-foreground/70 hover:underline hover:cursor-pointer"
              @click="toggleMethod"
          >
            {{ method === 'magic' ? 'Use password instead' : 'Use email link instead' }}
          </button>
        </div>

        <Divider>or</Divider>

        <!-- Google (disabled placeholder) -->
        <button
            type="button"
            disabled
            title="Google sign-in isn't wired up in this build"
            class="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-foreground/8 bg-foreground/[0.03] text-sm text-foreground/70 transition-colors"
        >
          <svg class="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

      </TabsContent>
    </Tabs>
  </AuthShell>
</template>
