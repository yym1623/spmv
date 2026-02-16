<template>
  <div class="pt-14 md:pt-16 min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white">인기 콘텐츠</h1>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="tab === 'movie' ? 'bg-accent text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'"
            @click="switchTab('movie')"
          >
            영화
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="tab === 'tv' ? 'bg-accent text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'"
            @click="switchTab('tv')"
          >
            TV
          </button>
        </div>
      </div>

      <!-- Genre Filter -->
      <CommonScrollableRow container-class="pb-4" class="mb-6">
        <button
          class="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="!selectedGenre ? 'bg-accent text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'"
          @click="selectGenre(null)"
        >
          전체
        </button>
        <button
          v-for="genre in genres"
          :key="genre.id"
          class="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="selectedGenre === genre.id ? 'bg-accent text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'"
          @click="selectGenre(genre.id)"
        >
          {{ genre.name }}
        </button>
      </CommonScrollableRow>

      <!-- Grid -->
      <CommonMovieGrid
        :items="items"
        :loading="loading"
        empty-text="콘텐츠가 없습니다"
        @select="goDetail"
        @load-more="loadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '인기 - SPMV' })

const router = useRouter()
const tmdb = useTmdb()

const tab = ref<'movie' | 'tv'>('movie')
const items = ref<import('~/types/tmdb').MovieItem[]>([])
const genres = ref<import('~/types/tmdb').Genre[]>([])
const selectedGenre = ref<number | null>(null)
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

async function fetchGenres() {
  try {
    const res = tab.value === 'movie'
      ? await tmdb.getMovieGenres()
      : await tmdb.getTvGenres()
    genres.value = res.genres
  } catch (e) {
    console.error(e)
  }
}

async function fetchData(page = 1) {
  if (page === 1) loading.value = true
  try {
    const params: Record<string, string | number> = {
      sort_by: 'popularity.desc',
      page,
    }
    if (selectedGenre.value) {
      params.with_genres = selectedGenre.value
    }

    const res = tab.value === 'movie'
      ? await tmdb.discoverMovies(params)
      : await tmdb.discoverTv(params)

    if (page === 1) {
      items.value = res.results
    } else {
      items.value = [...items.value, ...res.results]
    }
    totalPages.value = res.total_pages
    currentPage.value = page
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function switchTab(newTab: 'movie' | 'tv') {
  tab.value = newTab
  selectedGenre.value = null
  items.value = []
  fetchGenres()
  fetchData(1)
}

function selectGenre(genreId: number | null) {
  selectedGenre.value = genreId
  items.value = []
  fetchData(1)
}

function loadMore() {
  if (currentPage.value < totalPages.value && !loading.value) {
    fetchData(currentPage.value + 1)
  }
}

function goDetail(item: import('~/types/tmdb').MovieItem) {
  router.push(`/detail/${tab.value}-${item.id}`)
}

onMounted(() => {
  fetchGenres()
  fetchData()
})
</script>

