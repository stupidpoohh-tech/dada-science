import type { UnitMeta } from '../../content/types'
import { chapterDone, manuscriptOf, popupById, requiredPopups } from '../../lib/content'
import { updateProgress, useProgress } from '../../lib/store'
import ConceptBlock from './ConceptBlock'
import { PopupChip } from './Inline'
import { bankOf, TOPICS } from '../../content/bank'
import { href } from '../../lib/router'

/** 대단원 전체를 하나의 연속 문서로 렌더링(소챕터는 제목·구분선·여백으로만 구분) */
export default function ContinuousTextbook({ unit }: { unit: UnitMeta }) {
  const ms = manuscriptOf(unit.id)
  return (
    <article className="flex flex-col pb-24">
      <header className="mb-2 border-b-2 border-ink pb-4" data-block-id={`${unit.id}-title`} id={`${unit.id}-title`}>
        <p className="text-[14px] font-bold text-brand">대단원 {unit.numeral}</p>
        <h1 className="mt-1 text-[34px] font-extrabold leading-tight tracking-tight">{unit.numeral}. {unit.title}</h1>
      </header>
      {unit.chapters.map((ch) => {
        const parsed = ms.chapters.find((c) => c.chapterId === ch.id)
        return <ChapterSection key={ch.id} unit={unit} chapterId={ch.id} no={ch.no} title={ch.title} blocks={parsed?.blocks ?? []} />
      })}
    </article>
  )
}

function ChapterSection({ unit, chapterId, no, title, blocks }: { unit: UnitMeta; chapterId: string; no: string; title: string; blocks: import('../../lib/manuscript').Block[] }) {
  const p = useProgress()
  const ch = unit.chapters.find((c) => c.id === chapterId)!
  const req = requiredPopups(unit.id, ch)
  const done = chapterDone(p, unit.id, ch)
  return (
    <section id={chapterId} data-chapter={chapterId} className="scroll-mt-24 pt-10">
      <h2 data-block-id={`${chapterId}-title`} className="flex items-baseline gap-3 border-b border-ink/15 pb-2.5 text-[26px] font-extrabold">
        <span className="text-brand tabular-nums">{no}.</span>{title}
        {done && <span className="ml-auto text-[13px] font-bold text-[#00875a]">✓ 학습 완료</span>}
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        {blocks.map((b) => <ConceptBlock key={b.id} b={b} />)}
      </div>
      {/* 이 소챕터와 관련된 문제(문제은행 소주제 연결) */}
      {(TOPICS[unit.id] ?? []).filter((t) => t.chapterIds.includes(chapterId)).map((t) => {
        const n = bankOf(unit.id, 'concept').filter((q) => q.topic === t.id).length
        const m = bankOf(unit.id, 'exam').filter((q) => q.topic === t.id).length
        return (n + m > 0) && (
          <div key={t.id} data-block-id={`${chapterId}-quiz-${t.id}`} className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
            <span className="font-bold text-ink/55">관련 문제 · {t.label}</span>
            {n > 0 && <a href={href({ name: 'concept', unitId: unit.id, topic: t.id })} className="inline-flex min-h-9 items-center rounded-full border border-ink/15 bg-white px-3 font-bold hover:border-brand/50">개념 확인 {n}문항 →</a>}
            {m > 0 && <a href={href({ name: 'exam', unitId: unit.id })} className="inline-flex min-h-9 items-center rounded-full border border-ink/15 bg-white px-3 font-bold hover:border-brand/50">내신 대비 {m}문항 →</a>}
          </div>
        )
      })}
      {/* 소챕터 학습 완료 조건 */}
      <div data-block-id={`${chapterId}-check`} className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-ink/10 bg-[#f7f9fc] px-3.5 py-2.5 text-[14px]">
        {req ? (
          <>
            <span className="font-bold text-ink/60">개념 확인</span>
            {req.map((id) => <PopupChip key={id} id={id} label={popupById(id)?.title} />)}
            <span className="ml-auto font-bold text-ink/55">{req.filter((id) => p.popups[id]?.done).length} / {req.length} 완료</span>
          </>
        ) : (
          <label className="flex min-h-10 cursor-pointer items-center gap-2.5 font-bold">
            <input type="checkbox" className="h-5 w-5 accent-[#00a865]" checked={!!p.chapters[chapterId]?.manualDone}
              onChange={(e) => updateProgress((s) => { s.chapters[chapterId] = { manualDone: e.target.checked } })} />
            이 소챕터 학습을 마쳤습니다
          </label>
        )}
      </div>
    </section>
  )
}
