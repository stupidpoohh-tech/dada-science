import type { CSSProperties, ReactNode } from 'react'

/**
 * 인터랙티브 그림 영역의 공통 틀.
 * 위: SVG 그림(가로 비율 유지, 데스크톱에서는 남은 높이를 채움)
 * 아래: 조작 버튼·범례·주석
 */
export function SceneFrame({ viewBox = '0 0 800 480', svg, controls, legend, note, below, label }: {
  viewBox?: string
  svg: ReactNode
  controls?: ReactNode
  legend?: ReactNode
  note?: ReactNode
  below?: ReactNode
  label: string
}) {
  const [, , w, h] = viewBox.split(' ').map(Number)
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative w-full min-h-0 lg:flex-1">
        <div className="aspect-(--ar) lg:absolute lg:inset-0 lg:aspect-auto" style={{ '--ar': `${w} / ${h}` } as CSSProperties}>
          <svg viewBox={viewBox} className="block h-full w-full select-none overflow-hidden" role="img" aria-label={label}
            preserveAspectRatio="xMidYMid meet">
            {svg}
          </svg>
        </div>
      </div>
      {below}
      {(controls || legend || note) && (
        <div className="flex flex-col gap-2 border-t border-ink/8 px-3 py-2.5 sm:px-4">
          {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
          {(legend || note) && (
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              {legend}
              {note && <div className="sm:max-w-[55%]">{note}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** 팝업북 펼친 면 느낌의 카드 */
export default function SceneViewer({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_0_rgba(0,10,20,.04),0_12px_32px_-18px_rgba(0,10,20,.25)] lg:flex-1">
      {children}
    </section>
  )
}
