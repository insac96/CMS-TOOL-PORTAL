<template>
  <UForm :state="state" :validate="validate" @submit="send">
    <UFormGroup label="Tài khoản Game" name="info">
      <SelectGameToolAccount v-model="state.info" :game="game.code" />
    </UFormGroup>

    <UFormGroup label="Gói nạp" name="recharge">
      <SelectGameToolRecharge v-model="state.recharge" :game="game.code" />
    </UFormGroup>

    <UiFlex justify="end" class="gap-1">
      <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      <slot name="close" :loading="loading"></slot>
    </UiFlex>
  </UForm>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close'])
const loading = ref(false)

const state = ref({
  info: null,
  recharge: null,
  game: props.game?.code
})

const validate = (state) => {
  const errors = []
  if (!state.info) errors.push({ path: 'info', message: 'Vui lòng chọn tài khoản game' })
  if (!state.recharge) errors.push({ path: 'recharge', message: 'Vui lòng chọn gói nạp' })
  return errors
}

const send = async () => {
  try {
    loading.value = true
    await useAPI('game/tool/public/recharge/send', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('close')
	}
	catch(e){
    loading.value = false
  }
}
</script>