<template>
  <div id="NotifyGlobalText" :class="{
    'NotifyGlobalText h-[16px] md:h-[20px]': true
  }">
    <p 
      id="NotifyGlobalTextContent"
      :class="{
        'NotifyGlobalText__Content text-xs md:text-sm font-semibold': true,
        'NotifyGlobalText__Anim': !!isRunning
      }"
      :style="{
        '--end-pos': endtPos
      }"
      v-html="text"
    ></p>
  </div>
</template>

<script setup>
const { $socket } = useNuxtApp()
const isRunning = ref(false)
const emits = defineEmits(['running'])
const text = ref(null)
const endtPos = ref(0)
const list = ref([
  'Chúc bạn có những phút giây chơi game vui vẻ !'
])
const length = computed(() => {
  return list.value.length
})

const start = () => {
  const el = document.getElementById('NotifyGlobalTextContent')
  setTimeout(() => {
    endtPos.value = (el.offsetWidth)+'px'
    isRunning.value = true
  }, 1)
  el.addEventListener("animationend", stop)
}

const stop = () => {
  const el = document.getElementById('NotifyGlobalTextContent')
  list.value.shift()
  isRunning.value = false
  emits('running', false)
  el.removeEventListener("animationend", stop)
  run()
}

const run = () => {
  if(list.value.length == 0) return isRunning.value = false
  text.value = list.value[0]
  start()
  emits('running', true)
}

onMounted(() => {
  run()

  $socket.on('notify-global-push', (data) => list.value.push(data))
})
watch(() => length.value, () => !isRunning.value && run())
</script>

<style lang="sass">
.NotifyGlobalText
  position: relative
  overflow: hidden
  &__Content
    position: relative
    right: -100%
    padding: 0
    width: max-content
  &__Anim
    right: 0
    transition: all 0.5s ease
    animation: notify-global-text 2s linear
    animation-delay: 2s

@keyframes notify-global-text
  to
    right: var(--end-pos)
</style>