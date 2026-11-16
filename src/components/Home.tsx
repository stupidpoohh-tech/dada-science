import { UNITS, unitStats, POPUPS } from '../lib/content'
import { href } from '../lib/router'
import { useProgress } from '../lib/store'
import { questionsOf } from '../content/questions'
import { openPopup } from '../lib/popupState'

const STATUS: Record<string, string> = { original: '', demo: '데모 원문', pending: '원문 입력 대기' }

export default function Home() {
  const p = useProgress()
  return (
    <div className="mx-auto max-w-[1040px] px-4 pb-20 sm:px-6">
      <header className="pb-8 pt-12 sm:pt-16">
        <p className="mb-2 text-[15px] font-bold text-brand">고등학교 지구과학 · 인터랙티브 디지털 교과서</p>
        <h1 className="text-[36px] font-extrabold leading-tight tracking-tight sm:text-[46px]">움직이는 지구과학</h1>
        <p className="mt-2 max-w-[620px] text-[17px] leading-relaxed text-ink/65">
          원문을 읽고, 중요한 곳에 필기하고, 이해되지 않는 그림을 누르면 움직이는 설명이 열립니다. 학습을 마치면 기본 예제와 내신 대비 문제로 이어집니다.
        </p>
      </header>

      <ol className="flex flex-col gap-4">
        {UNITS.map((u) => {
          const st = unitStats(p, u, questionsOf(u.id, 'practice').map((q) => q.id))
          const pct = st.chapters ? Math.round((st.chaptersDone / st.chapters) * 100) : 0
          return (
            <li key={u.id} className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-ink/50">대단원 {u.numeral} {STATUS[u.status] && <span className="ml-1 rounded-full bg-[#fff1c2] px-2 py-0.5 text-[12px] text-[#7a5b00]">{STATUS[u.status]}</span>}</p>
                  <h2 className="mt-1 text-[24px] font-extrabold">{u.numeral}. {u.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{u.chapters.map((c) => `${c.no} ${c.title}`).join(' · ')}</p>
                </div>
                <div className="w-full sm:w-56">
                  <div className="mb-1 flex justify-between text-[13px] font-bold text-ink/60"><span>소챕터 학습</span><span className="text-ink">{st.chaptersDone} / {st.chapters}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink/8"><div className="h-full rounded-full bg-[#00b87a]" style={{ width: `${pct}%` }} /></div>
                  <p className="mt-1.5 text-[13px] text-ink/55">개념 확인 {st.conceptsDone}/{st.concepts} · 오답 {st.wrongOpen}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={href({ name: 'unit', unitId: u.id })} className="inline-flex h-12 items-center rounded-xl bg-ink px-5 text-[16px] font-bold text-white">교재 펼치기</a>
                <a href={href({ name: 'practice', unitId: u.id })} className="inline-flex h-12 items-center rounded-xl border border-ink/15 px-4 text-[15px] font-bold">기본 예제</a>
                <a href={href({ name: 'exam', unitId: u.id })} className="inline-flex h-12 items-center rounded-xl border border-ink/15 px-4 text-[15px] font-bold">내신 대비</a>
                <a href={href({ name: 'wrong', unitId: u.id })} className="inline-flex h-12 items-center rounded-xl border border-ink/15 px-4 text-[15px] font-bold">오답 노트</a>
              </div>
              <div className="mt-4 border-t border-ink/8 pt-3">
                <p className="mb-1.5 text-[13px] font-bold text-ink/50">움직이는 그림</p>
                <div className="flex flex-wrap gap-1.5">
                  {POPUPS.filter((x) => x.unitId === u.id).map((x) => (
                    <button key={x.id} type="button" onClick={() => openPopup(x.id)}
                      className={`no-tap inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-[14px] font-semibold ${p.popups[x.id]?.done ? 'border-[#00a865]/40 bg-[#00dc84]/10 text-[#00754e]' : 'border-ink/12 text-ink/75 hover:border-brand/50'}`}>
                      ▶ {x.title}{p.popups[x.id]?.done ? ' ✓' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <footer className="mt-10 text-[13px] leading-relaxed text-ink/50">
        학습 기록은 이 브라우저(localStorage), 필기는 이 브라우저의 IndexedDB에 저장됩니다. 다른 기기와 동기화되지 않으므로 필기 도구의 ‘필기 백업 파일 내보내기’로 백업해 두세요.
        그림의 크기·높이는 이해를 돕기 위해 과장한 부분이 있으며 각 그림에 주석으로 표시했습니다.
      </footer>
    </div>
  )
}
