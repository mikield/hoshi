<script setup lang="ts">
import { ref } from "vue"
import { Toaster } from "@hoshi/ui"

useHead({
  htmlAttrs: {
    class: "",
  },
})

/** Hierarchy depth of a route — auth-ish screens sit below the app so that
 *  signing in always feels like moving forward. */
function routeDepth(path: string): number {
  if (/^\/(login|forgot-password|reset-password|invites)/.test(path)) return 0
  return path.split('/').filter(Boolean).length
}

/** Directional page transition: deeper = forward, shallower = back, lateral = rise. */
const transitionName = ref('page-fade')
useRouter().beforeResolve((to, from) => {
  if (to.path === from.path) return
  const delta = routeDepth(to.path) - routeDepth(from.path)
  transitionName.value = delta > 0 ? 'page-forward' : delta < 0 ? 'page-back' : 'page-fade'
})

useIdleLock()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="{ name: transitionName, mode: 'out-in' }" />
    </NuxtLayout>
    <UserSettingsModal />
    <CustomizeOverlay />
    <LockScreen />
    <Toaster />
  </div>
</template>
