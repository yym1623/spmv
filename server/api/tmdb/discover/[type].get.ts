/**
 * GET /api/tmdb/discover/:type?sort_by=popularity.desc&with_genres=28&page=1
 * 장르별 콘텐츠 탐색 (영화/TV)
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type') // 'movie' | 'tv'
  const query = getQuery(event)

  const params: Record<string, string | number> = {}
  if (query.sort_by) params.sort_by = String(query.sort_by)
  if (query.with_genres) params.with_genres = String(query.with_genres)
  if (query.page) params.page = Number(query.page)

  return tmdbFetch(`/discover/${type}`, { params })
})
