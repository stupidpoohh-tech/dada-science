import { useState } from 'react'
import type { UnitMeta } from '../../content/types'
import { answerKeyOf, bankById, topicOf } from '../../content/bank'
import { conceptById } from '../../content/concepts'
import { formatBankAnswer, gradeItem, isAnswered, typeLabel, type BankAnswer } from '../../lib/bankGrading'
import { href } from '../../lib/router'
import { emptyBankSet, recordRetry, useProgress, type WrongRecord } from '../../lib/store'
import AssessmentLayout from './AssessmentLayout'
import BankQuestionCard from './BankQuestionCard'

const fmtDate = (t: number) => new Date(t).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const SET_LABEL: Record<string, string> = { concept: '개념 확인', exam: '내신 대비', textbook: '교과서 문제' }

/** 오답 노트: 틀린 문제 자동 저장 · 오답만 다시 풀기 · 재풀이 기록 */
export default function WrongAnswerNotebook({ unit }: { unit: UnitMeta }) {
  const p = useProgress()
  const [filter, setFilter] = useState<'open' | 'all'>('open')
  const [retryId, setRetryId] = useState<string | null>(null)
  const [answer, setAnswer] = useState<BankAnswer>(undefined)
  const [checked, setChecked] = useState(false)
  const [manual, setManual] = useState<{ rubric?: boolean[]; correct?: boolean; confirmed?: boolean }>({})
  const list = Object.values(p.wrong).filter((w) => w.unitId === unit.id && bankById(w.questionId))
    .filter((w) => filter === 'all' || !w.resolved).sort((a, b) => b.lastAt - a.lastAt)
  const queue = list.filter((w) => !w.resolved).map((w) => w.questionId)

  const start = (id: string) => { setRetryId(id); setAnswer(undefined); setChecked(false); setManual({}); window.scrollTo({ top: 0 }) }
  const q = retryId ? bankById(retryId) : undefined

  if (q) {
    const key = answerKeyOf(q)!
    const result = checked ? gradeItem(q, key, answer, { manual }) : undefined
    const nextId = queue.find((id) => id !== q.id)
    const st = { ...emptyBankSet(), manual: { [q.code]: manual } }
    return (
      <AssessmentLayout unit={unit} tab="wrong">
        <button type="button" onClick={() => setRetryId(null)} className="mb-3 h-10 rounded-full border border-ink/12 bg-white px-3.5 text-[14px] font-bold">← 오답 목록</button>
        <BankQuestionCard q={q} value={answer} onChange={setAnswer} revealed={checked} result={result} answerKey={checked ? key : undefined}
          state={st} onOverride={() => {}} backRoute={{ name: 'wrong', unitId: unit.id }} locked={checked}
          onManual={(m) => { setManual(m); if (m.confirmed) { const r = gradeItem(q, key, answer, { manual: m }); recordRetry(q.id, answer, r.status === 'correct') } }}
          onCheck={() => { const r = gradeItem(q, key, answer, { manual }); if (r.status !== 'pending') recordRetry(q.id, answer, r.status === 'correct'); setChecked(true) }} />
        {checked && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => start(q.id)} className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-5 text-[16px] font-bold">다시 풀기</button>
            {nextId && <button type="button" onClick={() => start(nextId)} className="no-tap h-12 rounded-xl bg-ink px-5 text-[16px] font-bold text-white">다음 오답 →</button>}
          </div>
        )}
      </AssessmentLayout>
    )
  }

  return (
    <AssessmentLayout unit={unit} tab="wrong">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-[24px] font-extrabold">오답 노트</h1>
        <div className="flex rounded-full border border-ink/12 bg-white p-1">
          {(['open', 'all'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`h-9 rounded-full px-3.5 text-[14px] font-bold ${filter === f ? 'bg-ink text-white' : 'text-ink/60'}`}>{f === 'open' ? '복습 필요' : '전체'}</button>
          ))}
        </div>
        {queue.length > 0 && <button type="button" onClick={() => start(queue[0])} className="no-tap h-11 rounded-xl bg-coriolis px-4 text-[15px] font-bold text-white">오답만 다시 풀기 ({queue.length})</button>}
      </div>
      {!list.length ? (
        <p className="rounded-2xl border-2 border-dashed border-ink/15 p-8 text-center text-[15px] text-ink/55">{filter === 'open' ? '복습할 오답이 없습니다.' : '아직 틀린 문제가 없습니다.'} 개념 확인 문제나 내신 대비에서 틀린 문제가 자동으로 여기에 모입니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">{list.map((w) => <WrongItem key={w.questionId} w={w} onRetry={() => start(w.questionId)} />)}</ul>
      )}
    </AssessmentLayout>
  )
}

function WrongItem({ w, onRetry }: { w: WrongRecord; onRetry: () => void }) {
  const q = bankById(w.questionId)!
  const key = answerKeyOf(q)!
  const last = w.retries[w.retries.length - 1]
  return (
    <li className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold">
        <span className="text-[16px] font-extrabold">{SET_LABEL[w.set] ?? w.set} {w.set === 'textbook' && q.no ? `${q.no}번` : q.code}</span>
        <span className="rounded-full bg-ink/6 px-2 py-0.5 text-ink/60">{typeLabel(q)}</span>
        <span className="rounded-full bg-ink/6 px-2 py-0.5 text-ink/60">{topicOf(q.unitId, q.topic)?.label}</span>
        <span className={`rounded-full px-2 py-0.5 ${w.resolved ? 'bg-[#00dc84]/15 text-[#00754e]' : 'bg-coriolis/10 text-coriolis'}`}>{w.resolved ? '재풀이 정답' : '복습 필요'}</span>
        <span className="ml-auto text-ink/45">마지막 응시 {fmtDate(w.lastAt)}</span>
      </div>
      <p className="mt-2 line-clamp-2 whitespace-pre-line text-[15.5px] font-semibold leading-snug">{q.question}</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[14px]">
        <dt className="text-ink/55">선택한 답</dt><dd className="font-semibold text-coriolis">{isAnswered(q, w.lastAnswer as BankAnswer) ? formatBankAnswer(q, w.lastAnswer as BankAnswer) : '무응답'}</dd>
        <dt className="text-ink/55">정답</dt><dd className="font-semibold text-[#00875a]">{key.manual ? '모범답안 참고' : key.display}</dd>
        <dt className="text-ink/55">오답 횟수</dt><dd className="font-semibold">{w.wrongCount}회</dd>
        <dt className="text-ink/55">재풀이</dt><dd className="font-semibold">{w.retries.length ? `${w.retries.length}회 · 최근 ${last.correct ? '정답' : '오답'}` : '아직 안 함'}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {q.conceptIds.map((cid) => {
          const c = conceptById(cid)
          return c && (
            <a key={cid} href={href({ name: 'unit', unitId: c.unitId, focus: c.blockId, concept: c.id, back: href({ name: 'wrong', unitId: c.unitId }) })}
              className="inline-flex min-h-9 items-center rounded-full border border-brand/40 px-3 text-[13.5px] font-bold text-brand">{c.title} · 원문 →</a>
          )
        })}
        <button type="button" onClick={onRetry} className="no-tap ml-auto h-10 rounded-xl bg-ink px-4 text-[14px] font-bold text-white">다시 풀기</button>
      </div>
    </li>
  )
}
