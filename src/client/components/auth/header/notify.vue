<template>
  <UPopover class="h-[32px] w-[32px]" :popper="{ strategy: 'absolute', placement: 'bottom-end' }" v-model:open="open">
    <UChip size="md" :show="authStore.profile.notify > 0">
      <UButton
        class="relative p-1.5"
        icon="i-bx-bell"
        color="gray" square
      ></UButton>
    </UChip>

    <template #panel>
      <UiContent title="Thông Báo" class="w-[300px] sm:w-[400px] max-w-sreen overflow-hidden p-4 BoxBlock" no-dot>
        <template #more >
          <UiFlex class="gap-1 ml-auto">
            <UButton color="gray" size="2xs" :loading="loading.read" icon="i-bx-check-double" @click=read v-if="list.length > 0"></UButton>
            <UButton color="gray" size="2xs" :loading="loading.del" icon="i-bx-trash" @click=del v-if="list.length > 0"></UButton>
            <UButton color="gray" size="2xs" icon="i-bx-x" @click="open = false"></UButton>
          </UiFlex>
        </template>

        <DataEmpty text="Không có thông báo mới" :loading="loading.list" v-if="!!loading.list || list.length == 0"></DataEmpty>

        <UiFlex type="col" class="divide-y divide-gray-100 dark:divide-gray-800 max-h-[60vh] overflow-y-auto" v-else>
          <UiFlex class="w-full py-2 gap-4" v-for="(item, index) in list" :key="index">
            <UButton variant="soft" :color="item.color" icon="i-bx-bell" />
            
            <div class="grow">
              <div class="text-sm grow" v-html="item.content"></div>
              <UiFlex justify="end" class="w-full mt-1">
                <UiText size="xs" color="gray" weight="semibold">{{ useDayJs().fromTime(item.createdAt) }}</UiText>
              </UiFlex>
            </div>
          </UiFlex>
        </UiFlex>

        <UiFlex justify="end" class="mt-2">
          <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" />
        </UiFlex>
      </UiContent>
    </template>
  </UPopover>
</template>

<script setup>
const authStore = useAuthStore()
const open = ref(false)
const loading = ref({
  list: true,
  read: false,
  del: false
})
const list = ref([])

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0
})

watch(() => open.value, (val) => !!val && (page.value.current = 1, getList()))
watch(() => page.value.current, () => getList())

const read = async () => {
  try {
    loading.value.read = true
    await useAPI('notify/public/read')

    loading.value.read = false
    getList()
  }
  catch(e){
    loading.value.read = false
  }
}

const del = async () => {
  try {
    loading.value.del = true
    await useAPI('notify/public/del')

    loading.value.del = false
    getList()
  }
  catch(e){
    loading.value.del = false
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('notify/public/list', JSON.parse(JSON.stringify(page.value)))
    await authStore.setAuth()
    
    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.list = false, 700)
  }
  catch(e){
    loading.value.list = false
  }
}
</script>