export type ToastKind = 'success' | 'error' | 'info';

export const TOAST_EVENT = 'roamify:toast';

export const toast = {
  success: (message: string) => showToast('success', message),
  error: (message: string) => showToast('error', message),
  info: (message: string) => showToast('info', message),
};

function showToast(kind: ToastKind, message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { kind, message } }));
  }
}
