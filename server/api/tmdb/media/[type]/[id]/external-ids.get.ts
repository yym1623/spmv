/**
 * GET /api/tmdb/media/:type/:id/external-ids
 * 외부 SNS 아이디 (Instagram, Facebook, Twitter)
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id')

  return tmdbFetch(`/${type}/${id}/external_ids`)
})
