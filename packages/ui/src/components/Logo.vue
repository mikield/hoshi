<script setup lang="ts">
import { computed } from "vue"
import { cn } from "../lib/utils"

interface Props {
  variant?: "symbol" | "logo"
}

const props = withDefaults(defineProps<Props>(), { variant: "logo" })

// Theme handling is pure CSS: ship one asset and
// invert it for the opposite mode, so the logo never depends on JS color-mode
// state being resolved.
const ASSETS = {
  symbol: {
    src: "/brandkit/Logo/Brandmark/SVG/Brandmark Black.svg",
    class: "dark:invert",
  },
  logo: {
    src: "/brandkit/Logo/Logomark/SVG/Logomark White.svg",
    class: "invert dark:invert-0",
  },
} as const

const asset = computed(() => ASSETS[props.variant])
</script>

<template>
  <img :src="asset.src" alt="Logo" :class="cn('shrink-0 select-none', asset.class)" />
</template>
