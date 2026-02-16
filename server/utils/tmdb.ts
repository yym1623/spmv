/**
 * 서버 전용 TMDB API 유틸리티
 *
 * API 키가 여기서만 사용되므로 클라이언트에 절대 노출되지 않음.
 * 모든 server/api/ 핸들러가 이 유틸을 통해 TMDB와 통신한다.
 */

interface TmdbFetchOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  params?: Record<string, string | number | undefined>
  body?: Record<string, unknown>
}

/**
 * TMDB API에 서버 사이드 요청을 보낸다.
 * API 키를 서버 runtimeConfig에서 가져와 자동으로 주입한다.
 */
export async function tmdbFetch<T = unknown>(
  path: string,
  options: TmdbFetchOptions = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const baseUrl = config.tmdbBaseUrl || 'https://api.themoviedb.org/3'
  const apiKey = config.tmdbApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key is not configured',
    })
  }

  // URL 조립 - api_key와 language는 항상 주입
  const url = new URL(`${baseUrl}${path}`)
  url.searchParams.set('api_key', apiKey)

  // language 기본값은 ko, 파라미터로 덮어쓸 수 있음
  if (!options.params?.language) {
    url.searchParams.set('language', 'ko')
  }

  // 추가 쿼리 파라미터 주입
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const fetchOptions: RequestInit & { body?: string } = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (options.body && (options.method === 'POST' || options.method === 'DELETE')) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  const response = await $fetch<T>(url.toString(), {
    method: fetchOptions.method as any,
    headers: fetchOptions.headers as Record<string, string>,
    body: options.body,
  })

  return response
}
