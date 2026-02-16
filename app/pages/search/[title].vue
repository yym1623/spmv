<template>
  <div class="pt-14 md:pt-16 min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-white/40 text-sm mb-1">검색 결과</p>
        <h1 class="text-2xl md:text-3xl font-bold text-white">
          "{{ searchTitle }}"
        </h1>
      </div>

      <!-- Grid -->
      <CommonMovieGrid
        :items="items"
        :loading="loading"
        empty-text="검색된 결과가 없습니다"
        @select="goDetail"
        @load-more="loadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const tmdb = useTmdb()

const searchTitle = computed(() => decodeURIComponent(route.params.title as string))
const items = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

useHead({ title: () => `"${searchTitle.value}" 검색 - SPMV` })

async function fetchData(page = 1) {
  if (page === 1) loading.value = true
  try {
    const res = await tmdb.searchMulti(searchTitle.value, page)
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

function loadMore() {
  if (currentPage.value < totalPages.value && !loading.value) {
    fetchData(currentPage.value + 1)
  }
}

function goDetail(item: import('~/types/tmdb').MovieItem) {
  const type = item.media_type || 'movie'
  router.push(`/detail/${type}-${item.id}`)
}

watch(() => route.params.title, () => {
  items.value = []
  fetchData(1)
})

onMounted(() => fetchData())
</script>
