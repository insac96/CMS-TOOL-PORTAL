
<template>
  <div>
    <DataEmpty v-if="!user || !!loading.load" :loading="loading.load" text="Không có thông tin" class="min-h-[300px]" />

    <div v-else class="rounded-2xl p-6">
      <UiFlex class="gap-4 mb-4 relative z-[3]">
        <DataUserAvatar size="sm" :user="user" no-action />
        <div>
          <DataUserName :user="user" size="lg" no-action />
          <UiText weight="semibold" size="xs" :color="user.online ? 'green' : 'rose'">{{ user.online ? 'Online' : 'Offline' }}</UiText>
        </div>
      </UiFlex>

      <UiFlex type="col" class="gap-4 relative z-[3]">
        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Chức vụ</UiText>
          <UBadge size="xs" variant="soft" class="px-3" :color="typeFormat[user.type]['color']">{{ typeFormat[user.type]['label'] }}</UBadge>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Cảnh giới</UiText>
          <UiText weight="semibold" size="xs">{{ user.level.title || '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Tu vi</UiText>
          <UiText weight="semibold" size="xs">{{ toMoney(user.currency.exp) }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Tài phú</UiText>
          <UiText weight="semibold" size="xs">{{ toMoney(user.currency.coin) }}</UiText>
        </UiFlex>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const emit = defineEmits(['close', 'update:userData'])
const authStore = useAuthStore()

const props = defineProps({
  fetchId: String,
  reload: Number,
  userData: Object,
  noChat: Boolean
})

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'G-MOD', color: 'green' },
  2: { label: 'F-MOD', color: 'cyan' },
  100: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const loading = ref({
  load: true,
  chat: false
})
const user = ref(undefined)
watch(() => props.reload, (val) => !!val && init())

const getProfile = async () => {
  try {
    if(!props.fetchId) return false

    loading.value.load = true
    const get = await useAPI('user/public/profile', {
      _id: props.fetchId
    })

    user.value = get
    emit('update:userData', get)
    setTimeout(() => loading.value.load = false, 700)
  }
  catch(e) {
    loading.value.load = true
  }
}

onMounted(() => setTimeout(getProfile, 1))
</script>