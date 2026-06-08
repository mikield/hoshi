<script setup lang="ts">
import Popover from "./Popover.vue"

interface Props {
  open: boolean
  modal?: boolean
}
const props = withDefaults(defineProps<Props>(), { modal: true })
const emit = defineEmits<{ "update:open": [value: boolean] }>()
</script>
<template>
  <Popover :open="open" :modal="modal" @update:open="emit('update:open', $event)">
    <slot />
  </Popover>
</template>
