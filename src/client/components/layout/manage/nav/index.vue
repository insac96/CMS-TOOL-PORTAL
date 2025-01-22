<template>
  <UAccordion 
    :items="navItems" 
    :ui="{
      'item': { padding: 'pt-0 pb-2 pl-6' },
    }"
    multiple
  >
    <template #default="{item, open}">
      <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
        <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'"/>
        <UiText 
          class="mx-4" 
          size="sm" 
          weight="semibold" 
          :color="open ? 'primary' : 'gray'"
          :text="item.label"
        />
        <UiIcon
          name="i-bx-chevron-right"
          size="5"
          :color="open ? 'primary' : 'gray'"
          class="ms-auto transform transition-transform duration-200"
          :class="[open && 'rotate-90']"
        />
      </UiFlex>
    </template>
    <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
    <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
    <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
    <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template>
    <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emit('to')"/></template>
    <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emit('to')"/></template>
    <template #tab-6><UVerticalNavigation :links="navItems[6].children" @click="emit('to')"/></template>
  </UAccordion>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: 'Thông tin trang', to: '/manage/@eni/config/page' },
      { label: 'API Social', to: '/manage/@eni/config/apisocial' },
      { label: 'Chi tiêu', to: '/manage/@eni/spend' },
      { label: 'Nhật ký', to: '/manage/@eni/log' }
    ]
  },
  {
    label: 'Tài khoản',
    icon: 'i-bxs-user',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      { label: 'Danh sách', to: '/manage/@eni/user' },
      { label: 'Cấp độ', to: '/manage/@eni/user/level' },
    ]
  },
  {
    label: 'Bài viết',
    icon: 'i-bxs-book',
    defaultOpen: false,
    slot: 'tab-2',
    children: [
      { label: 'Trang giới thiệu', to: '/manage/@eni/config/article/about' },
      { label: 'Quyền riêng tư', to: '/manage/@eni/config/article/privacy' },
      { label: 'Điều khoản dịch vụ', to: '/manage/@eni/config/article/terms' }
    ]
  },
  {
    label: 'Địa chỉ IP',
    icon: 'i-bxs-barcode',
    defaultOpen: false,
    slot: 'tab-3',
    children: [
      { label: 'Quản trị', to: '/manage/@eni/ip/admin' },
      { label: 'Thành viên', to: '/manage/@eni/ip/user' }
    ]
  },
  {
    label: 'Tin tức',
    icon: 'i-bx-news',
    defaultOpen: false,
    slot: 'tab-4',
    children: [
    { label: 'Danh mục', to: '/manage/@eni/news/category' }, 
    { label: 'Danh sách', to: '/manage/@eni/news' }, 
    ]
  },
  {
    label: 'Thanh toán',
    icon: 'i-bx-credit-card',
    defaultOpen: false,
    slot: 'tab-5',
    children: [
      { label: 'Kênh nạp', to: '/manage/@eni/gate' }, 
      { label: 'Nạp xu', to: '/manage/@eni/payment/coin' },
    ]
  },
  {
    label: 'Trò chơi',
    icon: 'i-bxs-cube-alt',
    defaultOpen: false,
    slot: 'tab-6',
    children: [
      { label: 'Nền tảng', to: '/manage/@eni/game/platform' },
      { label: 'Thể loại', to: '/manage/@eni/game/category' },  
      { label: 'Danh sách', to: '/manage/@eni/game/tool' },
    ]
  },
]
</script>