import { useEffect, useMemo, useState } from 'react'
import type { UnitMeta } from '../../content/types'
import type { BankQuestion, BankSet } from '../../content/bank/types'
import { answerKeyOf, bankOf, TOPICS } from '../../content/bank'
import { gradeItem, isAnswered, type BankAnswer, type ItemResult } from '../../lib/bankGrading'
import { askConfirm } from '../../lib/dialog'
import { emptyBankSet, recordRetry, recordWrong, updateProgress, useProgress, type BankSetState } from '../../lib/store'
import AssessmentLayout from './AssessmentLayout'
import { summarize, type SetSummary } from '../../lib/bankSummary'
import BankQuestionCard from './BankQuestionCard'

const DOT: Record<string, string> = {
  unanswered: 'border-ink/15 bg-white text-ink/45', answered: 'border-brand/50 bg-brand/10 text-brand',
  correct: 'border-[#00a865] bg-[#00a865] text-white', wrong: 'border-coriolis bg-coriolis text-white', pending: 'border-[#f5b400] bg-[#ffe7a3] text-ink',
}

/** 개념 확인(문항별 정답 확인 + 전체 채점) / 내신 대비(시험 모드: 제출 후 일괄 채점) */
export default function QuestionSetPage({ unit, set, topic, q: focusQ }: { unit: UnitMeta; set: BankSet; topic?: string; q?: string }) {
  const p = useProgress()
  const all = useMemo(() => bankOf(unit.id, set), [unit.id, set])
  const topics = TOPICS[unit.id] ?? []
  const skey = `${unit.id}:${set}`
  const st: BankSetState = p.bank[skey] ?? emptyBankSet()
  const [filter, setFilter] = useState(topic ?? 'all')
  const exam = set === 'exam'
  const retry = st.retry ?? []
  const inRetry = retry.length > 0

  useEffect(() => { if (focusQ) setTimeout(() => document.getElementById(`q-${focusQ}`)?.scrollIntoView({ block: 'start' }), 80) }, [focusQ])

  const save = (fn: (s: BankSetState) => void) => updateProgress((ps) => { const s = ps.bank[skey] ?? emptyBankSet(); fn(s); ps.bank[skey] = s })

  // 공개된 문항만 정답 데이터로 채점
  const results = new Map<string, ItemResult>()
  for (const q of all) {
    if (!st.revealed[q.code]) continue
    results.set(q.code, gradeItem(q, answerKeyOf(q)!, st.answers[q.code] as BankAnswer, { override: st.overrides[q.code], manual: st.manual[q.code] }))
  }
  const statusOf = (q: BankQuestion) => results.get(q.code)?.status ?? (isAnswered(q, st.answers[q.code] as BankAnswer) ? 'answered' : 'unanswered')

  const visible = all.filter((q) => (filter === 'all' || q.topic === filter) && (!inRetry || retry.includes(q.code)))
  const answeredCount = all.filter((q) => isAnswered(q, st.answers[q.code] as BankAnswer)).length

  const onWrongOrRetry = (q: BankQuestion, r: ItemResult) => {
    const v = st.answers[q.code]
    if (retry.includes(q.code)) { if (r.status !== 'pending') recordRetry(q.id, v, r.status === 'correct') }
    else if (r.status === 'wrong') recordWrong(q.id, unit.id, set, v)
  }

  const checkOne = (q: BankQuestion) => {
    const r = gradeItem(q, answerKeyOf(q)!, st.answers[q.code] as BankAnswer, { override: st.overrides[q.code], manual: st.manual[q.code] })
    save((s) => { s.revealed[q.code] = true })
    onWrongOrRetry(q, r)
  }

  const gradeAll = async () => {
    const targets = inRetry ? all.filter((q) => retry.includes(q.code)) : all
    const empty = targets.filter((q) => !isAnswered(q, st.answers[q.code] as BankAnswer)).length
    const ok = await askConfirm({
      title: exam ? '답안을 제출할까요?' : (inRetry ? '다시 푼 문항을 채점할까요?' : '전체 채점할까요?'),
      message: `${empty ? `미응답 ${empty}문항은 오답으로 처리됩니다. ` : ''}채점하면 정답과 해설이 공개됩니다.${exam ? ' 서술형은 교사 채점을 확정한 뒤 점수에 반영됩니다.' : ''}`,
      confirmLabel: exam ? '제출' : '채점',
    })
    if (!ok) return
    const res: [BankQuestion, ItemResult][] = targets.filter((q) => !st.revealed[q.code]).map((q) => [q, gradeItem(q, answerKeyOf(q)!, st.answers[q.code] as BankAnswer, { override: st.overrides[q.code], manual: st.manual[q.code] })])
    res.forEach(([q, r]) => onWrongOrRetry(q, r))
    save((s) => {
      targets.forEach((q) => { s.revealed[q.code] = true })
      s.submittedAt = Date.now()
      if (inRetry) s.retry = undefined
    })
    // 기록(전체 기준)
    setTimeout(() => updateProgress((ps) => {
      const s = ps.bank[skey]; if (!s) return
      const sum = summarize(all, s)
      s.history = [...(s.history ?? []), { at: Date.now(), score: sum.score, max: sum.max, correct: sum.correct, wrong: sum.wrong, unanswered: sum.unanswered, pending: sum.pending }]
    }), 0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startRetry = () => {
    const codes = all.filter((q) => { const s = results.get(q.code)?.status; return s === 'wrong' || s === 'unanswered' }).map((q) => q.code)
    if (!codes.length) return
    save((s) => {
      s.retry = codes
      codes.forEach((c) => { delete s.answers[c]; delete s.revealed[c]; delete s.overrides[c]; delete s.manual[c] })
    })
    setFilter('all')
    window.scrollTo({ top: 0 })
  }
  const resetAll = async () => {
    if (!(await askConfirm({ title: '처음부터 다시 풀까요?', message: '이 세트의 답안과 채점 결과가 지워집니다. 오답 노트와 응시 기록은 남습니다.', confirmLabel: '다시 풀기', danger: true }))) return
    updateProgress((ps) => { ps.bank[skey] = { ...emptyBankSet(), history: ps.bank[skey]?.history ?? [] } })
    window.scrollTo({ top: 0 })
  }

  const anyRevealed = results.size > 0
  const sum = summarize(all, st)
  const wrongCount = [...results.values()].filter((r) => r.status === 'wrong' || r.status === 'unanswered').length
  const allRevealed = all.every((q) => st.revealed[q.code])

  return (
    <AssessmentLayout unit={unit} tab={set}>
      <h1 className="mb-1 text-[24px] font-extrabold">{exam ? '내신 대비 문제' : '개념 확인 문제'}</h1>
      <p className="mb-4 text-[15px] leading-relaxed text-ink/60">
        {exam ? '시험처럼 모두 풀고 제출하세요. 제출 전에는 정답과 해설이 공개되지 않습니다.' : '문항마다 답을 입력하고 정답을 확인하거나, 모두 푼 뒤 전체 채점하세요. 정답은 확인 전까지 공개되지 않습니다.'}
      </p>

      {anyRevealed && <ResultSummary unit={unit} set={set} sum={sum} allRevealed={allRevealed} />}

      {/* 진행률·응답 상태 */}
      <section className="mb-4 rounded-2xl border border-ink/10 bg-white p-4" aria-label="풀이 진행">
        <div className="mb-1.5 flex justify-between text-[14px] font-bold"><span className="text-ink/60">응답</span><span>{answeredCount} / {all.length}</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink/8"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(answeredCount / all.length) * 100}%` }} /></div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {all.map((q) => {
            const s = statusOf(q)
            return (
              <button key={q.code} type="button" title={`${q.code} ${s}`} onClick={() => { if (filter !== 'all' && q.topic !== filter) setFilter('all'); setTimeout(() => document.getElementById(`q-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30) }}
                className={`no-tap h-10 min-w-10 rounded-lg border px-1.5 text-[13px] font-extrabold tabular-nums ${DOT[s]} ${inRetry && !retry.includes(q.code) ? 'opacity-30' : ''}`}>{q.number}</button>
            )
          })}
        </div>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] font-semibold text-ink/55">
          <span>□ 미응답</span><span className="text-brand">■ 응답함</span><span className="text-[#00875a]">■ 정답</span><span className="text-coriolis">■ 오답</span>{exam && <span className="text-[#a37800]">■ 채점 대기(서술형)</span>}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="개념 분류">
          {[{ id: 'all', label: '전체' }, ...topics].map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)}
              className={`no-tap h-9 rounded-full px-3 text-[13.5px] font-bold ${filter === t.id ? 'bg-ink text-white' : 'border border-ink/12 bg-white text-ink/65'}`}>
              {t.label}{t.id !== 'all' && <span className="ml-1 opacity-60">{all.filter((q) => q.topic === t.id).length}</span>}
            </button>
          ))}
        </div>
        {inRetry && <p className="mt-3 rounded-lg bg-coriolis/[.07] px-3 py-2 text-[14px] font-bold text-coriolis">오답 다시 풀기: {retry.length}문항만 표시합니다. 다 풀면 아래 ‘다시 푼 문항 채점’을 누르세요.</p>}
      </section>

      <div className="flex flex-col gap-4">
        {visible.map((q) => {
          const revealed = !!st.revealed[q.code]
          return (
            <BankQuestionCard key={q.id} q={q} value={st.answers[q.code] as BankAnswer}
              onChange={(v) => save((s) => { s.answers[q.code] = v })}
              revealed={revealed} result={results.get(q.code)} answerKey={revealed ? answerKeyOf(q) : undefined} state={st}
              onOverride={(v) => save((s) => { s.overrides[q.code] = v })}
              onManual={(m) => {
                save((s) => { s.manual[q.code] = m })
                if (m.confirmed) {
                  const r = gradeItem(q, answerKeyOf(q)!, st.answers[q.code] as BankAnswer, { manual: m })
                  if (r.status === 'wrong') onWrongOrRetry(q, r)
                  else if (retry.includes(q.code)) recordRetry(q.id, st.answers[q.code], true)
                }
              }}
              onCheck={!exam ? () => checkOne(q) : undefined}
              backRoute={{ name: set, unitId: unit.id, q: q.id }} locked={revealed} />
          )
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[920px] flex-wrap items-center gap-2">
          <span className="text-[14px] font-bold tabular-nums text-ink/65">응답 {answeredCount}/{all.length}</span>
          {!allRevealed || inRetry ? (
            <button type="button" onClick={gradeAll} className="no-tap ml-auto h-12 rounded-xl bg-ink px-5 text-[16px] font-bold text-white">
              {inRetry ? '다시 푼 문항 채점' : exam ? '답안 제출' : '전체 채점'}
            </button>
          ) : (
            <div className="ml-auto flex gap-2">
              {wrongCount > 0 && <button type="button" onClick={startRetry} className="no-tap h-12 rounded-xl bg-coriolis px-4 text-[15px] font-bold text-white">오답·미응답 다시 풀기 ({wrongCount})</button>}
              <button type="button" onClick={resetAll} className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-4 text-[15px] font-bold">처음부터 다시</button>
            </div>
          )}
        </div>
      </div>
    </AssessmentLayout>
  )
}

function ResultSummary({ sum, allRevealed, set }: { unit: UnitMeta; set: BankSet; sum: SetSummary; allRevealed: boolean }) {
  const pointsBased = sum.max > 0
  const finalDone = sum.pending === 0 && allRevealed
  return (
    <section className="rise mb-4 rounded-2xl border border-ink/10 bg-white p-5" aria-label="채점 결과">
      <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
        <div>
          <p className="text-[13px] font-bold text-ink/55">{pointsBased ? (finalDone ? '총점' : '현재 점수(미확정)') : '정답률'}</p>
          <p className="text-[34px] font-extrabold tabular-nums leading-none">
            {pointsBased ? <>{sum.score}<span className="text-[18px] text-ink/45"> / {sum.max}점</span></> : <>{sum.graded ? Math.round((sum.correct / sum.graded) * 100) : 0}<span className="text-[18px] text-ink/45">%</span></>}
          </p>
        </div>
        <dl className="flex gap-4 text-center">
          {[['정답', sum.correct, 'text-[#00875a]'], ['오답', sum.wrong, 'text-coriolis'], ['미응답', sum.unanswered, 'text-ink/60'], ...(set === 'exam' || sum.pending ? [['채점 대기', sum.pending, 'text-[#a37800]'] as const] : [])].map(([l, v, c]) => (
            <div key={l as string}><dt className="text-[12.5px] font-bold text-ink/50">{l}</dt><dd className={`text-[22px] font-extrabold tabular-nums ${c}`}>{v}</dd></div>
          ))}
        </dl>
      </div>
      {set === 'exam' && (
        <p className="mt-3 text-[14px] text-ink/65">
          객관식 {sum.autoScore} / {sum.autoMax}점 · 서술형 {sum.manualScore} / {sum.manualMax}점
          {sum.pending > 0 && <span className="font-bold text-[#a37800]"> — 서술형 {sum.pending}문항은 교사 채점을 확정해야 최종 점수가 정해집니다.</span>}
        </p>
      )}
      {!allRevealed && <p className="mt-2 text-[13.5px] text-ink/55">아직 정답을 확인하지 않은 문항이 있어 확인한 문항만 반영했습니다.</p>}
      <p className="mb-2 mt-4 text-[14px] font-extrabold">개념별 정답률</p>
      <ul className="flex flex-col gap-1.5">
        {sum.topics.map((t) => {
          const rate = t.graded ? t.correct / t.graded : 0
          return (
            <li key={t.id} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 text-[14px] sm:grid-cols-[13rem_1fr_auto]">
              <span className="truncate font-semibold">{t.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-ink/8"><span className={`block h-full rounded-full ${rate >= 0.8 ? 'bg-[#00b87a]' : rate >= 0.5 ? 'bg-[#f5b400]' : 'bg-coriolis'}`} style={{ width: `${rate * 100}%` }} /></span>
              <span className="w-20 text-right font-bold tabular-nums">{t.graded ? `${Math.round(rate * 100)}%` : '–'} <span className="text-[12px] text-ink/45">{t.correct}/{t.total}</span></span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
