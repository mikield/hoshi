<template>
  <!-- Divider -->
  <div class="my-5 flex items-center gap-3">
    <div class="flex-1 h-px bg-foreground/8" />
    <span class="text-xs uppercase tracking-wider text-foreground/40">
      <slot />
    </span>
    <div class="flex-1 h-px bg-foreground/8" />
  </div>
</template>
