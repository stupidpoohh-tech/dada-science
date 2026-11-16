import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getStroke } from 'perfect-freehand'
import { annotations, getTools, newId, useScopeStrokes, useTools, type Stroke } from '../../lib/annotations'

/**
 * 필기 레이어(AnnotationLayer).
 * - 획은 화면 좌표가 아니라 '본문 블록(data-block-id) 기준 좌표'로 저장 → 스크롤·확대·레이아웃 변화에도 블록과 함께 이동
 * - 입력 규칙: 필기 도구가 켜져 있을 때 Apple Pencil(pen)·마우스는 필기, 손가락(touch)은 스크롤·버튼 조작
 *   ('손가락 필기'를 켜거나 팝업 그림 필기 모드에서는 손가락도 필기)
 * - 필기 획이 시작된 포인터의 click은 막아서 그림 위에 동그라미를 그려도 팝업이 열리지 않음
 */

interface Box { x: number; y: number; w: number; h: number }
interface Props {
  scopeId: string
  children: ReactNode
  className?: string
  /** 표면 전체를 하나의 블록으로 다룸(팝업 그림) */
  single?: string
  /** false면 필기 입력을 받지 않음(표시만) */
  enabled?: boolean
  /** 손가락 입력도 필기로 받음 */
  captureTouch?: boolean
}

const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document))
const LASER_MS = 1300
const ERASE_R = 12

function outline(pts: number[], size: number, pressure: boolean): string {
  const input: number[][] = []
  for (let i = 0; i < pts.length; i += 3) input.push([pts[i], pts[i + 1], pts[i + 2]])
  const o = getStroke(input, { size, thinning: pressure ? 0.55 : 0.35, smoothing: 0.55, streamline: 0.45, simulatePressure: !pressure, last: true })
  if (!o.length) return ''
  let d = `M${o[0][0].toFixed(1)} ${o[0][1].toFixed(1)}`
  for (let i = 1; i < o.length; i++) {
    const [x0, y0] = o[i - 1], [x1, y1] = o[i]
    d += ` Q${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`
  }
  return d + ' Z'
}
function polyline(pts: number[]): string {
  if (pts.length < 3) return ''
  let d = `M${pts[0].toFixed(1)} ${pts[1].toFixed(1)}`
  for (let i = 3; i < pts.length; i += 3) {
    const mx = (pts[i - 3] + pts[i]) / 2, my = (pts[i - 2] + pts[i + 1]) / 2
    d += ` Q${pts[i - 3].toFixed(1)} ${pts[i - 2].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`
  }
  if (pts.length === 3) d += ` L${(pts[0] + 0.1).toFixed(1)} ${pts[1].toFixed(1)}`
  return d
}
const hasRealPressure = (pts: number[]) => { for (let i = 2; i < pts.length; i += 3) if (Math.abs(pts[i] - 0.5) > 0.02) return true; return false }

export default function AnnotationSurface({ scopeId, children, className = '', single, enabled = true, captureTouch = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<SVGPathElement>(null)
  const laserRef = useRef<SVGPathElement>(null)
  const tools = useTools()
  const { strokes } = useScopeStrokes(scopeId)
  const [boxes, setBoxes] = useState<Map<string, Box>>(new Map())
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [penSeen, setPenSeen] = useState(false)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  // ── 블록 위치 측정(논리 px: 확대·축소 배율을 나눔) ──
  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const rr = root.getBoundingClientRect()
    const scale = root.offsetWidth ? rr.width / root.offsetWidth : 1
    const m = new Map<string, Box>()
    if (single) m.set(single, { x: 0, y: 0, w: root.offsetWidth, h: root.offsetHeight })
    else root.querySelectorAll<HTMLElement>('[data-block-id]').forEach((el) => {
      const r = el.getBoundingClientRect()
      m.set(el.dataset.blockId!, { x: (r.left - rr.left) / scale, y: (r.top - rr.top) / scale, w: r.width / scale, h: r.height / scale })
    })
    setBoxes((prev) => {
      if (prev.size === m.size) {
        let same = true
        for (const [k, b] of m) { const p = prev.get(k); if (!p || Math.abs(p.x - b.x) > 0.5 || Math.abs(p.y - b.y) > 0.5 || Math.abs(p.w - b.w) > 0.5 || Math.abs(p.h - b.h) > 0.5) { same = false; break } }
        if (same) return prev
      }
      return m
    })
  }, [single])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    measure()
    let raf = 0
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    const ro = new ResizeObserver(schedule)
    ro.observe(root)
    root.querySelectorAll('[data-block-id]').forEach((el) => ro.observe(el))
    window.addEventListener('resize', schedule)
    document.fonts?.ready.then(schedule)
    return () => { ro.disconnect(); window.removeEventListener('resize', schedule); cancelAnimationFrame(raf) }
  }, [measure, children])

  // ── 저장된 획 → 화면 경로 ──
  const rendered = useMemo(() => {
    const out: { id: string; tool: Stroke['tool']; color: string; d: string; pts: number[]; width: number }[] = []
    for (const s of strokes) {
      if (hidden.has(s.id)) continue
      const b = boxes.get(s.blockId)
      if (!b) continue
      const sx = s.bw ? b.w / s.bw : 1, sy = s.bh ? b.h / s.bh : 1
      const pts: number[] = []
      for (let i = 0; i < s.pts.length; i += 3) pts.push(b.x + s.pts[i] * sx, b.y + s.pts[i + 1] * sy, s.pts[i + 2])
      const d = s.tool === 'pen' ? outline(pts, s.size, hasRealPressure(s.pts)) : polyline(pts)
      out.push({ id: s.id, tool: s.tool, color: s.color, d, pts, width: s.size })
    }
    return out
  }, [strokes, boxes, hidden])
  const renderedRef = useRef(rendered)
  renderedRef.current = rendered
  const boxesRef = useRef(boxes)
  boxesRef.current = boxes

  // ── 입력 처리 ──
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let drawing: { pid: number; tool: string; pts: number[]; pen: boolean; erased: Set<string> } | null = null
    let suppressUntil = 0
    let laser: { x: number; y: number; t: number }[] = []
    let laserRaf = 0

    const local = (e: PointerEvent) => {
      const rr = root.getBoundingClientRect()
      const scale = root.offsetWidth ? rr.width / root.offsetWidth : 1
      return [(e.clientX - rr.left) / scale, (e.clientY - rr.top) / scale]
    }
    const wants = (e: PointerEvent) => {
      const t = getTools()
      if (!enabledRef.current || t.tool === 'none' || !t.visible) return false
      if (e.pointerType === 'pen') return true
      if (e.pointerType === 'mouse') return e.button === 0
      return e.pointerType === 'touch' && (t.fingerDraw || captureTouch)
    }
    const drawLaser = () => {
      const now = performance.now()
      laser = laser.filter((p) => now - p.t < LASER_MS)
      const el = laserRef.current
      if (el) el.setAttribute('d', laser.length > 1 ? laser.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '')
      if (laser.length || drawing?.tool === 'laser') laserRaf = requestAnimationFrame(drawLaser)
      else laserRaf = 0
    }
    const eraseAt = (x: number, y: number) => {
      if (!drawing) return
      for (const r of renderedRef.current) {
        if (drawing.erased.has(r.id)) continue
        const rad = ERASE_R + (r.tool === 'highlighter' ? r.width / 2 : r.width)
        for (let i = 0; i < r.pts.length; i += 3) {
          if (Math.hypot(r.pts[i] - x, r.pts[i + 1] - y) < rad) { drawing.erased.add(r.id); setHidden((h) => new Set(h).add(r.id)); break }
        }
      }
    }
    const updateLive = () => {
      if (!drawing || !liveRef.current) return
      const t = getTools()
      if (drawing.tool === 'pen') {
        liveRef.current.setAttribute('d', outline(drawing.pts, t.penSize, drawing.pen))
        liveRef.current.setAttribute('fill', t.penColor); liveRef.current.setAttribute('stroke', 'none'); liveRef.current.setAttribute('opacity', '1')
      } else if (drawing.tool === 'highlighter') {
        liveRef.current.setAttribute('d', polyline(drawing.pts))
        liveRef.current.setAttribute('fill', 'none'); liveRef.current.setAttribute('stroke', t.hlColor)
        liveRef.current.setAttribute('stroke-width', String(t.hlSize)); liveRef.current.setAttribute('opacity', '0.4')
      }
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') setPenSeen(true)
      if (!wants(e) || drawing) return
      e.preventDefault()
      e.stopPropagation()
      try { root.setPointerCapture(e.pointerId) } catch { /* 무시 */ }
      const [x, y] = local(e)
      const tool = getTools().tool
      drawing = { pid: e.pointerId, tool, pts: [x, y, e.pressure || 0.5], pen: e.pointerType === 'pen', erased: new Set() }
      suppressUntil = Infinity
      if (tool === 'laser') { laser.push({ x, y, t: performance.now() }); if (!laserRaf) laserRaf = requestAnimationFrame(drawLaser) }
      if (tool === 'eraser') eraseAt(x, y)
      updateLive()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'pen' && !penSeen) setPenSeen(true)
      if (!drawing || e.pointerId !== drawing.pid) return
      e.preventDefault()
      const evs = (e.getCoalescedEvents?.() ?? []).length ? e.getCoalescedEvents() : [e]
      for (const ev of evs) {
        const [x, y] = local(ev)
        if (drawing.tool === 'laser') laser.push({ x, y, t: performance.now() })
        else if (drawing.tool === 'eraser') eraseAt(x, y)
        else drawing.pts.push(x, y, ev.pressure || 0.5)
      }
      updateLive()
    }
    const onUp = (e: PointerEvent) => {
      if (!drawing || e.pointerId !== drawing.pid) return
      const d = drawing
      drawing = null
      suppressUntil = performance.now() + 350
      liveRef.current?.setAttribute('d', '')
      if (d.tool === 'eraser') {
        if (d.erased.size) annotations.remove(scopeId, [...d.erased])
        setHidden(new Set())
        return
      }
      if (d.tool !== 'pen' && d.tool !== 'highlighter') return
      // 획이 시작된 위치의 블록에 연결(블록 사이 여백이면 가장 가까운 블록)
      const sx = d.pts[0], sy = d.pts[1]
      let best: [string, Box] | null = null, bestDist = Infinity
      for (const [id, b] of boxesRef.current) {
        const dx = sx < b.x ? b.x - sx : sx > b.x + b.w ? sx - b.x - b.w : 0
        const dy = sy < b.y ? b.y - sy : sy > b.y + b.h ? sy - b.y - b.h : 0
        const dist = Math.hypot(dx, dy)
        if (dist < bestDist) { bestDist = dist; best = [id, b] }
      }
      if (!best) return
      const [blockId, b] = best
      const t = getTools()
      const pts: number[] = []
      for (let i = 0; i < d.pts.length; i += 3) pts.push(+(d.pts[i] - b.x).toFixed(1), +(d.pts[i + 1] - b.y).toFixed(1), +d.pts[i + 2].toFixed(2))
      annotations.add(scopeId, [{
        id: newId(), blockId, tool: d.tool, color: d.tool === 'pen' ? t.penColor : t.hlColor, size: d.tool === 'pen' ? t.penSize : t.hlSize,
        pts, bw: +b.w.toFixed(1), bh: +b.h.toFixed(1), at: Date.now(),
      }])
    }
    const onClick = (e: MouseEvent) => {
      if (performance.now() < suppressUntil) { e.preventDefault(); e.stopPropagation() }
    }
    root.addEventListener('pointerdown', onDown, { capture: true })
    root.addEventListener('pointermove', onMove, { capture: true })
    root.addEventListener('pointerup', onUp, { capture: true })
    root.addEventListener('pointercancel', onUp, { capture: true })
    root.addEventListener('click', onClick, { capture: true })
    return () => {
      root.removeEventListener('pointerdown', onDown, { capture: true })
      root.removeEventListener('pointermove', onMove, { capture: true })
      root.removeEventListener('pointerup', onUp, { capture: true })
      root.removeEventListener('pointercancel', onUp, { capture: true })
      root.removeEventListener('click', onClick, { capture: true })
      cancelAnimationFrame(laserRaf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeId, captureTouch])

  const active = enabled && tools.tool !== 'none' && tools.visible

  // 비수동(passive: false) 터치 리스너는 스크롤을 늦추므로 필기 도구를 켠 동안에만 붙입니다.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return
    // iPadOS Safari: Apple Pencil 터치만 기본 동작(스크롤)을 막아 손가락 스크롤과 공존
    const onTouch = (e: TouchEvent) => {
      const t = getTools()
      if (!enabledRef.current || t.tool === 'none' || !t.visible) return
      if (t.fingerDraw || captureTouch) { e.preventDefault(); return }
      for (const touch of Array.from(e.changedTouches)) {
        if ((touch as Touch & { touchType?: string }).touchType === 'stylus') { e.preventDefault(); return }
      }
    }
    root.addEventListener('touchstart', onTouch, { passive: false })
    root.addEventListener('touchmove', onTouch, { passive: false })
    return () => { root.removeEventListener('touchstart', onTouch); root.removeEventListener('touchmove', onTouch) }
  }, [active, captureTouch])
  // 손가락 필기 / 그림 필기 모드: 터치 스크롤을 끔. 비 iOS 기기에서 펜을 쓰면 펜 스크롤을 막기 위해 끔.
  const touchAction = active && (tools.fingerDraw || captureTouch || (penSeen && !isIOS)) ? 'none' : undefined
  const hlByColor = new Map<string, typeof rendered>()
  for (const r of rendered) if (r.tool === 'highlighter') { const a = hlByColor.get(r.color) ?? []; a.push(r); hlByColor.set(r.color, a) }

  return (
    <div ref={rootRef} className={`relative ${className}`} data-annotation-scope={scopeId}
      style={{ touchAction, userSelect: active ? 'none' : undefined, WebkitUserSelect: active ? 'none' : undefined, cursor: active ? (tools.tool === 'eraser' ? 'cell' : 'crosshair') : undefined }}>
      {children}
      <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" aria-hidden>
        {tools.visible && (
          <>
            {/* 형광펜: 색마다 한 묶음으로 투명도를 적용 → 겹쳐 그려도 진해지지 않음 */}
            {[...hlByColor].map(([color, list]) => (
              <g key={color} opacity={0.38} style={{ mixBlendMode: 'multiply' }}>
                {list.map((r) => <path key={r.id} d={r.d} fill="none" stroke={color} strokeWidth={r.width} strokeLinecap="round" strokeLinejoin="round" />)}
              </g>
            ))}
            {rendered.filter((r) => r.tool === 'pen').map((r) => <path key={r.id} d={r.d} fill={r.color} />)}
          </>
        )}
        <path ref={liveRef} strokeLinecap="round" strokeLinejoin="round" style={{ mixBlendMode: 'multiply' }} />
        <path ref={laserRef} fill="none" stroke="#ff2d2d" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,45,45,.7))' }} />
      </svg>
    </div>
  )
}
