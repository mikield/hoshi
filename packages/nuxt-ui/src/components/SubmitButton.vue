<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next"
import Button from "./Button.vue"
import Alert from "./Alert.vue"
import AlertDescription from "./AlertDescription.vue"
import type { ButtonVariants } from "./button"

interface Props {
  pending?: boolean
  pendingText?: string
  errorMessage?: string
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
}
withDefaults(defineProps<Props>(), { pendingText: "Submitting..." })
</script>

<template>
  <div class="flex flex-col gap-y-4 w-full">
    <Alert v-if="errorMessage" variant="destructive" class="w-full">
      <AlertTriangle class="h-4 w-4" />
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>
    <div>
      <Button type="submit" :variant="variant" :size="size" :aria-disabled="pending" :disabled="pending">
        <slot v-if="!pending" />
        <template v-else>{{ pendingText }}</template>
      </Button>
    </div>
  </div>
</template>
