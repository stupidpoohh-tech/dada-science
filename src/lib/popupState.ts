import { useSyncExternalStore } from 'react'

/** 열려 있는 개념 팝업 */
export interface OpenPopup { id: string; step?: number; mode?: string; returnFocus?: HTMLElement | null; scrollY: number }
let state: OpenPopup | null = null
const ls = new Set<() => void>()
export function openPopup(id: string, step?: number, mode?: string) {
  state = { id, step, mode, returnFocus: document.activeElement as HTMLElement | null, scrollY: window.scrollY }
  ls.forEach((l) => l())
}
export function closePopup() {
  const s = state
  state = null
  ls.forEach((l) => l())
  if (s) requestAnimationFrame(() => { window.scrollTo({ top: s.scrollY }); s.returnFocus?.focus?.({ preventScroll: true }) })
}
export const usePopupState = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l) }, () => state)
