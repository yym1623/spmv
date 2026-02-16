/**
 * TMDB API 컴포저블
 *
 * 모든 요청은 서버 API(/api/tmdb/...)를 경유한다.
 * 타입: ~/types/tmdb
 */
import type { TmdbResponse, MovieItem, CastMember, Review, VideoResult, ExternalIds } from '~/types/tmdb'

export type { TmdbResponse, MovieItem, CastMember, Review, VideoResult, ExternalIds }

// ─── Composable ──────────────────────────────────────
export function useTmdb() {
  // ─── 영화 ──────────────────────────────────────────
  async function getUpcoming(page = 1) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/movies/upcoming', {
      params: { page },
    })
  }

  async function getPopularMovies(page = 1) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/movies/popular', {
      params: { page },
    })
  }

  async function getNowPlaying(page = 1) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/movies/now-playing', {
      params: { page },
    })
  }

  async function getTrendingMovies() {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/trending/movies')
  }

  // ─── TV ────────────────────────────────────────────
  async function getPopularTv(page = 1) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/tv/popular', {
      params: { page },
    })
  }

  async function getNewTv(page = 1) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/tv/on-the-air', {
      params: { page },
    })
  }

  // ─── 미디어 공통 (영화/TV 통합) ────────────────────
  async function getMediaDetail(type: string, id: number) {
    return $fetch<MovieItem>(`/api/tmdb/media/${type}/${id}`)
  }

  async function getMediaVideos(type: string, id: number) {
    return $fetch<{ results: VideoResult[] }>(`/api/tmdb/media/${type}/${id}/videos`)
  }

  async function getMediaRecommendations(type: string, id: number) {
    return $fetch<TmdbResponse<MovieItem>>(`/api/tmdb/media/${type}/${id}/recommendations`)
  }

  async function getMediaCredits(type: string, id: number) {
    return $fetch<{ cast: CastMember[] }>(`/api/tmdb/media/${type}/${id}/credits`)
  }

  async function getMediaReviews(type: string, id: number) {
    return $fetch<TmdbResponse<Review>>(`/api/tmdb/media/${type}/${id}/reviews`)
  }

  async function getMediaExternalIds(type: string, id: number) {
    return $fetch<ExternalIds>(`/api/tmdb/media/${type}/${id}/external-ids`)
  }

  // ─── 검색 ──────────────────────────────────────────
  async function searchMulti(query: string, page = 1) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/search/multi', {
      params: { query, page },
    })
  }

  // ─── 탐색 (장르 필터) ──────────────────────────────
  async function discoverMovies(params: Record<string, string | number> = {}) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/discover/movie', {
      params,
    })
  }

  async function discoverTv(params: Record<string, string | number> = {}) {
    return $fetch<TmdbResponse<MovieItem>>('/api/tmdb/discover/tv', {
      params,
    })
  }

  async function getMovieGenres() {
    return $fetch<{ genres: { id: number; name: string }[] }>('/api/tmdb/genres/movie')
  }

  async function getTvGenres() {
    return $fetch<{ genres: { id: number; name: string }[] }>('/api/tmdb/genres/tv')
  }

  // ─── 인증 ──────────────────────────────────────────
  async function createRequestToken() {
    return $fetch<{ request_token: string }>('/api/tmdb/auth/token')
  }

  async function validateWithLogin(username: string, password: string, requestToken: string) {
    return $fetch<{ request_token: string }>('/api/tmdb/auth/validate-login', {
      method: 'POST',
      body: { username, password, request_token: requestToken },
    })
  }

  async function createSession(requestToken: string) {
    return $fetch<{ session_id: string }>('/api/tmdb/auth/session', {
      method: 'POST',
      body: { request_token: requestToken },
    })
  }

  async function createGuestSession() {
    return $fetch<{ guest_session_id: string }>('/api/tmdb/auth/guest-session')
  }

  async function getAccountDetails(sessionId: string) {
    return $fetch<{ id: number }>('/api/tmdb/account/0', {
      params: { session_id: sessionId },
    })
  }

  // ─── 계정 액션 ─────────────────────────────────────
  async function toggleFavorite(
    accountId: number,
    sessionId: string,
    mediaType: string,
    mediaId: number,
    favorite: boolean,
  ) {
    return $fetch(`/api/tmdb/account/${accountId}/favorite`, {
      method: 'POST',
      body: { session_id: sessionId, media_type: mediaType, media_id: mediaId, favorite },
    })
  }

  async function toggleWatchlist(
    accountId: number,
    sessionId: string,
    mediaType: string,
    mediaId: number,
    watchlist: boolean,
  ) {
    return $fetch(`/api/tmdb/account/${accountId}/watchlist`, {
      method: 'POST',
      body: { session_id: sessionId, media_type: mediaType, media_id: mediaId, watchlist },
    })
  }

  async function rateMedia(type: string, id: number, value: number, sessionParam: string) {
    const isGuest = sessionParam.includes('guest') || !sessionParam.match(/^[a-f0-9]{40}$/)
    const body: Record<string, unknown> = { value }
    if (isGuest) {
      body.guest_session_id = sessionParam
    } else {
      body.session_id = sessionParam
    }

    return $fetch(`/api/tmdb/media/${type}/${id}/rating`, {
      method: 'POST',
      body,
    })
  }

  async function getFavorites(accountId: number, sessionId: string, type: string) {
    const mediaType = type === 'movie' ? 'movies' : 'tv'
    return $fetch<TmdbResponse<MovieItem>>(`/api/tmdb/account/${accountId}/favorite`, {
      params: { session_id: sessionId, media_type: mediaType },
    })
  }

  async function getWatchlist(accountId: number, sessionId: string, type: string) {
    const mediaType = type === 'movie' ? 'movies' : 'tv'
    return $fetch<TmdbResponse<MovieItem>>(`/api/tmdb/account/${accountId}/watchlist`, {
      params: { session_id: sessionId, media_type: mediaType },
    })
  }

  async function getRatedMedia(accountId: number, sessionId: string, type: string) {
    const mediaType = type === 'movie' ? 'movies' : 'tv'
    return $fetch<TmdbResponse<MovieItem & { rating: number }>>(`/api/tmdb/account/${accountId}/rated`, {
      params: { session_id: sessionId, media_type: mediaType },
    })
  }

  // ─── 리스트 ────────────────────────────────────────
  async function createList(sessionId: string, name: string) {
    return $fetch<{ list_id: number }>('/api/tmdb/lists', {
      method: 'POST',
      body: { session_id: sessionId, name },
    })
  }

  async function getListDetail(listId: number) {
    return $fetch<{ id: number; name: string; items: MovieItem[] }>(`/api/tmdb/lists/${listId}`)
  }

  async function addToList(listId: number, sessionId: string, mediaId: number) {
    return $fetch(`/api/tmdb/lists/${listId}/add-item`, {
      method: 'POST',
      body: { session_id: sessionId, media_id: mediaId },
    })
  }

  async function removeFromList(listId: number, sessionId: string, mediaId: number) {
    return $fetch(`/api/tmdb/lists/${listId}/remove-item`, {
      method: 'POST',
      body: { session_id: sessionId, media_id: mediaId },
    })
  }

  async function checkItemInList(listId: number, movieId: number) {
    return $fetch<{ item_present: boolean }>(`/api/tmdb/lists/${listId}/item-status`, {
      params: { movie_id: movieId },
    })
  }

  // ─── Export ────────────────────────────────────────
  return {
    // 영화
    getUpcoming,
    getPopularMovies,
    getNowPlaying,
    getTrendingMovies,
    // TV
    getPopularTv,
    getNewTv,
    // 미디어 공통
    getMediaDetail,
    getMediaVideos,
    getMediaRecommendations,
    getMediaCredits,
    getMediaReviews,
    getMediaExternalIds,
    // 검색
    searchMulti,
    // 탐색
    discoverMovies,
    discoverTv,
    getMovieGenres,
    getTvGenres,
    // 인증
    createRequestToken,
    validateWithLogin,
    createSession,
    createGuestSession,
    getAccountDetails,
    // 계정
    toggleFavorite,
    toggleWatchlist,
    rateMedia,
    getFavorites,
    getWatchlist,
    getRatedMedia,
    // 리스트
    createList,
    getListDetail,
    addToList,
    removeFromList,
    checkItemInList,
  }
}
