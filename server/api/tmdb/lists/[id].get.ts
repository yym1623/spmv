/**
 * GET /api/tmdb/lists/:id
 * 리스트 상세 조회
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/list/${id}`)
})
