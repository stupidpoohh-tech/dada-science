import { useState } from 'react'
import type { AnswerKey, BankQuestion } from '../../content/bank/types'
import { conceptById } from '../../content/concepts'
import { FIGURES } from '../../figures'
import { blankCount, type BankAnswer, type ItemResult } from '../../lib/bankGrading'
import { href, type Route } from '../../lib/router'
import { openPopup } from '../../lib/popupState'
import type { BankSetState } from '../../lib/store'

const CIRCLED = '①②③④⑤⑥⑦'
const STATUS_STYLE: Record<string, string> = {
  unanswered: 'bg-ink/6 text-ink/55', answered: 'bg-brand/10 text-brand',
  correct: 'bg-[#00a865] text-white', wrong: 'bg-coriolis text-white', pending: 'bg-[#f5b400] text-ink', partial: 'bg-[#ffb4a8] text-ink',
}
const STATUS_LABEL: Record<string, string> = { unanswered: '미응답', answered: '응답함', correct: '정답', wrong: '오답', pending: '채점 대기', partial: '부분 점수' }

/**
 * 문제 하나. 정답·해설(key)은 revealed일 때만 전달·표시됩니다.
 */
export default function BankQuestionCard({ q, value, onChange, revealed, result, answerKey, state, onOverride, onManual, onCheck, backRoute, locked }: {
  q: BankQuestion
  value: BankAnswer
  onChange: (v: BankAnswer) => void
  revealed: boolean
  result?: ItemResult
  answerKey?: AnswerKey
  state: BankSetState
  onOverride: (v: boolean) => void
  onManual: (m: BankSetState['manual'][string]) => void
  /** 개념 확인 모드의 문항별 정답 확인 */
  onCheck?: () => void
  backRoute: Route
  locked: boolean
}) {
  const [open, setOpen] = useState(true)
  const answered = result ? result.status !== 'unanswered' : value !== undefined && (Array.isArray(value) ? value.some((x) => x?.trim()) : String(value).trim() !== '')
  const status = revealed && result ? (result.status === 'wrong' && result.score > 0 ? 'partial' : result.status) : answered ? 'answered' : 'unanswered'
  const Fig = q.diagram?.fig ? FIGURES[q.diagram.fig] : undefined
  const imgs = [...(q.diagram?.img ? [q.diagram.img] : []), ...(q.images ?? [])]
  const manual = state.manual[q.code] ?? {}
  const n = blankCount(q)
  const blanks = Array.isArray(value) ? value : Array.from({ length: n }, () => '')

  const choice = (i: number, label: string) => {
    const no = i + 1
    const picked = value === no
    const right = revealed && answerKey?.answer === no
    const wrong = revealed && picked && answerKey?.answer !== no
    return (
      <button key={i} type="button" role="radio" aria-checked={picked} disabled={locked} onClick={() => onChange(no)}
        className={`no-tap flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left text-[16px] font-semibold transition disabled:cursor-default
          ${right ? 'border-[#00a865] bg-[#00dc84]/10' : wrong ? 'border-coriolis bg-coriolis/[.06]' : picked ? 'border-brand bg-brand/[.06]' : 'border-ink/12 bg-white hover:border-brand/50'}`}>
        <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[16px] font-extrabold ${picked ? 'bg-brand text-white' : 'bg-ink/6 text-ink/70'}`}>{CIRCLED[i]}</span>
        <span className="min-w-0">{label}</span>
      </button>
    )
  }

  return (
    <article id={`q-${q.id}`} data-block-id={`q-${q.id}`} className="scroll-mt-28 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5">
      {/* 번호와 문제만 표시. 채점 후에만 결과(정답·오답·점수)를 붙입니다. */}
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 whitespace-pre-line text-[17px] font-semibold leading-relaxed">
          <span className="mr-1.5 font-extrabold tabular-nums">{q.no ?? q.number}.</span>{q.question}
        </p>
        {revealed && result && (
          <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[13px] font-bold ${STATUS_STYLE[status]}`}>{answerKey?.pending ? '정답 준비 중' : STATUS_LABEL[status]}{result.status !== 'unanswered' && q.points > 0 ? ` ${result.score}/${q.points}` : ''}</span>
        )}
      </div>
      {q.material && (
        <div className="mt-3 rounded-xl border border-ink/15 bg-[#f7f9fc] px-4 py-2.5 text-[15.5px] leading-relaxed">
          <p className="mb-0.5 font-bold">[자료]</p>
          {q.material.map((m, i) => <p key={i}>{m}</p>)}
        </div>
      )}
      {Fig && (
        <figure className={`mt-3 ${q.diagram?.wide ? 'max-w-[560px]' : 'max-w-[360px]'}`}>
          <svg viewBox={q.diagram?.wide ? '0 0 560 220' : '0 0 320 200'} className="w-full rounded-xl border border-ink/10 bg-white" role="img" aria-label={q.diagram?.caption}><Fig /></svg>
          {q.diagram?.caption && <figcaption className="mt-1 text-[13px] text-ink/55">{q.diagram.caption}</figcaption>}
        </figure>
      )}
      {imgs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-start gap-3">
          {imgs.map((src) => <TextbookImage key={src} src={src} />)}
        </div>
      )}
      {q.table && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-center text-[14.5px]">
            <thead><tr>{q.table.head.map((h, i) => <th key={i} className="border border-ink/20 bg-ink/[.04] px-2 py-1.5 font-bold">{h}</th>)}</tr></thead>
            <tbody>{q.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border border-ink/20 px-2 py-1 tabular-nums">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {q.statements && (
        <div className="mt-3 rounded-xl border border-ink/20 px-4 py-3">
          <p className="mb-1.5 text-center text-[14px] font-bold">&lt;보기&gt;</p>
          <ol className="flex flex-col gap-1.5 text-[16px] leading-relaxed">
            {q.statements.map((s, i) => <li key={i} className="flex gap-2"><span className="font-bold">{'ㄱㄴㄷㄹㅁ'[i]}.</span><span>{s}</span></li>)}
          </ol>
        </div>
      )}

      {/* 답 입력 */}
      <div className="mt-4 flex flex-col gap-2" role={q.type === 'multiple_choice' || q.type === 'ox' ? 'radiogroup' : undefined} aria-label={`${q.code} 답`}>
        {q.type === 'multiple_choice' && q.options?.map((o, i) => choice(i, o))}
        {q.type === 'ox' && (
          <div className="flex gap-3">
            {(['O', 'X'] as const).map((v) => {
              const picked = value === v, right = revealed && answerKey?.answer === v, wrong = revealed && picked && answerKey?.answer !== v
              return (
                <button key={v} type="button" role="radio" aria-checked={picked} aria-label={v} disabled={locked} onClick={() => onChange(v)}
                  className={`no-tap h-16 flex-1 rounded-2xl border-2 text-[28px] font-extrabold transition ${right ? 'border-[#00a865] bg-[#00dc84]/10' : wrong ? 'border-coriolis bg-coriolis/[.06]' : picked ? 'border-brand bg-brand/[.06] text-brand' : 'border-ink/12 bg-white'}`}>{v}</button>
              )
            })}
          </div>
        )}
        {(q.type === 'blank' || q.type === 'short_answer' || q.type === 'calculation') && !isLongAnswer(q) && (
          <>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: n }, (_, i) => {
                const ok = revealed ? result?.blanks?.[i] : undefined
                return (
                  <label key={i} className="flex min-w-[200px] flex-1 items-center gap-2">
                    {q.blanks && <span className="shrink-0 text-[14px] font-bold text-ink/60">{q.blanks[i]}</span>}
                    <input type="text" value={blanks[i] ?? ''} disabled={locked} aria-label={q.blanks?.[i] ?? '답'}
                      onChange={(e) => { const next = [...blanks]; next[i] = e.target.value; onChange(next) }}
                      className={`h-12 min-w-0 flex-1 rounded-xl border-2 bg-white px-3.5 text-[17px] outline-none focus:border-brand disabled:bg-ink/[.03] ${ok === true ? 'border-[#00a865]' : ok === false ? 'border-coriolis' : 'border-ink/15'}`} />
                    {ok !== undefined && <span className={`text-[18px] font-extrabold ${ok ? 'text-[#00a865]' : 'text-coriolis'}`}>{ok ? '○' : '✕'}</span>}
                  </label>
                )
              })}
            </div>
            <p className="text-[13px] text-ink/45">{q.unitHint ?? ''}{n > 1 ? `${q.unitHint ? ' · ' : ''}칸마다 입력하거나 첫 칸에 쉼표로 구분해 입력해도 됩니다.` : ''}</p>
          </>
        )}
        {isLongAnswer(q) && (
          <textarea value={typeof value === 'string' ? value : ''} disabled={locked} onChange={(e) => onChange(e.target.value)} rows={q.type === 'essay' || q.set === 'exam' ? 5 : 3}
            placeholder="답안을 작성하세요" aria-label="서술 답안"
            className="rounded-xl border-2 border-ink/15 bg-white px-3.5 py-2.5 text-[16px] leading-relaxed outline-none focus:border-brand disabled:bg-ink/[.03]" />
        )}
      </div>

      {onCheck && !revealed && (
        <button type="button" onClick={onCheck} disabled={!answered}
          className="no-tap mt-3 h-11 rounded-xl bg-ink px-4 text-[15px] font-bold text-white disabled:opacity-30">정답 확인</button>
      )}

      {/* 정답·해설: 제출 후에만 */}
      {revealed && answerKey && (
        <div className="mt-4 rounded-xl bg-[#f5f8fc]">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
            className="no-tap flex min-h-11 w-full items-center justify-between px-4 text-left text-[15px] font-extrabold">
            정답 및 해설 <span className="text-ink/45">{open ? '접기 ▲' : '펼치기 ▼'}</span>
          </button>
          {open && (
            <div className="flex flex-col gap-2.5 px-4 pb-4 text-[15.5px] leading-relaxed">
              {answerKey.pending && <p className="font-bold text-ink/55">정답이 아직 입력되지 않았습니다.</p>}
              {!answerKey.manual && !answerKey.pending && <p><span className="font-extrabold text-[#00875a]">정답</span> {answerKey.display}</p>}
              {answerKey.manual && answerKey.modelAnswer && (
                <div><p className="font-extrabold text-[#00875a]">모범답안</p><p className="whitespace-pre-line">{answerKey.modelAnswer}</p></div>
              )}
              {answerKey.keywords && <p className="text-[13.5px] text-ink/55">이 문항은 핵심 단어 포함 여부로 채점했습니다. 판정이 맞지 않으면 아래에서 교사가 정답으로 인정할 수 있습니다.</p>}
              {answerKey.explanation && <p className="whitespace-pre-line"><span className="font-extrabold">해설</span> {answerKey.explanation}</p>}

              {/* 서술형·설명형: 교사(또는 자기) 채점 */}
              {answerKey.manual && (
                <div className="rounded-xl border border-[#f5b400]/50 bg-white p-3">
                  <p className="mb-1.5 text-[14px] font-extrabold">{q.set === 'textbook' ? '스스로 채점' : '교사 채점'} <span className="font-semibold text-ink/50">({q.set === 'textbook' ? '모범답안과 비교해 스스로 판정하고 확정하세요' : '자동으로 채점하지 않습니다. 확정 전에는 점수에 넣지 않습니다'})</span></p>
                  {answerKey.rubric ? answerKey.rubric.map((r, i) => (
                    <label key={i} className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[15px]">
                      <input type="checkbox" className="h-5 w-5 accent-[#00a865]" checked={!!manual.rubric?.[i]}
                        onChange={(e) => { const rb = [...(manual.rubric ?? [])]; rb[i] = e.target.checked; onManual({ ...manual, rubric: rb, confirmed: false }) }} />
                      {r.text} <span className="text-ink/45">({r.points}점)</span>
                    </label>
                  )) : (
                    <div className="flex gap-2">
                      {[true, false].map((v) => (
                        <button key={String(v)} type="button" onClick={() => onManual({ ...manual, correct: v, confirmed: false })}
                          className={`no-tap h-10 rounded-lg border px-3 text-[14px] font-bold ${manual.correct === v ? (v ? 'border-[#00a865] bg-[#00dc84]/15' : 'border-coriolis bg-coriolis/10') : 'border-ink/15'}`}>{v ? '모범답안과 같은 뜻(정답)' : '부족함(오답)'}</button>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => onManual({ ...manual, confirmed: !manual.confirmed })} disabled={!answerKey.rubric && manual.correct === undefined}
                      className={`no-tap h-10 rounded-lg px-3 text-[14px] font-bold disabled:opacity-30 ${manual.confirmed ? 'bg-[#00a865] text-white' : 'bg-ink text-white'}`}>{manual.confirmed ? '✓ 채점 확정됨 (다시 누르면 해제)' : '채점 확정'}</button>
                    {answerKey.rubric && <span className="text-[14px] font-bold">{answerKey.rubric.reduce((a, r, i) => a + (manual.rubric?.[i] ? r.points : 0), 0)} / {q.points}점</span>}
                  </div>
                </div>
              )}
              {!answerKey.manual && !answerKey.pending && result?.status === 'wrong' && (
                <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[14px] text-ink/70">
                  <input type="checkbox" className="h-5 w-5 accent-[#2870ff]" checked={!!state.overrides[q.code]} onChange={(e) => onOverride(e.target.checked)} />
                  교사 확인: 과학적으로 같은 답이므로 정답으로 인정
                </label>
              )}
              {state.overrides[q.code] && !answerKey.manual && <p className="text-[13.5px] font-bold text-brand">교사 확인으로 정답 인정됨</p>}

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[14px] font-extrabold">관련 개념</span>
                {q.conceptIds.map((cid) => {
                  const c = conceptById(cid)
                  if (!c) return null
                  return (
                    <span key={cid} className="inline-flex items-center gap-1">
                      <a href={href({ name: 'unit', unitId: c.unitId, focus: c.blockId, concept: c.id, back: href(backRoute) })}
                        className="inline-flex min-h-9 items-center rounded-full border border-brand/40 bg-white px-3 text-[13.5px] font-bold text-brand">{c.title} · 원문 →</a>
                      {c.popupId && <button type="button" onClick={() => openPopup(c.popupId!, c.popupStep)} aria-label={`${c.title} 움직이는 그림`}
                        className="no-tap inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">▶</button>}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

/** 서술형·설명형(긴 답) 문항: 입력 형태는 정답 데이터가 아니라 문항 정보로만 결정 */
export function isLongAnswer(q: BankQuestion) {
  return q.type === 'essay' || (q.type === 'short_answer' && q.set === 'exam') || q.format === 'text'
}

/** 교과서 그림(원본 이미지). 원본 크기의 약 1.8배까지 키워 보여 줌 */
function TextbookImage({ src }: { src: string }) {
  const [w, setW] = useState(0)
  return (
    <img src={src} alt="교과서 그림" loading="lazy" onLoad={(e) => setW(e.currentTarget.naturalWidth)}
      style={{ width: w ? Math.round(w * 1.8) : undefined }}
      className="max-w-full rounded-lg border border-ink/10 bg-white" />
  )
}
