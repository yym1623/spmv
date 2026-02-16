/**
 * GET /api/tmdb/trending/movies
 * 실시간 인기 급상승 영화
 */
export default defineEventHandler(async () => {
  return tmdbFetch('/trending/movie/day')
})
