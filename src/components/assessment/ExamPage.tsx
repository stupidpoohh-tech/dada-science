import { useEffect } from 'react'
import type { UnitMeta } from '../../content/types'
import { questionsOf } from '../../content/questions'
import { conceptById } from '../../content/concepts'
import { grade } from '../../lib/grading'
import { askConfirm } from '../../lib/dialog'
import { href } from '../../lib/router'
import { recordWrong, updateProgress, useProgress } from '../../lib/store'
import AssessmentLayout, { EmptyQuestions } from './AssessmentLayout'
import QuestionRenderer from './QuestionRenderer'

/** 내신 대비: 시험 모드(제출 전에는 정답 비공개) → 제출 후 결과 보고서 */
export default function ExamPage({ unit, q: focusQ }: { unit: UnitMeta; q?: string }) {
  const qs = questionsOf(unit.id, 'exam')
  const p = useProgress()
  const ex = p.exams[unit.id] ?? { draft: {} }
  const submitted = !!ex.submittedAt
  useEffect(() => { if (focusQ) setTimeout(() => document.getElementById(`q-${focusQ}`)?.scrollIntoView({ block: 'start' }), 80) }, [focusQ])

  const setAns = (id: string, v: unknown) => updateProgress((s) => { s.exams[unit.id] = { ...(s.exams[unit.id] ?? { draft: {} }), draft: { ...(s.exams[unit.id]?.draft ?? {}), [id]: v } } })
  const answered = qs.filter((q) => ex.draft[q.id] !== undefined && ex.draft[q.id] !== '').length

  const submit = async () => {
    if (answered < qs.length) {
      const ok = await askConfirm({ title: '답하지 않은 문항이 있습니다', message: `${qs.length - answered}문항이 비어 있습니다. 그대로 제출할까요?`, confirmLabel: '제출' })
      if (!ok) return
    } else if (!(await askConfirm({ title: '답안을 제출할까요?', message: '제출하면 채점 결과와 해설이 공개됩니다.', confirmLabel: '제출' }))) return
    const graded: Record<string, boolean | null> = {}
    let score = 0, max = 0
    for (const q of qs) {
      const r = grade(q, ex.draft[q.id])
      graded[q.id] = r
      if (q.type !== 'essay') { max += q.points ?? 1; if (r) score += q.points ?? 1 }
      if (r === false) recordWrong(q.id, unit.id, 'exam', ex.draft[q.id])
    }
    updateProgress((s) => {
      const e = s.exams[unit.id] ?? { draft: {} }
      e.submittedAt = Date.now(); e.graded = graded; e.score = score; e.maxScore = max
      e.history = [...(e.history ?? []), { at: Date.now(), score, maxScore: max }]
      s.exams[unit.id] = e
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const restart = async () => {
    if (!(await askConfirm({ title: '다시 응시할까요?', message: '현재 답안과 결과 화면이 지워집니다. 오답 노트와 응시 기록은 남습니다.', confirmLabel: '다시 응시' }))) return
    updateProgress((s) => { s.exams[unit.id] = { draft: {}, history: s.exams[unit.id]?.history } })
    window.scrollTo({ top: 0 })
  }

  const wrongConcepts = submitted ? [...new Set(qs.filter((q) => ex.graded?.[q.id] === false).flatMap((q) => q.conceptIds))] : []

  return (
    <AssessmentLayout unit={unit} tab="exam">
      <h1 className="mb-1 text-[24px] font-extrabold">내신 대비 문제</h1>
      <p className="mb-4 text-[15px] text-ink/60">{submitted ? '채점 결과입니다. 틀린 문항의 관련 개념을 복습하세요.' : '시험처럼 모두 푼 뒤 제출하세요. 제출 전에는 정답이 공개되지 않습니다.'}</p>
      {!qs.length ? <EmptyQuestions unit={unit} /> : (
        <>
          {submitted && (
            <section className="rise mb-5 rounded-2xl border border-ink/10 bg-white p-5" aria-label="채점 결과">
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                <div><p className="text-[13px] font-bold text-ink/55">총점(자동 채점)</p><p className="text-[34px] font-extrabold tabular-nums">{ex.score} <span className="text-[18px] text-ink/45">/ {ex.maxScore}점</span></p></div>
                <div><p className="text-[13px] font-bold text-ink/55">정답률</p><p className="text-[24px] font-extrabold tabular-nums">{ex.maxScore ? Math.round(((ex.score ?? 0) / ex.maxScore) * 100) : 0}%</p></div>
                <button type="button" onClick={restart} className="no-tap ml-auto h-11 rounded-xl border border-ink/15 px-4 text-[15px] font-bold">다시 응시</button>
              </div>
              <p className="mb-2 mt-4 text-[14px] font-extrabold">문항별 정오표</p>
              <div className="flex flex-wrap gap-1.5">
                {qs.map((q) => {
                  const r = ex.graded?.[q.id]
                  return (
                    <a key={q.id} href={`#q-${q.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                      className={`flex h-12 w-14 flex-col items-center justify-center rounded-xl text-[13px] font-extrabold ${r === null ? 'bg-ink/8 text-ink/60' : r ? 'bg-[#00dc84]/15 text-[#00754e]' : 'bg-coriolis/10 text-coriolis'}`}>
                      <span>{q.number}번</span><span>{r === null ? '서술' : r ? 'O' : 'X'}</span>
                    </a>
                  )
                })}
              </div>
              {wrongConcepts.length > 0 && (
                <>
                  <p className="mb-2 mt-4 text-[14px] font-extrabold">틀린 개념 복습</p>
                  <div className="flex flex-wrap gap-1.5">
                    {wrongConcepts.map((cid) => {
                      const c = conceptById(cid)
                      return c && (
                        <a key={cid} href={href({ name: 'unit', unitId: c.unitId, focus: c.blockId, concept: c.id, back: href({ name: 'exam', unitId: unit.id }) })}
                          className="inline-flex min-h-10 items-center rounded-full border border-coriolis/40 bg-coriolis/[.04] px-3 text-[14px] font-bold text-coriolis">{c.title} · 원문으로 →</a>
                      )
                    })}
                  </div>
                </>
              )}
            </section>
          )}
          <div className="flex flex-col gap-4">
            {qs.map((q) => (
              <QuestionRenderer key={q.id} q={q} value={ex.draft[q.id]} onChange={(v) => setAns(q.id, v)} reveal={submitted} result={ex.graded?.[q.id]}
                backRoute={{ name: 'exam', unitId: unit.id, q: q.id }}
                selfCheck={ex.selfCheck?.[q.id]} onSelfCheck={(i, v) => updateProgress((s) => {
                  const e = s.exams[unit.id]!; e.selfCheck = { ...(e.selfCheck ?? {}) }
                  const arr = [...(e.selfCheck[q.id] ?? [])]; arr[i] = v; e.selfCheck[q.id] = arr
                })} />
            ))}
          </div>
          {!submitted && (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur">
              <div className="mx-auto flex max-w-[920px] items-center gap-3">
                <span className="text-[15px] font-bold tabular-nums text-ink/70">{answered} / {qs.length} 답함</span>
                <button type="button" onClick={submit} className="no-tap ml-auto h-12 rounded-xl bg-ink px-6 text-[16px] font-bold text-white">답안 제출</button>
              </div>
            </div>
          )}
        </>
      )}
    </AssessmentLayout>
  )
}
