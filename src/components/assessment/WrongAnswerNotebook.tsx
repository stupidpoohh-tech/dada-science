import { useState } from 'react'
import type { UnitMeta } from '../../content/types'
import { questionById } from '../../content/questions'
import { conceptById } from '../../content/concepts'
import { formatAnswer, formatCorrect, grade, TYPE_LABEL } from '../../lib/grading'
import { href } from '../../lib/router'
import { recordRetry, useProgress, type WrongRecord } from '../../lib/store'
import AssessmentLayout from './AssessmentLayout'
import QuestionRenderer from './QuestionRenderer'

const fmtDate = (t: number) => new Date(t).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

/** 오답 노트: 틀린 문제 자동 저장 · 오답만 다시 풀기 · 재풀이 기록 */
export default function WrongAnswerNotebook({ unit }: { unit: UnitMeta }) {
  const p = useProgress()
  const [filter, setFilter] = useState<'open' | 'all'>('open')
  const [retryId, setRetryId] = useState<string | null>(null)
  const [answer, setAnswer] = useState<unknown>(undefined)
  const [checked, setChecked] = useState(false)
  const list = Object.values(p.wrong).filter((w) => w.unitId === unit.id && questionById(w.questionId))
    .filter((w) => filter === 'all' || !w.resolved).sort((a, b) => b.lastAt - a.lastAt)
  const queue = list.filter((w) => !w.resolved).map((w) => w.questionId)

  const start = (id: string) => { setRetryId(id); setAnswer(undefined); setChecked(false); window.scrollTo({ top: 0 }) }
  const q = retryId ? questionById(retryId) : undefined

  if (q) {
    const ok = checked ? grade(q, answer) : undefined
    const nextId = queue.find((id) => id !== q.id)
    return (
      <AssessmentLayout unit={unit} tab="wrong">
        <button type="button" onClick={() => setRetryId(null)} className="mb-3 h-10 rounded-full border border-ink/12 bg-white px-3.5 text-[14px] font-bold">← 오답 목록</button>
        <QuestionRenderer q={q} value={answer} onChange={setAnswer} reveal={checked} result={ok} backRoute={{ name: 'wrong', unitId: unit.id }} />
        <div className="mt-3 flex flex-wrap gap-2">
          {!checked ? (
            <button type="button" disabled={answer === undefined || answer === ''} onClick={() => { const r = grade(q, answer); if (r !== null) recordRetry(q.id, answer, r); setChecked(true) }}
              className="no-tap h-12 rounded-xl bg-ink px-5 text-[16px] font-bold text-white disabled:opacity-35">정답 확인</button>
          ) : (
            <>
              <button type="button" onClick={() => { setAnswer(undefined); setChecked(false) }} className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-5 text-[16px] font-bold">다시 풀기</button>
              {nextId && <button type="button" onClick={() => start(nextId)} className="no-tap h-12 rounded-xl bg-ink px-5 text-[16px] font-bold text-white">다음 오답 →</button>}
            </>
          )}
        </div>
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
        <p className="rounded-2xl border-2 border-dashed border-ink/15 p-8 text-center text-[15px] text-ink/55">{filter === 'open' ? '복습할 오답이 없습니다.' : '아직 틀린 문제가 없습니다.'} 기본 예제나 내신 대비에서 틀린 문제가 자동으로 여기에 모입니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">{list.map((w) => <WrongItem key={w.questionId} w={w} onRetry={() => start(w.questionId)} />)}</ul>
      )}
    </AssessmentLayout>
  )
}

function WrongItem({ w, onRetry }: { w: WrongRecord; onRetry: () => void }) {
  const q = questionById(w.questionId)!
  const last = w.retries[w.retries.length - 1]
  return (
    <li className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold">
        <span className="text-[16px] font-extrabold">{w.set === 'exam' ? '내신 대비' : '기본 예제'} {q.number}번</span>
        <span className="rounded-full bg-ink/6 px-2 py-0.5 text-ink/60">{TYPE_LABEL[q.type]}</span>
        <span className={`rounded-full px-2 py-0.5 ${w.resolved ? 'bg-[#00dc84]/15 text-[#00754e]' : 'bg-coriolis/10 text-coriolis'}`}>{w.resolved ? '재풀이 정답' : '복습 필요'}</span>
        <span className="ml-auto text-ink/45">마지막 응시 {fmtDate(w.lastAt)}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-[15.5px] font-semibold leading-snug">{q.stem}</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[14px]">
        <dt className="text-ink/55">선택한 답</dt><dd className="font-semibold text-coriolis">{formatAnswer(q, w.lastAnswer)}</dd>
        <dt className="text-ink/55">정답</dt><dd className="font-semibold text-[#00875a]">{formatCorrect(q)}</dd>
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
