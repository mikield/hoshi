<script setup lang="ts">
import { cn } from "../lib/utils"

interface Props {
  dividers?: boolean
  class?: string
}
const props = defineProps<Props>()
</script>
<template>
  <dl :class="cn(dividers && 'divide-y divide-border/60 border-y border-border/60', props.class)">
    <slot />
  </dl>
</template>
