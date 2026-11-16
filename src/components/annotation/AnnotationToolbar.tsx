import { useRef, useState, type ReactNode } from 'react'
import { annotations, HL_COLORS, HL_SIZES, PEN_COLORS, PEN_SIZES, setTools, useScopeStrokes, useTools, type Tool } from '../../lib/annotations'
import { ANNOTATION_FORMAT } from '../../lib/annotationDB'
import { askConfirm, notify } from '../../lib/dialog'
import { usePopupState } from '../../lib/popupState'

/** 필기 도구 모음(화면 오른쪽, 위아래로 옮기기·접기 가능) */
const Icon = ({ d, children }: { d?: string; children?: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d ? <path d={d} /> : children}
  </svg>
)
const ICONS: Record<Tool, ReactNode> = {
  none: <Icon d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-1.5v-2a1.5 1.5 0 0 1 3 0V12m0-1v-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7l-2.3-3.6a1.5 1.5 0 0 1 2.5-1.6L8 15" />,
  pen: <Icon d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1zM14.5 6.5l3 3" />,
  highlighter: <Icon d="M9 11l-5 5v4h4l5-5M9 11l6-6 4 4-6 6M9 11l4 4M14 20h6" />,
  laser: <Icon><circle cx="12" cy="12" r="3" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></Icon>,
  eraser: <Icon d="M7 21h10M5.5 14.5l7-7a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L11 19H8l-2.5-2.5a1.4 1.4 0 0 1 0-2z" />,
}
const NAMES: Record<Tool, string> = { none: '탐색(필기 끄기)', pen: '펜', highlighter: '형광펜', laser: '레이저 포인터', eraser: '지우개' }

function Btn({ label, active, onClick, children, disabled }: { label: string; active?: boolean; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={active} onClick={onClick} disabled={disabled}
      className={`no-tap flex h-11 w-11 items-center justify-center rounded-xl transition disabled:opacity-30 ${active ? 'bg-brand text-white' : 'text-ink/75 hover:bg-ink/6'}`}>
      {children}
    </button>
  )
}

export default function AnnotationToolbar() {
  const t = useTools()
  const scope = t.activeScope
  const { canUndo, canRedo, saving } = useScopeStrokes(scope || '_none')
  const [menu, setMenu] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{ y0: number; b0: number } | null>(null)
  const popup = usePopupState()
  if (!scope) return null
  // 팝업이 열려 있을 때는 '그림에 필기'를 켠 경우에만 도구 표시(팝업 조작과 충돌 방지)
  if (popup && !scope.startsWith('popup:')) return null

  const choose = (tool: Tool) => setTools({ tool, collapsed: false })
  const top = `calc(${Math.round(t.barY * 100)}vh)`

  const clearRegion = async () => {
    setMenu(false)
    const region = getRegion()
    const ok = await askConfirm({ title: `${region.label}의 필기를 모두 지울까요?`, message: '실행 취소로 되돌릴 수 있습니다.', confirmLabel: '모두 지우기', danger: true })
    if (!ok) return
    const ids = new Set(region.blockIds())
    const all = annotations.get(scope).strokes
    annotations.remove(scope, all.filter((s) => !ids.size || ids.has(s.blockId)).map((s) => s.id))
  }
  const getRegion = () => t.activeRegion ?? { label: '이 영역', blockIds: () => [] as string[] }

  const exportAll = async () => {
    setMenu(false)
    const scopes = await annotations.exportAll()
    const data = { app: 'moving-earth-science', kind: 'annotations', format: ANNOTATION_FORMAT, exportedAt: new Date().toISOString(), scopes }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `필기-백업-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }
  const importFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text())
      if (data?.kind !== 'annotations' || !Array.isArray(data.scopes)) throw new Error('형식')
      const n = await annotations.importAll(data.scopes)
      notify('필기를 가져왔습니다', `새로 추가된 획 ${n}개. 이미 있던 필기는 그대로 유지했습니다.`)
    } catch {
      notify('가져오지 못했습니다', '이 앱에서 내보낸 필기 백업 파일(.json)인지 확인해 주세요.')
    }
  }

  const onGrip = (e: React.PointerEvent) => {
    dragRef.current = { y0: e.clientY, b0: t.barY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onGripMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const y = dragRef.current.b0 + (e.clientY - dragRef.current.y0) / window.innerHeight
    setTools({ barY: Math.max(0.06, Math.min(0.62, y)) })
  }

  if (t.collapsed) {
    return (
      <div className="fixed right-2 z-[70] sm:right-3" style={{ top }}>
        <button type="button" onClick={() => setTools({ collapsed: false })} aria-label="필기 도구 열기"
          className={`no-tap flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 shadow-lg ${t.tool === 'none' ? 'bg-white text-ink' : 'bg-brand text-white'}`}>
          {ICONS[t.tool === 'none' ? 'pen' : t.tool]}
        </button>
      </div>
    )
  }

  const colors = t.tool === 'highlighter' ? HL_COLORS : PEN_COLORS
  const sizes = t.tool === 'highlighter' ? HL_SIZES : PEN_SIZES
  const curColor = t.tool === 'highlighter' ? t.hlColor : t.penColor
  const curSize = t.tool === 'highlighter' ? t.hlSize : t.penSize

  return (
    <div className="fixed right-2 z-[70] flex items-start gap-2 sm:right-3" style={{ top }}>
      {(t.tool === 'pen' || t.tool === 'highlighter') && (
        <div className="rise flex flex-col items-center gap-1.5 rounded-2xl border border-ink/10 bg-white p-1.5 shadow-lg">
          {colors.map((c) => (
            <button key={c.value} type="button" aria-label={c.label} title={c.label} onClick={() => setTools(t.tool === 'highlighter' ? { hlColor: c.value } : { penColor: c.value })}
              className={`no-tap flex h-9 w-9 items-center justify-center rounded-full ${curColor === c.value ? 'ring-2 ring-brand ring-offset-1' : ''}`}>
              <span className="h-6 w-6 rounded-full border border-ink/10" style={{ background: c.value }} />
            </button>
          ))}
          <span className="my-0.5 h-px w-7 bg-ink/10" />
          {sizes.map((s, i) => (
            <button key={s} type="button" aria-label={`굵기 ${i + 1}`} title={`굵기 ${['가늘게', '보통', '굵게'][i]}`} onClick={() => setTools(t.tool === 'highlighter' ? { hlSize: s } : { penSize: s })}
              className={`no-tap flex h-9 w-9 items-center justify-center rounded-full ${curSize === s ? 'bg-ink/8' : ''}`}>
              <span className="rounded-full" style={{ width: 6 + i * 6, height: 6 + i * 6, background: curColor, opacity: t.tool === 'highlighter' ? 0.6 : 1 }} />
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-ink/10 bg-white p-1.5 shadow-lg" role="toolbar" aria-label="필기 도구">
        <div onPointerDown={onGrip} onPointerMove={onGripMove} onPointerUp={() => (dragRef.current = null)} title="끌어서 위치 옮기기"
          className="flex h-5 w-11 cursor-grab touch-none items-center justify-center text-ink/30">
          <svg width="20" height="6"><circle cx="4" cy="3" r="1.6" fill="currentColor" /><circle cx="10" cy="3" r="1.6" fill="currentColor" /><circle cx="16" cy="3" r="1.6" fill="currentColor" /></svg>
        </div>
        {(['none', 'pen', 'highlighter', 'laser', 'eraser'] as Tool[]).map((k) => (
          <Btn key={k} label={NAMES[k]} active={t.tool === k} onClick={() => choose(k)}>{ICONS[k]}</Btn>
        ))}
        <span className="my-0.5 h-px w-7 bg-ink/10" />
        <Btn label="실행 취소" onClick={() => annotations.undo(scope)} disabled={!canUndo}><Icon d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" /></Btn>
        <Btn label="다시 실행" onClick={() => annotations.redo(scope)} disabled={!canRedo}><Icon d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" /></Btn>
        <Btn label={t.visible ? '필기 숨기기' : '필기 보이기'} active={!t.visible} onClick={() => setTools({ visible: !t.visible })}>
          {t.visible ? <Icon d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /> : <Icon d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />}
        </Btn>
        <div className="relative">
          <Btn label="더 보기" active={menu} onClick={() => setMenu((v) => !v)}><Icon><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" /></Icon></Btn>
          {menu && (
            <div className="rise absolute right-12 top-0 w-64 rounded-2xl border border-ink/10 bg-white p-2 text-[15px] shadow-xl">
              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-lg px-2 hover:bg-ink/4">
                <span>손가락으로도 필기<span className="block text-[12px] text-ink/50">켜면 필기 도구 사용 중 손가락 스크롤이 멈춥니다</span></span>
                <input type="checkbox" checked={t.fingerDraw} onChange={(e) => setTools({ fingerDraw: e.target.checked })} className="h-5 w-5 accent-[#2870ff]" />
              </label>
              <button type="button" onClick={clearRegion} className="flex min-h-11 w-full items-center rounded-lg px-2 text-left text-coriolis hover:bg-ink/4">{getRegion().label} 필기 모두 지우기</button>
              <button type="button" onClick={exportAll} className="flex min-h-11 w-full items-center rounded-lg px-2 text-left hover:bg-ink/4">필기 백업 파일 내보내기</button>
              <button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-11 w-full items-center rounded-lg px-2 text-left hover:bg-ink/4">백업 파일 가져오기</button>
              <p className="px-2 pb-1 pt-2 text-[12px] leading-snug text-ink/50">
                {saving ? '저장 중…' : '자동 저장됨.'} 필기는 이 기기의 브라우저에만 저장되며 다른 기기와 동기화되지 않습니다. 브라우저 데이터를 지우기 전에 백업 파일을 내보내 두세요.
              </p>
            </div>
          )}
        </div>
        <Btn label="도구 접기" onClick={() => { setMenu(false); setTools({ collapsed: true }) }}><Icon d="M9 6l6 6-6 6" /></Btn>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = '' }} />
      </div>
    </div>
  )
}
