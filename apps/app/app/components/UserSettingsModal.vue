<script setup lang="ts">
import type { Component } from 'vue'
import { Dialog, DialogContent, DialogTitle, cn } from '@hoshi/ui'
import { VisuallyHidden } from 'reka-ui'
import { Bell, Keyboard, KeyRound, Palette, Settings2, Volume2 } from 'lucide-vue-next'

type SettingsTab = 'general' | 'appearance' | 'sounds' | 'notifications' | 'shortcuts' | 'cli-tokens'

const { open } = useSettingsModal()
const tab = ref<SettingsTab>('general')

const TAB_GROUPS: { label: string; tabs: { id: SettingsTab; label: string; icon: Component }[] }[] = [
  {
    label: 'Preferences',
    tabs: [
      { id: 'general', label: 'General', icon: Settings2 },
      { id: 'appearance', label: 'Appearance', icon: Palette },
      { id: 'sounds', label: 'Sounds', icon: Volume2 },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    ],
  },
  {
    label: 'Account',
    tabs: [{ id: 'cli-tokens', label: 'CLI tokens', icon: KeyRound }],
  },
]
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="h-[80vh] max-h-[90vh] max-w-4xl gap-0 overflow-hidden p-0">
      <VisuallyHidden>
        <DialogTitle>Settings</DialogTitle>
      </VisuallyHidden>
      <div class="flex h-full min-h-0">
        <!-- Sidebar -->
        <aside class="w-56 flex-shrink-0 border-r border-border bg-background p-4">
          <div class="flex flex-col gap-4">
            <div v-for="group in TAB_GROUPS" :key="group.label">
              <div class="px-4 pb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">{{ group.label }}</div>
              <div class="flex flex-col gap-0.5">
                <button
                  v-for="item in group.tabs"
                  :key="item.id"
                  type="button"
                  :class="cn(
                    'flex w-full cursor-pointer items-center justify-start gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    tab === item.id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )"
                  @click="tab = item.id"
                >
                  <component :is="item.icon" class="size-4 shrink-0" />
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Content -->
        <div class="min-h-0 min-w-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <SettingsGeneralTab v-if="tab === 'general'" />
          <SettingsAppearanceTab v-else-if="tab === 'appearance'" />
          <SettingsSoundsTab v-else-if="tab === 'sounds'" />
          <SettingsNotificationsTab v-else-if="tab === 'notifications'" />
          <SettingsShortcutsTab v-else-if="tab === 'shortcuts'" />
          <SettingsCliTokensTab v-else-if="tab === 'cli-tokens'" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
