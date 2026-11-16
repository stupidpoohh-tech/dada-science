import { useSyncExternalStore } from 'react'

/**
 * 학습 기록(localStorage). 필기는 IndexedDB(annotationDB.ts)에 따로 저장합니다.
 * 형식을 바꿀 때는 VERSION을 올리고 migrate()에 변환을 추가하세요.
 */
const KEY = 'moving-earth-science:progress'
const VERSION = 3

export interface PopupRecord { done: boolean; attempts: number; correctAttempts: number; firstTry?: boolean; doneAt?: number }
export interface AnswerRecord { answer: unknown; correct: boolean | null; at: number }
export interface ExamRecord {
  draft: Record<string, unknown>
  submittedAt?: number
  /** 제출 시 채점 결과(문항 ID → 정오, 서술형은 null) */
  graded?: Record<string, boolean | null>
  score?: number
  maxScore?: number
  /** 서술형 자기 점검(채점 요소 체크) */
  selfCheck?: Record<string, boolean[]>
  history?: { at: number; score: number; maxScore: number }[]
}
export interface WrongRecord {
  questionId: string
  unitId: string
  set: string
  lastAnswer: unknown
  wrongCount: number
  lastAt: number
  retries: { at: number; correct: boolean }[]
  resolved: boolean
}
/** 문제은행 풀이 상태(단원·세트별) */
export interface BankSetState {
  answers: Record<string, unknown>
  /** 정답·해설이 공개된 문항(정답 확인 또는 채점 후) */
  revealed: Record<string, boolean>
  submittedAt?: number
  /** 교사 확인으로 정답 인정 */
  overrides: Record<string, boolean>
  /** 서술형·설명형 채점(채점 기준 체크, 맞음/틀림, 확정 여부) */
  manual: Record<string, { rubric?: boolean[]; correct?: boolean; confirmed?: boolean }>
  /** 오답만 다시 풀기 중인 문항 */
  retry?: string[]
  history: { at: number; score: number; max: number; correct: number; wrong: number; unanswered: number; pending: number }[]
}
export const emptyBankSet = (): BankSetState => ({ answers: {}, revealed: {}, overrides: {}, manual: {}, history: [] })

export interface ProgressState {
  version: number
  popups: Record<string, PopupRecord>
  chapters: Record<string, { manualDone: boolean }>
  practice: Record<string, AnswerRecord>
  exams: Record<string, ExamRecord>
  wrong: Record<string, WrongRecord>
  bank: Record<string, BankSetState>
}

const empty = (): ProgressState => ({ version: VERSION, popups: {}, chapters: {}, practice: {}, exams: {}, wrong: {}, bank: {} })

/** 1차 버전(개념 번호 배열) → 팝업 ID 기록 */
const V1_IDS = ['pressure', 'pgf', 'geostrophic', 'ekman', 'upwelling', 'waves', 'shoaling', 'tsunami', 'tides', 'tide-day']
function migrate(): ProgressState {
  const s = empty()
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p && p.version === VERSION) return { ...s, ...p }
      // v2 → v3: 문제은행 추가. 데모 문항 기록은 문항이 없어져 표시되지 않음
      if (p && p.version === 2) return { ...s, ...p, version: VERSION, bank: {} }
    }
    const old = localStorage.getItem('moving-earth-science:ocean:v1')
    if (old) {
      const ids: number[] = JSON.parse(old)
      for (const n of ids) { const id = V1_IDS[n - 1]; if (id) s.popups[id] = { done: true, attempts: 1, correctAttempts: 1, firstTry: true } }
    }
  } catch { /* 저장소를 쓸 수 없으면 빈 기록으로 시작 */ }
  return s
}

let state: ProgressState = migrate()
const listeners = new Set<() => void>()

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* 저장 실패 시 세션 동안만 유지 */ }
}
export function updateProgress(fn: (s: ProgressState) => void) {
  const next: ProgressState = structuredClone(state)
  fn(next)
  state = next
  save()
  listeners.forEach((l) => l())
}
export function useProgress(): ProgressState {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)
}
export const getProgress = () => state
export function resetProgress() { updateProgress((s) => Object.assign(s, empty())) }

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { state = migrate(); listeners.forEach((l) => l()) }
  })
}

// ───── 기록 함수 ─────
export function recordPopupAnswer(popupId: string, correct: boolean) {
  updateProgress((s) => {
    const r = s.popups[popupId] ?? { done: false, attempts: 0, correctAttempts: 0 }
    if (r.attempts === 0) r.firstTry = correct
    r.attempts++
    if (correct) { r.correctAttempts++; if (!r.done) { r.done = true; r.doneAt = Date.now() } }
    s.popups[popupId] = r
  })
}

export function recordWrong(questionId: string, unitId: string, set: string, answer: unknown) {
  updateProgress((s) => {
    const w = s.wrong[questionId] ?? { questionId, unitId, set, lastAnswer: answer, wrongCount: 0, lastAt: 0, retries: [], resolved: false }
    w.wrongCount++
    w.lastAnswer = answer
    w.lastAt = Date.now()
    w.resolved = false
    s.wrong[questionId] = w
  })
}

export function recordRetry(questionId: string, answer: unknown, correct: boolean) {
  updateProgress((s) => {
    const w = s.wrong[questionId]
    if (!w) return
    w.retries.push({ at: Date.now(), correct })
    w.lastAt = Date.now()
    w.lastAnswer = answer
    if (correct) w.resolved = true
    else w.wrongCount++
  })
}
