/**
 * POST /api/tmdb/lists/:id/remove-item
 * 리스트에서 아이템 제거
 * body: { session_id, media_id }
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return tmdbFetch(`/list/${id}/remove_item`, {
    method: 'POST',
    params: { session_id: body.session_id },
    body: { media_id: body.media_id },
  })
})
