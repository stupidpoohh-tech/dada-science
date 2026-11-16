import { useCallback, useEffect, useRef, useState } from 'react'
import { SCENES } from '../../scenes'
import { popupById } from '../../lib/content'
import { closePopup, usePopupState } from '../../lib/popupState'
import { recordPopupAnswer, useProgress } from '../../lib/store'
import { setTools, useActiveScope, useTools } from '../../lib/annotations'
import SceneViewer from '../SceneViewer'
import StepControls from '../StepControls'
import ConceptExplanation from '../ConceptExplanation'
import ConceptQuiz from '../ConceptQuiz'
import { StepDots } from '../ProgressTracker'
import AnnotationSurface from '../annotation/AnnotationSurface'

/** 개념 팝업: 원문 위에 열리는 단계별 움직이는 그림 + 개념 확인 */
export default function ConceptPopupHost() {
  const st = usePopupState()
  useEffect(() => {
    if (!st) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { html.style.overflow = prev }
  }, [st])
  if (!st) return null
  return <ConceptPopup key={`${st.id}-${st.step ?? 0}`} id={st.id} initialStep={st.step} initialMode={st.mode} />
}

function ConceptPopup({ id, initialStep, initialMode }: { id: string; initialStep?: number; initialMode?: string }) {
  const def = popupById(id)
  const progress = useProgress()
  const [step, setStep] = useState(Math.min(initialStep ?? 0, (def?.steps.length ?? 1) - 1))
  const [mode, setMode] = useState(initialMode ?? def?.defaultMode ?? '')
  const [replay, setReplay] = useState(0)
  const [drawMode, setDrawMode] = useState(false)
  const tools = useTools()
  const panel = useRef<HTMLDivElement>(null)
  const total = (def?.steps.length ?? 0) + 1
  const isQuiz = step === total - 1
  const go = useCallback((i: number) => setStep(Math.max(0, Math.min(total - 1, i))), [total])

  useActiveScope(`popup:${id}`, drawMode, { label: '이 그림', blockIds: () => [] })
  useEffect(() => { panel.current?.focus() }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopup()
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') go(step + 1)
      if (e.key === 'ArrowLeft') go(step - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, step])

  if (!def) return null
  const Scene = SCENES[def.scene ?? def.id]
  const sd = def.steps[Math.min(step, def.steps.length - 1)]
  const text = typeof sd.text === 'string' ? sd.text : sd.text[mode] ?? Object.values(sd.text)[0]
  const done = !!progress.popups[id]?.done

  const toggleDraw = () => {
    const next = !drawMode
    setDrawMode(next)
    if (next && (tools.tool === 'none' || tools.tool === 'laser')) setTools({ tool: 'pen' })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-ink/45 md:p-4 lg:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) closePopup() }}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={def.title}
        className="rise flex w-full max-w-[1240px] flex-col overflow-hidden bg-paper outline-none md:rounded-3xl md:shadow-2xl">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-ink/8 bg-white px-4 py-3">
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[13px] font-bold text-brand">움직이는 그림</span>
          <h2 className="order-last w-full text-[18px] font-extrabold sm:order-none sm:w-auto sm:flex-1 sm:truncate sm:text-[20px]">
            {def.title}{done && <span className="ml-2 align-middle text-[13px] font-bold text-[#00875a]">✓ 학습 완료</span>}
          </h2>
          <div className="ml-auto flex items-center gap-3 sm:ml-0">
            <StepDots step={step} total={total} onJump={go} />
            <span className="hidden text-[14px] font-extrabold tabular-nums text-ink/60 sm:inline">{isQuiz ? '개념 확인' : `${step + 1} / ${total - 1}`}</span>
            {!isQuiz && (
              <button type="button" onClick={toggleDraw} aria-pressed={drawMode}
                className={`no-tap h-10 rounded-full border px-3 text-[14px] font-bold ${drawMode ? 'border-brand bg-brand text-white' : 'border-ink/15 bg-white text-ink/75'}`}>
                {drawMode ? '그림 필기 중' : '그림에 필기'}
              </button>
            )}
            <button type="button" onClick={closePopup} aria-label="닫고 원문으로 돌아가기"
              className="no-tap flex h-10 items-center gap-1 rounded-full bg-ink px-4 text-[14px] font-bold text-white">닫기 ✕</button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:p-4">
          <SceneViewer>
            {isQuiz ? (
              <ConceptQuiz quiz={def.quiz} keyPoints={def.keyPoints} done={done}
                onAnswer={(c) => recordPopupAnswer(id, c)}
                onReview={() => { if (def.quiz.reviewMode) setMode(def.quiz.reviewMode); setStep(def.quiz.reviewStep); setReplay((r) => r + 1) }}
                onFinish={closePopup} finishLabel="원문으로 돌아가기" />
            ) : (
              <AnnotationSurface scopeId={`popup:${id}`} single="scene" enabled={drawMode} captureTouch className="flex min-h-0 flex-col lg:flex-1">
                <Scene key={replay} step={step} mode={mode} setMode={setMode} />
                {drawMode && <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-brand/90 px-3 py-1 text-center text-[13px] font-bold text-white">그림 필기 모드: 그림 조작이 잠시 멈춥니다. 다시 누르면 조작할 수 있습니다.</div>}
              </AnnotationSurface>
            )}
          </SceneViewer>
          {!isQuiz && (
            <footer className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:gap-6">
              <ConceptExplanation index={step} title={sd.title} text={text} />
              <StepControls step={step} total={total} onPrev={() => go(step - 1)} onNext={() => go(step + 1)}
                onReplay={() => setReplay((r) => r + 1)} nextLabel={step === total - 2 ? '개념 확인 →' : undefined} />
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
