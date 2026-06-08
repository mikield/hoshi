<script setup lang="ts">
import { DropdownMenuCheckboxItem as Primitive, DropdownMenuItemIndicator } from "reka-ui"
import { CheckIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

const props = defineProps<{ class?: string; modelValue?: boolean }>()
const emit = defineEmits<{ "update:modelValue": [v: boolean] }>()
</script>
<template>
  <Primitive
    data-slot="dropdown-menu-checkbox-item"
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    :class="cn(
      'relative flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      props.class
    )"
  >
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <CheckIcon class="size-4" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </Primitive>
</template>
