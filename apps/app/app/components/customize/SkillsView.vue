<script setup lang="ts">
import { computed } from 'vue'
import { MarkdownContent } from '@hoshi/ui'
import { Sparkles } from 'lucide-vue-next'
import type { SkillInfo } from '~/composables/useOpencode'

const props = defineProps<{ skills: SkillInfo[] }>()

const items = computed(() =>
  props.skills.map((skill) => ({ id: skill.name, label: skill.name, sublabel: skill.description })),
)

function skillByName(name: string): SkillInfo | undefined {
  return props.skills.find((skill) => skill.name === name)
}
</script>

<template>
  <CustomizeListDetailSection :icon="Sparkles" title="Skills" :items="items" search-placeholder="Search skills…">
    <template #detail="{ item }">
      <div class="mx-auto w-full max-w-3xl px-6 py-8">
        <h2 class="text-lg font-semibold tracking-tight text-foreground">{{ item.label }}</h2>
        <p class="mt-1 text-sm text-muted-foreground">Loaded on demand when a session needs it.</p>
        <MarkdownContent v-if="skillByName(item.id)?.description" class="mt-6">
          <p>{{ skillByName(item.id)!.description }}</p>
        </MarkdownContent>
      </div>
    </template>
  </CustomizeListDetailSection>
</template>
