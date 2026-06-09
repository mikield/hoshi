<script setup lang="ts">
import { Toaster } from "@kortix/nuxt-ui"

useHead({
  htmlAttrs: {
    class: "",
  },
})

onMounted(() => {
  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  const apply = (isDark: boolean) => document.documentElement.classList.toggle("dark", isDark)
  apply(mql.matches)
  mql.addEventListener("change", (e) => apply(e.matches))
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Toaster />
  </div>
</template>
