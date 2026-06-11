<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="flex items-start gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
        <component :is="icon" class="size-5 text-primary" />
      </span>
      <div class="leading-tight">
        <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ title }}</h1>
        <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>
