import { useState } from 'react'
import type { Quiz } from '../data/types'

export default function ConceptQuiz({ quiz, keyPoints, done, onCorrect, onReview, onNextLesson, isLast }: {
  quiz: Quiz; keyPoints: string[]; done: boolean
  onCorrect: () => void; onReview: () => void; onNextLesson: () => void; isLast: boolean
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const chosen = picked !== null ? quiz.options[picked] : null
  const correct = !!chosen?.correct

  const pick = (i: number) => {
    if (picked !== null && correct) return
    setPicked(i)
    if (quiz.options[i].correct) onCorrect()
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-8 lg:p-10">
      <div className="min-w-0 flex-1">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet/10 px-3 py-1 text-[14px] font-bold text-violet">
          개념 확인 문제 {done && <span className="text-[#00a865]">· 완료</span>}
        </p>
        <h2 className="mb-5 text-[21px] font-extrabold leading-snug sm:text-[24px]">{quiz.question}</h2>
        <div className="flex flex-col gap-2.5" role="radiogroup">
          {quiz.options.map((o, i) => {
            const isPicked = picked === i
            const showRight = picked !== null && correct && o.correct
            const state = isPicked ? (o.correct ? 'right' : 'wrong') : showRight ? 'right' : 'idle'
            const cls = {
              idle: 'border-ink/12 bg-white hover:border-brand/60 hover:bg-brand/[.03]',
              right: 'border-[#00a865] bg-[#00dc84]/10',
              wrong: 'border-coriolis bg-coriolis/[.06]',
            }[state]
            return (
              <button key={i} type="button" role="radio" aria-checked={isPicked} onClick={() => pick(i)}
                disabled={picked !== null && correct && !isPicked}
                className={`no-tap flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[17px] font-semibold transition active:scale-[.99] disabled:cursor-default ${cls}`}>
                <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold ${state === 'right' ? 'bg-[#00a865] text-white' : state === 'wrong' ? 'bg-coriolis text-white' : 'bg-ink/6 text-ink/70'}`}>
                  {state === 'right' ? '✓' : state === 'wrong' ? '✕' : String.fromCharCode(65 + i)}
                </span>
                {o.text}
              </button>
            )
          })}
        </div>

        {chosen && (
          <div key={picked} className={`rise mt-4 rounded-xl p-4 ${correct ? 'bg-[#00dc84]/10' : 'bg-coriolis/[.07]'}`} aria-live="polite">
            <p className={`mb-1 text-[17px] font-extrabold ${correct ? 'text-[#00875a]' : 'text-coriolis'}`}>
              {correct ? '정답입니다' : '다시 생각해 볼까요?'}
            </p>
            <p className="text-[16px] leading-relaxed">{chosen.feedback}</p>
            {correct && (
              <p className="mt-3 rounded-lg bg-white px-3 py-2.5 text-[16px] font-bold leading-relaxed">
                <span className="mr-1.5 text-brand">핵심</span>{quiz.summary}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {correct ? (
                <button type="button" onClick={onNextLesson}
                  className="no-tap h-12 rounded-xl bg-ink px-5 text-[16px] font-bold text-white active:scale-95">
                  {isLast ? '목록으로 돌아가기' : '다음 개념 학습 →'}
                </button>
              ) : (
                <>
                  <button type="button" onClick={onReview}
                    className="no-tap h-12 rounded-xl bg-brand px-5 text-[16px] font-bold text-white active:scale-95">
                    ↺ 핵심 애니메이션 다시 보기
                  </button>
                  <button type="button" onClick={() => setPicked(null)}
                    className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-5 text-[16px] font-bold active:scale-95">
                    다시 풀기
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <aside className="shrink-0 rounded-xl bg-paper p-4 lg:w-72 lg:self-start">
        <p className="mb-2 text-[14px] font-bold text-ink/60">이 페이지의 핵심 개념</p>
        <ul className="flex flex-col gap-1.5">
          {keyPoints.map((k) => (
            <li key={k} className="flex gap-2 text-[15px] font-semibold leading-snug">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />{k}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
