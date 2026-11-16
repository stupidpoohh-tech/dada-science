import type { BankQuestion } from '../content/bank/types'
import { answerKeyOf, TOPICS } from '../content/bank'
import { gradeItem, type BankAnswer } from './bankGrading'
import type { BankSetState } from './store'

export interface SetSummary {
  score: number; max: number; autoScore: number; autoMax: number; manualScore: number; manualMax: number
  correct: number; wrong: number; unanswered: number; pending: number; graded: number; total: number
  topics: { id: string; label: string; correct: number; graded: number; total: number }[]
}

/** 채점 요약(공개된 문항 기준) */
export function summarize(all: BankQuestion[], st: BankSetState): SetSummary {
  const s: SetSummary = { score: 0, max: 0, autoScore: 0, autoMax: 0, manualScore: 0, manualMax: 0, correct: 0, wrong: 0, unanswered: 0, pending: 0, graded: 0, total: all.length, topics: [] }
  const unitId = all[0]?.unitId
  const tmap = new Map((TOPICS[unitId] ?? []).map((t) => [t.id, { id: t.id, label: t.label, correct: 0, graded: 0, total: 0 }]))
  for (const q of all) {
    const k = answerKeyOf(q)!
    const t = tmap.get(q.topic)
    if (t) t.total++
    s.max += q.points
    if (k.manual) s.manualMax += q.points; else s.autoMax += q.points
    if (!st.revealed[q.code]) continue
    const r = gradeItem(q, k, st.answers[q.code] as BankAnswer, { override: st.overrides[q.code], manual: st.manual[q.code] })
    if (r.status === 'pending') { s.pending++; continue }
    s.graded++
    if (t) t.graded++
    s.score += r.score
    if (k.manual) s.manualScore += r.score; else s.autoScore += r.score
    if (r.status === 'correct') { s.correct++; if (t) t.correct++ } else if (r.status === 'wrong') s.wrong++; else s.unanswered++
  }
  s.topics = [...tmap.values()]
  return s
}

