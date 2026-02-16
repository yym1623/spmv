/**
 * GET /api/tmdb/media/:type/:id/recommendations
 * 관련 추천 콘텐츠
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/${type}/${id}/recommendations`)
})
