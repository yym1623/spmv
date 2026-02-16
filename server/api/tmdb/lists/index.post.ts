/**
 * POST /api/tmdb/lists
 * 새 리스트 생성
 * body: { session_id, name }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return tmdbFetch('/list', {
    method: 'POST',
    params: { session_id: body.session_id },
    body: {
      name: body.name,
      description: '',
      language: 'ko',
    },
  })
})
