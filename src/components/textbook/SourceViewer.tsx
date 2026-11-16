import { useEffect, useState } from 'react'

/** 손글씨 원본 노트 보기 */
export default function SourceViewer({ pages, onClose }: { pages: string[]; onClose: () => void }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-ink/85 p-3" role="dialog" aria-modal="true" aria-label="원본 노트">
      <div className="flex items-center gap-2 text-white">
        <span className="font-bold">원본 노트 {i + 1} / {pages.length}</span>
        <div className="ml-auto flex gap-2">
          {pages.map((_, k) => (
            <button key={k} type="button" onClick={() => setI(k)} className={`h-10 min-w-10 rounded-full px-3 font-bold ${k === i ? 'bg-white text-ink' : 'bg-white/15'}`}>{k + 1}</button>
          ))}
          <button type="button" onClick={onClose} className="h-10 rounded-full bg-white px-4 font-bold text-ink">닫기 ✕</button>
        </div>
      </div>
      <div className="mt-3 min-h-0 flex-1 overflow-auto">
        <img src={`./source/${pages[i]}`} alt={`원본 손글씨 노트 ${i + 1}쪽`} className="mx-auto block w-full max-w-[1100px] rounded-lg" />
      </div>
    </div>
  )
}
