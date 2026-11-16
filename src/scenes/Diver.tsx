/** 잠수부 일러스트(중심이 원점) */
export default function Diver({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      {/* 공기통 */}
      <rect x={-30} y={-26} width={14} height={40} rx={6} fill="#ffcc4d" stroke="#000a14" strokeWidth={2} />
      {/* 몸통 */}
      <rect x={-18} y={-24} width={30} height={42} rx={13} fill="#1b2633" stroke="#000a14" strokeWidth={2} />
      {/* 다리와 오리발 */}
      <path d="M-10 16 L-14 40 M6 16 L8 40" stroke="#1b2633" strokeWidth={10} strokeLinecap="round" />
      <path d="M-22 42 L-6 38 L-8 48 Z M0 38 L18 42 L4 48 Z" fill="#00dc84" stroke="#000a14" strokeWidth={1.6} strokeLinejoin="round" />
      {/* 팔 */}
      <path d="M8 -12 Q24 -4 22 12" stroke="#1b2633" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* 머리·마스크 */}
      <circle cx={-2} cy={-38} r={14} fill="#f2c8a0" stroke="#000a14" strokeWidth={2} />
      <path d="M-16 -42 Q-2 -54 12 -42" stroke="#1b2633" strokeWidth={6} fill="none" strokeLinecap="round" />
      <rect x={-2} y={-46} width={18} height={12} rx={4} fill="#9fe7ff" stroke="#000a14" strokeWidth={2} />
      {/* 호흡기 */}
      <path d="M8 -30 Q-12 -22 -24 -24" stroke="#000a14" strokeWidth={2.4} fill="none" />
    </g>
  )
}
