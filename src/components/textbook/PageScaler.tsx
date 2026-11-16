import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * A4 학습지 판형: 본문을 고정 폭(A4 너비 794 논리 px)으로 배치한 뒤 확대·축소합니다.
 * - 화면 크기가 달라도 배치와 줄바꿈이 원본과 같고, 필기 좌표도 어긋나지 않습니다.
 * - 기본은 화면 폭에 맞춤. 휴대폰처럼 좁은 화면에서는 확대 후 가로로 스크롤해 볼 수 있습니다.
 */
export const PAGE_WIDTH = 794
const KEY = 'moving-earth-science:zoom'
const STEPS = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.6, 1.8, 2]

export default function PageScaler({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  const [zoom, setZoom] = useState<number | 'fit'>(() => {
    try { const v = localStorage.getItem(KEY); return v && v !== 'fit' ? Number(v) : 'fit' } catch { return 'fit' }
  })
  useEffect(() => { try { localStorage.setItem(KEY, String(zoom)) } catch { /* 무시 */ } }, [zoom])
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current
    if (!o || !i) return
    const ro = new ResizeObserver(() => { setW(o.clientWidth); setH(i.offsetHeight) })
    ro.observe(o); ro.observe(i)
    setW(o.clientWidth); setH(i.offsetHeight)
    return () => ro.disconnect()
  }, [])
  // 소수점 오차로 가로 넘침이 생기지 않도록 내림
  const fit = w ? Math.min(1.3, Math.floor((w / PAGE_WIDTH) * 1000) / 1000) : 1
  const scale = zoom === 'fit' ? fit : zoom
  const cur = zoom === 'fit' ? fit : zoom
  const step = (dir: 1 | -1) => {
    const next = dir > 0 ? STEPS.find((s) => s > cur + 0.001) : [...STEPS].reverse().find((s) => s < cur - 0.001)
    if (next) setZoom(next)
  }
  return (
    <>
      {/* 화면 폭에 맞을 때는 가로 스크롤 영역을 만들지 않음: iOS에서 세로 스크롤이 안쪽 영역에 걸려 되돌아가는 현상 방지 */}
      <div ref={outer} className={`w-full ${PAGE_WIDTH * scale > w + 1 ? 'overflow-x-auto overscroll-x-contain' : 'overflow-x-clip'}`}>
        <div className="mx-auto" style={{ width: PAGE_WIDTH * scale, height: h * scale || undefined }}>
          <div ref={inner} style={{ width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {children}
          </div>
        </div>
      </div>
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-0.5 rounded-full border border-ink/12 bg-white px-1 py-1 text-[13px] font-bold shadow-sm" role="group" aria-label="학습지 크기">
        <button type="button" onClick={() => step(-1)} className="no-tap h-9 w-9 rounded-full hover:bg-ink/5" aria-label="축소">−</button>
        <span className="w-12 text-center tabular-nums text-ink/70">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => step(1)} className="no-tap h-9 w-9 rounded-full hover:bg-ink/5" aria-label="확대">＋</button>
        <button type="button" onClick={() => setZoom('fit')} className={`no-tap h-9 rounded-full px-2.5 ${zoom === 'fit' ? 'text-brand' : 'text-ink/60 hover:bg-ink/5'}`}>맞춤</button>
      </div>
    </>
  )
}
