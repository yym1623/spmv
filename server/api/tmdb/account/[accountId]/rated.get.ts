/**
 * GET /api/tmdb/account/:accountId/rated?session_id=xxx&media_type=movies
 * 평점을 매긴 콘텐츠 목록
 */
export default defineEventHandler(async (event) => {
  const accountId = getRouterParam(event, 'accountId')
  const { session_id, media_type = 'movies' } = getQuery(event)

  return tmdbFetch(`/account/${accountId}/rated/${media_type}`, {
    params: {
      session_id: String(session_id),
      sort_by: 'created_at.asc',
    },
  })
})
