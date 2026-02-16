<template>
  <section class="py-6">
    <CommonMovieSwiper :title="title" :more-link="moreLink" :loading="loading">
      <div
        v-for="movie in items"
        :key="movie.id"
        class="swiper-slide !w-28 md:!w-36 lg:!w-40"
      >
        <CommonMovieCard :item="movie" @click="handleClick(movie)" />
      </div>
      <!-- 더보기 슬라이드 -->
      <div v-if="moreLink" class="swiper-slide !w-28 md:!w-36 lg:!w-40">
        <NuxtLink
          :to="moreLink"
          class="flex flex-col items-center justify-center aspect-[2/3] rounded-lg
                 border border-white/10 bg-white/5 hover:bg-white/10
                 transition-colors cursor-pointer"
        >
          <Icon name="material-symbols:arrow-forward-rounded" class="w-8 h-8 text-white/40 mb-2" />
          <span class="text-sm text-white/50 font-medium">더보기</span>
        </NuxtLink>
      </div>
    </CommonMovieSwiper>

    <!-- Detail Preview Modal -->
    <Transition name="modal">
      <div
        v-if="selectedMovie && detailData"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closePreview" />
        <div class="relative w-full max-w-4xl glass-dark rounded-2xl overflow-hidden animate-fade-in-up z-10">
          <!-- Backdrop -->
          <div
            class="h-48 md:h-64 bg-cover bg-center relative"
            :class="{ 'flex flex-col items-center justify-center gap-2 text-white/30 bg-white/5': !detailData.backdrop_path }"
            :style="detailData.backdrop_path ? { backgroundImage: `url(${tmdbImageUrl(detailData.backdrop_path, 'backdrop', 'lg')})` } : undefined"
          >
            <template v-if="!detailData.backdrop_path">
              <Icon name="material-symbols:image-outline-rounded" class="w-10 h-10" />
              <span class="text-sm font-medium">이미지 없음</span>
            </template>
            <div class="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            <button
              class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center
                     hover:bg-black/70 transition-colors"
              @click="closePreview"
            >
              <Icon name="material-symbols:close-rounded" class="w-5 h-5 text-white" />
            </button>
          </div>

          <div class="p-6 -mt-20 relative">
            <div class="flex gap-4 md:gap-6">
              <!-- Poster + 상세보기 (팝업 포스터에도 액션 아이콘) -->
              <div class="hidden md:flex flex-col w-32 lg:w-40 shrink-0">
                <div class="relative">
                  <img
                    v-if="detailData.poster_path && !previewPosterErrored"
                    :src="tmdbImageUrl(detailData.poster_path, 'poster', 'md')"
                    :alt="detailData.title || detailData.name"
                    class="w-full aspect-[2/3] rounded-xl object-cover shadow-2xl"
                    @error="previewPosterErrored = true"
                  />
                  <CommonNoImagePlaceholder v-else class="w-full aspect-[2/3] rounded-xl shadow-2xl" />
                  <div class="absolute bottom-0.5 right-0.5">
                    <DetailActionsCompact
                      :media-id="detailData.id"
                      :media-type="detailData.media_type || 'movie'"
                      :media="detailData"
                    />
                  </div>
                </div>
                <button
                  class="mt-3 btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
                  @click="goDetail"
                >
                  <Icon name="material-symbols:info-outline-rounded" class="w-4 h-4" />
                  상세보기
                </button>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl md:text-2xl font-bold text-white mb-2">
                  {{ detailData.title || detailData.name }}
                </h3>
                <p class="text-white/60 text-sm line-clamp-4 md:line-clamp-6 mb-4">
                  {{ detailData.overview || '상세설명이 없습니다' }}
                </p>

                <!-- 모바일용 상세보기 -->
                <button
                  class="mt-4 btn-primary md:hidden inline-flex items-center gap-2"
                  @click="goDetail"
                >
                  <Icon name="material-symbols:info-outline-rounded" class="w-5 h-5" />
                  상세보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
interface MovieItem {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  overview?: string
  media_type?: string
}

interface Props {
  title: string
  items: MovieItem[]
  loading?: boolean
  moreLink?: string
  mediaType?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mediaType: 'movie',
})

const router = useRouter()
const tmdb = useTmdb()

const selectedMovie = ref<MovieItem | null>(null)
const detailData = ref<any>(null)
const previewPosterErrored = ref(false)

async function handleClick(movie: MovieItem) {
  selectedMovie.value = movie
  detailData.value = null
  previewPosterErrored.value = false

  try {
    const type = movie.media_type || props.mediaType
    detailData.value = await tmdb.getMediaDetail(type, movie.id)
  } catch (e) {
    detailData.value = movie
  }
}

function closePreview() {
  selectedMovie.value = null
  detailData.value = null
}

function goDetail() {
  if (!selectedMovie.value) return
  const type = selectedMovie.value.media_type || props.mediaType
  router.push(`/detail/${type}-${selectedMovie.value.id}`)
  closePreview()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && selectedMovie.value && detailData.value) {
    closePreview()
  }
}

watch([selectedMovie, detailData], ([movie, detail]) => {
  const open = !!(movie && detail)
  if (open) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
}, { flush: 'sync' })

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
