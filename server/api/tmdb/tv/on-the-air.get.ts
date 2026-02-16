/**
 * GET /api/tmdb/tv/on-the-air?page=1
 * 현재 방영중인 TV 프로그램 목록
 */
export default defineEventHandler(async (event) => {
  const { page = '1' } = getQuery(event)

  return tmdbFetch('/tv/on_the_air', {
    params: { page: Number(page) },
  })
})
