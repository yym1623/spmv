/**
 * GET /api/tmdb/media/:type/:id/credits
 * 출연진 정보 (movie: credits, tv: aggregate_credits)
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id')

  const endpoint = type === 'movie'
    ? `/movie/${id}/credits`
    : `/tv/${id}/aggregate_credits`

  return tmdbFetch(endpoint)
})
