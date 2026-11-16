export default function StepControls({ step, total, onPrev, onNext, onReplay, nextLabel, hideReplay }: {
  step: number; total: number; onPrev: () => void; onNext: () => void; onReplay: () => void
  nextLabel?: string; hideReplay?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onPrev} disabled={step === 0}
        className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-4 text-[16px] font-bold text-ink transition hover:border-ink/40 active:scale-95 disabled:opacity-35">
        ← 이전
      </button>
      {!hideReplay && (
        <button type="button" onClick={onReplay} title="이 단계를 처음부터 다시 봅니다"
          className="no-tap h-12 rounded-xl border border-ink/15 bg-white px-4 text-[16px] font-bold text-ink/80 transition hover:border-ink/40 active:scale-95">
          ↺ 다시 보기
        </button>
      )}
      <button type="button" onClick={onNext} disabled={step >= total - 1 && !nextLabel}
        className="no-tap h-12 flex-1 rounded-xl bg-ink px-5 text-[16px] font-bold text-white transition hover:bg-[#13202e] active:scale-[.98] disabled:opacity-35 sm:flex-none sm:min-w-40">
        {nextLabel ?? '다음 →'}
      </button>
    </div>
  )
}
