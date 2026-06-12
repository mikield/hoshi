<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string }>()
</script>
<template>
  <!-- Slim scrollbar inlined — a library component must not depend on an
       app-defined CSS utility. -->
  <div
    data-slot="command-list"
    :class="cn(
      'max-h-[min(60vh,480px)] scroll-py-2 overflow-x-hidden overflow-y-auto py-1',
      '[scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--muted-foreground)_25%,transparent)_transparent]',
      '[&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
