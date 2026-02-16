/**
 * 커스텀 Toast / Confirm / Loading 시스템
 * 타입: ~/types/toast
 */
import type { ToastType, ToastItem, ConfirmOptions } from '~/types/toast'

export type { ToastType, ToastItem, ConfirmOptions }

// ─── Global Reactive State ───────────────────────────
// 전역 상태 (모든 컴포넌트에서 공유)
const toasts = ref<ToastItem[]>([])
const loadingVisible = ref(false)
const loadingTitle = ref('처리 중...')

const confirmVisible = ref(false)
const confirmOptions = ref<ConfirmOptions>({ title: '' })
let confirmResolve: ((value: boolean) => void) | null = null

let toastId = 0

// ─── Composable ──────────────────────────────────────
export function useToast() {
  function addToast(type: ToastType, title: string, duration = 2500) {
    const id = ++toastId
    toasts.value.push({ id, type, title, duration })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function success(title: string) {
    addToast('success', title)
  }

  function error(title: string) {
    addToast('error', title)
  }

  function warning(title: string) {
    addToast('warning', title)
  }

  function info(title: string) {
    addToast('info', title)
  }

  function loading(title: string = '처리 중...') {
    loadingTitle.value = title
    loadingVisible.value = true
  }

  function closeLoading() {
    loadingVisible.value = false
  }

  async function confirm(title: string, text?: string): Promise<boolean> {
    return new Promise((resolve) => {
      confirmOptions.value = {
        title,
        text,
        confirmText: '확인',
        cancelText: '취소',
      }
      confirmResolve = resolve
      confirmVisible.value = true
    })
  }

  function resolveConfirm(value: boolean) {
    confirmVisible.value = false
    if (confirmResolve) {
      confirmResolve(value)
      confirmResolve = null
    }
  }

  return {
    // state (읽기용 — ToastContainer에서 사용)
    toasts: readonly(toasts),
    loadingVisible: readonly(loadingVisible),
    loadingTitle: readonly(loadingTitle),
    confirmVisible: readonly(confirmVisible),
    confirmOptions: readonly(confirmOptions),

    // actions
    success,
    error,
    warning,
    info,
    loading,
    closeLoading,
    confirm,
    removeToast,
    resolveConfirm,
  }
}
