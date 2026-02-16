/**
 * GET /api/tmdb/auth/guest-session
 * 게스트 세션 생성
 */
export default defineEventHandler(async () => {
  return tmdbFetch('/authentication/guest_session/new')
})
