<script setup lang="ts">
import {TabsList as Primitive} from "reka-ui"
import {cn} from "../lib/utils"

const props = defineProps<{ class?: string }>()
</script>
<template>
  <Primitive data-slot="tabs-list"
             :class="cn('bg-foreground/[0.05] text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-0.5 gap-0.5', props.class)">
    <slot/>
  </Primitive>
</template>
