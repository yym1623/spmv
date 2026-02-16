<template>
  <Teleport to="body">
    <Transition name="video-overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        @keydown.escape="close"
      >
        <!-- 배경 블러 -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />

        <!-- 팝업 -->
        <Transition name="video-popup" appear>
          <div
            v-if="open"
            class="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/80"
          >
            <!-- 닫기 버튼 -->
            <button
              class="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60
                     flex items-center justify-center text-white/60 hover:text-white
                     hover:bg-black/80 transition-colors"
              @click="close"
            >
              <Icon name="material-symbols:close-rounded" class="w-5 h-5" />
            </button>

            <!-- 영상 -->
            <div class="relative w-full aspect-video bg-black/40">
              <iframe
                v-if="videoKey"
                :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`"
                class="absolute inset-0 w-full h-full"
                frameborder="0"
                allowfullscreen
                allow="autoplay; encrypted-media"
              />
              <div
                v-else
                class="absolute inset-0 flex flex-col items-center justify-center"
              >
                <Icon name="material-symbols:videocam-off-rounded" class="w-16 h-16 text-white/20 mb-3" />
                <p class="text-white/40">제공되는 영상이 없습니다</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  videoKey?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function close() {
  emit('update:open', false)
}

// body 스크롤 잠금
watch(() => props.open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.video-overlay-enter-active,
.video-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.video-overlay-enter-from,
.video-overlay-leave-to {
  opacity: 0;
}

.video-popup-enter-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.video-popup-leave-active {
  transition: all 0.2s ease;
}
.video-popup-enter-from {
  opacity: 0;
  transform: scale(0.92);
}
.video-popup-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
