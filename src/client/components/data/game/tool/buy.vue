<template>
  <UiContent no-dot title="Mua Tool" sub="Lựa chọn loại tool muốn mua" class="p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading" @click="emits('close')"></UButton>
    </template>

    <UForm :state="stateBuy">
      <UFormGroup help="Vui lòng nhập đúng chính tả tên tài khoản trong game của bạn">
        <UiFlex class="gap-1">
          <UInput v-model="stateBuy.account" class="grow" placeholder="Nhập tên tài khoản game" />
          <SelectGameToolServer v-model="stateBuy.server_id" :game="game.code" class="grow" />
          <UButton @click="checkAccount" size="lg">Kiểm tra</UButton>
        </UiFlex>
      </UFormGroup>

      <div v-if="!!checkdone.status">
        <UiFlex class="mb-4">
          <UCheckbox v-model="stateBuy.recharge" :color="!!checkdone.recharge ? 'green' : 'primary'" :disabled="!!checkdone.recharge" label="Nạp tiền" class="mr-auto" />
          <UiText weight="semibold" size="sm" :color="!!checkdone.recharge ? 'green' : null">{{ !!checkdone.recharge ? 'Đã mua' : toMoney(game.price.recharge) }}</UiText>
        </UiFlex>

        <UiFlex class="mb-4">
          <UCheckbox v-model="stateBuy.mail" :color="!!checkdone.mail ? 'green' : 'primary'" :disabled="!!checkdone.mail" label="Gửi thư" class="mr-auto" />
          <UiText weight="semibold" size="sm" :color="!!checkdone.mail ? 'green' : null">{{ !!checkdone.mail ? 'Đã mua' : toMoney(game.price.mail) }}</UiText>
        </UiFlex>

        <UiFlex class="mb-4">
          <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Đơn giá</UiText>
          <UiText weight="semibold" size="sm">{{ toMoney(price) }}</UiText>
        </UiFlex>

        <UiFlex class="mb-4">
          <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Thành tiền</UiText>
          <UiText weight="semibold" size="sm">{{ toMoney(totalPrice) }} Xu</UiText>
        </UiFlex>

        <UiFlex justify="end" class="gap-1">
          <UButton :loading="loading" @click="buyTool">Mua</UButton>
          <UButton color="gray" :disabled="loading" @click="emits('close')">Đóng</UButton>
        </UiFlex>
      </div>
    </UForm>
  </UiContent>
</template>

<script setup>
import { SelectGameToolServer } from '#components'

const {  toMoney } = useMoney()
const props = defineProps(['game'])
const emits = defineEmits(['done', 'close'])
const authStore = useAuthStore()

const loading = ref(false)
const checking = ref(false)
const checkdone = ref({
  status: false,
  recharge: false,
  mail: false
})

const stateBuy = ref({
  account: null,
  server_id: null,
  recharge: false,
  mail: false
})

watch(() => stateBuy.value.server_id, (val) => (!!val && !!stateBuy.value.account) && checkAccount())
watch(() => stateBuy.value.account, (val) => (!val && !!checkdone.value.status) && (checkdone.value.status = false))

const price = computed(() => {
  let total = 0
  if(!checkdone.value.recharge && !!stateBuy.value.recharge) total = total + props.game.price?.recharge
  if(!checkdone.value.mail && !!stateBuy.value.mail) total = total + props.game.price?.mail
  return total
})

const discount = computed(() => {
  return 0
})

const totalPrice = computed(() => {
  return price.value - Math.floor((price.value * discount.value) / 100)
})

const checkAccount = async () => {
  try {
    checkdone.value.status = false
    checkdone.value.recharge = false
    checkdone.value.mail = false
    stateBuy.value.recharge = false
    stateBuy.value.mail = false
    checking.value = true

    const send = {
      account: stateBuy.value.account,
      server_id: stateBuy.value.server_id,
      game: props.game.code
    }

    const data = await useAPI('game/tool/public/project/check', JSON.parse(JSON.stringify(send)))
    await authStore.setAuth()

    checkdone.value.recharge = data.recharge
    checkdone.value.mail = data.mail
    stateBuy.value.recharge = data.recharge
    stateBuy.value.mail = data.mail
    checkdone.value.status = true
    checking.value = false
  }
  catch(e){
    checking.value = false
  }
}

const buyTool = async () => {
  try {
    loading.value = true

    const send = JSON.parse(JSON.stringify(stateBuy.value))
    send.game = props.game.code

    const data = await useAPI('game/tool/public/project/buy', send)
    await authStore.setAuth()

    stateBuy.value.recharge = data.recharge
    stateBuy.value.mail = data.mail

    loading.value = false
    emits('done', JSON.parse(JSON.stringify(stateBuy.value)))
  }
  catch(e){
    loading.value = false
  }
}
</script>