/**
 * GET /api/tmdb/tv/popular?page=1
 * 인기 TV 프로그램 목록
 */
export default defineEventHandler(async (event) => {
  const { page = '1' } = getQuery(event)

  return tmdbFetch('/tv/popular', {
    params: { page: Number(page) },
  })
})
