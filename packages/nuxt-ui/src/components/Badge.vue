<script setup lang="ts">
import { Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { badgeVariants, type BadgeVariants } from "./badge"

interface Props {
  variant?: BadgeVariants["variant"]
  size?: BadgeVariants["size"]
  asChild?: boolean
  as?: string | object
  class?: string
}
const props = withDefaults(defineProps<Props>(), { as: "span", asChild: false })
</script>

<template>
  <Primitive
    data-slot="badge"
    :as="as"
    :as-child="asChild"
    :class="cn(badgeVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
