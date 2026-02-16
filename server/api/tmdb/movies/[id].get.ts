/**
 * GET /api/tmdb/movies/:id
 * 영화 상세 정보
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/movie/${id}`)
})
