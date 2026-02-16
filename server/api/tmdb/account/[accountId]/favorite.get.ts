/**
 * GET /api/tmdb/account/:accountId/favorite?session_id=xxx&media_type=movies
 * 즐겨찾기 목록 조회
 */
export default defineEventHandler(async (event) => {
  const accountId = getRouterParam(event, 'accountId')
  const { session_id, media_type = 'movies' } = getQuery(event)

  return tmdbFetch(`/account/${accountId}/favorite/${media_type}`, {
    params: {
      session_id: String(session_id),
      sort_by: 'created_at.asc',
    },
  })
})
