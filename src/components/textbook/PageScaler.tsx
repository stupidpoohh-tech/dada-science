import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * 교재 판형 고정: 본문을 고정 폭(720 논리 px)으로 배치한 뒤 화면 폭에 맞게 확대·축소합니다.
 * → 화면 크기가 달라져도 줄바꿈이 바뀌지 않아 필기 위치가 본문과 정확히 맞습니다.
 * 폭이 매우 좁은 휴대폰(600px 미만)에서는 읽기 편하도록 줄바꿈을 다시 하며, 이때 필기는 블록 비율로 맞춰 표시됩니다.
 */
export const PAGE_WIDTH = 720
const MIN_FIXED = 600
const MAX_SCALE = 1.18

export default function PageScaler({ children }: { children: (reflow: boolean) => ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current
    if (!o || !i) return
    const ro = new ResizeObserver(() => { setW(o.clientWidth); setH(i.offsetHeight) })
    ro.observe(o); ro.observe(i)
    setW(o.clientWidth); setH(i.offsetHeight)
    return () => ro.disconnect()
  }, [])
  const reflow = w > 0 && w < MIN_FIXED
  const scale = reflow || !w ? 1 : Math.min(MAX_SCALE, w / PAGE_WIDTH)
  return (
    <div ref={outer} className="w-full" style={{ height: reflow ? undefined : h * scale || undefined }}>
      <div ref={inner} className={reflow ? 'reflow' : ''}
        style={reflow ? undefined : { width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {children(reflow)}
      </div>
    </div>
  )
}
