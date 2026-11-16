/** 학습 화면 상단 단계 표시 */
export function StepDots({ step, total, onJump }: { step: number; total: number; onJump: (i: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <button key={i} type="button" onClick={() => onJump(i)} aria-label={i === total - 1 ? '확인 문제' : `${i + 1}단계`}
          className={`no-tap h-2.5 rounded-full transition-all ${i === step ? 'w-7 bg-brand' : i < step ? 'w-2.5 bg-brand/45' : 'w-2.5 bg-ink/15'} ${i === total - 1 ? 'ring-2 ring-offset-1 ring-transparent' : ''}`}>
        </button>
      ))}
    </div>
  )
}
