/**
 * POST /api/tmdb/media/:type/:id/rating
 * 평점 등록
 * body: { value, session_id?, guest_session_id? }
 */
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const params: Record<string, string | number> = {}
  if (body.session_id) params.session_id = body.session_id
  if (body.guest_session_id) params.guest_session_id = body.guest_session_id

  return tmdbFetch(`/${type}/${id}/rating`, {
    method: 'POST',
    params,
    body: { value: body.value },
  })
})
