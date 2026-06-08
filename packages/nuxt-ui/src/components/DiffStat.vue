<script setup lang="ts">
import { cn } from "../lib/utils"
import { STATUS_TEXT } from "./status"

interface Props {
  additions?: number
  deletions?: number
  class?: string
}
const props = defineProps<Props>()
</script>
<template>
  <span v-if="additions || deletions" data-slot="diff-stat" :class="cn('inline-flex items-center gap-1.5 font-mono tabular-nums', props.class)">
    <span v-if="additions" :class="STATUS_TEXT.success">+{{ additions }}</span>
    <span v-if="deletions" :class="STATUS_TEXT.destructive">&minus;{{ deletions }}</span>
  </span>
</template>
