<template>
  <div>
    <UiFlex class="p-5">
      <USkeleton class="h-10 w-10 mr-4" :ui="{ rounded: 'rounded-full' }" />

      <div>
        <USkeleton class="h-4 w-40 mb-2" />
        <UiFlex class="w-full">
          <USkeleton class="h-5 w-12 mr-1" />
          <USkeleton class="h-5 w-12" />
        </UiFlex>
      </div>
    </UiFlex>

    <div 
      v-if="!noAuth && (!!authStore.isLogin && !!authStore.isAdmin)"
      :class="[
        'py-2 px-4',
        'border-t border-gray-100 dark:border-gray-800',
      ]"
    >
      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
        <USkeleton class="h-4 w-4 mr-4" :ui="{ rounded: 'rounded-full' }" />
        <USkeleton class="h-4 w-36" />
      </UiFlex>

      <UiFlex justify="between" class="text-gray-500 dark:text-gray-400 py-2">
        <USkeleton class="h-4 w-4 mr-4" :ui="{ rounded: 'rounded-full' }" />
        <USkeleton class="h-4 w-24" />
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
defineProps({
  noAuth: Boolean
})

const authStore = useAuthStore()
</script>