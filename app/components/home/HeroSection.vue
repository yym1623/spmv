<template>
  <section class="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center transition-all duration-1000"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />

    <!-- Search Box -->
    <div class="relative z-10 w-full max-w-2xl mx-auto px-6">
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-6">
        지금 바로 검색하세요
      </h1>

      <!-- 클릭하면 검색 팝업 열림 -->
      <button
        class="w-full h-14 flex items-center gap-3 pl-5 pr-6 rounded-2xl
               bg-white/10 backdrop-blur-md border border-white/20
               hover:border-accent/40 hover:bg-white/15
               transition-all duration-300 cursor-text text-left"
        @click="searchOpen = true"
      >
        <Icon name="mdi:movie-search" class="w-5 h-5 text-white/40 shrink-0" />
        <span class="text-lg text-white/40">영화 및 TV프로그램을 검색하세요</span>
      </button>
    </div>

    <!-- Search Modal -->
    <CommonSearchModal v-model:open="searchOpen" />
  </section>
</template>

<script setup lang="ts">
interface Props {
  bgImage?: string
}

withDefaults(defineProps<Props>(), {
  bgImage: 'https://www.justwatch.com/appassets/img/home/bg-tiles/bg-tiles.webp',
})

const searchOpen = ref(false)
</script>
