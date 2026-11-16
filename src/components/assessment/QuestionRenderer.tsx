import type { Question } from '../../content/types'
import { conceptById } from '../../content/concepts'
import { THUMBS } from '../../scenes/thumbs'
import { InlineText } from '../textbook/Inline'
import { formatCorrect, TYPE_LABEL } from '../../lib/grading'
import { href, type Route } from '../../lib/router'

/** 문제 하나(본문·자료·보기·답 입력). reveal이면 정오와 해설을 표시 */
export default function QuestionRenderer({ q, value, onChange, reveal, result, backRoute, selfCheck, onSelfCheck }: {
  q: Question; value: unknown; onChange: (v: unknown) => void; reveal: boolean; result?: boolean | null
  backRoute: Route; selfCheck?: boolean[]; onSelfCheck?: (i: number, v: boolean) => void
}) {
  const Thumb = q.figure?.thumb ? THUMBS[q.figure.thumb] : undefined
  const locked = reveal
  const choiceBtn = (i: number, label: React.ReactNode) => {
    const picked = value === i
    const correct = reveal && q.answer === i
    const wrong = reveal && picked && q.answer !== i
    return (
      <button key={i} type="button" role="radio" aria-checked={picked} disabled={locked} onClick={() => onChange(i)}
        className={`no-tap flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left text-[16px] font-semibold transition disabled:cursor-default
          ${correct ? 'border-[#00a865] bg-[#00dc84]/10' : wrong ? 'border-coriolis bg-coriolis/[.06]' : picked ? 'border-brand bg-brand/[.06]' : 'border-ink/12 bg-white hover:border-brand/50'}`}>
        <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold ${picked ? 'bg-brand text-white' : 'bg-ink/6 text-ink/70'}`}>{'①②③④⑤⑥'[i]}</span>
        <span className="min-w-0"><InlineText text={String(label)} /></span>
      </button>
    )
  }

  return (
    <article id={`q-${q.id}`} className="scroll-mt-24 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[13px] font-bold">
        <span className="text-[18px] font-extrabold text-ink">{q.number}.</span>
        <span className="rounded-full bg-ink/6 px-2 py-0.5 text-ink/60">{TYPE_LABEL[q.type]}</span>
        {q.points && <span className="text-ink/45">[{q.points}점]</span>}
        {q.demo && <span className="rounded-full bg-[#fff1c2] px-2 py-0.5 text-[#7a5b00]">데모 문항</span>}
        {reveal && result !== undefined && (
          <span className={`ml-auto rounded-full px-2.5 py-0.5 text-white ${result === null ? 'bg-ink/50' : result ? 'bg-[#00a865]' : 'bg-coriolis'}`}>
            {result === null ? '자기 점검' : result ? '정답' : '오답'}
          </span>
        )}
      </div>
      <p className="text-[17px] font-semibold leading-relaxed"><InlineText text={q.stem} /></p>
      {q.material && <div className="mt-3 rounded-xl border border-ink/15 bg-[#f7f9fc] px-3.5 py-2.5 text-[15.5px] leading-relaxed"><span className="mr-1 font-bold">[자료]</span><InlineText text={q.material} /></div>}
      {q.figure && (
        <figure className="mt-3 max-w-[380px]">
          {q.figure.src ? <img src={q.figure.src} alt={q.figure.alt ?? ''} className="rounded-lg border border-ink/10" />
            : Thumb ? <svg viewBox="0 0 320 180" className="w-full rounded-lg border border-ink/10 bg-[#f3f8fd]" role="img" aria-label={q.figure.caption}><Thumb /></svg> : null}
          {q.figure.caption && <figcaption className="mt-1 text-[13px] text-ink/60">{q.figure.caption}</figcaption>}
        </figure>
      )}
      {q.statements && (
        <div className="mt-3 rounded-xl border border-ink/20 px-4 py-3">
          <p className="mb-1.5 text-center text-[14px] font-bold">&lt;보기&gt;</p>
          <ol className="flex flex-col gap-1.5 text-[16px] leading-relaxed">
            {q.statements.map((s, i) => <li key={i} className="flex gap-2"><span className="font-bold">{'ㄱㄴㄷㄹ'[i]}.</span><span><InlineText text={s} /></span></li>)}
          </ol>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2" role={q.type === 'choice' || q.type === 'tf-set' || q.type === 'ox' ? 'radiogroup' : undefined}>
        {(q.type === 'choice' || q.type === 'tf-set') && q.choices?.map((c, i) => choiceBtn(i, c))}
        {q.type === 'ox' && (
          <div className="flex gap-3">
            {['O', 'X'].map((v) => {
              const picked = value === v, correct = reveal && q.answer === v, wrong = reveal && picked && q.answer !== v
              return (
                <button key={v} type="button" role="radio" aria-checked={picked} disabled={locked} onClick={() => onChange(v)}
                  className={`no-tap h-16 flex-1 rounded-2xl border-2 text-[28px] font-extrabold transition ${correct ? 'border-[#00a865] bg-[#00dc84]/10' : wrong ? 'border-coriolis bg-coriolis/[.06]' : picked ? 'border-brand bg-brand/[.06] text-brand' : 'border-ink/12 bg-white'}`}>{v}</button>
              )
            })}
          </div>
        )}
        {q.type === 'short' && (
          <input type="text" value={String(value ?? '')} disabled={locked} onChange={(e) => onChange(e.target.value)} placeholder="답을 입력하세요"
            className="h-12 rounded-xl border-2 border-ink/15 bg-white px-3.5 text-[17px] outline-none focus:border-brand disabled:bg-ink/4" />
        )}
        {q.type === 'essay' && (
          <textarea value={String(value ?? '')} disabled={locked} onChange={(e) => onChange(e.target.value)} rows={4} placeholder="답안을 서술하세요"
            className="rounded-xl border-2 border-ink/15 bg-white px-3.5 py-2.5 text-[16px] leading-relaxed outline-none focus:border-brand disabled:bg-ink/4" />
        )}
      </div>

      {reveal && (
        <div className="rise mt-4 flex flex-col gap-2.5 rounded-xl bg-[#f5f8fc] p-4 text-[15.5px] leading-relaxed">
          {q.type !== 'essay' && <p><span className="font-extrabold text-[#00875a]">정답</span> {formatCorrect(q)}</p>}
          {q.type === 'essay' && (
            <>
              <p><span className="font-extrabold text-[#00875a]">모범답안</span> {q.modelAnswer}</p>
              {q.rubric && (
                <div>
                  <p className="mb-1 font-extrabold">핵심 채점 요소 <span className="text-[13px] font-semibold text-ink/50">(내 답안에 포함된 요소를 직접 체크하세요. 자동 채점하지 않습니다)</span></p>
                  {q.rubric.map((r, i) => (
                    <label key={i} className="flex min-h-10 cursor-pointer items-center gap-2.5">
                      <input type="checkbox" className="h-5 w-5 accent-[#00a865]" checked={!!selfCheck?.[i]} onChange={(e) => onSelfCheck?.(i, e.target.checked)} disabled={!onSelfCheck} />{r}
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
          <p><span className="font-extrabold">풀이</span> <InlineText text={q.explanation} /></p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-extrabold">적용 개념</span>
            {q.conceptIds.map((cid) => {
              const c = conceptById(cid)
              if (!c) return null
              return (
                <a key={cid} href={href({ name: 'unit', unitId: c.unitId, focus: c.blockId, concept: c.id, back: href(backRoute) })}
                  className="inline-flex min-h-9 items-center rounded-full border border-brand/40 bg-white px-3 text-[14px] font-bold text-brand hover:bg-brand/5">
                  {c.title} · 원문으로 →
                </a>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}
