<template>
  <USelectMenu
    v-model="itemSelect"
    :searchable="searchItem"
    size="lg"
    by="id"
    class="grow"
    debounce
  >
    <template #label>
      {{ !!select ? select.name : 'Tìm kiếm gói nạp' }}
    </template>

    <template #option="{ option: item }">
      {{ item.name }}
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
  game: String
})

const emit = defineEmits(['update:modelValue'])

const itemSelect = ref(props.modelValue)

const select = ref(undefined)

watch(itemSelect, val => {
  select.value = val
  if(!val) return 

  emit('update:modelValue', val)
})

const searchItem = async (key) => {
  const items = await useAPI('game/tool/public/select/recharge', { key: key, game: props.game })

  return items.map(i => ({
    id: i.recharge_id,
    name: i.recharge_name
  })).filter(Boolean)
}
</script>