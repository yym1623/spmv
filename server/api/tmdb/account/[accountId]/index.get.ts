/**
 * GET /api/tmdb/account/:accountId?session_id=xxx
 * 계정 정보 조회
 */
export default defineEventHandler(async (event) => {
  const { session_id } = getQuery(event)

  return tmdbFetch('/account', {
    params: { session_id: String(session_id) },
  })
})
