import { useSyncExternalStore } from 'react'

/** 학습지 보기 모드: 교재(원문) · 빈칸(핵심어 가림) · 핵심 */
export type SheetMode = 'text' | 'blank' | 'key'
const KEY = 'moving-earth-science:sheet-mode'
let mode: SheetMode = 'text'
try { const v = localStorage.getItem(KEY); if (v === 'blank' || v === 'key' || v === 'text') mode = v } catch { /* 기본값 */ }
const ls = new Set<() => void>()
export function setSheetMode(m: SheetMode) {
  mode = m
  try { localStorage.setItem(KEY, m) } catch { /* 무시 */ }
  ls.forEach((l) => l())
}
export const useSheetMode = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l) }, () => mode)
