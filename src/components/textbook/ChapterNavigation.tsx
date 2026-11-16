import type { UnitMeta } from '../../content/types'
import { chapterDone, unitStats, UNITS } from '../../lib/content'
import { href } from '../../lib/router'
import { useProgress } from '../../lib/store'

/** 대단원 목차 + 학습 진행률 + 문제 풀이 진입 */
export default function ChapterNavigation({ unit, current, onJump, onSource, compact }: {
  unit: UnitMeta; current: string; onJump: (chapterId: string) => void; onSource?: () => void; compact?: boolean
}) {
  const p = useProgress()
  const st = unitStats(p, unit)
  const pct = st.chapters ? Math.round((st.chaptersDone / st.chapters) * 100) : 0
  return (
    <nav aria-label={`${unit.title} 목차`} className="flex flex-col gap-5 text-[15px]">
      {!compact && (
        <div className="flex flex-col gap-1">
          {UNITS.map((u) => (
            <a key={u.id} href={href({ name: 'unit', unitId: u.id })}
              className={`rounded-lg px-2.5 py-1.5 text-[14px] font-bold ${u.id === unit.id ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5'}`}>
              {u.numeral}. {u.title}
            </a>
          ))}
        </div>
      )}
      <ol className="flex flex-col gap-0.5">
        {unit.chapters.map((c) => {
          const active = c.id === current
          const done = chapterDone(p, unit.id, c)
          return (
            <li key={c.id}>
              <button type="button" onClick={() => onJump(c.id)} aria-current={active ? 'location' : undefined}
                className={`no-tap flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${active ? 'bg-brand/10 text-ink' : 'text-ink/70 hover:bg-ink/5'}`}>
                <span className={`w-7 shrink-0 font-extrabold tabular-nums ${active ? 'text-brand' : 'text-ink/40'}`}>{c.no}</span>
                <span className={`min-w-0 flex-1 leading-snug ${active ? 'font-extrabold' : 'font-semibold'}`}>{c.title}</span>
                {done && <span className="text-[#00a865]" aria-label="학습 완료">✓</span>}
              </button>
            </li>
          )
        })}
      </ol>
      <div className="rounded-xl bg-[#f3f6fa] p-3">
        <div className="mb-1.5 flex justify-between text-[13px] font-bold text-ink/60"><span>소챕터 학습</span><span className="text-ink">{st.chaptersDone} / {st.chapters}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-[#00b87a] transition-all" style={{ width: `${pct}%` }} /></div>
        <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]">
          <dt className="text-ink/55">완료한 개념</dt><dd className="text-right font-bold">{st.conceptsDone} / {st.concepts}</dd>
          <dt className="text-ink/55">남은 개념</dt><dd className="text-right font-bold">{st.concepts - st.conceptsDone}</dd>
          <dt className="text-ink/55">첫 시도 정답률</dt><dd className="text-right font-bold">{st.firstTryRate === null ? '–' : `${Math.round(st.firstTryRate * 100)}%`}</dd>
          <dt className="text-ink/55">개념 확인 문제</dt><dd className="text-right font-bold">{st.conceptGraded ? `${st.conceptCorrect} / ${st.conceptTotal} 정답` : `${st.conceptAnswered} / ${st.conceptTotal} 응답`}</dd>
          <dt className="text-ink/55">내신 대비</dt><dd className="text-right font-bold">{st.examScore === undefined ? '미응시' : `${st.examScore} / ${st.examMax}점${st.examPending ? ' (미확정)' : ''}`}</dd>
        </dl>
      </div>
      <div className="flex flex-col gap-1.5">
        <a href={href({ name: 'concept', unitId: unit.id })} className="flex min-h-11 items-center justify-between rounded-xl border border-ink/12 bg-white px-3 font-bold hover:border-brand/50">개념 확인 문제 <span className="text-ink/40">→</span></a>
        <a href={href({ name: 'exam', unitId: unit.id })} className="flex min-h-11 items-center justify-between rounded-xl border border-ink/12 bg-white px-3 font-bold hover:border-brand/50">내신 대비 문제 <span className="text-ink/40">→</span></a>
        <a href={href({ name: 'wrong', unitId: unit.id })} className="flex min-h-11 items-center justify-between rounded-xl border border-ink/12 bg-white px-3 font-bold hover:border-brand/50">
          오답 노트 <span className={st.wrongOpen ? 'rounded-full bg-coriolis px-2 text-[12px] text-white' : 'text-ink/40'}>{st.wrongOpen || '→'}</span>
        </a>
        {onSource && <button type="button" onClick={onSource} className="flex min-h-11 items-center rounded-xl px-3 text-left text-[14px] font-bold text-ink/60 hover:bg-ink/5">원본 손글씨 노트 보기</button>}
      </div>
    </nav>
  )
}
