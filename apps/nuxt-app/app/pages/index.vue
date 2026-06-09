<script setup lang="ts">
// Port of `app/page.tsx` — redirect to projects when signed in, otherwise to login.
const { data } = await useFetch('/api/auth/me', { key: 'auth-me' })
await navigateTo((data.value as { user?: unknown } | null)?.user ? '/projects' : '/login', { replace: true })
</script>

<template>
  <div />
</template>
