<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDark } from '@vueuse/core'
import { cn } from '../lib/utils'

const props = withDefaults(defineProps<{
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  speed?: number
  customSize?: number
  class?: string
  variant?: 'white' | 'black' | 'auto'
}>(), {
  size: 'medium',
  speed: 1.2,
  variant: 'auto',
})

const SIZE_MAP = { small: 20, medium: 24, large: 32, xlarge: 40 } as const

const mounted = ref(false)
onMounted(() => { mounted.value = true })

const isDark = useDark()

const loaderSize = computed(() => props.customSize ?? SIZE_MAP[props.size])
const borderWidth = computed(() => Math.max(2, Math.round(loaderSize.value / 16)))
const duration = computed(() => `${(0.8 / props.speed).toFixed(2)}s`)

const effectiveVariant = computed<'white' | 'black'>(() => {
  if (props.variant !== 'auto') return props.variant
  return isDark.value ? 'white' : 'black'
})

const borderColor = computed(() =>
  effectiveVariant.value === 'white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
)
const spinnerColor = computed(() =>
  effectiveVariant.value === 'white' ? '#ffffff' : '#000000',
)
</script>

<template>
  <div :class="cn('flex items-center justify-center', props.class)">
    <div
      v-if="mounted"
      :style="{
        width: `${loaderSize}px`,
        height: `${loaderSize}px`,
        border: `${borderWidth}px solid ${borderColor}`,
        borderTopColor: spinnerColor,
        borderRadius: '50%',
        animation: `hoshi-spin ${duration} linear infinite`,
      }"
    />
    <div
      v-else
      :style="{ width: `${loaderSize}px`, height: `${loaderSize}px` }"
    />
  </div>
</template>

<style>
@keyframes hoshi-spin {
  to { transform: rotate(360deg); }
}
</style>
