<template>
  <footer class="border-t border-white/5 bg-surface-dark">
    <div class="max-w-screen-2xl mx-auto px-6 py-8">
      <div class="flex flex-col items-center text-center gap-3">
        <span class="logo-text font-display text-2xl font-bold tracking-widest">
          <span class="text-white">SP</span><span class="text-accent-light">MV</span>
        </span>
        <p class="text-sm text-white/35 max-w-md leading-relaxed">
          TMDB API 기반 영화 및 TV프로그램 정보 서비스
        </p>
        <p class="text-xs text-white/20 mt-3">
          &copy; {{ new Date().getFullYear() }} SPMV
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.logo-text {
  text-shadow: 0 0 20px rgba(107, 159, 196, 0.15);
  letter-spacing: 0.15em;
}
</style>
