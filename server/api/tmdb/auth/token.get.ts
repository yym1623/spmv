/**
 * GET /api/tmdb/auth/token
 * 인증용 요청 토큰 생성
 */
export default defineEventHandler(async () => {
  return tmdbFetch('/authentication/token/new')
})
