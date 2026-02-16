/**
 * Toast / Confirm 관련 타입
 * composables/useToast, ToastContainer 등에서 사용
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  type: ToastType
  title: string
  duration: number
}

export interface ConfirmOptions {
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
}
