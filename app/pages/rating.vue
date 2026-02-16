<template>
  <div class="pt-14 md:pt-16 min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white">관심목록</h1>
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
        :items="displayItems"
        :loading="loading"
        empty-text="관심목록이 비어있습니다"
        @select="goDetail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '관심목록 - SPMV' })

const router = useRouter()
const authStore = useAuthStore()
const tmdb = useTmdb()
const toast = useToast()

const tab = ref<'movie' | 'tv'>('movie')
const items = ref<any[]>([])
const loading = ref(true)

const guestItems = computed(() =>
  authStore.guestWatchlist.filter((f: any) => f.media_type === tab.value)
)
const displayItems = computed(() =>
  authStore.isGuest ? guestItems.value : items.value
)

async function fetchData() {
  if (!authStore.isLoggedIn) {
    toast.warning('로그인이 필요합니다')
    router.push('/')
    return
  }

  if (authStore.isGuest) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const res = await tmdb.getWatchlist(authStore.accountId!, authStore.sessionId!, tab.value)
    items.value = res.results
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function switchTab(newTab: 'movie' | 'tv') {
  tab.value = newTab
  fetchData()
}

function goDetail(item: any) {
  router.push(`/detail/${tab.value}-${item.id}`)
}

onMounted(() => fetchData())
</script>
