<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, Teleport } from "vue"

// vaul-vue@0.2.1 unconditionally sets body{position:fixed} for scroll-lock (unlike
// React vaul which skips this on non-Safari). Chrome uses a position:fixed body as
// the containing block for its fixed-positioned descendants, pushing the drawer content
// far off-screen. Fix: teleport into a div appended to <html> (sibling of <body>) so
// it sits outside body's layout context entirely.
const container = ref<HTMLElement | null>(null)

onMounted(() => {
  const div = document.createElement("div")
  div.setAttribute("data-slot", "drawer-portal")
  document.documentElement.appendChild(div)
  container.value = div
})

onBeforeUnmount(() => {
  container.value?.remove()
  container.value = null
})
</script>
<template>
  <Teleport v-if="container" :to="container">
    <slot />
  </Teleport>
</template>
