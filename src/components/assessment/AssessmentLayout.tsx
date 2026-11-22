import type { ReactNode } from 'react'
import type { UnitMeta } from '../../content/types'
import { href } from '../../lib/router'
import { unitStats } from '../../lib/content'
import { useProgress } from '../../lib/store'
import { useActiveScope } from '../../lib/annotations'
import AnnotationSurface from '../annotation/AnnotationSurface'

/** 문제 풀이 영역 공통 틀(개념 확인 → 기본 예제 → 내신 대비 → 오답 복습) */
export default function AssessmentLayout({ unit, tab, children }: { unit: UnitMeta; tab: 'concept' | 'exam' | 'textbook' | 'wrong'; children: ReactNode }) {
  const p = useProgress()
  const st = unitStats(p, unit)
  // 문제 풀이 필기: 탭(개념 확인·내신 대비·교과서 문제·오답 노트)마다 따로 저장
  const scope = `${unit.id}:solve-${tab}`
  useActiveScope(scope, true, { label: '이 문제 화면', blockIds: () => [] })
  const tabs = [
    { key: 'concept', label: '개념 확인' },
    { key: 'exam', label: '내신 대비' },
    { key: 'textbook', label: '교과서 문제' },
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
              className={`flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-xl px-1 text-[14px] font-bold sm:text-[15px] ${tab === t.key ? 'bg-white text-ink shadow-sm' : 'text-ink/55'}`}>{t.label}</a>
          ))}
        </div>
      </div>
      {st.conceptsDone < st.concepts && tab !== 'wrong' && (
        <p className="mt-3 rounded-xl bg-brand/[.06] px-4 py-2.5 text-[14px] font-semibold text-ink/75">
          권장 학습 순서: 원문을 읽고 움직이는 그림으로 원리를 확인한 뒤 문제를 푸세요. 현재 움직이는 그림 개념 확인 {st.conceptsDone} / {st.concepts} 완료.
        </p>
      )}
      <AnnotationSurface key={scope} scopeId={scope} className="mt-4">{children}</AnnotationSurface>
    </div>
  )
}
