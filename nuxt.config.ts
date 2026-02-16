export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
  ],

  app: {
    head: {
      title: 'SPMV',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      htmlAttrs: { lang: 'ko' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SPMV' },
        { property: 'og:title', content: 'SPMV' },
        { property: 'og:description', content: '영화 및 TV프로그램 정보 제공' },
        { property: 'og:image', content: 'https://www.justwatch.com/appassets/img/home/bg-tiles/bg-tiles.webp' },
        { property: 'og:url', content: 'https://spmv.netlify.app' },
      ],
    },
  },

  runtimeConfig: {
    // 서버 전용 - 프론트에 절대 노출 안됨
    tmdbApiKey: '',
    tmdbBaseUrl: '',

    // 클라이언트 공개 - 이미지 URL만 (키 없음)
    public: {
      tmdbImgUrl: '',
    },
  },

  css: [
    '~/assets/css/global.css',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },
})
