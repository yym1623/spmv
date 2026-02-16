/**
 * GET /api/tmdb/movies/popular?page=1
 * 인기 영화 목록
 */
export default defineEventHandler(async (event) => {
  const { page = '1' } = getQuery(event)

  return tmdbFetch('/movie/popular', {
    params: { page: Number(page) },
  })
})
