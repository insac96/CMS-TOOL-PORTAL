<template>
  <UForm :state="state" :validate="validate" @submit="send">
    <UFormGroup label="Tài khoản Game" name="account">
      <SelectGameToolAccount v-model="state.account" :game="game.code" />
    </UFormGroup>

    <UFormGroup label="Máy chủ" name="server_id">
      <SelectGameToolServer v-model="state.server_id" :game="game.code" />
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
  server_id: props.server,
  account: props.role,
  recharge: null,
  game: props.game?.code
})

const validate = (state) => {
  const errors = []
  if (!state.server_id) errors.push({ path: 'server_id', message: 'Vui lòng chọn máy chủ' })
  if (!state.account) errors.push({ path: 'account', message: 'Vui lòng chọn tài khoản game' })
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