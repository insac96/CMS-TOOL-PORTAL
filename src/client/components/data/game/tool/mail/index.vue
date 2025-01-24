<template>
  <UForm :state="state" :validate="validate" @submit="send">
    <UFormGroup label="Tài khoản Game" name="info">
      <SelectGameToolAccount v-model="state.info" :game="game.code" />
    </UFormGroup>

    <UFormGroup label="Vật phẩm" name="item">
      <SelectGameToolItem v-model="state.item" :game="game.code" />
    </UFormGroup>

    <UFormGroup label="Số lượng" name="amount">
      <UInput type="number" v-model="state.amount" />
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
  item: null,
  amount: 1,
  game: props.game?.code
})

const validate = (state) => {
  const errors = []
  if (!state.info) errors.push({ path: 'info', message: 'Vui lòng chọn tài khoản game' })
  if (!state.item) errors.push({ path: 'item', message: 'Vui lòng chọn vật phẩm' })
  if (!state.amount) errors.push({ path: 'amount', message: 'Vui lòng nhập số lượng' })
  else if (state.amount < 1) errors.push({ path: 'amount', message: 'Số lượng không hợp lệ' })
  return errors
}

const send = async () => {
  try {
    loading.value = true
    await useAPI('game/tool/public/mail/send', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('close')
	}
	catch(e){
    loading.value = false
  }
}
</script>