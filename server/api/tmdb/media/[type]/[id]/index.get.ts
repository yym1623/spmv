/**
 * GET /api/tmdb/media/:type/:id
 * 미디어(영화/TV) 상세 정보 통합 엔드포인트
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type') // 'movie' | 'tv'
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/${type}/${id}`)
})
