import { useEffect, useMemo, useRef, useState } from 'react'
import type { UnitMeta } from '../../content/types'
import { conceptById } from '../../content/concepts'
import { manuscriptOf } from '../../lib/content'
import { href, navigate } from '../../lib/router'
import { UNITS } from '../../content/units'
import { openPopup } from '../../lib/popupState'
import { useActiveScope } from '../../lib/annotations'
import AnnotationSurface from '../annotation/AnnotationSurface'
import ChapterNavigation from './ChapterNavigation'
import ContinuousTextbook from './ContinuousTextbook'
import PageScaler from './PageScaler'
import SourceViewer from './SourceViewer'
import ModeToggle from './ModeToggle'
import { useSheetMode } from '../../lib/sheetMode'
import type { Block } from '../../lib/manuscript'

/** AppShell: 왼쪽 목차(가로 화면) / 위쪽 접이식 목차(세로·휴대폰) + 연속형 교재 본문 */
export default function UnitPage({ unit, focus, back, concept }: { unit: UnitMeta; focus?: string; back?: string; concept?: string }) {
  const [current, setCurrent] = useState(unit.chapters[0]?.id ?? '')
  const [tocOpen, setTocOpen] = useState(false)
  const [sideOpen, setSideOpen] = useState(true)
  const [source, setSource] = useState(false)
  const mode = useSheetMode()
  const [focusBar, setFocusBar] = useState<{ blockId: string; back?: string; concept?: string } | null>(null)
  const currentRef = useRef(current)
  currentRef.current = current

  // 필기 대상: 이 대단원. '현재 영역' = 지금 읽는 소챕터
  const ms = manuscriptOf(unit.id)
  const blockIdsOf = useMemo(() => (chapterId: string) => {
    const out: string[] = [`${chapterId}-title`, `${chapterId}-check`]
    const visit = (b: Block) => { if (b.kind === 'row') b.cols.forEach((c) => c.forEach(visit)); else out.push(b.id) }
    ms.chapters.find((c) => c.chapterId === chapterId)?.blocks.forEach(visit)
    return out
  }, [ms])
  useActiveScope(unit.id, true, {
    get label() { const c = unit.chapters.find((x) => x.id === currentRef.current); return c ? `${c.no}. ${c.title}` : '이 단원' },
    blockIds: () => blockIdsOf(currentRef.current),
  })

  // 현재 읽는 소챕터(스크롤 위치)
  useEffect(() => {
    const els = unit.chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setCurrent((vis[0].target as HTMLElement).dataset.chapter!)
    }, { rootMargin: '-25% 0px -65% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [unit])

  // 관련 개념 위치로 이동 + 강조
  useEffect(() => {
    if (!focus) { window.scrollTo({ top: 0 }); return }
    let tries = 0
    const run = () => {
      const el = document.getElementById(focus)
      if (!el) { if (tries++ < 20) setTimeout(run, 80); return }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.remove('focus-flash'); void el.offsetWidth; el.classList.add('focus-flash')
      setFocusBar({ blockId: focus, back, concept })
    }
    setTimeout(run, 60)
  }, [focus, back, concept])

  const jump = (id: string) => {
    setTocOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const uIdx = UNITS.findIndex((u) => u.id === unit.id)
  const prevUnit = UNITS[uIdx - 1]
  const nextUnit = UNITS[uIdx + 1]
  // 본문은 소챕터 강조가 바뀔 때마다 다시 그리지 않음(스크롤 중 끊김 방지)
  const page = useMemo(() => (
    <PageScaler>
      <AnnotationSurface scopeId={unit.id}>
        <ContinuousTextbook unit={unit} />
      </AnnotationSurface>
    </PageScaler>
  ), [unit])
  const conceptObj = focusBar?.concept ? conceptById(focusBar.concept) : undefined

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-5 px-3 sm:px-5 lg:px-6">
      {/* 가로형: 왼쪽 목차 */}
      {sideOpen && (
        <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 overflow-y-auto border-r border-ink/8 py-5 pr-4 lg:block">
          <div className="mb-4 flex items-center justify-between">
            <a href="#/" className="text-[15px] font-extrabold">움직이는 지구과학</a>
            <button type="button" onClick={() => setSideOpen(false)} className="rounded-lg px-2 py-1 text-[13px] font-bold text-ink/50 hover:bg-ink/5" aria-label="목차 접기">접기 ‹</button>
          </div>
          <ChapterNavigation unit={unit} current={current} onJump={jump} onSource={unit.sourcePages ? () => setSource(true) : undefined} />
        </aside>
      )}
      <main className="min-w-0 flex-1">
        {/* 세로형·휴대폰: 위쪽 바 */}
        <div className={`sticky top-0 z-30 -mx-3 border-b border-ink/8 bg-white/95 px-3 py-2 backdrop-blur sm:-mx-5 sm:px-5 ${sideOpen ? 'lg:hidden' : ''}`}>
          <div className="flex items-center gap-2">
            {!sideOpen && <button type="button" onClick={() => setSideOpen(true)} className="hidden h-10 rounded-lg border border-ink/12 px-3 text-[14px] font-bold lg:block">› 목차</button>}
            <button type="button" onClick={() => setTocOpen((v) => !v)} aria-expanded={tocOpen}
              className="no-tap flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl px-1 text-left">
              <span className="shrink-0 rounded-md bg-ink px-1.5 py-0.5 text-[12px] font-bold text-white">{unit.numeral}</span>
              <span className="min-w-0 truncate text-[15px] font-bold">{unit.title}</span>
              <span className={`text-ink/45 transition ${tocOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            <ModeToggle />
            <UnitArrow unit={prevUnit} dir="prev" />
            <UnitArrow unit={nextUnit} dir="next" />
          </div>
          {tocOpen && (
            <div className="rise max-h-[70dvh] overflow-y-auto pb-3 pt-2">
              <ChapterNavigation unit={unit} current={current} onJump={jump} onSource={unit.sourcePages ? () => { setTocOpen(false); setSource(true) } : undefined} />
            </div>
          )}
        </div>

        {/* 가로형(목차 펼침): 교재 오른쪽 위 보기 전환 */}
        {sideOpen && <div className="sticky top-0 z-30 hidden justify-end py-2 lg:flex"><ModeToggle /></div>}
        <div className="py-4 lg:pt-1">
          {mode === 'blank' && <p className="mb-2 text-center text-[13px] font-semibold text-ink/50">파란 빈칸을 누르면 답이 보이고, 다시 누르면 가려집니다.</p>}
          {mode === 'key' && <p className="mb-2 text-center text-[13px] font-semibold text-ink/50">핵심 보기는 준비 중입니다. 지금은 교재와 같은 화면이 보입니다.</p>}
          {unit.status !== 'original' && (
            <p className="mb-4 rounded-xl bg-[#fff6db] px-4 py-2.5 text-[14px] font-semibold text-[#7a5b00]">
              {unit.status === 'demo' ? '이 단원의 본문은 데모 원문입니다.' : '이 단원의 원문은 아직 입력되지 않았습니다.'}
            </p>
          )}
          {page}
        </div>
      </main>

      {focusBar && (
        <div className="rise fixed inset-x-3 bottom-3 z-[55] mx-auto flex max-w-[720px] flex-wrap items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-white shadow-2xl sm:bottom-5">
          <span className="min-w-0 flex-1 text-[15px] font-bold">관련 개념{conceptObj ? `: ${conceptObj.title}` : ''}</span>
          {conceptObj?.popupId && (
            <button type="button" onClick={() => openPopup(conceptObj.popupId!, conceptObj.popupStep)} className="no-tap h-10 rounded-xl bg-brand px-3 text-[14px] font-bold">▶ 움직이는 그림 다시 보기</button>
          )}
          {focusBar.back && (
            <button type="button" onClick={() => navigate(focusBar.back!)} className="no-tap h-10 rounded-xl bg-white px-3 text-[14px] font-bold text-ink">← 문제로 돌아가기</button>
          )}
          <button type="button" onClick={() => setFocusBar(null)} aria-label="닫기" className="no-tap h-10 w-10 rounded-xl text-white/70">✕</button>
        </div>
      )}
      {source && unit.sourcePages && <SourceViewer pages={unit.sourcePages} onClose={() => setSource(false)} />}
    </div>
  )
}

/** 위쪽 바의 대단원 이동 화살표(‹ ›) */
function UnitArrow({ unit, dir }: { unit?: UnitMeta; dir: 'prev' | 'next' }) {
  const cls = 'no-tap grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ink/12 bg-white text-[18px] font-bold'
  const label = `${dir === 'prev' ? '이전' : '다음'} 대단원${unit ? `: ${unit.numeral}. ${unit.title}` : ''}`
  const glyph = dir === 'prev' ? '‹' : '›'
  if (!unit) return <span aria-hidden className={`${cls} opacity-30`}>{glyph}</span>
  return <a href={href({ name: 'unit', unitId: unit.id })} aria-label={label} title={label} className={cls}>{glyph}</a>
}
