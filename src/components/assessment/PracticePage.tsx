import { useEffect, useState } from 'react'
import type { UnitMeta } from '../../content/types'
import { questionsOf } from '../../content/questions'
import { grade } from '../../lib/grading'
import { recordWrong, updateProgress, useProgress } from '../../lib/store'
import AssessmentLayout, { EmptyQuestions } from './AssessmentLayout'
import QuestionRenderer from './QuestionRenderer'

/** 기본 예제: 문항마다 바로 정답 확인 */
export default function PracticePage({ unit, q: focusQ }: { unit: UnitMeta; q?: string }) {
  const qs = questionsOf(unit.id, 'practice')
  const p = useProgress()
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [open, setOpen] = useState<Record<string, boolean>>({})
  useEffect(() => { if (focusQ) setTimeout(() => document.getElementById(`q-${focusQ}`)?.scrollIntoView({ block: 'start' }), 60) }, [focusQ])

  const check = (id: string) => {
    const q = qs.find((x) => x.id === id)!
    const ans = draft[id]
    const ok = grade(q, ans)
    updateProgress((s) => { s.practice[id] = { answer: ans, correct: ok, at: Date.now() } })
    if (ok === false) recordWrong(id, unit.id, 'practice', ans)
    setOpen((o) => ({ ...o, [id]: true }))
  }
  const retry = (id: string) => { setOpen((o) => ({ ...o, [id]: false })); setDraft((d) => ({ ...d, [id]: undefined })) }

  return (
    <AssessmentLayout unit={unit} tab="practice">
      <h1 className="mb-1 text-[24px] font-extrabold">기본 예제</h1>
      <p className="mb-4 text-[15px] text-ink/60">학습한 개념을 적용해 보는 문제입니다. 문항마다 답을 고르고 정답을 확인하세요.</p>
      {!qs.length ? <EmptyQuestions unit={unit} /> : (
        <div className="flex flex-col gap-4">
          {qs.map((q) => {
            const rec = p.practice[q.id]
            const shown = open[q.id] ?? false
            const value = shown ? (draft[q.id] ?? rec?.answer) : draft[q.id]
            return (
              <div key={q.id}>
                <QuestionRenderer q={q} value={value} onChange={(v) => setDraft((d) => ({ ...d, [q.id]: v }))}
                  reveal={shown} result={shown ? grade(q, value) : undefined} backRoute={{ name: 'practice', unitId: unit.id, q: q.id }} />
                <div className="mt-2 flex items-center gap-2">
                  {!shown ? (
                    <button type="button" onClick={() => check(q.id)} disabled={draft[q.id] === undefined || draft[q.id] === ''}
                      className="no-tap h-12 rounded-xl bg-ink px-5 text-[16px] font-bold text-white disabled:opacity-35">정답 확인</button>
                  ) : (
                    <button type="button" onClick={() => retry(q.id)} className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-5 text-[16px] font-bold">다시 풀기</button>
                  )}
                  {rec && !shown && <span className="text-[13px] font-semibold text-ink/50">지난 풀이: {rec.correct ? '정답' : rec.correct === false ? '오답' : '자기 점검'}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AssessmentLayout>
  )
}
