<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  length?: number
  disabled?: boolean
}>(), {
  modelValue: '',
  length: 6,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

const digits = ref<string[]>(Array.from({ length: props.length }, () => ''))
const inputRefs = ref<(HTMLInputElement | null)[]>([])

watch(() => props.modelValue, (val) => {
  const chars = (val ?? '').slice(0, props.length).split('')
  digits.value = Array.from({ length: props.length }, (_, i) => chars[i] ?? '')
})

function focus(index: number) {
  nextTick(() => inputRefs.value[index]?.focus())
}

function onInput(index: number, event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const digit = raw.replace(/\D/g, '').slice(-1)

  digits.value[index] = digit
  emitValue()

  if (digit && index < props.length - 1) {
    focus(index + 1)
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    focus(index - 1)
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  const clean = text.replace(/\D/g, '').slice(0, props.length)
  if (!clean) return

  const chars = clean.split('')
  digits.value = Array.from({ length: props.length }, (_, i) => chars[i] ?? '')
  emitValue()
  focus(Math.min(clean.length, props.length - 1))
}

function emitValue() {
  const value = digits.value.join('')
  emit('update:modelValue', value)
  if (value.length === props.length) {
    emit('complete', value)
  }
}
</script>

<template>
  <div class="flex gap-2 justify-center">
    <input
      v-for="(_, i) in digits"
      :key="i"
      :ref="(el) => { inputRefs[i] = el as HTMLInputElement | null }"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digits[i]"
      :disabled="disabled"
      class="w-12 h-14 text-center text-lg font-semibold rounded-2xl border border-border/70 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @paste="onPaste"
    />
  </div>
</template>
