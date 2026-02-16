<template>
  <section class="py-6">
    <div
      class="relative rounded-2xl overflow-hidden transition-all duration-1000 group/trailer"
      :style="{ backgroundImage: currentBg ? `url(${currentBg})` : undefined }"
      :class="{ 'bg-cover bg-center': currentBg }"
    >
      <div class="absolute inset-0 bg-black/60" />
      <div class="relative z-10 p-6 md:p-8">
        <h2 class="text-xl md:text-2xl font-bold text-white mb-6">최신 예고편</h2>

        <!-- Skeleton -->
        <div v-if="loading" class="flex gap-4 overflow-hidden">
          <div
            v-for="i in 4"
            :key="i"
            class="flex-shrink-0 w-64 md:w-80 aspect-video rounded-xl animate-pulse-skeleton"
            :style="{ backgroundColor: 'rgba(255,255,255,0.08)' }"
          />
        </div>

        <!-- Trailers -->
        <template v-else>
          <div ref="swiperContainer" class="swiper">
            <div class="swiper-wrapper">
              <div
                v-for="movie in items"
                :key="movie.id"
                class="swiper-slide !w-64 md:!w-80"
              >
                <div
                  class="group relative aspect-video rounded-xl overflow-hidden cursor-pointer
                         transition-transform duration-300 hover:scale-105"
                  @click="openTrailer(movie)"
                  @mouseenter="updateBg(movie)"
                >
                  <img
                    v-if="movie.backdrop_path && !trailerBackdropErrored[movie.id]"
                    :src="tmdbImageUrl(movie.backdrop_path, 'backdrop', 'md')"
                    :alt="movie.title || movie.name"
                    class="w-full h-full object-cover"
                    @error="trailerBackdropErrored[movie.id] = true"
                  />
                  <div
                    v-else
                    class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/30 bg-white/5 rounded-xl"
                  >
                    <Icon name="material-symbols:image-outline-rounded" class="w-10 h-10" />
                    <span class="text-xs font-medium">이미지 없음</span>
                  </div>
                  <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Icon
                      name="material-symbols:play-circle-rounded"
                      class="w-14 h-14 text-red-500 drop-shadow-lg group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent
                            text-white text-sm font-medium line-clamp-1">
                    {{ movie.title || movie.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 왼쪽 화살표 -->
          <button
            v-show="canPrev"
            class="swiper-nav-btn left-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
            @click="slidePrev"
          >
            <Icon name="material-symbols:chevron-left-rounded" class="w-7 h-7" />
          </button>

          <!-- 오른쪽 화살표 -->
          <button
            v-show="canNext"
            class="swiper-nav-btn right-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"
            @click="slideNext"
          >
            <Icon name="material-symbols:chevron-right-rounded" class="w-7 h-7" />
          </button>
        </template>
      </div>
    </div>

    <!-- Video Modal -->
    <CommonVideoModal v-model:open="videoModalOpen" :video-key="currentVideoKey" />
  </section>
</template>

<script setup lang="ts">
interface MovieItem {
  id: number
  title?: string
  name?: string
  backdrop_path: string | null
}

interface Props {
  items: MovieItem[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const tmdb = useTmdb()
const swiperContainer = ref<HTMLElement | null>(null)
let swiperInstance: any = null

const currentBg = ref('')
const currentVideoKey = ref('')
const videoModalOpen = ref(false)
const canPrev = ref(false)
const canNext = ref(false)
const trailerBackdropErrored = reactive<Record<number, boolean>>({})

function updateBg(movie: MovieItem) {
  if (movie.backdrop_path) {
    currentBg.value = tmdbImageUrl(movie.backdrop_path, 'backdrop', 'lg')
  }
}

function updateNavState() {
  if (!swiperInstance) return
  const scrollLeft = Math.abs(swiperInstance.translate)
  const maxScroll = swiperInstance.virtualSize - swiperInstance.size
  canPrev.value = scrollLeft > 4
  canNext.value = maxScroll - scrollLeft > 4
}

function slidePrev() {
  if (!swiperInstance) return
  const perView = Math.floor(swiperInstance.params.slidesPerView as number) || 2
  swiperInstance.slideTo(Math.max((swiperInstance.activeIndex ?? 0) - perView, 0))
}

function slideNext() {
  if (!swiperInstance) return
  const perView = Math.floor(swiperInstance.params.slidesPerView as number) || 2
  const total = swiperInstance.slides.length
  const maxStart = Math.max(total - perView, 0)
  const target = Math.min((swiperInstance.activeIndex ?? 0) + perView, maxStart)
  swiperInstance.slideTo(target)
}

async function openTrailer(movie: MovieItem) {
  try {
    const videos = await tmdb.getMediaVideos('movie', movie.id)
    const trailer = videos.results.find(
      (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
    ) || videos.results.find(
      (v: any) => v.site === 'YouTube' && v.type === 'Teaser'
    ) || videos.results.find(
      (v: any) => v.site === 'YouTube'
    )
    if (trailer) {
      currentVideoKey.value = trailer.key
      videoModalOpen.value = true
    }
  } catch (e) {
    console.error(e)
  }
}

async function initSwiper() {
  if (!swiperContainer.value || swiperInstance) return

  const { default: Swiper } = await import('swiper')
  const { FreeMode } = await import('swiper/modules')

  swiperInstance = new Swiper(swiperContainer.value, {
    modules: [FreeMode],
    freeMode: {
      enabled: true,
      momentumRatio: 0.5,
      momentumBounce: false,
    },
    resistanceRatio: 0,
    spaceBetween: 16,
    breakpoints: {
      0: { slidesPerView: 1.5 },
      640: { slidesPerView: 2.5 },
      1024: { slidesPerView: 3.5 },
    },
    on: {
      init: () => setTimeout(updateNavState, 50),
      progress: updateNavState,
      resize: updateNavState,
      transitionEnd: updateNavState,
    },
  })
}

watch(() => props.loading, (val) => {
  if (!val) nextTick(() => initSwiper())
})

onMounted(() => {
  if (!props.loading) nextTick(() => initSwiper())
  if (props.items.length && props.items[0]) updateBg(props.items[0])
})

onBeforeUnmount(() => {
  if (swiperInstance) {
    swiperInstance.destroy(true, true)
    swiperInstance = null
  }
})
</script>

<style scoped>
.swiper-nav-btn {
  @apply absolute top-0 bottom-0 z-10 w-12 md:w-14 flex items-center justify-center
         text-white/50 hover:text-white transition-all;
}
</style>
