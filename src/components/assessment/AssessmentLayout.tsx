import type { ReactNode } from 'react'
import type { UnitMeta } from '../../content/types'
import { href } from '../../lib/router'
import { unitStats } from '../../lib/content'
import { useProgress } from '../../lib/store'
import { questionsOf } from '../../content/questions'

/** 문제 풀이 영역 공통 틀(개념 확인 → 기본 예제 → 내신 대비 → 오답 복습) */
export default function AssessmentLayout({ unit, tab, children }: { unit: UnitMeta; tab: 'practice' | 'exam' | 'wrong'; children: ReactNode }) {
  const p = useProgress()
  const st = unitStats(p, unit, questionsOf(unit.id, 'practice').map((q) => q.id))
  const tabs = [
    { key: 'practice', label: '기본 예제' },
    { key: 'exam', label: '내신 대비' },
    { key: 'wrong', label: `오답 노트${st.wrongOpen ? ` ${st.wrongOpen}` : ''}` },
  ] as const
  return (
    <div className="mx-auto max-w-[920px] px-3 pb-28 pt-4 sm:px-5">
      <div className="sticky top-0 z-30 -mx-3 bg-paper/95 px-3 pb-2 pt-2 backdrop-blur sm:-mx-5 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <a href={href({ name: 'unit', unitId: unit.id })} className="inline-flex h-10 items-center rounded-full border border-ink/12 bg-white px-3.5 text-[14px] font-bold">← 교재로</a>
          <span className="text-[15px] font-extrabold">{unit.numeral}. {unit.title}</span>
        </div>
        <div className="mt-2 flex gap-1 rounded-2xl bg-ink/5 p-1" role="tablist">
          {tabs.map((t) => (
            <a key={t.key} href={href({ name: t.key, unitId: unit.id })} role="tab" aria-selected={tab === t.key}
              className={`flex h-11 flex-1 items-center justify-center rounded-xl text-[15px] font-bold ${tab === t.key ? 'bg-white text-ink shadow-sm' : 'text-ink/55'}`}>{t.label}</a>
          ))}
        </div>
      </div>
      {st.conceptsDone < st.concepts && tab !== 'wrong' && (
        <p className="mt-3 rounded-xl bg-brand/[.06] px-4 py-2.5 text-[14px] font-semibold text-ink/75">
          권장 학습 순서: 원문 학습과 개념 확인을 먼저 마치세요. 현재 개념 {st.conceptsDone} / {st.concepts} 완료.
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export function EmptyQuestions({ unit }: { unit: UnitMeta }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/15 p-8 text-center text-[15px] leading-relaxed text-ink/60">
      아직 이 대단원의 문제 자료가 입력되지 않았습니다.<br />
      <code className="text-[13px]">src/content/questions/{unit.id}.ts</code>에 준비한 문항을 입력하면 이곳에 표시됩니다.
    </div>
  )
}
