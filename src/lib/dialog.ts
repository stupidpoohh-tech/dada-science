import { useSyncExternalStore } from 'react'

/** 화면 안 확인 창(브라우저 confirm()을 쓰지 않음) */
export interface DialogReq { title: string; message?: string; confirmLabel?: string; cancelLabel?: string | null; danger?: boolean; resolve: (ok: boolean) => void }
let current: DialogReq | null = null
const ls = new Set<() => void>()
const emit = () => ls.forEach((l) => l())

export function askConfirm(o: Omit<DialogReq, 'resolve'>): Promise<boolean> {
  return new Promise((resolve) => { current = { cancelLabel: '취소', ...o, resolve }; emit() })
}
export function notify(title: string, message?: string) {
  return askConfirm({ title, message, confirmLabel: '확인', cancelLabel: null })
}
export function closeDialog(ok: boolean) { const c = current; current = null; emit(); c?.resolve(ok) }
export const useDialog = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l) }, () => current)
