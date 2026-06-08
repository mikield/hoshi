<template>
  <div data-slot="command-empty" class="py-10 text-center text-sm text-muted-foreground/60"><slot /></div>
</template>

<style>
[data-slot="command-list"]:has([data-slot="command-item"]) [data-slot="command-empty"] {
  display: none;
}
</style>
