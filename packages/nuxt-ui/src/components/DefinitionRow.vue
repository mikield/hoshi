<script setup lang="ts">
interface Props {
  label: string
  labelWidth?: number
  title?: string
}
const props = withDefaults(defineProps<Props>(), { labelWidth: 110 })
</script>
<template>
  <div class="flex items-baseline gap-6 py-2.5">
    <dt class="text-xs text-muted-foreground/70 shrink-0 font-medium" :style="{ width: `${props.labelWidth}px` }">{{ label }}</dt>
    <dd class="text-sm text-foreground/90 min-w-0 flex-1 truncate" :title="title"><slot /></dd>
  </div>
</template>
