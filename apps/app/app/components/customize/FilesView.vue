<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next'
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <CustomizeSectionHeader :icon="FolderOpen" title="Files" />
    <div class="min-h-0 flex-1 overflow-hidden">
      <WorkspaceFilesPanel />
    </div>
  </div>
</template>
