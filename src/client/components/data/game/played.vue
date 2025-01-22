<template>
  <UiContent title="Lịch Sử Chơi" sub="Các trò chơi đã chơi hoặc thanh toán" no-dot class="p-4">
    <DataGameToolPlayed :user="user" v-if="os == 'tool'" />
  </UiContent>
</template>

<script setup>
const props = defineProps(['user'])
const os = ref('tool')
</script>