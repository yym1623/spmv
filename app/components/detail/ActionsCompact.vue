<template>
  <div class="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm p-1" @click.stop>
    <!-- Favorite: 채워진 상태면 filled 아이콘 + 강조색 -->
    <button
      type="button"
      class="compact-btn"
      :class="isFavorite ? 'text-white opacity-100' : 'text-white/70 opacity-80'"
      title="즐겨찾기"
      @click.stop="handleFavorite"
    >
      <Icon
        :key="`fav-${isFavorite}`"
        :name="isFavorite ? 'material-symbols:favorite-rounded' : 'material-symbols:favorite-outline-rounded'"
        class="w-4 h-4"
      />
    </button>
    <!-- Watchlist: 채워진 상태면 filled 아이콘 + 강조색 -->
    <button
      type="button"
      class="compact-btn"
      :class="isWatchlisted ? 'text-white opacity-100' : 'text-white/70 opacity-80'"
      title="관심목록"
      @click.stop="handleWatchlist"
    >
      <Icon
        :key="`wl-${isWatchlisted}`"
        :name="isWatchlisted ? 'material-symbols:bookmark-rounded' : 'material-symbols:bookmark-outline-rounded'"
        class="w-4 h-4"
      />
    </button>
    <!-- Rating: 채워진 상태면 filled 아이콘 + 강조색 -->
    <div class="relative">
      <button
        type="button"
        class="compact-btn"
        :class="isRated ? 'text-white opacity-100' : 'text-white/70 opacity-80'"
        title="평점"
        @click.stop="ratingOpen = !ratingOpen"
      >
        <Icon
          :key="`rate-${isRated}`"
          :name="isRated ? 'material-symbols:star-rounded' : 'material-symbols:star-outline-rounded'"
          class="w-4 h-4"
        />
      </button>
      <Transition name="dropdown">
        <div
          v-if="ratingOpen"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 flex items-center gap-0.5 px-2 py-1.5
                 glass-dark rounded-lg shadow-xl z-50"
        >
          <button
            v-for="star in 4"
            :key="star"
            type="button"
            class="p-0.5 transition-transform hover:scale-110"
            @click.stop="handleRate(star * 2.5)"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
          >
            <Icon
              name="material-symbols:star-rounded"
              class="w-5 h-5 transition-colors"
              :class="(hoverRating >= star || currentRating >= star * 2.5) ? 'text-yellow-400' : 'text-white/30'"
            />
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mediaId: number
  mediaType: string
  media?: any
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const tmdb = useTmdb()
const toast = useToast()

const isFavorite = ref(false)
const isWatchlisted = ref(false)
const isRated = ref(false)
const currentRating = ref(0)
const ratingOpen = ref(false)
const hoverRating = ref(0)

function requireAuth(guestAllowed = false): boolean {
  if (!authStore.isLoggedIn) {
    toast.warning('로그인이 필요합니다')
    return false
  }
  if (!guestAllowed && authStore.isGuest) {
    toast.warning('게스트 아이디로는 불가능합니다')
    return false
  }
  return true
}

async function handleFavorite() {
  if (!requireAuth(true)) return
  if (authStore.isGuest) {
    if (isFavorite.value) {
      authStore.removeGuestFavorite(props.mediaId, props.mediaType)
      isFavorite.value = false
      toast.success('즐겨찾기에서 삭제했습니다')
    } else {
      const item = props.media
        ? { ...props.media, id: props.mediaId, media_type: mediaTypeNorm.value }
        : { id: props.mediaId, media_type: mediaTypeNorm.value }
      authStore.saveGuestFavorite(item)
      isFavorite.value = true
      toast.success('즐겨찾기에 추가했습니다')
    }
    nextTick(() => syncStateFromStore())
    return
  }
  try {
    toast.loading()
    await tmdb.toggleFavorite(
      authStore.accountId!,
      authStore.sessionId!,
      props.mediaType,
      props.mediaId,
      !isFavorite.value
    )
    isFavorite.value = !isFavorite.value
    toast.closeLoading()
    toast.success(isFavorite.value ? '즐겨찾기에 추가했습니다' : '즐겨찾기에서 삭제했습니다')
  } catch (e) {
    toast.closeLoading()
    toast.error('오류가 발생했습니다')
  }
}

async function handleWatchlist() {
  if (!requireAuth(true)) return
  if (authStore.isGuest) {
    if (isWatchlisted.value) {
      authStore.removeGuestWatchlist(props.mediaId, props.mediaType)
      isWatchlisted.value = false
      toast.success('관심목록에서 삭제했습니다')
    } else {
      const item = props.media
        ? { ...props.media, id: props.mediaId, media_type: mediaTypeNorm.value }
        : { id: props.mediaId, media_type: mediaTypeNorm.value }
      authStore.saveGuestWatchlist(item)
      isWatchlisted.value = true
      toast.success('관심목록에 추가했습니다')
    }
    nextTick(() => syncStateFromStore())
    return
  }
  try {
    toast.loading()
    await tmdb.toggleWatchlist(
      authStore.accountId!,
      authStore.sessionId!,
      props.mediaType,
      props.mediaId,
      !isWatchlisted.value
    )
    isWatchlisted.value = !isWatchlisted.value
    toast.closeLoading()
    toast.success(isWatchlisted.value ? '관심목록에 추가했습니다' : '관심목록에서 삭제했습니다')
  } catch (e) {
    toast.closeLoading()
    toast.error('오류가 발생했습니다')
  }
}

async function handleRate(value: number) {
  if (!requireAuth(true)) return
  if (authStore.isGuest) {
    authStore.saveGuestRating({ id: props.mediaId, media_type: mediaTypeNorm.value, rating: value })
    currentRating.value = value
    isRated.value = true
    ratingOpen.value = false
    toast.success('평점을 등록했습니다')
    nextTick(() => syncStateFromStore())
    return
  }
  try {
    toast.loading()
    await tmdb.rateMedia(props.mediaType, props.mediaId, value, authStore.sessionId!)
    currentRating.value = value
    isRated.value = true
    ratingOpen.value = false
    toast.closeLoading()
    toast.success('평점을 등록했습니다')
  } catch (e) {
    toast.closeLoading()
    toast.error('오류가 발생했습니다')
  }
}

const mediaTypeNorm = computed(() => props.mediaType || 'movie')

const GUEST_FAVORITES_KEY = 'spmv_guest_favorites'
const GUEST_WATCHLIST_KEY = 'spmv_guest_watchlist'
const GUEST_RATINGS_KEY = 'spmv_guest_ratings'

function parseGuestList(key: string): any[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** 로컬스토리지/계정 상태 검사 → 이미 저장된 항목이면 채워진 아이콘으로 표시 */
function syncStateFromStore() {
  if (!authStore.isLoggedIn) return
  const id = Number(props.mediaId)
  const type = mediaTypeNorm.value

  if (authStore.isGuest) {
    const favorites = parseGuestList(GUEST_FAVORITES_KEY)
    const watchlist = parseGuestList(GUEST_WATCHLIST_KEY)
    const ratings = parseGuestList(GUEST_RATINGS_KEY)
    const same = (f: any) => Number(f.id) === id && (String(f.media_type || 'movie') === type)
    isFavorite.value = favorites.some(same)
    isWatchlisted.value = watchlist.some(same)
    const rated = ratings.find((r: any) => same(r))
    if (rated) {
      isRated.value = true
      currentRating.value = Number((rated as any).rating) || 0
    } else {
      isRated.value = false
      currentRating.value = 0
    }
    return
  }

  ;(async () => {
    try {
      const [favRes, watchRes, ratedRes] = await Promise.allSettled([
        tmdb.getFavorites(authStore.accountId!, authStore.sessionId!, type),
        tmdb.getWatchlist(authStore.accountId!, authStore.sessionId!, type),
        tmdb.getRatedMedia(authStore.accountId!, authStore.sessionId!, type),
      ])
      if (favRes.status === 'fulfilled') isFavorite.value = favRes.value.results.some((r: any) => r.id === id)
      if (watchRes.status === 'fulfilled') isWatchlisted.value = watchRes.value.results.some((r: any) => r.id === id)
      if (ratedRes.status === 'fulfilled') {
        const rated = ratedRes.value.results.find((r: any) => r.id === id)
        if (rated) {
          isRated.value = true
          currentRating.value = (rated as any).rating
        } else {
          isRated.value = false
          currentRating.value = 0
        }
      }
    } catch (e) {
      console.error(e)
    }
  })()
}

onMounted(() => syncStateFromStore())

watch([() => props.mediaId, mediaTypeNorm], () => syncStateFromStore())

watch(
  () => [authStore.guestFavorites, authStore.guestWatchlist, authStore.guestRatings],
  () => {
    if (authStore.isGuest) syncStateFromStore()
  },
  { deep: true }
)
</script>

<style scoped>
.compact-btn {
  @apply w-6 h-6 rounded-full flex items-center justify-center text-white/90
         hover:bg-white/20 hover:text-white transition-all duration-200 active:scale-95;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translate(-50%, 4px);
}
</style>
