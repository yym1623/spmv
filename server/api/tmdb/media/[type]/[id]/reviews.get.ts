/**
 * GET /api/tmdb/media/:type/:id/reviews
 * 리뷰 목록 (영문)
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/${type}/${id}/reviews`, {
    params: { language: 'en-US' },
  })
})
