import type { Block } from '../../lib/manuscript'
import { InlineText, PopupChip } from './Inline'
import InteractiveFigure from './InteractiveFigure'
import { SheetRow } from '../../sheets'

/** 원문 블록 하나. data-block-id는 필기 연결 기준이므로 바꾸지 마세요. */
export default function ConceptBlock({ b }: { b: Block }) {
  const common = { id: b.id, 'data-block-id': b.id } as const
  switch (b.kind) {
    case 'heading':
      return b.level === 3
        ? <h3 {...common} className="mt-7 text-[22px] font-extrabold">{<InlineText text={b.text} />}</h3>
        : <h4 {...common} className="mt-6 text-[19px] font-extrabold text-ink"><InlineText text={b.text} /></h4>
    case 'para':
      return <p {...common} className="text-[17px] leading-[1.85]"><InlineText text={b.text} /></p>
    case 'box':
      return (
        <div {...common} className="rounded-xl border-l-4 border-sky bg-[#eef9ff] px-4 py-3 text-[16.5px] leading-[1.8]">
          {b.label && <strong className="mr-2 font-extrabold text-[#0a7fb3]">[{b.label}]</strong>}<InlineText text={b.text} />
        </div>
      )
    case 'formula':
      return (
        <div {...common} className="flex flex-col items-center gap-1 py-1">
          <div className="rounded-lg border border-ink/15 bg-white px-5 py-2 text-[20px] font-bold tracking-wide"><InlineText text={b.text} /></div>
          {b.caption && <span className="text-[13px] text-ink/55">{b.caption}</span>}
        </div>
      )
    case 'list':
      return (
        <ul {...common} className="flex flex-col gap-1.5 text-[17px] leading-[1.75]">
          {b.items.map((it, i) => (
            <li key={i} id={it.id} className="flex gap-2.5" style={{ paddingLeft: it.depth * 22 }}>
              <span className={`mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full ${it.depth ? 'bg-ink/35' : 'bg-ink/70'}`} />
              <span className="min-w-0"><InlineText text={it.text} /></span>
            </li>
          ))}
        </ul>
      )
    case 'figure':
      return <div {...common}><InteractiveFigure b={b} /></div>
    case 'table':
      return (
        <figure {...common} className="overflow-x-auto">
          {b.caption && <figcaption className="mb-1.5 text-[14px] font-bold text-ink/70">{b.caption}</figcaption>}
          <table className="w-full border-collapse text-[15.5px] leading-snug">
            <thead><tr>{b.header.map((h, i) => <th key={i} className="border-y-2 border-ink/70 bg-[#f1f5fa] px-2.5 py-2 text-left font-extrabold"><InlineText text={h} /></th>)}</tr></thead>
            <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border-b border-ink/12 px-2.5 py-2 align-top"><InlineText text={c} /></td>)}</tr>)}</tbody>
          </table>
        </figure>
      )
    case 'popups':
      return (
        <div {...common} className="flex flex-wrap items-center gap-1.5 rounded-xl bg-brand/[.04] px-3 py-2 text-[15px]">
          <span className="mr-1 font-bold text-ink/60">움직이는 그림으로 보기</span>
          {b.popups.map((p) => <PopupChip key={p.id} id={p.id} step={p.step} />)}
        </div>
      )
    case 'placeholder':
      return <div {...common} className="rounded-xl border-2 border-dashed border-ink/20 px-4 py-6 text-center text-[15px] text-ink/55">원문 입력 대기 — <InlineText text={b.text} /></div>
    case 'demo':
      return <div {...common} className="rounded-xl bg-[#fff6db] px-4 py-2.5 text-[14px] font-semibold text-[#7a5b00]">데모 원문: <InlineText text={b.text} /></div>
    case 'sheet':
      return <SheetRow id={b.id} />
    case 'row':
      return (
        <div className="ms-row grid items-start gap-x-6 gap-y-3" style={{ gridTemplateColumns: (b.widths ?? b.cols.map(() => 1)).map((w) => `minmax(0,${w}fr)`).join(' ') }}>
          {b.cols.map((col, i) => <div key={i} className="flex min-w-0 flex-col gap-3">{col.map((c) => <ConceptBlock key={c.id} b={c} />)}</div>)}
        </div>
      )
  }
}
