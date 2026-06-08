<script setup lang="ts">
import { ref, onMounted } from "vue"
import { DialogPortal as Primitive } from "reka-ui"
import { getPortalRoot } from "../lib/portal-root"

defineOptions({ inheritAttrs: false })

const container = ref<HTMLElement | null>(null)
onMounted(() => {
  container.value = getPortalRoot()
})
</script>
<template>
  <Primitive v-if="container" :to="container">
    <slot />
  </Primitive>
</template>
