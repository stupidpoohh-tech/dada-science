/** 전체 학습 진행률 */
export function OverallProgress({ done, total, onReset }: { done: number; total: number; onReset: () => void }) {
  const pct = Math.round((done / total) * 100)
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-white px-4 py-3 sm:w-auto sm:min-w-80">
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[14px] font-bold text-ink/70">학습 진행률</span>
          <span className="text-[15px] font-extrabold text-ink">{done} / {total} 완료</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink/8" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-[#00dc84] to-[#00b7ff] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {done > 0 && (
        <button type="button" onClick={() => { if (confirm('학습 기록을 모두 지울까요?')) onReset() }}
          className="shrink-0 text-[13px] font-semibold text-ink/45 underline-offset-2 hover:text-ink hover:underline">
          초기화
        </button>
      )}
    </div>
  )
}

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
