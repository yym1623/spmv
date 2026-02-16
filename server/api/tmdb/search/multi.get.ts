/**
 * GET /api/tmdb/search/multi?query=검색어&page=1
 * 통합 검색 (영화 + TV)
 */
export default defineEventHandler(async (event) => {
  const { query, page = '1' } = getQuery(event)

  if (!query) {
    throw createError({ statusCode: 400, statusMessage: 'query parameter is required' })
  }

  return tmdbFetch('/search/multi', {
    params: { query: String(query), page: Number(page) },
  })
})
