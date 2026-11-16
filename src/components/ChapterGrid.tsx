import type { Lesson } from '../data/types'
import { THUMBS } from '../scenes/thumbs'

export default function ChapterGrid({ lessons, completed, onOpen }: {
  lessons: Lesson[]; completed: number[]; onOpen: (id: number) => void
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {lessons.map((l) => {
        const done = completed.includes(l.id)
        const Thumb = THUMBS[l.id]
        return (
          <li key={l.id}>
            <button type="button" onClick={() => onOpen(l.id)}
              className="no-tap group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white text-left shadow-[0_10px_28px_-20px_rgba(0,10,20,.35)] transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_16px_32px_-18px_rgba(40,112,255,.45)] active:scale-[.99]">
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-ink/8 bg-[#f3f8fd]">
                <svg viewBox="0 0 320 180" className="h-full w-full transition duration-500 group-hover:scale-[1.04]" aria-hidden>
                  <Thumb />
                </svg>
                <span className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ${done ? 'bg-[#00a865] text-white' : 'bg-white/90 text-ink/55'}`}>
                  {done ? '✓ 학습 완료' : '미완료'}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <p className="text-[14px] font-extrabold text-brand">개념 {String(l.id).padStart(2, '0')}</p>
                <h3 className="text-[19px] font-extrabold leading-snug">{l.title}</h3>
                <p className="text-[15px] leading-snug text-ink/65">{l.goal}</p>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
