<template>
  <USelectMenu
    v-model="itemSelect"
    :searchable="searchItem"
    size="lg"
    class="grow"
    debounce
  >
    <template #label>
      {{ !!select ? select : 'Tìm kiếm tài khoản' }}
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
  const list = await useAPI('game/tool/public/select/account', { key: key, game: props.game })

  return list.map(i => i.account).filter(Boolean)
}
</script>