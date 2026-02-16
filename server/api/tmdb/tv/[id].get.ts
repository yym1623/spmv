/**
 * GET /api/tmdb/tv/:id
 * TV 프로그램 상세 정보
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/tv/${id}`)
})
