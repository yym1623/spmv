/**
 * POST /api/tmdb/auth/validate-login
 * 아이디/비밀번호로 토큰 인증
 * body: { username, password, request_token }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return tmdbFetch('/authentication/token/validate_with_login', {
    method: 'POST',
    body: {
      username: body.username,
      password: body.password,
      request_token: body.request_token,
    },
  })
})
