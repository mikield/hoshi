<script setup lang="ts">
import {TabsRoot} from "reka-ui"
import {cn} from "../lib/utils"

defineOptions({inheritAttrs: false})
const props = defineProps<{ class?: string }>()
</script>
<template>
  <TabsRoot data-slot="tabs" :class="cn('flex flex-col gap-2', props.class)" v-bind="$attrs">
    <slot/>
  </TabsRoot>
</template>
