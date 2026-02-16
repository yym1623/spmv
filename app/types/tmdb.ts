/**
 * TMDB API 관련 공통 타입
 * composables/useTmdb, 컴포넌트(영화/미디어 카드·섹션·상세 등)에서 사용
 */

export interface TmdbResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

/** 영화/TV 목록·카드·상세 등 공통으로 쓰는 미디어 아이템 (게스트 목록과 호환되도록 poster_path 등 optional) */
export interface MovieItem {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  backdrop_path?: string | null
  overview?: string
  release_date?: string
  first_air_date?: string
  vote_average?: number
  media_type?: string
  genre_ids?: number[]
  genres?: Genre[]
  tagline?: string
  runtime?: number
  popularity?: number
  rating?: number
}

export interface CastMember {
  id: number
  name: string
  character?: string
  profile_path: string | null
}

export interface Review {
  id: string
  author: string
  content: string
  created_at: string
}

export interface VideoResult {
  key: string
  name: string
  site: string
  type: string
}

export interface ExternalIds {
  instagram_id: string | null
  facebook_id: string | null
  twitter_id: string | null
}
