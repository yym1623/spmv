/**
 * GET /api/tmdb/movies/now-playing?page=1
 * 현재 상영중인 영화 목록 (최신순)
 */
export default defineEventHandler(async (event) => {
  const { page = '1' } = getQuery(event)

  return tmdbFetch('/movie/now_playing', {
    params: { page: Number(page) },
  })
})
