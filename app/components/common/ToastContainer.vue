<template>
  <Teleport to="body">
    <!-- ─── Toast Notifications ─────────────────────── -->
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto min-w-[280px] max-w-[380px] rounded-xl border shadow-2xl backdrop-blur-xl overflow-hidden"
          :class="toastStyles[toast.type].container"
        >
          <div class="flex items-start gap-3 px-4 py-3.5">
            <!-- Icon -->
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              :class="toastStyles[toast.type].iconBg"
            >
              <Icon :name="toastStyles[toast.type].icon" class="w-4.5 h-4.5" :class="toastStyles[toast.type].iconColor" />
            </div>

            <!-- Content -->
            <p class="text-sm font-medium text-white leading-relaxed pt-1">{{ toast.title }}</p>

            <!-- Close -->
            <button
              class="ml-auto shrink-0 w-6 h-6 rounded-md flex items-center justify-center
                     text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              @click="removeToast(toast.id)"
            >
              <Icon name="material-symbols:close-rounded" class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Progress bar -->
          <div class="h-0.5 w-full bg-white/5">
            <div
              class="h-full rounded-full toast-progress"
              :class="toastStyles[toast.type].progress"
              :style="{ animationDuration: toast.duration + 'ms' }"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- ─── Loading Overlay ─────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="loadingVisible"
        class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center gap-4 glass-dark rounded-2xl px-10 py-8 shadow-2xl">
          <div class="relative w-10 h-10">
            <div class="absolute inset-0 rounded-full border-2 border-white/10" />
            <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-light animate-spin" />
          </div>
          <p class="text-sm text-white/80 font-medium">{{ loadingTitle }}</p>
        </div>
      </div>
    </Transition>

    <!-- ─── Confirm Dialog ──────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="confirmVisible"
        class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="resolveConfirm(false)"
      >
        <Transition name="confirm" appear>
          <div
            v-if="confirmVisible"
            class="w-full max-w-sm rounded-2xl glass-dark border border-white/10 shadow-2xl overflow-hidden"
          >
            <!-- Icon -->
            <div class="flex justify-center pt-7 pb-2">
              <div class="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center ring-1 ring-amber-500/20">
                <Icon name="material-symbols:warning-rounded" class="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 pb-2 text-center">
              <h3 class="text-lg font-semibold text-white mb-1">{{ confirmOptions.title }}</h3>
              <p v-if="confirmOptions.text" class="text-sm text-white/50 leading-relaxed">{{ confirmOptions.text }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 px-6 pb-6 pt-4">
              <button
                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                       bg-white/5 border border-white/10 text-white/70
                       hover:bg-white/10 hover:text-white transition-all duration-200
                       active:scale-[0.97]"
                @click="resolveConfirm(false)"
              >
                {{ confirmOptions.cancelText || '취소' }}
              </button>
              <button
                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                       bg-accent text-white
                       hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20 transition-all duration-200
                       active:scale-[0.97]"
                @click="resolveConfirm(true)"
              >
                {{ confirmOptions.confirmText || '확인' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const {
  toasts,
  loadingVisible,
  loadingTitle,
  confirmVisible,
  confirmOptions,
  removeToast,
  resolveConfirm,
} = useToast()

// 토스트 타입별 스타일 맵
const toastStyles = {
  success: {
    container: 'bg-emerald-950/80 border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    icon: 'material-symbols:check-circle-rounded',
    iconColor: 'text-emerald-400',
    progress: 'bg-emerald-400',
  },
  error: {
    container: 'bg-red-950/80 border-red-500/20',
    iconBg: 'bg-red-500/15',
    icon: 'material-symbols:error-rounded',
    iconColor: 'text-red-400',
    progress: 'bg-red-400',
  },
  warning: {
    container: 'bg-amber-950/80 border-amber-500/20',
    iconBg: 'bg-amber-500/15',
    icon: 'material-symbols:warning-rounded',
    iconColor: 'text-amber-400',
    progress: 'bg-amber-400',
  },
  info: {
    container: 'bg-sky-950/80 border-sky-500/20',
    iconBg: 'bg-sky-500/15',
    icon: 'material-symbols:info-rounded',
    iconColor: 'text-sky-400',
    progress: 'bg-sky-400',
  },
}
</script>

<style scoped>
/* Toast progress bar animation */
.toast-progress {
  animation: shrink linear forwards;
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

/* Toast enter/leave */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.06, 0.71, 0.55, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s ease;
}

/* Fade overlay */
.fade-enter-active {
  transition: opacity 0.2s ease;
}
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Confirm dialog scale */
.confirm-enter-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.confirm-leave-active {
  transition: all 0.2s ease;
}
.confirm-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.confirm-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
