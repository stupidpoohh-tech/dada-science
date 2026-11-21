import { setSheetMode, useSheetMode, type SheetMode } from '../../lib/sheetMode'

const MODES: { key: SheetMode; label: string }[] = [
  { key: 'text', label: '교재' },
  { key: 'blank', label: '빈칸' },
  { key: 'key', label: '핵심' },
]

/** 학습지 보기 전환(교재 · 빈칸 · 핵심) */
export default function ModeToggle() {
  const mode = useSheetMode()
  return (
    <div className="flex shrink-0 rounded-full bg-ink/6 p-0.5" role="tablist" aria-label="학습지 보기">
      {MODES.map((m) => (
        <button key={m.key} type="button" role="tab" aria-selected={mode === m.key} onClick={() => setSheetMode(m.key)}
          className={`no-tap h-8 rounded-full px-3 text-[13px] font-bold transition ${mode === m.key ? 'bg-ink text-white shadow-sm' : 'text-ink/55'}`}>
          {m.label}
        </button>
      ))}
    </div>
  )
}
