<template>
  <div class="pt-14 md:pt-16">
    <!-- Hero -->
    <HomeHeroSection :bg-image="heroBg" />

    <!-- Content -->
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 pb-12 space-y-2">
      <!-- Upcoming -->
      <HomeMovieSection
        title="개봉예정"
        :items="upcomingMovies"
        :loading="loadingUpcoming"
        more-link="/new"
        media-type="movie"
      />

      <!-- Popular -->
      <HomeMovieSection
        title="인기 영화"
        :items="popularMovies"
        :loading="loadingPopular"
        more-link="/popular"
        media-type="movie"
      />

      <!-- Trailers -->
      <HomeTrailerSection :items="trailerMovies" :loading="loadingTrailers" />

      <!-- Trending -->
      <HomeMovieSection
        title="실시간 급상승"
        :items="trendingMovies"
        :loading="loadingTrending"
        more-link="/popular"
        media-type="movie"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieItem, VideoResult } from '~/types/tmdb'

useHead({ title: 'SPMV - 영화 및 TV프로그램' })

const tmdb = useTmdb()

const upcomingMovies = ref<MovieItem[]>([])
const popularMovies = ref<MovieItem[]>([])
const trendingMovies = ref<MovieItem[]>([])
const trailerMovies = ref<MovieItem[]>([])

const loadingUpcoming = ref(true)
const loadingPopular = ref(true)
const loadingTrending = ref(true)
const loadingTrailers = ref(true)

const heroBg = ref('https://www.justwatch.com/appassets/img/home/bg-tiles/bg-tiles.webp')

onMounted(async () => {
  try {
    const [upcoming, popular, trending, nowPlaying] = await Promise.all([
      tmdb.getUpcoming(),
      tmdb.getPopularMovies(),
      tmdb.getTrendingMovies(),
      tmdb.getNowPlaying(),
    ])

    upcomingMovies.value = upcoming.results.slice(0, 12)
    loadingUpcoming.value = false

    popularMovies.value = popular.results.slice(0, 12)
    loadingPopular.value = false

    trendingMovies.value = trending.results.slice(0, 12)
    loadingTrending.value = false

    // 최신 상영작 중 예고편이 있는 영화만 필터링 (최대 12개)
    const candidates = nowPlaying.results
      .filter((m: MovieItem) => m.backdrop_path)
      .slice(0, 12)

    const videoChecks = await Promise.allSettled(
      candidates.map(async (movie: MovieItem) => {
        const videos = await tmdb.getMediaVideos('movie', movie.id)
        const trailer = videos.results.find(
          (v: VideoResult) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        )
        return trailer ? movie : null
      })
    )

    const trailerResults = videoChecks
      .filter((r): r is PromiseFulfilledResult<MovieItem> => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)
    // 랜덤 셔플
    for (let i = trailerResults.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const a = trailerResults[i]
      const b = trailerResults[j]
      if (a !== undefined && b !== undefined) {
        trailerResults[i] = b
        trailerResults[j] = a
      }
    }
    trailerMovies.value = trailerResults
    loadingTrailers.value = false

    // Hero 배경을 최신 데이터 중 랜덤으로 설정
    const allMovies = [
      ...upcoming.results,
      ...popular.results,
      ...trending.results,
      ...trailerMovies.value,
    ].filter((m: MovieItem) => m.backdrop_path)
    if (allMovies.length) {
      const random = allMovies[Math.floor(Math.random() * allMovies.length)]
      if (random?.backdrop_path) {
        heroBg.value = tmdbImageUrl(random.backdrop_path, 'backdrop', 'original')
      }
    }
  } catch (e) {
    console.error(e)
    loadingUpcoming.value = false
    loadingPopular.value = false
    loadingTrending.value = false
    loadingTrailers.value = false
  }
})
</script>
