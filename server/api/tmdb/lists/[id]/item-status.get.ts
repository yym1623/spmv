/**
 * GET /api/tmdb/lists/:id/item-status?movie_id=123
 * 리스트에 아이템이 존재하는지 확인
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { movie_id } = getQuery(event)

  return tmdbFetch(`/list/${id}/item_status`, {
    params: { movie_id: Number(movie_id) },
  })
})
