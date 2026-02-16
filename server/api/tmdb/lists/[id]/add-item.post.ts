/**
 * POST /api/tmdb/lists/:id/add-item
 * 리스트에 아이템 추가
 * body: { session_id, media_id }
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return tmdbFetch(`/list/${id}/add_item`, {
    method: 'POST',
    params: { session_id: body.session_id },
    body: { media_id: body.media_id },
  })
})
