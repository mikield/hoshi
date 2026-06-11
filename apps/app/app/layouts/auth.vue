<template>
  <!-- Persistent auth chrome: the wallpaper + frosted card stay mounted while
       login/forgot/reset/invite pages swap inside, so navigation between them
       transitions the card content instead of blinking the whole backdrop. -->
  <AuthShell>
    <slot />
  </AuthShell>
</template>
