<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:open', false)" />

        <!-- Modal -->
        <div class="relative w-full max-w-md glass-dark rounded-2xl p-6 md:p-8 animate-fade-in-up z-10">
          <!-- Close -->
          <button
            class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
                   hover:bg-white/10 transition-colors"
            @click="$emit('update:open', false)"
          >
            <Icon name="material-symbols:close-rounded" class="w-5 h-5 text-white/60" />
          </button>

          <!-- Title -->
          <h2 class="text-2xl font-bold text-white mb-6">로그인</h2>

          <!-- Guest Login -->
          <button
            class="w-full py-3 rounded-xl bg-white/10 text-white font-medium
                   hover:bg-white/15 transition-colors mb-4"
            @click="handleGuestLogin"
          >
            게스트로 로그인
          </button>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-3 bg-surface text-white/40">또는</span>
            </div>
          </div>

          <!-- Form -->
          <div v-if="showForm" class="space-y-4 animate-fade-in">
            <div>
              <input
                v-model="id"
                type="text"
                placeholder="아이디 (TMDB)"
                class="w-full h-12 px-4 rounded-xl bg-white/10 text-white placeholder-white/30
                       outline-none border border-white/10 focus:border-accent/50 transition-colors"
              />
              <p v-if="errors.id" class="mt-1 text-sm text-red-400">아이디를 입력해주세요</p>
            </div>
            <div>
              <input
                v-model="pw"
                type="password"
                placeholder="비밀번호"
                class="w-full h-12 px-4 rounded-xl bg-white/10 text-white placeholder-white/30
                       outline-none border border-white/10 focus:border-accent/50 transition-colors"
                @keyup.enter="handleLogin"
              />
              <p v-if="errors.pw" class="mt-1 text-sm text-red-400">비밀번호를 입력해주세요</p>
            </div>
            <button
              class="w-full py-3 rounded-xl bg-accent text-white font-medium
                     hover:bg-accent-light transition-colors"
              @click="handleLogin"
            >
              로그인
            </button>
          </div>

          <button
            v-else
            class="w-full py-3 rounded-xl border border-white/20 text-white/80 font-medium
                   hover:bg-white/10 transition-colors"
            @click="showForm = true"
          >
            TMDB 계정으로 로그인
          </button>

          <!-- Sign Up -->
          <div class="mt-4 text-center">
            <button class="text-sm text-accent hover:text-accent-light transition-colors" @click="handleSignUp">
              TMDB 회원가입
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const authStore = useAuthStore()

const id = ref('yym1623')
const pw = ref('xldjf0312')
const showForm = ref(false)
const errors = reactive({ id: false, pw: false })

async function handleGuestLogin() {
  const success = await authStore.loginAsGuest()
  if (success) emit('update:open', false)
}

async function handleLogin() {
  errors.id = !id.value.trim()
  errors.pw = !pw.value.trim()
  if (errors.id || errors.pw) return

  const success = await authStore.login(id.value, pw.value)
  if (success) emit('update:open', false)
}

function handleSignUp() {
  authStore.signUp()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
