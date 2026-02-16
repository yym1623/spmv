<template>
  <div class="relative group/swiper">
    <!-- Section Title -->
    <div v-if="title" class="flex items-center justify-between mb-4 px-1">
      <h2 class="text-xl md:text-2xl font-bold text-white">{{ title }}</h2>
      <NuxtLink v-if="moreLink" :to="moreLink" class="text-sm text-accent hover:text-accent-light transition-colors">
        더보기
        <Icon name="material-symbols:arrow-forward-rounded" class="w-4 h-4 inline" />
      </NuxtLink>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="flex-shrink-0 rounded-lg animate-pulse-skeleton"
        :class="isVideo ? 'w-64 md:w-80 aspect-video' : 'w-28 md:w-36 lg:w-40 aspect-[2/3]'"
        :style="{ backgroundColor: 'rgba(255,255,255,0.08)' }"
      />
    </div>

    <!-- Swiper -->
    <template v-else>
      <div ref="swiperContainer" class="swiper">
        <div class="swiper-wrapper">
          <slot />
        </div>
      </div>

      <!-- 왼쪽 화살표 -->
      <button
        v-show="canPrev"
        class="swiper-nav-btn left-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"
        @click="slidePrev"
      >
        <Icon name="material-symbols:chevron-left-rounded" class="w-7 h-7" />
      </button>

      <!-- 오른쪽 화살표 -->
      <button
        v-show="canNext"
        class="swiper-nav-btn right-0 bg-gradient-to-l from-primary via-primary/80 to-transparent"
        @click="slideNext"
      >
        <Icon name="material-symbols:chevron-right-rounded" class="w-7 h-7" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  moreLink?: string
  loading?: boolean
  isVideo?: boolean
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isVideo: false,
  slidesPerView: 'auto',
  spaceBetween: 16,
  breakpoints: () => ({}),
})

const swiperContainer = ref<HTMLElement | null>(null)
let swiperInstance: any = null

const canPrev = ref(false)
const canNext = ref(false)

const skeletonCount = computed(() => props.isVideo ? 3 : 7)

const defaultBreakpoints: Record<number, { slidesPerView: number; spaceBetween?: number }> = props.isVideo
  ? { 0: { slidesPerView: 1.5 }, 640: { slidesPerView: 2.5 }, 1024: { slidesPerView: 3.5 } }
  : { 0: { slidesPerView: 3 }, 640: { slidesPerView: 4 }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 7 } }

function updateNavState() {
  if (!swiperInstance) return
  const el = swiperInstance.wrapperEl?.parentElement
  if (!el) return
  const scrollLeft = Math.abs(swiperInstance.translate)
  const maxScroll = swiperInstance.virtualSize - swiperInstance.size
  canPrev.value = scrollLeft > 4
  canNext.value = maxScroll - scrollLeft > 4
}

const STEP = 3

function slidePrev() {
  if (!swiperInstance) return
  swiperInstance.slideTo(Math.max((swiperInstance.activeIndex ?? 0) - STEP, 0))
}

function slideNext() {
  if (!swiperInstance) return
  const total = swiperInstance.slides.length
  const perView = Math.floor(swiperInstance.params.slidesPerView as number) || 3
  const maxStart = Math.max(total - perView, 0)
  const target = Math.min((swiperInstance.activeIndex ?? 0) + STEP, maxStart)
  swiperInstance.slideTo(target)
}

async function initSwiper() {
  if (!swiperContainer.value || swiperInstance) return

  const { default: Swiper } = await import('swiper')
  const { FreeMode } = await import('swiper/modules')

  swiperInstance = new Swiper(swiperContainer.value, {
    modules: [FreeMode],
    slidesPerView: props.slidesPerView,
    spaceBetween: props.spaceBetween,
    freeMode: {
      enabled: true,
      momentumRatio: 0.5,
      momentumBounce: false,
    },
    resistanceRatio: 0,
    breakpoints: Object.keys(props.breakpoints).length > 0 ? props.breakpoints : defaultBreakpoints,
    on: {
      init: () => setTimeout(updateNavState, 50),
      progress: updateNavState,
      resize: updateNavState,
      transitionEnd: updateNavState,
    },
  })
}

function destroySwiper() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true)
    swiperInstance = null
  }
}

watch(() => props.loading, (val) => {
  if (!val) {
    nextTick(() => initSwiper())
  }
})

onMounted(() => {
  if (!props.loading) {
    nextTick(() => initSwiper())
  }
})

onBeforeUnmount(() => {
  destroySwiper()
})
</script>

<style scoped>
.swiper-nav-btn {
  @apply absolute top-0 bottom-0 z-10 w-12 md:w-14 flex items-center justify-center
         text-white/50 hover:text-white transition-all;
}
</style>
