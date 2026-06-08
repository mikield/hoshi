<script setup lang="ts">
import { cn } from "../lib/utils"
import { buttonVariants, type ButtonVariants } from "./button"
import AlertDialog from "./AlertDialog.vue"
import AlertDialogContent from "./AlertDialogContent.vue"
import AlertDialogHeader from "./AlertDialogHeader.vue"
import AlertDialogTitle from "./AlertDialogTitle.vue"
import AlertDialogDescription from "./AlertDialogDescription.vue"
import AlertDialogFooter from "./AlertDialogFooter.vue"
import AlertDialogCancel from "./AlertDialogCancel.vue"
import AlertDialogAction from "./AlertDialogAction.vue"

interface Props {
  open: boolean
  title: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  confirmVariant?: ButtonVariants["variant"]
}
const props = withDefaults(defineProps<Props>(), {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  confirmVariant: "default",
})
const emit = defineEmits<{
  "update:open": [open: boolean]
  confirm: []
}>()

function handleConfirm(e: Event) {
  e.preventDefault()
  emit("confirm")
}
</script>

<template>
  <AlertDialog :open="open" @update:open="(v: boolean) => emit('update:open', v)">
    <AlertDialogContent class="sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription as-child>
          <div><slot name="description" /></div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isPending">{{ cancelLabel }}</AlertDialogCancel>
        <AlertDialogAction
          @click="handleConfirm"
          :disabled="isPending"
          :class="cn(buttonVariants({ variant: confirmVariant }), 'gap-1.5')"
        >
          <slot name="icon" />
          {{ isPending ? `${confirmLabel}…` : confirmLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
