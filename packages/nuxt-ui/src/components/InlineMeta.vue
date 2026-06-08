<script setup lang="ts">
import { cn } from "../lib/utils"
import { useSlots, h, Fragment } from "vue"
const props = defineProps<{ class?: string }>()
const slots = useSlots()

function render() {
  const children = (slots.default?.() ?? []).flatMap((vnode) =>
    Array.isArray(vnode.children) ? vnode.children as any[] : [vnode]
  ).filter((c) => c != null && c !== "" && c !== false)

  return h(
    "div",
    { class: cn("flex items-center gap-2 text-xs text-muted-foreground/70 min-w-0", props.class) },
    children.map((child, i) =>
      h(Fragment, { key: i }, [
        i > 0 ? h("span", { class: "text-muted-foreground/30" }, "·") : null,
        h("span", { class: "truncate" }, [child]),
      ])
    )
  )
}
</script>
<template>
  <component :is="render" />
</template>
