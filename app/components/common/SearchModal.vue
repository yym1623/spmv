<template>
  <Teleport to="body">
    <Transition name="search-overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] md:pt-[16vh] px-4"
        @click.self="close"
      >
        <!-- 뒤 배경 블러 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />

        <!-- 팝업 -->
        <Transition name="search-popup" appear>
          <div
            v-if="open"
            class="relative w-full max-w-xl rounded-2xl bg-surface border border-white/10
                   shadow-2xl shadow-black/60 overflow-hidden"
          >
            <!-- 검색 인풋 -->
            <div class="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Icon
                name="mdi:movie-search"
                class="w-5 h-5 text-accent-light shrink-0"
              />
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="영화 및 TV프로그램을 검색하세요"
                class="flex-1 bg-transparent text-white text-base outline-none placeholder-white/30"
                autocomplete="off"
                @keydown.enter="search"
                @keydown.escape="close"
                @keydown.down.prevent="navigate(1)"
                @keydown.up.prevent="navigate(-1)"
              />
              <button
                v-if="query"
                class="w-7 h-7 rounded-lg flex items-center justify-center
                       text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                @click="clearQuery"
              >
                <Icon name="material-symbols:close-rounded" class="w-4 h-4" />
              </button>
            </div>

            <!-- 컨텐츠 -->
            <div class="max-h-[50vh] overflow-y-auto overscroll-contain">

              <!-- 자동완성 결과 -->
              <template v-if="query.trim() && suggestions.length">
                <p class="section-label mt-3">검색 결과</p>
                <div class="px-2 pb-2 space-y-0.5">
                  <button
                    v-for="(item, idx) in suggestions"
                    :key="item.id"
                    class="result-row"
                    :class="{ 'bg-white/8': idx === activeIdx }"
                    @click="selectSuggestion(item)"
                  >
                    <img
                      v-if="item.poster_path && !searchPosterErrored[item.id]"
                      :src="tmdbImageUrl(item.poster_path, 'poster', 'sm')"
                      :alt="item.title || item.name"
                      class="w-10 h-14 rounded-lg object-cover shrink-0"
                      @error="searchPosterErrored[item.id] = true"
                    />
                    <div
                      v-else
                      class="w-10 h-14 rounded-lg bg-white/8 flex items-center justify-center shrink-0 text-white/30"
                    >
                      <Icon name="material-symbols:image-outline-rounded" class="w-4 h-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm text-white font-medium truncate">{{ item.title || item.name }}</p>
                      <p class="text-xs text-white/40 mt-0.5">
                        {{ item.media_type === 'tv' ? 'TV' : '영화' }}
                        <span v-if="item.release_date || item.first_air_date">
                          &middot; {{ (item.release_date || item.first_air_date || '').slice(0, 4) }}
                        </span>
                        <span v-if="item.vote_average">
                          &middot; {{ item.vote_average.toFixed(1) }}
                        </span>
                      </p>
                    </div>
                    <Icon name="material-symbols:arrow-outward-rounded" class="w-4 h-4 text-white/15 shrink-0" />
                  </button>
                </div>

                <!-- 전체 검색 -->
                <button
                  class="w-full flex items-center justify-center gap-2 py-3 border-t border-white/5
                         hover:bg-white/5 transition-colors"
                  @click="search"
                >
                  <Icon name="material-symbols:search-rounded" class="w-4 h-4 text-accent-light" />
                  <span class="text-sm text-accent-light">"{{ query }}" 전체 검색</span>
                </button>
              </template>

              <!-- 검색 중 -->
              <template v-else-if="query.trim() && isSearching">
                <div class="flex items-center justify-center gap-2 py-10">
                  <div class="w-5 h-5 border-2 border-white/10 border-t-accent-light rounded-full animate-spin" />
                  <span class="text-sm text-white/30">검색 중...</span>
                </div>
              </template>

              <!-- 결과 없음 -->
              <template v-else-if="query.trim() && !isSearching && searched">
                <div class="flex flex-col items-center py-10">
                  <Icon name="material-symbols:search-off-rounded" class="w-8 h-8 text-white/10 mb-2" />
                  <p class="text-sm text-white/40">검색 결과가 없습니다</p>
                </div>
              </template>

              <!-- 최근 검색어 -->
              <template v-else-if="!query.trim() && recentSearches.length">
                <div class="flex items-center justify-between mt-3 px-5">
                  <p class="section-label !mt-0 !mb-0 !px-0">최근 검색</p>
                  <button
                    class="text-[11px] text-white/25 hover:text-white/50 transition-colors"
                    @click="clearAllRecent"
                  >
                    전체 삭제
                  </button>
                </div>
                <div class="px-2 pt-2 pb-2 space-y-0.5">
                  <button
                    v-for="(term, idx) in recentSearches"
                    :key="term"
                    class="result-row group"
                    :class="{ 'bg-white/8': idx === activeIdx }"
                    @click="selectRecent(term)"
                  >
                    <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Icon name="material-symbols:history-rounded" class="w-4 h-4 text-white/20" />
                    </div>
                    <span class="text-sm text-white/60 flex-1 truncate text-left">{{ term }}</span>
                    <span
                      role="button"
                      class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 cursor-pointer
                             text-transparent group-hover:text-white/25 hover:!text-white/50 hover:!bg-white/10
                             transition-all"
                      @click.stop="removeRecent(term)"
                    >
                      <Icon name="material-symbols:close-rounded" class="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </template>

              <!-- 빈 상태 -->
              <template v-else-if="!query.trim() && !recentSearches.length">
                <div class="flex flex-col items-center justify-center h-[200px]">
                  <p class="text-sm text-white/25">영화 또는 TV프로그램을 검색해보세요</p>
                </div>
              </template>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { MovieItem } from '~/types/tmdb'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const router = useRouter()
const tmdb = useTmdb()

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const isSearching = ref(false)
const searched = ref(false)
const activeIdx = ref(-1)
const suggestions = ref<MovieItem[]>([])
const searchPosterErrored = reactive<Record<number, boolean>>({})
const recentSearches = ref<string[]>([])

const RECENT_KEY = 'spmv_recent_searches'
const MAX_RECENT = 10
const MAX_SUGGESTIONS = 8

// ─── 모달 열릴 때 포커스 ─────────────────────────────
watch(() => props.open, (val) => {
  if (val) {
    loadRecent()
    nextTick(() => inputRef.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    query.value = ''
    suggestions.value = []
    searched.value = false
    activeIdx.value = -1
    document.body.style.overflow = ''
  }
})

// ─── 최근 검색어 ─────────────────────────────────────
function loadRecent() {
  if (!import.meta.client) return
  try {
    const data = localStorage.getItem(RECENT_KEY)
    recentSearches.value = data ? JSON.parse(data) : []
  } catch {
    recentSearches.value = []
  }
}

function saveRecent(term: string) {
  if (!import.meta.client) return
  const t = term.trim()
  if (!t) return
  recentSearches.value = [t, ...recentSearches.value.filter(s => s !== t)].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value))
}

function removeRecent(term: string) {
  recentSearches.value = recentSearches.value.filter(s => s !== term)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value))
}

function clearAllRecent() {
  recentSearches.value = []
  localStorage.removeItem(RECENT_KEY)
}

// ─── 자동완성 (debounce) ─────────────────────────────
let timer: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
  activeIdx.value = -1
  if (timer) clearTimeout(timer)

  const t = val.trim()
  if (!t) {
    suggestions.value = []
    isSearching.value = false
    searched.value = false
    return
  }

  isSearching.value = true
  searched.value = false

  timer = setTimeout(async () => {
    try {
      const res = await tmdb.searchMulti(t, 1)
      suggestions.value = res.results
        .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, MAX_SUGGESTIONS)
      searched.value = true
    } catch {
      suggestions.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})

// ─── 키보드 ──────────────────────────────────────────
function navigate(dir: number) {
  const list = query.value.trim() ? suggestions.value : recentSearches.value
  if (!list.length) return
  activeIdx.value = (activeIdx.value + dir + list.length) % list.length
}

// ─── 액션 ────────────────────────────────────────────
function close() {
  emit('update:open', false)
}

async function search() {
  const t = query.value.trim()
  if (!t) return

  if (activeIdx.value >= 0) {
    const suggestion = suggestions.value[activeIdx.value]
    if (t && suggestion) {
      selectSuggestion(suggestion)
      return
    }
    const recent = recentSearches.value[activeIdx.value]
    if (!t && recent) {
      selectRecent(recent)
      return
    }
  }

  saveRecent(t)
  close()
  await router.push(`/search/${encodeURIComponent(t)}`)
}

function selectSuggestion(item: MovieItem) {
  const title = item.title || item.name || ''
  saveRecent(title)
  close()
  const type = item.media_type === 'tv' ? 'tv' : 'movie'
  router.push(`/detail/${type}-${item.id}`)
}

function selectRecent(term: string) {
  saveRecent(term)
  close()
  router.push(`/search/${encodeURIComponent(term)}`)
}

function clearQuery() {
  query.value = ''
  suggestions.value = []
  searched.value = false
  inputRef.value?.focus()
}
</script>

<style scoped>
.section-label {
  @apply text-[11px] font-semibold text-white/25 uppercase tracking-wider px-5 mb-2;
}

.result-row {
  @apply w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left
         hover:bg-white/5 transition-colors;
}

/* 오버레이 */
.search-overlay-enter-active,
.search-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.search-overlay-enter-from,
.search-overlay-leave-to {
  opacity: 0;
}

/* 팝업 */
.search-popup-enter-active {
  transition: all 0.25s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.search-popup-leave-active {
  transition: all 0.15s ease;
}
.search-popup-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.97);
}
.search-popup-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
