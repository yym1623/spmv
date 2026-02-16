/**
 * GET /api/tmdb/account/:accountId/watchlist?session_id=xxx&media_type=movies
 * 관심목록 조회
 */
export default defineEventHandler(async (event) => {
  const accountId = getRouterParam(event, 'accountId')
  const { session_id, media_type = 'movies' } = getQuery(event)

  return tmdbFetch(`/account/${accountId}/watchlist/${media_type}`, {
    params: {
      session_id: String(session_id),
      sort_by: 'created_at.asc',
    },
  })
})
