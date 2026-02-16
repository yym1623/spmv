/**
 * GET /api/tmdb/movies/upcoming?page=1
 * 개봉예정 영화 목록
 */
export default defineEventHandler(async (event) => {
  const { page = '1' } = getQuery(event)

  return tmdbFetch('/movie/upcoming', {
    params: { page: Number(page) },
  })
})
