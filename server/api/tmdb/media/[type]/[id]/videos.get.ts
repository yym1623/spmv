/**
 * GET /api/tmdb/media/:type/:id/videos
 * 미디어 영상(예고편 등)
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/${type}/${id}/videos`)
})
