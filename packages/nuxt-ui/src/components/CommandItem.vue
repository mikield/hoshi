<script setup lang="ts">
import { inject, computed, ref, onMounted, type Ref } from "vue"
import { cn } from "../lib/utils"

interface Props {
  class?: string
  disabled?: boolean
  value?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ select: [value: string | undefined] }>()

const search = inject<Ref<string>>("command-search")
const shouldFilter = inject<boolean>("command-should-filter", true)

const el = ref<HTMLElement | null>(null)
const renderedText = ref("")

onMounted(() => {
  renderedText.value = el.value?.textContent?.toLowerCase() ?? ""
})

const isVisible = computed(() => {
  if (!shouldFilter || !search?.value) return true
  return renderedText.value.includes(search.value.toLowerCase())
})

function onClick() {
  if (props.disabled) return
  emit("select", props.value)
}
</script>
<template>
  <div
    ref="el"
    v-show="isVisible"
    data-slot="command-item"
    role="option"
    :data-disabled="disabled || undefined"
    :class="cn(
      `relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground/80 outline-hidden select-none transition-colors duration-75
      data-[highlighted]:bg-foreground/[0.06] data-[highlighted]:text-foreground
      [&_svg:not([class*='text-'])]:text-muted-foreground/65
      data-[disabled]:pointer-events-none data-[disabled]:opacity-40
      [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
      props.class
    )"
    @click="onClick"
  >
    <slot />
  </div>
</template>
