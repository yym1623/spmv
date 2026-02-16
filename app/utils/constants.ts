export const TMDB_IMG_SIZES = {
  poster: {
    sm: 'w185',
    md: 'w342',
    lg: 'w500',
    xl: 'w780',
    original: 'original',
  },
  backdrop: {
    sm: 'w300',
    md: 'w780',
    lg: 'w1280',
    original: 'original',
  },
  profile: {
    sm: 'w45',
    md: 'w185',
    lg: 'h632',
    original: 'original',
  },
} as const

export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
} as const

export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES]
