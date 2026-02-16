import { defineStore } from 'pinia'
import type { MovieItem } from '~/types/tmdb'

/** 게스트 저장용 최소 아이템 (id, media_type 필수, rating은 평점 목록용) */
export type GuestMediaItem = Pick<MovieItem, 'id' | 'media_type'> & Partial<Pick<MovieItem, 'title' | 'name' | 'poster_path'>> & { rating?: number }

export const useAuthStore = defineStore('auth', () => {
  const tmdb = useTmdb()
  const toast = useToast()

  // State
  const sessionId = ref<string | null>(null)
  const guestSessionId = ref<string | null>(null)
  const accountId = ref<number | null>(null)
  const isLoggedIn = computed(() => !!sessionId.value || !!guestSessionId.value)
  const isGuest = computed(() => !!guestSessionId.value && !sessionId.value)

  // 게스트 모드용 localStorage 키
  const GUEST_FAVORITES_KEY = 'spmv_guest_favorites'
  const GUEST_WATCHLIST_KEY = 'spmv_guest_watchlist'
  const GUEST_RATINGS_KEY = 'spmv_guest_ratings'

  // 게스트 모드용 데이터 (ref로 두어 추가/삭제 시 바로 반영, 새로고침 불필요)
  const guestFavoritesRef = ref<GuestMediaItem[]>([])
  const guestWatchlistRef = ref<GuestMediaItem[]>([])
  const guestRatingsRef = ref<GuestMediaItem[]>([])

  const guestFavorites = computed(() => (import.meta.client && isGuest.value ? guestFavoritesRef.value : []))
  const guestWatchlist = computed(() => (import.meta.client && isGuest.value ? guestWatchlistRef.value : []))
  const guestRatings = computed(() => (import.meta.client && isGuest.value ? guestRatingsRef.value : []))

  // Init from localStorage
  function init() {
    if (import.meta.client) {
      sessionId.value = localStorage.getItem('session_id')
      guestSessionId.value = localStorage.getItem('guest_session_id')
      const storedAccountId = localStorage.getItem('account_id')
      accountId.value = storedAccountId ? Number(storedAccountId) : null
      // 게스트 데이터 ref 동기화 (다른 탭/페이지에서 읽을 때 최신값 유지)
      try {
        const f = localStorage.getItem(GUEST_FAVORITES_KEY)
        guestFavoritesRef.value = f ? JSON.parse(f) : []
        const w = localStorage.getItem(GUEST_WATCHLIST_KEY)
        guestWatchlistRef.value = w ? JSON.parse(w) : []
        const r = localStorage.getItem(GUEST_RATINGS_KEY)
        guestRatingsRef.value = r ? JSON.parse(r) : []
      } catch {
        guestFavoritesRef.value = []
        guestWatchlistRef.value = []
        guestRatingsRef.value = []
      }
    }
  }

  // 게스트 모드용 데이터 관리 (ref + localStorage 동기화 → 화면 바로 반영)
  function saveGuestFavorite(item: GuestMediaItem) {
    if (!import.meta.client) return
    const current = guestFavoritesRef.value
    const exists = current.find((f) => f.id === item.id && f.media_type === item.media_type)
    const updated = exists ? current : [...current, item]
    guestFavoritesRef.value = updated
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated))
  }

  function removeGuestFavorite(itemId: number, mediaType: string) {
    if (!import.meta.client) return
    const updated = guestFavoritesRef.value.filter((f) => !(f.id === itemId && f.media_type === mediaType))
    guestFavoritesRef.value = updated
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated))
  }

  function saveGuestWatchlist(item: GuestMediaItem) {
    if (!import.meta.client) return
    const current = guestWatchlistRef.value
    const exists = current.find((f) => f.id === item.id && f.media_type === item.media_type)
    const updated = exists ? current : [...current, item]
    guestWatchlistRef.value = updated
    localStorage.setItem(GUEST_WATCHLIST_KEY, JSON.stringify(updated))
  }

  function removeGuestWatchlist(itemId: number, mediaType: string) {
    if (!import.meta.client) return
    const updated = guestWatchlistRef.value.filter((f) => !(f.id === itemId && f.media_type === mediaType))
    guestWatchlistRef.value = updated
    localStorage.setItem(GUEST_WATCHLIST_KEY, JSON.stringify(updated))
  }

  function saveGuestRating(item: GuestMediaItem) {
    if (!import.meta.client) return
    const current = guestRatingsRef.value
    const exists = current.find((r) => r.id === item.id && r.media_type === item.media_type)
    const updated = exists ? current : [...current, item]
    guestRatingsRef.value = updated
    localStorage.setItem(GUEST_RATINGS_KEY, JSON.stringify(updated))
  }

  function removeGuestRating(itemId: number, mediaType: string) {
    if (!import.meta.client) return
    const updated = guestRatingsRef.value.filter((r) => !(r.id === itemId && r.media_type === mediaType))
    guestRatingsRef.value = updated
    localStorage.setItem(GUEST_RATINGS_KEY, JSON.stringify(updated))
  }

  async function loginAsGuest() {
    try {
      toast.loading()
      const res = await tmdb.createGuestSession()
      guestSessionId.value = res.guest_session_id
      localStorage.setItem('guest_session_id', res.guest_session_id)
      toast.closeLoading()
      toast.success('게스트로 로그인 되었습니다')
      return true
    } catch (e) {
      toast.closeLoading()
      toast.error('로그인에 실패했습니다')
      return false
    }
  }

  async function login(username: string, password: string) {
    try {
      toast.loading()

      // 1. Create request token
      const tokenRes = await tmdb.createRequestToken()
      const token = tokenRes.request_token

      // 2. Validate with login
      const validateRes = await tmdb.validateWithLogin(username, password, token)
      const validatedToken = validateRes.request_token

      // 3. Create session
      const sessionRes = await tmdb.createSession(validatedToken)
      sessionId.value = sessionRes.session_id
      localStorage.setItem('session_id', sessionRes.session_id)

      // 4. Get account details
      const accountRes = await tmdb.getAccountDetails(sessionRes.session_id)
      accountId.value = accountRes.id
      localStorage.setItem('account_id', String(accountRes.id))

      toast.closeLoading()
      toast.success('로그인 되었습니다')
      return true
    } catch (e) {
      toast.closeLoading()
      toast.error('정보가 일치하지 않습니다')
      return false
    }
  }

  async function logout() {
    const confirmed = await toast.confirm('정말 로그아웃 하시겠습니까?')
    if (!confirmed) return false

    sessionId.value = null
    guestSessionId.value = null
    accountId.value = null
    localStorage.removeItem('session_id')
    localStorage.removeItem('guest_session_id')
    localStorage.removeItem('account_id')
    // 게스트 데이터는 유지 (선택사항 - 필요시 삭제)
    // localStorage.removeItem(GUEST_FAVORITES_KEY)
    // localStorage.removeItem(GUEST_RATINGS_KEY)
    // localStorage.removeItem(GUEST_LISTS_KEY)
    toast.success('로그아웃 되었습니다')
    return true
  }

  function signUp() {
    tmdb.createRequestToken().then(res => {
      window.open(`https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=${window.location.origin}`)
    })
  }

  function getSessionParam(): string {
    return sessionId.value || guestSessionId.value || ''
  }

  return {
    sessionId,
    guestSessionId,
    accountId,
    isLoggedIn,
    isGuest,
    guestFavorites,
    guestWatchlist,
    guestRatings,
    init,
    loginAsGuest,
    login,
    logout,
    signUp,
    getSessionParam,
    saveGuestFavorite,
    removeGuestFavorite,
    saveGuestWatchlist,
    removeGuestWatchlist,
    saveGuestRating,
    removeGuestRating,
  }
})
