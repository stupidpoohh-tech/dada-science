import type { Block } from '../../lib/manuscript'
import { FIGURES } from '../../figures'
import { THUMB_BY_POPUP } from '../../scenes/thumbs'
import { openPopup } from '../../lib/popupState'
import { useProgress } from '../../lib/store'
import { InlineText } from './Inline'

type Fig = Extract<Block, { kind: 'figure' }>

/** 원문 그림. 팝업이 연결된 그림은 눌러서 움직이는 설명을 엽니다. */
export default function InteractiveFigure({ b }: { b: Fig }) {
  const p = useProgress()
  const Static = b.fig ? FIGURES[b.fig] : undefined
  const Thumb = b.thumb ? THUMB_BY_POPUP[b.thumb] : undefined
  const done = b.popup ? p.popups[b.popup]?.done : false
  const art = b.src ? <img src={b.src} alt={b.alt ?? b.caption} className="mx-auto block max-h-[340px] w-auto" />
    : Static ? <svg viewBox="0 0 320 200" className="block h-auto w-full" role="img" aria-label={b.caption}><Static /></svg>
    : Thumb ? <svg viewBox="0 0 320 180" className="block h-auto w-full" role="img" aria-label={b.caption}><Thumb /></svg>
    : <div className="flex h-32 items-center justify-center text-[14px] text-ink/45">그림 입력 대기</div>

  return (
    <figure className="mx-auto my-1 w-full" style={{ maxWidth: b.width ?? 460 }}>
      {b.popup ? (
        <button type="button" onClick={() => openPopup(b.popup!, b.popupStep)} data-popup-trigger={b.popup}
          className="no-tap group relative block w-full overflow-hidden rounded-xl border border-ink/10 bg-white text-left transition hover:border-brand/50 hover:shadow-[0_8px_24px_-16px_rgba(40,112,255,.6)]"
          aria-label={`${b.caption} — 움직이는 그림으로 보기`}>
          {art}
          <span className={`absolute bottom-2 right-2 inline-flex h-8 items-center gap-1 rounded-full px-2 text-[12px] font-bold shadow-md ring-2 ring-white ${done ? 'bg-[#00a865] text-white' : 'bg-brand text-white'}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 2v8l7-4z" fill="currentColor" /></svg>
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 group-hover:max-w-40">{done ? '학습 완료 · 다시 보기' : '움직이는 그림 보기'}</span>
            {done && <span aria-hidden>✓</span>}
          </span>
        </button>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">{art}</div>
      )}
      {b.caption && <figcaption className="mt-1.5 text-center text-[14px] leading-snug text-ink/70"><InlineText text={b.caption} /></figcaption>}
    </figure>
  )
}
