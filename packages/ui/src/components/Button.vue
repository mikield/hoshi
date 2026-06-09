<script setup lang="ts">
import { Primitive } from "reka-ui"
import { cn } from "../lib/utils"
import { buttonVariants, type ButtonVariants } from "./button"

interface Props {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  asChild?: boolean
  as?: string | object
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  asChild: false,
})
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
