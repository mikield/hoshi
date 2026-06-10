<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input, Label } from '@hoshi/ui'

// Mock surface — organization records have no backend yet (single-user app).
const props = defineProps<{ organizationName: string }>()

const name = ref(props.organizationName)
</script>

<template>
  <div class="space-y-6">
    <!-- General -->
    <div class="space-y-3">
      <div class="space-y-0.5 px-1">
        <h3 class="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">General</h3>
        <p class="text-[11px] text-muted-foreground/80">Basic information about this organization.</p>
      </div>
      <div class="rounded-2xl border border-border/60 bg-card">
        <div class="space-y-4 px-6 py-5">
          <div class="space-y-1.5">
            <Label for="org-name">Organization name</Label>
            <Input id="org-name" v-model="name" maxlength="120" class="max-w-md" />
          </div>
          <div class="flex items-center justify-between border-t border-border/60 pt-4">
            <span class="text-xs text-muted-foreground">Shown in the header breadcrumb.</span>
            <Button size="sm" class="gap-1.5" disabled>Save changes</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Security -->
    <div class="space-y-3">
      <div class="space-y-0.5 px-1">
        <h3 class="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">Security</h3>
      </div>
      <div class="rounded-2xl border border-border/60 bg-card">
        <div class="flex items-center justify-between gap-4 px-6 py-5">
          <div class="leading-tight">
            <div class="text-sm font-medium text-foreground">Require two-factor authentication</div>
            <p class="mt-0.5 text-xs text-muted-foreground">Every member must enable 2FA to access this organization.</p>
          </div>
          <Button size="sm" variant="outline" disabled>Configure</Button>
        </div>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="space-y-3">
      <div class="space-y-0.5 px-1">
        <h3 class="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">Danger zone</h3>
        <p class="text-[11px] text-muted-foreground/80">Irreversible actions for this organization.</p>
      </div>
      <div class="rounded-2xl border border-destructive/30 bg-card">
        <div class="flex items-center justify-between gap-4 px-6 py-5">
          <div class="leading-tight">
            <div class="text-sm font-medium text-foreground">Delete organization</div>
            <p class="mt-0.5 text-xs text-muted-foreground">Removes the organization, its projects, and member access.</p>
          </div>
          <Button variant="destructive" size="sm" class="shrink-0" disabled>Delete</Button>
        </div>
      </div>
    </div>
  </div>
</template>
