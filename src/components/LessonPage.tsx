import { useCallback, useEffect, useState } from 'react'
import type { Lesson } from '../data/types'
import { SCENES } from '../scenes'
import SceneViewer from './SceneViewer'
import StepControls from './StepControls'
import ConceptExplanation from './ConceptExplanation'
import ConceptQuiz from './ConceptQuiz'
import { StepDots } from './ProgressTracker'

export default function LessonPage({ lesson, done, onDone, onBack, onNextLesson, isLast }: {
  lesson: Lesson; done: boolean; onDone: () => void; onBack: () => void; onNextLesson: () => void; isLast: boolean
}) {
  const total = lesson.steps.length + 1 // 마지막 = 확인 문제
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState(lesson.defaultMode ?? '')
  const [replay, setReplay] = useState(0)
  const Scene = SCENES[lesson.id]
  const isQuiz = step === total - 1

  const go = useCallback((i: number) => setStep(Math.max(0, Math.min(total - 1, i))), [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') go(step + 1)
      if (e.key === 'ArrowLeft') go(step - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, step])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [lesson.id])

  const def = lesson.steps[Math.min(step, lesson.steps.length - 1)]
  const text = typeof def.text === 'string' ? def.text : def.text[mode] ?? Object.values(def.text)[0]
  const num = String(lesson.id).padStart(2, '0')

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1280px] flex-col px-3 pb-3 sm:px-5 lg:h-dvh lg:min-h-0">
      {/* 상단 */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
        <button type="button" onClick={onBack}
          className="no-tap inline-flex h-10 items-center gap-1 rounded-full border border-ink/12 bg-white px-3.5 text-[15px] font-bold text-ink/80 hover:border-ink/40">
          ← 목록
        </button>
        <h1 className="order-last w-full min-w-0 text-[19px] font-extrabold leading-snug sm:order-none sm:w-auto sm:flex-1 sm:truncate sm:text-[22px]">
          <span className="mr-2 text-brand">{num}</span>{lesson.title}
        </h1>
        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          <StepDots step={step} total={total} onJump={go} />
          <span className="text-[15px] font-extrabold tabular-nums text-ink/70">
            {isQuiz ? '확인 문제' : `${step + 1} / ${total - 1}`}
          </span>
        </div>
      </header>

      {/* 중앙 그림 */}
      <SceneViewer>
        {isQuiz ? (
          <ConceptQuiz quiz={lesson.quiz} keyPoints={lesson.keyPoints} done={done} isLast={isLast}
            onCorrect={onDone}
            onReview={() => { if (lesson.quiz.reviewMode) setMode(lesson.quiz.reviewMode); setStep(lesson.quiz.reviewStep); setReplay((r) => r + 1) }}
            onNextLesson={onNextLesson} />
        ) : (
          <Scene key={replay} step={step} mode={mode} setMode={setMode} />
        )}
      </SceneViewer>

      {/* 하단 설명 + 조작 */}
      {!isQuiz && (
        <footer className="mt-3 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:gap-6">
          <ConceptExplanation index={step} title={def.title} text={text} />
          <StepControls step={step} total={total} onPrev={() => go(step - 1)} onNext={() => go(step + 1)}
            onReplay={() => setReplay((r) => r + 1)}
            nextLabel={step === total - 2 ? '확인 문제 →' : undefined} />
        </footer>
      )}
      {isQuiz && (
        <footer className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(step - 1)}
            className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-4 text-[16px] font-bold hover:border-ink/40">
            ← 그림으로 돌아가기
          </button>
          {done && (
            <span className="text-[15px] font-bold text-[#00875a]">✓ 학습 완료로 저장되었습니다</span>
          )}
        </footer>
      )}
    </div>
  )
}
