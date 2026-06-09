<script setup lang="ts">
import { Toaster as Sonner } from "vue-sonner"

interface Props {
  theme?: "light" | "dark" | "system"
}
const props = withDefaults(defineProps<Props>(), { theme: "system" })
</script>
<template>
  <Sonner
    :theme="theme"
    class="toaster group"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': '1rem',
    }"
  />
</template>
