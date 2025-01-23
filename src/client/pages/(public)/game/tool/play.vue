<template>
  <div class="w-full h-full" v-if="!!verify && !!game">
    <iframe title="Playing Game" :src="verify.url" width="100%" height="100%" class="Iframe"></iframe>

    <DataGameToolPlayDrag :game="game" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'play',
  middleware: 'auth'
})

const route = useRoute()
const loading = ref(false)
const game = ref(undefined)
const verify = ref(undefined)

const getGame = async () => {
  try {
    loading.value = true
    const verifyData = await useAPI('game/tool/public/project/play/verify', JSON.parse(JSON.stringify(route.query)))
    const gameData = await useAPI('game/tool/public/project/key', { key: verifyData.key })

    game.value = gameData
    verify.value = verifyData
    loading.value = false
  }
  catch(e){
    return false
  }
}

onMounted(() => setTimeout(getGame, 1))
</script>