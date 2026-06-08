<script setup lang="ts">
import { inject, type Ref } from "vue"
import { SearchIcon } from "lucide-vue-next"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  compact?: boolean
  placeholder?: string
}
const props = defineProps<Props>()
const search = inject<Ref<string>>("command-search")!

function onInput(e: Event) {
  if (search) search.value = (e.target as HTMLInputElement).value
}
</script>
<template>
  <div data-slot="command-input-wrapper" :class="cn('flex items-center border-b border-border/50', compact ? 'h-11 gap-2.5 px-3.5' : 'h-[58px] gap-3 px-5')">
    <SearchIcon :class="cn('shrink-0 text-muted-foreground/60', compact ? 'size-4' : 'size-[18px]')" />
    <input
      data-slot="command-input"
      :value="search?.value"
      @input="onInput"
      :placeholder="placeholder"
      :class="cn(
        'placeholder:text-muted-foreground/45 text-foreground flex w-full bg-transparent outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        compact ? 'h-11 text-sm' : 'h-[58px] text-sm tracking-[-0.005em]',
        props.class
      )"
    />
    <slot name="rightElement" />
  </div>
</template>
