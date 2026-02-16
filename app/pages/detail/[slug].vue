<template>
  <div class="pt-14 md:pt-16 min-h-screen">
    <!-- Backdrop Hero -->
    <div class="relative h-[35vh] md:h-[45vh]">
      <!-- Skeleton -->
      <CommonSkeletonLoader v-if="loading" variant="custom" class="w-full h-full" />
      <template v-else>
        <template v-if="detail?.backdrop_path">
          <div
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${tmdbImageUrl(detail.backdrop_path, 'backdrop', 'original')})` }"
          />
        </template>
        <div
          v-else
          class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30 bg-white/5"
        >
          <Icon name="material-symbols:image-outline-rounded" class="w-12 h-12" />
          <span class="text-sm font-medium">이미지 없음</span>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

        <!-- Play Video Button -->
        <div class="absolute inset-0 flex items-center justify-center">
          <button
            class="w-20 h-20 rounded-full bg-red-600/80 flex items-center justify-center
                   hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
            @click="videoPlaying = true"
          >
            <Icon name="material-symbols:play-arrow-rounded" class="w-10 h-10 text-white ml-1" />
          </button>
        </div>
      </template>
    </div>

    <!-- Content -->
    <div class="relative -mt-16 md:-mt-24 z-20">
      <div class="max-w-screen-xl mx-auto px-4 md:px-6">
        <div class="glass-dark rounded-t-3xl p-6 md:p-10">
          <!-- Loading Skeleton -->
          <div v-if="loading" class="space-y-6">
            <div class="flex gap-6">
              <CommonSkeletonLoader variant="custom" class="w-40 md:w-52 aspect-[2/3] rounded-xl shrink-0" />
              <div class="flex-1 space-y-4">
                <CommonSkeletonLoader variant="custom" class="h-8 w-3/4" />
                <CommonSkeletonLoader variant="custom" class="h-12 w-full" />
                <CommonSkeletonLoader variant="custom" class="h-32 w-full" />
              </div>
            </div>
          </div>

          <!-- Detail Content -->
          <template v-else-if="detail">
            <div class="flex flex-col md:flex-row gap-6 md:gap-10">
              <!-- Poster + 이미지 하단 우측 액션 아이콘 -->
              <div class="w-40 md:w-52 shrink-0 mx-auto md:mx-0 relative">
                <img
                  v-if="detail.poster_path && !posterErrored"
                  :src="tmdbImageUrl(detail.poster_path, 'poster', 'lg')"
                  :alt="displayTitle"
                  class="w-full aspect-[2/3] rounded-2xl object-cover shadow-2xl"
                  @error="posterErrored = true"
                />
                <CommonNoImagePlaceholder v-else class="w-full aspect-[2/3] rounded-2xl shadow-2xl" />
                <div class="absolute bottom-0.5 right-0.5">
                  <DetailActionsCompact
                    :media-id="mediaId"
                    :media-type="mediaType"
                    :media="detail"
                  />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {{ displayTitle }}
                </h1>

                <!-- Tagline -->
                <p v-if="detail.tagline" class="text-white/50 italic mb-4">
                  {{ detail.tagline }}
                </p>

                <!-- SNS Links -->
                <div v-if="externalIds" class="flex items-center gap-3 mt-4">
                  <a
                    v-if="externalIds.instagram_id"
                    :href="`https://instagram.com/${externalIds.instagram_id}`"
                    target="_blank"
                    class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                           hover:bg-gradient-to-r hover:from-yellow-400 hover:via-red-500 hover:to-purple-600 transition-all"
                  >
                    <Icon name="mdi:instagram" class="w-5 h-5 text-white" />
                  </a>
                  <a
                    v-if="externalIds.facebook_id"
                    :href="`https://facebook.com/${externalIds.facebook_id}`"
                    target="_blank"
                    class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                           hover:bg-blue-600 transition-all"
                  >
                    <Icon name="mdi:facebook" class="w-5 h-5 text-white" />
                  </a>
                  <a
                    v-if="externalIds.twitter_id"
                    :href="`https://twitter.com/${externalIds.twitter_id}`"
                    target="_blank"
                    class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                           hover:bg-sky-500 transition-all"
                  >
                    <Icon name="mdi:twitter" class="w-5 h-5 text-white" />
                  </a>
                </div>

                <!-- Description -->
                <p class="mt-6 text-white/70 leading-relaxed text-sm md:text-base">
                  {{ detail.overview || '상세설명이 없습니다.' }}
                </p>
              </div>
            </div>

            <!-- Meta Info & Right Content -->
            <div class="flex flex-col lg:flex-row gap-8 mt-10">
              <!-- Left Meta -->
              <div class="lg:w-52 shrink-0 space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/40">개봉일</span>
                    <span class="text-white/80">{{ formatDate(detail.release_date || detail.first_air_date) }}</span>
                  </div>
                  <div class="flex items-start justify-between text-sm">
                    <span class="text-white/40 shrink-0">장르</span>
                    <span class="text-white/80 break-words w-[130px] text-right">{{ detail.genres?.map((g: any) => g.name).join(', ') || '미정' }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/40">시간</span>
                    <span class="text-white/80">{{ formatRuntime(detail.runtime) }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-white/40">평점</span>
                    <div class="flex items-center gap-1 ml-auto">
                      <Icon name="material-symbols:star-rounded" class="w-4 h-4 text-yellow-400" />
                      <span class="text-white/80 font-medium">{{ detail.vote_average?.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Content -->
              <div class="flex-1 min-w-0 space-y-8">
                <!-- Recommendations -->
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">관련 영상</h3>
                  <CommonMovieSwiper
                    v-if="recommendations.length"
                    :breakpoints="{ 0: { slidesPerView: 2.5 }, 640: { slidesPerView: 3.5 }, 1024: { slidesPerView: 4.5 } }"
                  >
                    <div
                      v-for="movie in recommendations"
                      :key="movie.id"
                      class="swiper-slide !w-28 md:!w-36"
                    >
                      <CommonMovieCard :item="movie" :show-title="true" @click="goToDetail(movie)" />
                    </div>
                  </CommonMovieSwiper>
                  <div v-else class="h-48 flex items-center justify-center text-white/30 glass rounded-xl">
                    관련 영상이 없습니다
                  </div>
                </div>

                <!-- Cast -->
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">출연진</h3>
                  <CommonMovieSwiper
                    v-if="cast.length"
                    :breakpoints="{ 0: { slidesPerView: 3.2 }, 640: { slidesPerView: 4.2 }, 1024: { slidesPerView: 5.2 } }"
                  >
                    <div v-for="person in cast" :key="person.id" class="swiper-slide !w-24 md:!w-32">
                      <div class="text-center">
                        <div class="aspect-[2/3] rounded-xl overflow-hidden bg-surface mb-2">
                          <img
                            v-if="person.profile_path && !castImageErrored[person.id]"
                            :src="tmdbImageUrl(person.profile_path, 'profile', 'md')"
                            :alt="person.name"
                            class="w-full h-full object-cover"
                            loading="lazy"
                            @error="castImageErrored[person.id] = true"
                          />
                          <div
                            v-else
                            class="w-full h-full flex flex-col items-center justify-center gap-0.5 text-white/30 bg-white/5"
                          >
                            <Icon name="material-symbols:person-outline-rounded" class="w-8 h-8" />
                          </div>
                        </div>
                        <p class="text-xs text-white/70 line-clamp-1">{{ person.name }}</p>
                      </div>
                    </div>
                  </CommonMovieSwiper>
                  <div v-else class="h-48 flex items-center justify-center text-white/30 glass rounded-xl">
                    출연진 정보가 없습니다
                  </div>
                </div>

                <!-- Reviews -->
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">리뷰</h3>
                  <div v-if="reviews.length" class="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    <div
                      v-for="review in reviews"
                      :key="review.id"
                      class="glass rounded-xl p-4"
                    >
                      <p class="text-sm text-white/70 leading-relaxed line-clamp-6">
                        {{ review.content }}
                      </p>
                      <div class="flex items-center justify-end gap-2 mt-3 text-xs text-white/40">
                        <span>{{ review.author }}</span>
                        <span>&middot;</span>
                        <span>{{ review.created_at?.slice(0, 10) }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="h-48 flex items-center justify-center text-white/30 glass rounded-xl">
                    리뷰가 없습니다
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <CommonVideoModal v-model:open="videoPlaying" :video-key="videoKey" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const tmdb = useTmdb()

// Parse slug: "movie-123" or "tv-456"
const slug = computed(() => route.params.slug as string)
const mediaType = computed(() => slug.value?.split('-')[0] ?? '')
const mediaId = computed(() => Number(slug.value?.split('-').slice(1).join('-') ?? 0))

const detail = ref<any>(null)
const recommendations = ref<any[]>([])
const cast = ref<any[]>([])
const reviews = ref<any[]>([])
const externalIds = ref<any>(null)
const videoKey = ref('')
const videoPlaying = ref(false)
const loading = ref(true)
const posterErrored = ref(false)
const castImageErrored = reactive<Record<number, boolean>>({})

const displayTitle = computed(() => detail.value?.title || detail.value?.name || '제목 없음')

useHead({ title: () => displayTitle.value ? `${displayTitle.value} - SPMV` : 'SPMV' })

async function loadData() {
  loading.value = true
  videoPlaying.value = false

  const type = mediaType.value
  const id = mediaId.value
  if (!type || !id) return

  try {
    const [detailRes, videosRes, recsRes, creditsRes, reviewsRes, extIdsRes] = await Promise.allSettled([
      tmdb.getMediaDetail(type, id),
      tmdb.getMediaVideos(type, id),
      tmdb.getMediaRecommendations(type, id),
      tmdb.getMediaCredits(type, id),
      tmdb.getMediaReviews(type, id),
      tmdb.getMediaExternalIds(type, id),
    ])

    if (detailRes.status === 'fulfilled') detail.value = detailRes.value
    if (videosRes.status === 'fulfilled') {
      const firstVideo = videosRes.value.results[0]
      if (firstVideo) videoKey.value = firstVideo.key
    }
    if (recsRes.status === 'fulfilled') recommendations.value = recsRes.value.results ?? []
    if (creditsRes.status === 'fulfilled') cast.value = creditsRes.value.cast ?? []
    if (reviewsRes.status === 'fulfilled') reviews.value = reviewsRes.value.results ?? []
    if (extIdsRes.status === 'fulfilled') externalIds.value = extIdsRes.value
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToDetail(movie: any) {
  const type = movie.media_type || mediaType.value
  router.push(`/detail/${type}-${movie.id}`)
}

watch(slug, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>
