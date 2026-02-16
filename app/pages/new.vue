<template>
  <div class="pt-14 md:pt-16 min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white">신규 콘텐츠</h1>
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
useHead({ title: '신규 - SPMV' })

const router = useRouter()
const tmdb = useTmdb()

const tab = ref<'movie' | 'tv'>('movie')
const items = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

async function fetchData(page = 1) {
  if (page === 1) loading.value = true
  try {
    const res = tab.value === 'movie'
      ? await tmdb.getUpcoming(page)
      : await tmdb.getNewTv(page)
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
  items.value = []
  fetchData(1)
}

function loadMore() {
  if (currentPage.value < totalPages.value && !loading.value) {
    fetchData(currentPage.value + 1)
  }
}

function goDetail(item: any) {
  router.push(`/detail/${tab.value}-${item.id}`)
}

onMounted(() => fetchData())
</script>
