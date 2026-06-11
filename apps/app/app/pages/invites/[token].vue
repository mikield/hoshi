<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Badge, Button, EntityAvatar, HoshiLoader, Logo } from '@hoshi/ui'
import { Loader2, MailX } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface InvitePreview {
  email: string
  role: 'admin' | 'member'
  organization: string
  invitedBy: string
}

definePageMeta({ layout: 'auth' })

const route = useRoute()
const token = route.params.token as string
const api = useApi()
const orgs = useOrganizationsStore()
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const invite = ref<InvitePreview | null>(null)
const loading = ref(true)
const invalid = ref(false)
const accepting = ref(false)

/** Signed in with the invited address — the only state that can accept. */
const matches = computed(() => user.value?.email.toLowerCase() === invite.value?.email)

onMounted(async () => {
  try {
    const [{ invite: preview }] = await Promise.all([
      api<{ invite: InvitePreview }>(`/invites/${token}`),
      auth.fetchUser().catch(() => null),
    ])
    invite.value = preview
  } catch {
    invalid.value = true
  } finally {
    loading.value = false
  }
})

async function accept() {
  if (accepting.value) return
  accepting.value = true
  try {
    const res = await api<{ orgId: string }>(`/invites/${token}/accept`, { method: 'POST' })
    await orgs.load(true)
    orgs.setCurrent(res.orgId)
    toast.success(`Welcome to ${invite.value?.organization}`)
    await navigateTo('/projects')
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    toast.error(message ?? 'Failed to accept the invite')
    accepting.value = false
  }
}

function signIn() {
  navigateTo(`/login?redirect=${encodeURIComponent(`/invites/${token}`)}`)
}
</script>

<template>
  <div>
    <Logo class="mb-8" />

    <div v-if="loading" class="flex justify-center py-10"><HoshiLoader class="size-5" /></div>

    <template v-else-if="invalid">
      <div class="flex flex-col items-center gap-3 text-center">
        <MailX class="size-8 text-muted-foreground/40" :stroke-width="1.25" />
        <h1 class="text-lg font-semibold tracking-tight">This invite isn't valid</h1>
        <p class="max-w-xs text-sm text-muted-foreground">
          The link may have expired or been revoked. Ask whoever invited you for a fresh one.
        </p>
        <Button variant="outline" class="mt-2 rounded-full" @click="navigateTo('/')">Go home</Button>
      </div>
    </template>

    <template v-else-if="invite">
      <div class="flex flex-col items-center gap-4 text-center">
        <EntityAvatar :label="invite.organization" size="lg" />
        <div class="space-y-1">
          <h1 class="text-lg font-semibold tracking-tight">Join {{ invite.organization }}</h1>
          <p class="text-sm text-muted-foreground">
            {{ invite.invitedBy }} invited <span class="font-medium text-foreground">{{ invite.email }}</span>
            to join as <Badge variant="secondary" class="align-middle">{{ invite.role }}</Badge>
          </p>
        </div>

        <Button v-if="matches" class="mt-2 w-full max-w-60 gap-1.5 rounded-full" :disabled="accepting" @click="accept">
          <Loader2 v-if="accepting" class="size-4 animate-spin" />
          Accept invite
        </Button>
        <template v-else>
          <p class="max-w-xs text-xs text-muted-foreground">
            {{ user ? `You're signed in as ${user.email} — switch to the invited account to accept.` : 'Sign in with the invited email to accept.' }}
          </p>
          <Button class="mt-1 w-full max-w-60 rounded-full" @click="signIn">
            Sign in as {{ invite.email }}
          </Button>
        </template>
      </div>
    </template>
  </div>
</template>
