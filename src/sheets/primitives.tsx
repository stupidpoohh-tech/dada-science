import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { openPopup } from '../lib/popupState'
import { useProgress } from '../lib/store'
import { useSheetMode } from '../lib/sheetMode'

/**
 * 학습지(원본 노트) 재현용 SVG 부품.
 * 좌표는 학습지 본문 폭 752 기준. 글자는 SVG <text>라 선택·복사가 됩니다.
 */
export const INK = '#111418'
export const BLUE = '#1f5fd6'
export const RED = '#d92b3a'
export const GRAY = '#6b7280'
export const SHEET_W = 752

/** 대략적인 글자 폭(상자·밑줄 크기 계산용) */
export function textWidth(s: string, size: number) {
  let w = 0
  for (const ch of s) {
    if (/[가-힣ㄱ-ㅎㅏ-ㅣ一-龥]/.test(ch)) w += size * 0.9
    else if (ch === ' ') w += size * 0.3
    else if (/[A-Za-z0-9.,:;()\-~'"/%+=<>!?]/.test(ch)) w += size * 0.56
    else w += size * 0.95
  }
  return w
}

/**
 * 빈칸 표시: 글자 안의 {{…}} 부분은 '빈칸' 모드에서 가려지고, 누르면 보입니다. 교재 모드에서는 괄호만 빠집니다.
 */
const BLANK_RE = /\{\{(.+?)\}\}/g
export const stripBlank = (s: string) => s.replace(BLANK_RE, '$1')
function parseBlank(s: string): { text: string; blank: boolean }[] {
  const out: { text: string; blank: boolean }[] = []
  let last = 0
  for (const m of s.matchAll(BLANK_RE)) {
    if (m.index! > last) out.push({ text: s.slice(last, m.index), blank: false })
    out.push({ text: m[1], blank: true })
    last = m.index! + m[0].length
  }
  if (last < s.length) out.push({ text: s.slice(last), blank: false })
  return out
}

/** 글자(빈칸 포함). 빈칸 모드에서는 가린 부분의 글자를 투명하게 두어 배치가 그대로 유지됩니다. */
function SheetText({ textRef, x, y, raw, size, fill, weight, anchor }: { textRef: React.RefObject<SVGTextElement | null>; x: number; y: number; raw: string; size: number; fill: string; weight: number; anchor: Anchor }) {
  const mode = useSheetMode()
  const segs = parseBlank(raw)
  const hasBlank = segs.some((g) => g.blank)
  const blankMode = mode === 'blank' && hasBlank
  const [shown, setShown] = useState<Set<number>>(() => new Set())
  const [boxes, setBoxes] = useState<{ i: number; x: number; w: number }[]>([])
  useLayoutEffect(() => { setShown(new Set()) }, [mode])
  useLayoutEffect(() => {
    if (!blankMode) { setBoxes([]); return }
    const m = () => {
      const el = textRef.current
      if (!el) return
      try {
        const out: { i: number; x: number; w: number }[] = []
        let pos = 0
        segs.forEach((g, i) => {
          if (g.blank && g.text.length) out.push({ i, x: el.getStartPositionOfChar(pos).x, w: el.getSubStringLength(pos, g.text.length) })
          pos += g.text.length
        })
        setBoxes(out)
      } catch { /* 숨김 상태 등 */ }
    }
    m()
    document.fonts?.ready.then(m)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blankMode, raw, size, x, y, anchor])
  const toggle = (i: number) => setShown((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n })
  return (
    <>
      <text ref={textRef} x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor} dominantBaseline="alphabetic">
        {blankMode ? segs.map((g, i) => (
          <tspan key={i} fill={g.blank && !shown.has(i) ? 'transparent' : undefined}>{g.text}</tspan>
        )) : stripBlank(raw)}
      </text>
      {blankMode && boxes.map((b) => (
        <rect key={b.i} x={b.x - 2} y={y - size * 0.92} width={b.w + 4} height={size * 1.22} rx={3}
          className={`sheet-blank${shown.has(b.i) ? ' is-shown' : ''}`} role="button" aria-label={shown.has(b.i) ? '빈칸 다시 가리기' : '빈칸 보기'}
          onClick={(e) => { e.stopPropagation(); toggle(b.i) }} />
      ))}
    </>
  )
}

type Anchor = 'start' | 'middle' | 'end'
interface TxtProps {
  x: number; y: number; children: string; size?: number; color?: string; weight?: number; anchor?: Anchor
  /** 밑줄: line(실선), double(이중), wavy(물결) */
  u?: 'line' | 'double' | 'wavy'; uColor?: string
}
const left = (x: number, w: number, a: Anchor) => (a === 'start' ? x : a === 'middle' ? x - w / 2 : x - w)

/** 실제 그려진 글자 폭을 재서(글꼴 로딩 후 포함) 상자·밑줄 크기를 맞춤 */
function useMeasured(text: string, size: number) {
  const ref = useRef<SVGTextElement>(null)
  const [w, setW] = useState(() => textWidth(text, size))
  useLayoutEffect(() => {
    const m = () => { try { const v = ref.current?.getComputedTextLength(); if (v) setW(v) } catch { /* 숨김 상태 등 */ } }
    m()
    document.fonts?.ready.then(m)
  }, [text, size])
  return [ref, w] as const
}

export function Txt({ x, y, children, size = 14, color = INK, weight = 500, anchor = 'start', u, uColor }: TxtProps) {
  const [ref, w] = useMeasured(stripBlank(children), size)
  const x0 = left(x, w, anchor)
  const uy = y + size * 0.32
  const uc = uColor ?? color
  let under: ReactNode = null
  if (u === 'line') under = <line x1={x0} x2={x0 + w} y1={uy} y2={uy} stroke={uc} strokeWidth={1.3} />
  if (u === 'double') under = <g stroke={uc} strokeWidth={1.2}><line x1={x0} x2={x0 + w} y1={uy} y2={uy} /><line x1={x0} x2={x0 + w} y1={uy + 3} y2={uy + 3} /></g>
  if (u === 'wavy') {
    let d = `M${x0} ${uy + 1}`
    for (let xx = x0; xx < x0 + w; xx += 6) d += ` q1.5 -2.6 3 0 t3 0`
    under = <path d={d} fill="none" stroke={uc} strokeWidth={1.1} />
  }
  return (
    <>
      <SheetText textRef={ref} x={x} y={y} raw={children} size={size} fill={color} weight={weight} anchor={anchor} />
      {under}
    </>
  )
}

/** 네모 상자 안 글자 */
export function Boxed({ x, y, children, size = 14, color = INK, border, anchor = 'start', weight = 600, pad = 4 }: { x: number; y: number; children: string; size?: number; color?: string; border?: string; anchor?: Anchor; weight?: number; pad?: number }) {
  const [ref, w] = useMeasured(stripBlank(children), size)
  const x0 = left(x, w, anchor)
  return (
    <>
      <rect x={x0 - pad} y={y - size * 0.95} width={w + pad * 2} height={size * 1.32} fill="none" stroke={border ?? color} strokeWidth={1.4} />
      <SheetText textRef={ref} x={x0} y={y} raw={children} size={size} fill={color} weight={weight} anchor="start" />
    </>
  )
}

/** 동그라미 친 글자 */
export function Circled({ x, y, children, size = 14, color = INK, ring, weight = 600 }: { x: number; y: number; children: string; size?: number; color?: string; ring?: string; weight?: number }) {
  const [ref, w] = useMeasured(stripBlank(children), size)
  return (
    <>
      <ellipse cx={x} cy={y - size * 0.33} rx={w / 2 + 5} ry={size * 0.78} fill="none" stroke={ring ?? color} strokeWidth={1.3} />
      <SheetText textRef={ref} x={x} y={y} raw={children} size={size} fill={color} weight={weight} anchor="middle" />
    </>
  )
}

/** 직선 화살표 */
export function Arw({ x1, y1, x2, y2, color = INK, w = 1.5, head = 7, both }: { x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; head?: number; both?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const hd = (x: number, y: number, ang: number) => `${x},${y} ${x - head * Math.cos(ang - 0.42)},${y - head * Math.sin(ang - 0.42)} ${x - head * Math.cos(ang + 0.42)},${y - head * Math.sin(ang + 0.42)}`
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(a) * head * 0.6} y2={y2 - Math.sin(a) * head * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={hd(x2, y2, a)} fill={color} />
      {both && <polygon points={hd(x1, y1, a + Math.PI)} fill={color} />}
    </g>
  )
}

/** 곡선 화살표(이차 베지어) */
export function Curve({ x1, y1, cx, cy, x2, y2, color = INK, w = 1.4, head = 7 }: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; color?: string; w?: number; head?: number }) {
  const a = Math.atan2(y2 - cy, x2 - cx)
  const pts = `${x2},${y2} ${x2 - head * Math.cos(a - 0.42)},${y2 - head * Math.sin(a - 0.42)} ${x2 - head * Math.cos(a + 0.42)},${y2 - head * Math.sin(a + 0.42)}`
  return (
    <g>
      <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={pts} fill={color} />
    </g>
  )
}

/** 물결선(해수면) */
export function Wave({ x, y, w, a = 4, l = 22, color = INK, sw = 1.5 }: { x: number; y: number; w: number; a?: number; l?: number; color?: string; sw?: number }) {
  let d = `M${x} ${y}`
  for (let xx = 0; xx <= w; xx += 2) d += ` L${x + xx} ${(y - a * Math.sin((xx / l) * 2 * Math.PI)).toFixed(1)}`
  return <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
}

/** 구름 말풍선 테두리 */
export function Cloud({ x, y, w, h, color = INK }: { x: number; y: number; w: number; h: number; color?: string }) {
  const n = Math.max(3, Math.round(w / 16))
  let d = `M${x} ${y + h}`
  for (let i = 0; i < n; i++) d += ` q${w / n / 2} 6 ${w / n} 0`
  d += ` q8 ${-h / 2} 0 ${-h}`
  for (let i = 0; i < n; i++) d += ` q${-w / n / 2} -6 ${-w / n} 0`
  d += ` q-8 ${h / 2} 0 ${h}`
  return <path d={d} fill="none" stroke={color} strokeWidth={1.2} />
}

/**
 * 움직이는 그림 연결 영역. 평소에는 학습지 그림 그대로 보이고, 오른쪽 위에 작은 재생 표시만 붙습니다.
 */
export function Hot({ x, y, w, h, popup, step, label, children, marker }: { x: number; y: number; w: number; h: number; popup: string; step?: number; label: string; children?: ReactNode; marker?: [number, number] }) {
  const p = useProgress()
  const done = p.popups[popup]?.done
  const open = () => openPopup(popup, step)
  return (
    <g role="button" tabIndex={0} aria-label={`${label} — 움직이는 그림 열기`} data-popup-trigger={popup} className="sheet-hot"
      onClick={open} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={6} className="sheet-hot-bg" />
      {children}
      <g transform={`translate(${marker ? marker[0] : x + w - 8} ${marker ? marker[1] : y + 8})`}>
        <circle r={7.5} fill={done ? '#16a34a' : BLUE} />
        {done ? <path d="M-3.4 0 L-1 2.6 L3.6 -2.6" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" /> : <path d="M-2.4 -3.6 L3.8 0 L-2.4 3.6 Z" fill="white" />}
      </g>
    </g>
  )
}

/** 학습지 한 줄(가로 영역). 필기 연결 단위(data-block-id)이기도 합니다. */
export function Row({ id, h, children, label }: { id: string; h: number; children: ReactNode; label?: string }) {
  return (
    <svg id={id} data-block-id={id} viewBox={`0 0 ${SHEET_W} ${h}`} className="sheet-row block w-full overflow-visible" role="group" aria-label={label}>
      {children}
    </svg>
  )
}
