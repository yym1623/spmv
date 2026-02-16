/**
 * Swiper 인스턴스 최소 타입 (동적 import 사용 시 타입 안전용)
 * MovieSwiper, TrailerSection 등에서 사용
 */
export interface SwiperInstance {
  translate: number
  size: number
  virtualSize: number
  wrapperEl?: { parentElement?: HTMLElement | null }
  params: { slidesPerView?: number }
  activeIndex?: number
  slides: { length: number }
  slideTo: (index: number) => void
  destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void
}
