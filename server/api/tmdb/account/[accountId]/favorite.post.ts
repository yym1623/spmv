/**
 * POST /api/tmdb/account/:accountId/favorite
 * 즐겨찾기 추가/제거
 * body: { session_id, media_type, media_id, favorite }
 */
export default defineEventHandler(async (event) => {
  const accountId = getRouterParam(event, 'accountId')
  const body = await readBody(event)

  return tmdbFetch(`/account/${accountId}/favorite`, {
    method: 'POST',
    params: { session_id: body.session_id },
    body: {
      media_type: body.media_type,
      media_id: body.media_id,
      favorite: body.favorite,
    },
  })
})
