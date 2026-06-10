<script setup lang="ts">
import { Sun, Moon, Monitor } from "lucide-vue-next"
import { cn } from "../lib/utils"

// Segmented light/dark/system control (pill radius, on-brand). Pure v-model —
// the host app owns how the value maps to its color-mode implementation.
export type ThemeValue = "light" | "dark" | "system"

const model = defineModel<ThemeValue>({ default: "system" })

const OPTIONS: { value: ThemeValue; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
]
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Theme"
    class="flex items-center gap-0.5 rounded-full border border-border/50 bg-muted/40 p-0.5"
  >
    <button
      v-for="option in OPTIONS"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :aria-label="`Theme: ${option.label}`"
      :class="cn(
        'flex h-6 w-7 cursor-pointer items-center justify-center rounded-full transition-all duration-150',
        model === option.value
          ? 'bg-background text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)]'
          : 'text-muted-foreground/70 hover:text-foreground',
      )"
      @click="model = option.value"
    >
      <component :is="option.icon" class="size-3.5" />
    </button>
  </div>
</template>
