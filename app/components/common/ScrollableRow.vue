<template>
  <div class="relative group/scroll">
    <!-- 왼쪽 화살표 -->
    <Transition name="arrow-fade">
      <button
        v-if="canScrollLeft"
        class="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-start
               bg-gradient-to-r from-primary via-primary/80 to-transparent
               text-white/60 hover:text-white transition-colors"
        @click="scrollBy(-scrollAmount)"
      >
        <Icon name="material-symbols:chevron-left-rounded" class="w-6 h-6" />
      </button>
    </Transition>

    <!-- 스크롤 영역 -->
    <div
      ref="scrollRef"
      class="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
      :class="containerClass"
      @scroll="updateArrows"
    >
      <slot />
    </div>

    <!-- 오른쪽 화살표 -->
    <Transition name="arrow-fade">
      <button
        v-if="canScrollRight"
        class="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-end
               bg-gradient-to-l from-primary via-primary/80 to-transparent
               text-white/60 hover:text-white transition-colors"
        @click="scrollBy(scrollAmount)"
      >
        <Icon name="material-symbols:chevron-right-rounded" class="w-6 h-6" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  scrollAmount?: number
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  scrollAmount: 200,
  containerClass: '',
})

const scrollRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateArrows() {
  const el = scrollRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
}

function scrollBy(amount: number) {
  scrollRef.value?.scrollBy({ left: amount, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(updateArrows)
  // ResizeObserver로 컨텐츠 크기 변할 때도 화살표 갱신
  if (scrollRef.value) {
    const ro = new ResizeObserver(updateArrows)
    ro.observe(scrollRef.value)
    onBeforeUnmount(() => ro.disconnect())
  }
})

// 슬롯 컨텐츠 변경 감지
watch(() => scrollRef.value?.scrollWidth, () => {
  nextTick(updateArrows)
})

defineExpose({ updateArrows })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.arrow-fade-enter-active,
.arrow-fade-leave-active {
  transition: opacity 0.2s ease;
}
.arrow-fade-enter-from,
.arrow-fade-leave-to {
  opacity: 0;
}
</style>
