<script setup lang="ts">
import { AvatarImage } from "reka-ui"
import { cn } from "../lib/utils"
const props = defineProps<{ class?: string; src?: string; alt?: string }>()
</script>
<template>
  <AvatarImage v-if="src" data-slot="avatar-image" referrer-policy="no-referrer" :src="src" :alt="alt" :class="cn('aspect-square size-full', props.class)" />
</template>
