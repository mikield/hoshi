<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from "reka-ui"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; modelValue?: boolean }>()
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()
</script>

<template>
  <SwitchRoot
    data-slot="switch"
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    :class="cn(
      'peer cursor-pointer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  >
    <SwitchThumb
      data-slot="switch-thumb"
      class="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
    />
  </SwitchRoot>
</template>
