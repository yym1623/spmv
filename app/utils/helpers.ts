import { TMDB_IMG_SIZES } from './constants'

export function tmdbImageUrl(
  path: string | null | undefined,
  type: 'poster' | 'backdrop' | 'profile' = 'poster',
  size: 'sm' | 'md' | 'lg' | 'xl' | 'original' = 'md'
): string {
  if (!path) return ''

  const config = useRuntimeConfig()
  const imgBase = config.public.tmdbImgUrl
  const sizeMap = TMDB_IMG_SIZES[type]
  const sizeValue = (sizeMap as Record<string, string>)[size] || 'original'

  return `${imgBase}/${sizeValue}${path}`
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '미정'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return '미정'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`
}

