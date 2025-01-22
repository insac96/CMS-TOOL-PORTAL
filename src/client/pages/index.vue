<template>
  <div class="HomePage">
    <div class="HomeBanner relative overflow-hidden rounded-3xl">
      <!-- Image -->
      <UiImg :src="config.og_image" class="!absolute w-full h-full top-0 left-0" w="16" h="9"/>

      <!-- Overlay -->
      <div class="absolute w-full h-full bg-black/80"></div>

      <!-- Content -->
      <UiFlex type="col" items="start" justify="center" class="relative w-full h-full md:p-20 p-12 aspect-auto">
        <UiLogo v-if="config.logo_image" img-size="45"></UiLogo>
        <UiText weight="bold" class="select-none sm:text-5xl text-3xl" color="primary" v-else>
          Choi<span class="text-white">Ngay.net</span>
        </UiText>

        <UiText size="lg" color="gray" class="md:mt-2 mt-0 tracking-tight max-w-xl">{{ config.description }}</UiText>

        <UiFlex class="my-8 gap-8 text-gray-300 w-full" wrap>
          <div class="grow">
            <UiText size="sm">Thành viên</UiText>
            <UiText size="xl" weight="bold">{{ home.member }}</UiText>
          </div>

          <div class="grow">
            <UiText size="sm">Game Tool</UiText>
            <UiText size="xl" weight="bold">{{ home.game.tool }}</UiText>
          </div>
        </UiFlex>

        <UiFlex class="gap-1 md:justify-start justify-center w-full">
          <UButton color="primary" size="md" icon="i-bxs-book-open" @click="navigateTo('/about')">Giới Thiệu</UButton>
        </UiFlex>
      </UiFlex>
    </div>

    <!--News-->
    <div class="my-12 mb-16">
      <DataNewsHome />
    </div>

    <!--Tool-->
    <UiLazy #default="{ render }">
      <div class="my-12 mb-16">
        <LazyDataGameToolHome v-if="!!render" />
      </div>
    </UiLazy>
  </div>
</template>

<script setup>
const device = useDevice()
const { error } = useNotify()
const { openNewTab } = useTo()
const { config } = useConfigStore()

const home = ref({
  member: 0,
  game: {
    tool: 0
  }
})

const getHome = async () => {
  try {
    const data = await useAPI('config/public/home')
    home.value = data
  }
  catch(e){
    return false
  }
}
getHome()
</script>