import { useEffect, useSyncExternalStore } from 'react'
import { loadAll, loadScope, saveScope } from './annotationDB'

export type DrawTool = 'pen' | 'highlighter'
export type Tool = 'none' | DrawTool | 'laser' | 'eraser'

/** 한 획. 좌표는 연결된 블록의 왼쪽 위 기준(교재 판형의 논리 px). */
export interface Stroke {
  id: string
  blockId: string
  tool: DrawTool
  color: string
  size: number
  /** [x, y, 필압] 반복 */
  pts: number[]
  /** 그릴 때의 블록 크기(화면 크기가 달라지면 이 비율로 맞춤) */
  bw: number
  bh: number
  at: number
}

type Op = { kind: 'add'; strokes: Stroke[] } | { kind: 'remove'; strokes: Stroke[] }
interface ScopeState { strokes: Stroke[]; undo: Op[]; redo: Op[]; loaded: boolean; saving: boolean }

const scopes = new Map<string, ScopeState>()
const listeners = new Set<() => void>()
let version = 0
const emit = () => { version++; listeners.forEach((l) => l()) }
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l) }

function scope(id: string): ScopeState {
  let s = scopes.get(id)
  if (!s) {
    s = { strokes: [], undo: [], redo: [], loaded: false, saving: false }
    scopes.set(id, s)
    loadScope(id).then((strokes) => {
      const cur = scopes.get(id)!
      // 불러오는 사이에 그린 획이 있으면 합칩니다.
      const ids = new Set(cur.strokes.map((x) => x.id))
      cur.strokes = [...strokes.filter((x) => !ids.has(x.id)), ...cur.strokes]
      cur.loaded = true
      emit()
    })
  }
  return s
}

const timers = new Map<string, number>()
let lastSaved = 0
function persist(id: string) {
  const s = scope(id)
  s.saving = true
  clearTimeout(timers.get(id))
  timers.set(id, window.setTimeout(async () => {
    await saveScope(id, scope(id).strokes)
    s.saving = false
    lastSaved = Date.now()
    emit()
  }, 400))
  emit()
}

function apply(id: string, op: Op, inverse = false) {
  const s = scope(id)
  const add = (op.kind === 'add') !== inverse
  if (add) s.strokes = [...s.strokes, ...op.strokes]
  else { const rm = new Set(op.strokes.map((x) => x.id)); s.strokes = s.strokes.filter((x) => !rm.has(x.id)) }
}

export const annotations = {
  add(id: string, strokes: Stroke[]) {
    if (!strokes.length) return
    const op: Op = { kind: 'add', strokes }
    apply(id, op); const s = scope(id); s.undo.push(op); s.redo = []; persist(id)
  },
  remove(id: string, strokeIds: string[]) {
    const s = scope(id)
    const set = new Set(strokeIds)
    const strokes = s.strokes.filter((x) => set.has(x.id))
    if (!strokes.length) return
    const op: Op = { kind: 'remove', strokes }
    apply(id, op); s.undo.push(op); s.redo = []; persist(id)
  },
  undo(id: string) {
    const s = scope(id); const op = s.undo.pop(); if (!op) return
    apply(id, op, true); s.redo.push(op); persist(id)
  },
  redo(id: string) {
    const s = scope(id); const op = s.redo.pop(); if (!op) return
    apply(id, op); s.undo.push(op); persist(id)
  },
  get: (id: string) => scope(id),
  /** 가져오기: 같은 ID의 획은 건너뛰고 합칩니다. */
  async importAll(records: { scopeId: string; strokes: Stroke[] }[]) {
    let added = 0
    for (const r of records) {
      const existing = new Set((await loadScope(r.scopeId)).map((x) => x.id))
      const s = scope(r.scopeId)
      for (const x of s.strokes) existing.add(x.id)
      const fresh = r.strokes.filter((x) => !existing.has(x.id) && Array.isArray(x.pts))
      added += fresh.length
      s.strokes = [...(await loadScope(r.scopeId)).filter((x) => !s.strokes.some((y) => y.id === x.id)), ...s.strokes, ...fresh]
      await saveScope(r.scopeId, s.strokes)
    }
    emit()
    return added
  },
  exportAll: loadAll,
}

export function useScopeStrokes(id: string) {
  useSyncExternalStore(subscribe, () => version)
  const s = scope(id)
  return { strokes: s.strokes, loaded: s.loaded, canUndo: s.undo.length > 0, canRedo: s.redo.length > 0, saving: s.saving }
}
export function useAnnotationVersion() {
  return useSyncExternalStore(subscribe, () => version)
}
export const lastSavedAt = () => lastSaved

// ───── 도구 설정(localStorage) ─────
export const PEN_COLORS = [
  { value: '#1b2633', label: '검정' },
  { value: '#e8384f', label: '빨강' },
  { value: '#2870ff', label: '파랑' },
]
export const HL_COLORS = [
  { value: '#ffd60a', label: '노랑' },
  { value: '#ff7ab8', label: '분홍' },
  { value: '#5cc8ff', label: '하늘' },
]
export const PEN_SIZES = [2.5, 4, 7]
export const HL_SIZES = [14, 20, 28]

export interface ToolSettings {
  tool: Tool
  penColor: string
  penSize: number
  hlColor: string
  hlSize: number
  visible: boolean
  fingerDraw: boolean
  collapsed: boolean
  barY: number
  /** 현재 필기 대상(툴바의 실행 취소 등이 적용되는 범위) */
  activeScope: string
  activeRegion: { label: string; blockIds: () => string[] } | null
}
const SKEY = 'moving-earth-science:tools'
let settings: ToolSettings = {
  tool: 'none', penColor: PEN_COLORS[0].value, penSize: PEN_SIZES[1], hlColor: HL_COLORS[0].value, hlSize: HL_SIZES[1],
  visible: true, fingerDraw: false, collapsed: false, barY: 0.3, activeScope: '', activeRegion: null,
}
if (typeof window !== 'undefined' && window.innerWidth < 768) settings.collapsed = true
try {
  const raw = localStorage.getItem(SKEY)
  if (raw) {
    const saved = JSON.parse(raw)
    settings = { ...settings, ...saved, tool: saved.tool === 'laser' || saved.tool === 'eraser' ? 'none' : saved.tool ?? 'none', activeScope: '', activeRegion: null }
  }
} catch { /* 기본값 사용 */ }
const sl = new Set<() => void>()
export function setTools(patch: Partial<ToolSettings>) {
  settings = { ...settings, ...patch }
  try {
    const { activeRegion: _r, activeScope: _s, ...rest } = settings
    void _r; void _s
    localStorage.setItem(SKEY, JSON.stringify(rest))
  } catch { /* 무시 */ }
  sl.forEach((l) => l())
}
export const getTools = () => settings
export function useTools(): ToolSettings {
  return useSyncExternalStore((l) => { sl.add(l); return () => sl.delete(l) }, () => settings)
}

/** 표면이 보이는 동안 툴바의 대상 범위로 등록 */
export function useActiveScope(scopeId: string, enabled: boolean, region?: ToolSettings['activeRegion']) {
  useEffect(() => {
    if (!enabled) return
    const prev = getTools().activeScope
    const prevRegion = getTools().activeRegion
    setTools({ activeScope: scopeId, activeRegion: region ?? null })
    return () => { if (getTools().activeScope === scopeId) setTools({ activeScope: prev === scopeId ? '' : prev, activeRegion: prev === scopeId ? null : prevRegion }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeId, enabled])
}

export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
