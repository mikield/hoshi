<script setup lang="ts">
import { DrawerContent as Primitive } from "vaul-vue"
import { cn } from "../lib/utils"
import DrawerPortal from "./DrawerPortal.vue"
import DrawerOverlay from "./DrawerOverlay.vue"

const props = defineProps<{ class?: string }>()
</script>
<template>
  <DrawerPortal>
    <DrawerOverlay />
    <Primitive
      data-slot="drawer-content"
      :class="cn(
        'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
        '[&[vaul-drawer-direction=top]]:inset-x-0 [&[vaul-drawer-direction=top]]:top-0 [&[vaul-drawer-direction=top]]:mb-24 [&[vaul-drawer-direction=top]]:max-h-[80vh] [&[vaul-drawer-direction=top]]:rounded-b-lg [&[vaul-drawer-direction=top]]:border-b',
        '[&[vaul-drawer-direction=bottom]]:inset-x-0 [&[vaul-drawer-direction=bottom]]:bottom-0 [&[vaul-drawer-direction=bottom]]:mt-24 [&[vaul-drawer-direction=bottom]]:max-h-[80vh] [&[vaul-drawer-direction=bottom]]:rounded-t-lg [&[vaul-drawer-direction=bottom]]:border-t',
        '[&[vaul-drawer-direction=right]]:inset-y-0 [&[vaul-drawer-direction=right]]:right-0 [&[vaul-drawer-direction=right]]:w-3/4 [&[vaul-drawer-direction=right]]:border-l [&[vaul-drawer-direction=right]]:sm:max-w-sm',
        '[&[vaul-drawer-direction=left]]:inset-y-0 [&[vaul-drawer-direction=left]]:left-0 [&[vaul-drawer-direction=left]]:w-3/4 [&[vaul-drawer-direction=left]]:border-r [&[vaul-drawer-direction=left]]:sm:max-w-sm',
        props.class
      )"
    >
      <div class="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-[&[vaul-drawer-direction=bottom]]/drawer-content:block" />
      <slot />
    </Primitive>
  </DrawerPortal>
</template>
