<script setup lang="ts">
import { Toaster } from "@hoshi/ui"

useHead({
  htmlAttrs: {
    class: "",
  },
})

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UserSettingsModal />
    <CustomizeOverlay />
    <Toaster />
  </div>
</template>
