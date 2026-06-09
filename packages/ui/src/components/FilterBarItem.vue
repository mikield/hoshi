<script setup lang="ts">
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; active?: boolean }>()
</script>
<template>
  <button
    data-slot="filter-bar-item"
    role="tab"
    type="button"
    :data-state="active ? 'active' : undefined"
    :class="cn(
      `cursor-pointer inline-flex h-[calc(100%-4px)] flex-1 items-center justify-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 text-muted-foreground/60 hover:text-foreground/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-foreground/[0.06] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5`,
      props.class
    )"
  ><slot /></button>
</template>
