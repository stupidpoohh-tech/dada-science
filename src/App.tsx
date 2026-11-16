import { useEffect, useState } from 'react'
import { LESSONS } from './data/lessons'
import { useProgress } from './lib/progress'
import ChapterGrid from './components/ChapterGrid'
import LessonPage from './components/LessonPage'
import { OverallProgress } from './components/ProgressTracker'

/** 해시 라우팅: #/ → 목록, #/lesson/3 → 3번 개념 (정적 호스팅에서도 새로고침 가능) */
function parseHash(): number | null {
  const m = window.location.hash.match(/^#\/lesson\/(\d+)/)
  if (!m) return null
  const id = Number(m[1])
  return LESSONS.some((l) => l.id === id) ? id : null
}

export default function App() {
  const [lessonId, setLessonId] = useState<number | null>(parseHash)
  const { completed, markDone, reset } = useProgress()

  useEffect(() => {
    const onHash = () => setLessonId(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const open = (id: number | null) => {
    window.location.hash = id ? `#/lesson/${id}` : '#/'
    window.scrollTo({ top: 0 })
  }

  const lesson = LESSONS.find((l) => l.id === lessonId)
  if (lesson) {
    const idx = LESSONS.indexOf(lesson)
    const next = LESSONS[idx + 1]
    return (
      <LessonPage key={lesson.id} lesson={lesson} done={completed.includes(lesson.id)}
        onDone={() => markDone(lesson.id)} onBack={() => open(null)}
        onNextLesson={() => open(next ? next.id : null)} isLast={!next} />
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6">
      <header className="flex flex-col gap-5 pb-8 pt-10 sm:flex-row sm:items-end sm:justify-between sm:pt-14">
        <div>
          <p className="mb-2 text-[15px] font-bold text-brand">고등학교 지구과학 · 해수의 운동과 순환</p>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-tight sm:text-[44px]">움직이는 지구과학</h1>
          <p className="mt-1.5 text-[18px] font-semibold text-ink/65 sm:text-[20px]">그림으로 이해하는 해수의 운동과 순환</p>
        </div>
        <OverallProgress done={completed.length} total={LESSONS.length} onReset={reset} />
      </header>
      <p className="mb-5 text-[15px] text-ink/60">카드를 눌러 팝업북을 펼쳐 보세요. 그림을 클릭하고 단계를 넘기며 원리를 확인한 뒤, 마지막 확인 문제를 맞히면 학습 완료로 저장됩니다.</p>
      <ChapterGrid lessons={LESSONS} completed={completed} onOpen={open} />
      <footer className="mt-12 text-[13px] text-ink/45">
        학습 기록은 이 브라우저에만 저장됩니다. 그림의 크기·높이는 이해를 돕기 위해 과장하여 표현한 부분이 있으며, 각 페이지에 주석으로 표시했습니다.
      </footer>
    </div>
  )
}
