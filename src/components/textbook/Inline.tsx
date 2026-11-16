import { Fragment, type ReactNode } from 'react'
import { parseInline, parseTarget, type Inline } from '../../lib/manuscript'
import { openPopup } from '../../lib/popupState'
import { popupById } from '../../lib/content'
import { useProgress } from '../../lib/store'

/** 원문 인라인 문법 렌더러 */
export function InlineText({ text }: { text: string }) {
  return <>{render(parseInline(text))}</>
}

function render(nodes: Inline[]): ReactNode {
  return nodes.map((n, i) => {
    switch (n.t) {
      case 'text': return <Fragment key={i}>{n.v}</Fragment>
      case 'b': return <strong key={i} className="font-extrabold">{render(n.v)}</strong>
      case 'i': return <em key={i}>{render(n.v)}</em>
      case 'u': return <span key={i} className="underline decoration-ink/40 decoration-2 underline-offset-4">{render(n.v)}</span>
      case 'term': return <span key={i} className="term">{render(n.v)}</span>
      case 'red': return <span key={i} className="text-[#d6283c]">{render(n.v)}</span>
      case 'box': return <span key={i} className="mx-0.5 inline-block rounded-[5px] border-[1.5px] border-ink/70 px-1.5 leading-snug">{render(n.v)}</span>
      case 'sup': return <sup key={i}>{n.v}</sup>
      case 'sub': return <sub key={i}>{n.v}</sub>
      case 'link': return <LinkNode key={i} label={n.label} target={n.target} />
    }
  })
}

function LinkNode({ label, target }: { label: string; target: string }) {
  const t = parseTarget(target)
  if (t.popup) return <PopupChip id={t.popup} step={t.step} label={label} />
  if (t.anchor) {
    return (
      <a href={`#${t.anchor}`} className="font-semibold text-brand underline underline-offset-4"
        onClick={(e) => { e.preventDefault(); document.getElementById(t.anchor!)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>{label}</a>
    )
  }
  return <>{label}</>
}

/** 움직이는 그림을 여는 표시(재생 아이콘 + 완료 표시) */
export function PopupChip({ id, step, label }: { id: string; step?: number; label?: string }) {
  const p = useProgress()
  const def = popupById(id)
  if (!def) return <span className="text-coriolis">[팝업 없음: {id}]</span>
  const done = p.popups[id]?.done
  return (
    <button type="button" onClick={() => openPopup(id, step)} data-popup-trigger={id}
      className={`no-tap mx-0.5 my-0.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 align-baseline text-[0.86em] font-bold leading-snug transition hover:-translate-y-px ${done ? 'border-[#00a865]/40 bg-[#00dc84]/10 text-[#00754e]' : 'border-brand/35 bg-brand/[.06] text-brand'}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><circle cx="6" cy="6" r="6" fill="currentColor" /><path d="M4.6 3.6v4.8L8.6 6z" fill="white" /></svg>
      {label ?? def.title}
      {done && <span aria-label="학습 완료">✓</span>}
    </button>
  )
}
