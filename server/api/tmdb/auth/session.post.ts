/**
 * POST /api/tmdb/auth/session
 * 세션 생성
 * body: { request_token }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return tmdbFetch('/authentication/session/new', {
    method: 'POST',
    body: { request_token: body.request_token },
  })
})
