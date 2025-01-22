<template>
  <UiFlex class="gap-1">
    <AuthHeaderNotify />
    <AuthHeaderMenu />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
</script>