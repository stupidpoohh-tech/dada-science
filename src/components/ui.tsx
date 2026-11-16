import type { ReactNode } from 'react'

/** 그림 위 조작 버튼 */
export function SceneButton({ onClick, children, active, disabled, tone = 'brand', pulse, title }: {
  onClick: () => void; children: ReactNode; active?: boolean; disabled?: boolean
  tone?: 'brand' | 'ink' | 'mint'; pulse?: boolean; title?: string
}) {
  const tones = {
    brand: active ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand/40 hover:border-brand',
    ink: active ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-ink/25 hover:border-ink/60',
    mint: active ? 'bg-[#00a865] text-white border-[#00a865]' : 'bg-white text-[#00875a] border-[#00a865]/40 hover:border-[#00a865]',
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`no-tap relative min-h-10 rounded-full border-2 px-4 py-1.5 text-[15px] font-bold shadow-sm transition active:scale-95 disabled:opacity-40 ${tones[tone]}`}>
      {pulse && !active && <span className="absolute inset-0 -z-0 animate-ping rounded-full border-2 border-brand/50" />}
      <span className="relative">{children}</span>
    </button>
  )
}

/** 2~4개 중 하나를 고르는 토글 */
export function Toggle<T extends string>({ value, options, onChange, label }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label?: string
}) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label={label}>
      {label && <span className="text-sm font-semibold text-ink/60">{label}</span>}
      <div className="flex rounded-full border border-ink/15 bg-white p-1 shadow-sm">
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
            className={`no-tap min-h-9 rounded-full px-3.5 text-[15px] font-bold transition ${value === o.value ? 'bg-ink text-white' : 'text-ink/70 hover:text-ink'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** 이상화 모형·과장 표현 주석 */
export function ModelNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 text-[13px] leading-snug text-ink/60">
      <span className="mt-[1px] inline-flex h-4 shrink-0 items-center rounded bg-ink/8 px-1 text-[11px] font-bold text-ink/70">주석</span>
      <span>{children}</span>
    </p>
  )
}

/** 화살표 색 범례 */
export function Legend({ items }: { items: { color: string; label: string; dashed?: boolean; thick?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/75">
          <svg width="26" height="12" aria-hidden>
            <line x1="1" y1="6" x2="17" y2="6" stroke={it.color} strokeWidth={it.thick ? 5 : 3} strokeDasharray={it.dashed ? '4 3' : undefined} strokeLinecap="round" />
            <polygon points="25,6 16,1 16,11" fill={it.color} />
          </svg>
          {it.label}
        </span>
      ))}
    </div>
  )
}

/** 장면 하단 조작부 레이아웃 */
export function SceneBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 px-3 pb-3 pt-1 sm:px-4">{children}</div>
}
