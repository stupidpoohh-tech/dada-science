import { useState } from 'react'

/** 교과서 '스스로 평가하기': 항목별 별점(이 기기에만 저장) */
export const SELF_CHECK: Record<string, { group: string; text: string }[]> = {
  ocean: [
    { group: '지식·이해', text: '해수를 움직이는 여러 가지 힘을 설명할 수 있는가?' },
    { group: '지식·이해', text: '에크만 수송과 지형류의 발생 원리를 설명할 수 있는가?' },
    { group: '과정·기능', text: '탐구 활동을 통해 해파의 발생 및 전파 과정을 해석했는가?' },
    { group: '과정·기능', text: '실측 자료를 이용해 각 지역에서의 조석 양상을 분석하고 추론했는가?' },
    { group: '가치·태도', text: '해일의 피해 사례를 조사하고 대처 방안을 제안하며 재해 예방의 중요성을 인식했는가?' },
  ],
}

export default function SelfCheck({ unitId, items }: { unitId: string; items: { group: string; text: string }[] }) {
  const key = `moving-earth-science:selfcheck:${unitId}`
  const [stars, setStars] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] }
  })
  const set = (i: number, v: number) => {
    const next = [...stars]; next[i] = next[i] === v ? 0 : v
    setStars(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* 무시 */ }
  }
  return (
    <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5" aria-label="스스로 평가하기">
      <h2 className="text-[18px] font-extrabold">스스로 평가하기</h2>
      <p className="mb-3 text-[14px] text-ink/55">단원을 학습한 다음, 나의 성취 수준을 스스로 평가해 보세요. (이 기기에만 저장)</p>
      <ul className="flex flex-col divide-y divide-ink/8">
        {items.map((it, i) => (
          <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
            <span className="shrink-0 rounded-full bg-ink/6 px-2 py-0.5 text-[12.5px] font-bold text-ink/60">{it.group}</span>
            <span className="min-w-0 flex-1 text-[15px]">{it.text}</span>
            <span className="flex" role="radiogroup" aria-label={`${it.text} 별점`}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} type="button" role="radio" aria-checked={stars[i] === v} aria-label={`${v}점`} onClick={() => set(i, v)}
                  className={`no-tap h-9 w-8 text-[22px] leading-none ${v <= (stars[i] ?? 0) ? 'text-[#f5b400]' : 'text-ink/20'}`}>★</button>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
