<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Button,
  EmptyState,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@hoshi/ui'
import { ArrowLeft, CircleHelp, FileClock, Github, Layers, Plus, Search, Users2 } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })

const TAB_IDS = ['members', 'groups', 'billing', 'transactions', 'git', 'audit', 'settings'] as const
type OrganizationTab = (typeof TAB_IDS)[number]

const route = useRoute()
const user = useAuthUser()

const initialTab = TAB_IDS.includes(route.query.tab as OrganizationTab)
  ? (route.query.tab as OrganizationTab)
  : 'members'
const tab = ref<OrganizationTab>(initialTab)

const groupQuery = ref('')

const organizationName = computed(() => `${user.value?.email ?? 'Your'}'s Organization`)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <AppHeader v-if="user" :user="user" breadcrumb="Organization" />
    <main class="flex-1 px-4 py-8">
      <div class="mx-auto w-full max-w-4xl space-y-8">
        <!-- Breadcrumb + title -->
        <div class="space-y-3">
          <NuxtLink
            to="/projects"
            class="inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft class="size-3" />
            Back to projects
          </NuxtLink>
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Organizations</span>
            <span class="text-muted-foreground/40">/</span>
            <span class="truncate font-medium text-foreground">Organization</span>
          </div>
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 class="text-2xl font-semibold tracking-tight text-foreground">Organization</h1>
              <p class="mt-1 text-sm text-muted-foreground">Manage organization settings, members, and access.</p>
            </div>
            <Button variant="secondary" class="gap-1.5 rounded-full" disabled>
              <CircleHelp class="size-4" />
              How permissions work
            </Button>
          </div>
        </div>

        <Tabs v-model="tab" class="gap-6">
          <TabsList class="max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <TabsTrigger value="members">All members</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="transactions">Credits ledger</TabsTrigger>
            <TabsTrigger value="git">Git</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="members" class="space-y-6">
            <OrganizationMembersTab />
          </TabsContent>

          <TabsContent value="groups" class="space-y-6">
            <OrganizationSectionCard
              title="Groups"
              description="Bundle members together and attach the whole group to projects with a role."
            >
              <template #actions>
                <Button class="gap-1.5 rounded-full" disabled>
                  <Plus class="size-4" />
                  Create a group
                </Button>
              </template>
              <template #search>
                <div class="relative max-w-sm">
                  <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input v-model="groupQuery" placeholder="Search by user group name…" class="h-9 pl-9" />
                </div>
              </template>
              <EmptyState :icon="Users2" title="No groups yet" class="py-12">
                <template #description>Create a group to bulk-add members to projects.</template>
              </EmptyState>
            </OrganizationSectionCard>
          </TabsContent>

          <TabsContent value="billing" class="space-y-6">
            <OrganizationBillingTab />
          </TabsContent>

          <TabsContent value="transactions" class="space-y-6">
            <OrganizationSectionCard
              title="Credits ledger"
              description="Every credit purchase and usage charge for this organization."
            >
              <EmptyState :icon="Layers" title="No transactions yet" class="py-12">
                <template #description>Credit purchases and usage charges will be listed here.</template>
              </EmptyState>
            </OrganizationSectionCard>
          </TabsContent>

          <TabsContent value="git" class="space-y-6">
            <OrganizationSectionCard
              title="Git Connections"
              description="Connect one or more GitHub users or organizations."
            >
              <template #actions>
                <Button class="gap-1.5 rounded-full" disabled>
                  <Github class="size-4" />
                  Connect GitHub
                </Button>
              </template>
              <EmptyState :icon="Github" title="No Git connections" class="py-12">
                <template #description>Connect a GitHub user or organization to import repositories.</template>
              </EmptyState>
            </OrganizationSectionCard>
          </TabsContent>

          <TabsContent value="audit" class="space-y-6">
            <OrganizationSectionCard
              title="Audit log"
              description="Security-relevant actions across the organization."
            >
              <EmptyState :icon="FileClock" title="No audit events yet" class="py-12">
                <template #description>Sign-ins, permission changes, and other sensitive actions land here.</template>
              </EmptyState>
            </OrganizationSectionCard>
          </TabsContent>

          <TabsContent value="settings" class="space-y-6">
            <OrganizationSettingsTab :organization-name="organizationName" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
</template>
