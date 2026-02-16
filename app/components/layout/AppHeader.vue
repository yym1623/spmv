<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass-dark">
    <nav class="max-w-screen-2xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
      <!-- Left: Logo + Nav (수직 중앙) -->
      <div class="flex items-center gap-6 md:gap-8">
        <!-- Logo -->
        <NuxtLink to="/" class="group shrink-0 flex items-center">
          <span class="logo-text font-display text-xl md:text-2xl font-bold tracking-widest">
            <span class="text-white">SP</span><span class="text-accent-light">MV</span>
          </span>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink to="/new" class="text-sm text-white/60 hover:text-white transition-colors duration-200">신규</NuxtLink>
          <NuxtLink to="/popular" class="text-sm text-white/60 hover:text-white transition-colors duration-200">인기</NuxtLink>
        </div>
      </div>

      <!-- Right: 타이틀(로고) 높이만큼 맞춤 -->
      <div class="hidden md:flex items-center justify-end gap-3 shrink-0">

        <template v-if="authStore.isLoggedIn">
          <div class="relative" ref="userMenuRef">
            <button
              class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-accent/30 flex items-center justify-center
                     hover:bg-accent/50 transition-colors"
              @click="userMenuOpen = !userMenuOpen"
            >
              <Icon name="material-symbols:person-rounded" class="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 top-12 w-56 rounded-xl glass-dark shadow-2xl overflow-hidden animate-slide-down"
              >
                <NuxtLink
                  to="/favorite"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <Icon name="material-symbols:favorite-rounded" class="w-5 h-5 text-red-400" />
                  <span class="text-sm">즐겨찾기</span>
                </NuxtLink>
                <NuxtLink
                  to="/rating"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <Icon name="material-symbols:bookmark-rounded" class="w-5 h-5 text-green-400" />
                  <span class="text-sm">관심목록</span>
                </NuxtLink>

                <div class="border-t border-white/10">
                  <button
                    class="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-red-400"
                    @click="handleLogout"
                  >
                    <Icon name="material-symbols:logout-rounded" class="w-5 h-5" />
                    <span class="text-sm">로그아웃</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <button
            class="login-btn font-display text-sm font-semibold tracking-[0.2em] px-4 py-1.5 rounded-lg
                   border border-accent-light/50 text-accent-light hover:bg-accent/25 hover:border-accent-light
                   transition-colors duration-200 flex items-center justify-center h-8 md:h-9"
            @click="loginModalOpen = true"
          >
            로그인
          </button>
        </template>
      </div>

      <!-- Mobile: Search + Hamburger -->
      <div class="flex md:hidden items-center gap-1 shrink-0">
        <button
          class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Icon name="material-symbols:menu-rounded" class="w-5 h-5 text-white" />
        </button>
      </div>
    </nav>

    <!-- ─── Mobile Fullscreen Menu ─────────────────────── -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-[90] md:hidden flex flex-col bg-primary/98 backdrop-blur-2xl"
        >
          <!-- Top bar -->
          <div class="shrink-0 flex items-center justify-end px-4 h-14 border-b border-white/5">
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              @click="mobileMenuOpen = false"
            >
              <Icon name="material-symbols:close-rounded" class="w-5 h-5 text-white" />
            </button>
          </div>

          <!-- Menu content -->
          <div class="flex-1 overflow-y-auto px-6 py-8">
            <!-- Nav -->
            <nav class="space-y-1 mb-8">
              <NuxtLink
                to="/new"
                class="mobile-menu-item"
                @click="mobileMenuOpen = false"
              >
                <Icon name="material-symbols:fiber-new-rounded" class="w-6 h-6 text-accent-light" />
                <span>신규</span>
              </NuxtLink>
              <NuxtLink
                to="/popular"
                class="mobile-menu-item"
                @click="mobileMenuOpen = false"
              >
                <Icon name="material-symbols:local-fire-department-rounded" class="w-6 h-6 text-orange-400" />
                <span>인기</span>
              </NuxtLink>
            </nav>

            <!-- User section -->
            <template v-if="authStore.isLoggedIn">
              <p class="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-3 px-1">내 라이브러리</p>
              <nav class="space-y-1 mb-8">
                <NuxtLink
                  to="/favorite"
                  class="mobile-menu-item"
                  @click="mobileMenuOpen = false"
                >
                  <Icon name="material-symbols:favorite-rounded" class="w-6 h-6 text-red-400" />
                  <span>즐겨찾기</span>
                </NuxtLink>
                <NuxtLink
                  to="/rating"
                  class="mobile-menu-item"
                  @click="mobileMenuOpen = false"
                >
                  <Icon name="material-symbols:bookmark-rounded" class="w-6 h-6 text-green-400" />
                  <span>관심목록</span>
                </NuxtLink>
              </nav>
            </template>
          </div>

          <!-- Bottom -->
          <div class="shrink-0 border-t border-white/5 px-6 py-5">
            <template v-if="authStore.isLoggedIn">
              <button
                class="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       border border-white/10 text-red-400 hover:bg-white/5 transition-colors"
                @click="handleLogout"
              >
                <Icon name="material-symbols:logout-rounded" class="w-5 h-5" />
                <span class="text-sm font-medium">로그아웃</span>
              </button>
            </template>
            <template v-else>
              <button
                class="w-full py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-medium transition-colors"
                @click="loginModalOpen = true; mobileMenuOpen = false"
              >
                로그인
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Login Modal -->
    <LayoutLoginModal v-model:open="loginModalOpen" />

    <!-- Search Modal -->
    <CommonSearchModal v-model:open="searchModalOpen" />
  </header>
</template>

<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()

const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const mobileMenuOpen = ref(false)
const loginModalOpen = ref(false)
const searchModalOpen = ref(false)

// 모바일 메뉴 열릴 때 body 스크롤 잠금
watch(mobileMenuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

async function handleLogout() {
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  const success = await authStore.logout()
  if (success) {
    router.push('/')
  }
}

// Close user menu on outside click
function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.logo-text {
  text-shadow: 0 0 20px rgba(107, 159, 196, 0.15);
  letter-spacing: 0.15em;
}

.group:hover .logo-text {
  text-shadow: 0 0 24px rgba(107, 159, 196, 0.3);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile fullscreen menu */
.mobile-menu-item {
  @apply flex items-center gap-4 px-4 py-4 rounded-xl text-white/80 text-[17px]
         hover:bg-white/5 active:bg-white/10 transition-colors;
}

.mobile-menu-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
