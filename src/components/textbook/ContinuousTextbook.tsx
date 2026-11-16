import type { UnitMeta } from '../../content/types'
import { chapterDone, manuscriptOf, popupById, requiredPopups } from '../../lib/content'
import { updateProgress, useProgress } from '../../lib/store'
import ConceptBlock from './ConceptBlock'
import { PopupChip } from './Inline'
import { bankOf, TOPICS } from '../../content/bank'
import { href } from '../../lib/router'
import type { Block } from '../../lib/manuscript'

/**
 * 대단원 전체를 하나의 연속 학습지로 렌더링.
 * 학습지 모드(@sheet 행)에서는 원본 노트처럼 행이 여백 없이 이어지고, 소챕터 제목도 행 안에 그려집니다.
 */
export default function ContinuousTextbook({ unit }: { unit: UnitMeta }) {
  const ms = manuscriptOf(unit.id)
  return (
    <article className="sheet flex flex-col bg-white px-[21px] pb-16 pt-6 text-ink">
      <header data-block-id={`${unit.id}-title`} id={`${unit.id}-title`}>
        <h1 className="text-[30px] font-extrabold leading-tight tracking-tight">{unit.numeral}. {unit.title}</h1>
      </header>
      {unit.chapters.map((ch) => {
        const parsed = ms.chapters.find((c) => c.chapterId === ch.id)
        return <ChapterSection key={ch.id} unit={unit} chapterId={ch.id} no={ch.no} title={ch.title} blocks={parsed?.blocks ?? []} />
      })}
    </article>
  )
}

function ChapterSection({ unit, chapterId, no, title, blocks }: { unit: UnitMeta; chapterId: string; no: string; title: string; blocks: Block[] }) {
  const p = useProgress()
  const ch = unit.chapters.find((c) => c.id === chapterId)!
  const done = chapterDone(p, unit.id, ch)
  const sheet = blocks[0]?.kind === 'sheet'
  return (
    <section id={chapterId} data-chapter={chapterId} className={`scroll-mt-20 ${sheet ? 'pt-7 first-of-type:pt-1' : 'pt-10'}`}>
      {sheet ? (
        <h2 className="sr-only">{no}. {title}</h2>
      ) : (
        <h2 data-block-id={`${chapterId}-title`} className="flex items-baseline gap-3 pb-1 text-[22px] font-extrabold">
          <span className="tabular-nums">{no}.</span>{title}
          {done && <span className="ml-auto text-[13px] font-bold text-[#00875a]">✓ 학습 완료</span>}
        </h2>
      )}
      <div className={`flex flex-col ${sheet ? '' : 'mt-3 gap-3'}`}>
        {blocks.map((b) => <ConceptBlock key={b.id} b={b} />)}
      </div>
      {/* 학습지 모드에서는 흐름을 끊지 않도록 목차(ChapterNavigation)에 표시 */}
      {!sheet && <div data-block-id={`${chapterId}-check`} className="mt-3 border-t border-dashed border-ink/12 pt-2"><ChapterFooter unit={unit} chapterId={chapterId} /></div>}
    </section>
  )
}

/** 소챕터 학습 완료 조건(움직이는 그림 개념 확인 또는 완료 체크)과 관련 문제 링크 */
export function ChapterFooter({ unit, chapterId }: { unit: UnitMeta; chapterId: string }) {
  const p = useProgress()
  const ch = unit.chapters.find((c) => c.id === chapterId)!
  const req = requiredPopups(unit.id, ch)
  const topics = (TOPICS[unit.id] ?? []).filter((t) => t.chapterIds.includes(chapterId))
  return (
    <div className="flex flex-col gap-1.5 text-[12.5px] leading-snug">
      {req ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-ink/50">개념 확인 {req.filter((id) => p.popups[id]?.done).length}/{req.length}</span>
          {req.map((id) => <PopupChip key={id} id={id} label={popupById(id)?.title} />)}
        </div>
      ) : (
        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-ink/65">
          <input type="checkbox" className="h-4 w-4 accent-[#00a865]" checked={!!p.chapters[chapterId]?.manualDone}
            onChange={(e) => updateProgress((s) => { s.chapters[chapterId] = { manualDone: e.target.checked } })} />
          이 소챕터 학습을 마쳤습니다
        </label>
      )}
      {topics.map((t) => {
        const n = bankOf(unit.id, 'concept').filter((q) => q.topic === t.id).length
        const m = bankOf(unit.id, 'exam').filter((q) => q.topic === t.id).length
        return (n + m > 0) && (
          <p key={t.id} className="flex flex-wrap gap-x-2 text-ink/50">
            <span>관련 문제({t.label})</span>
            {n > 0 && <a href={href({ name: 'concept', unitId: unit.id, topic: t.id })} className="font-bold text-brand hover:underline">개념 확인 {n} →</a>}
            {m > 0 && <a href={href({ name: 'exam', unitId: unit.id })} className="font-bold text-brand hover:underline">내신 대비 {m} →</a>}
          </p>
        )
      })}
    </div>
  )
}
