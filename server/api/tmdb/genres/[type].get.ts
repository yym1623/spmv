/**
 * GET /api/tmdb/genres/:type
 * 장르 목록 (영화/TV)
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type') // 'movie' | 'tv'

  return tmdbFetch(`/genre/${type}/list`)
})
