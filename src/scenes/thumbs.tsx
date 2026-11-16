import type { ComponentType } from 'react'
import { Arrow, C, PolarArrow } from '../components/svg'

const waveD = (y: number, a: number, l: number, x0 = 0, x1 = 320) => {
  let d = `M${x0} ${y}`
  for (let x = x0; x <= x1; x += 4) d += ` L${x} ${(y - a * Math.cos(((x - x0) / l) * 2 * Math.PI)).toFixed(1)}`
  return d
}

const T2 = () => (
  <>
    <path d="M40 54 L280 94 L280 160 L40 160 Z" fill="#7ccaf2" /><path d="M40 30 L40 160 L280 160 L280 30" fill="none" stroke="#9aa7b8" strokeWidth={5} />
    <line x1={40} y1={54} x2={280} y2={94} stroke={C.current} strokeWidth={3} />
    <Arrow x1={90} y1={130} x2={230} y2={130} color={C.pgf} width={7} halo />
    <circle cx={80} cy={130} r={8} fill="white" stroke={C.ink} strokeWidth={2} /><circle cx={240} cy={130} r={8} fill="white" stroke={C.ink} strokeWidth={2} />
  </>
)
const T3 = () => (
  <>
    <rect width={320} height={180} fill="#cde9f9" />{[40, 80, 120, 160].map((y) => <line key={y} x1={0} x2={320} y1={y} y2={y} stroke="white" strokeWidth={1.5} />)}
    <path d="M110 150 Q110 70 200 70 L290 70" fill="none" stroke={C.motion} strokeWidth={3} strokeDasharray="2 6" strokeLinecap="round" />
    <PolarArrow x={200} y={90} angle={90} length={50} color={C.pgf} width={5} halo />
    <PolarArrow x={200} y={90} angle={-90} length={50} color={C.coriolis} width={5} halo />
    <PolarArrow x={200} y={90} angle={0} length={70} color={C.motion} width={5} halo />
    <circle cx={200} cy={90} r={7} fill="white" stroke={C.ink} strokeWidth={2} />
  </>
)
const T4 = () => (
  <>
    <rect width={320} height={180} fill="#d8f1fd" />
    <PolarArrow x={160} y={100} angle={90} length={80} color={C.wind} width={14} opacity={0.5} />
    {[0, 1, 2, 3, 4].map((k) => <PolarArrow key={k} x={160} y={100} angle={45 - k * 36} length={70 * Math.exp(-k * 0.63)} color={C.current} width={4} halo />)}
    <PolarArrow x={160} y={100} angle={0} length={100} color={C.ekman} width={7} halo />
  </>
)
const T5 = () => (
  <>
    <rect y={50} width={320} height={130} fill="#1f5f9f" /><path d="M70 50 L320 50 L320 80 Q160 80 90 52 Z" fill="#8fd6f6" />
    <path d="M0 40 L70 44 L70 180 L0 180 Z" fill={C.sand} /><path d="M70 120 L320 170 L320 180 L70 180 Z" fill={C.sand} />
    <Arrow x1={100} y1={140} x2={92} y2={62} color="#00b7ff" width={7} halo /><Arrow x1={150} y1={62} x2={260} y2={62} color={C.ekman} width={5} halo />
  </>
)
const T6 = () => (
  <>
    <path d={waveD(70, 18, 160) + ' L320 180 L0 180 Z'} fill="#7ccaf2" /><path d={waveD(70, 18, 160)} fill="none" stroke={C.current} strokeWidth={3} />
    {[40, 120, 200, 280].map((x) => [0, 30, 60].map((d) => <circle key={`${x}${d}`} cx={x} cy={70 + d} r={18 * Math.exp(-d / 25)} fill="none" stroke="white" strokeWidth={1.5} />))}
    {[40, 120, 200, 280].map((x) => <circle key={x} cx={x} cy={52} r={4.5} fill="white" stroke={C.water5} strokeWidth={1.5} />)}
    <Arrow x1={20} y1={22} x2={100} y2={22} color={C.ink} width={4} />
  </>
)
const T7 = () => {
  let d = 'M0 80'
  for (let x = 0; x <= 250; x += 3) { const k = 1 + (x / 250) * 2.2; d += ` L${x} ${(80 - (6 + x * 0.06) * Math.cos((x * k) / 18)).toFixed(1)}` }
  return (
    <>
      <path d={d + ' L270 80 L320 60 L320 180 L0 180 Z'} fill="#7ccaf2" /><path d={d} fill="none" stroke={C.current} strokeWidth={3} />
      <path d="M0 170 L80 170 L280 80 L320 60 L320 180 L0 180 Z" fill={C.sand} />
      <path d="M232 70 Q246 44 266 54 Q272 60 262 68" fill="none" stroke="white" strokeWidth={5} strokeLinecap="round" />
    </>
  )
}
const T9 = () => (
  <>
    <rect width={320} height={180} fill="#0b1a2b" /><circle cx={-30} cy={90} r={70} fill="#ffb02e" />
    <ellipse cx={170} cy={90} rx={52} ry={30} fill="#4fb4e8" /><circle cx={170} cy={90} r={22} fill="#2f8f5b" />
    <circle cx={272} cy={90} r={10} fill="#f2f2e6" /><line x1={60} x2={262} y1={90} y2={90} stroke="#5c6f87" strokeDasharray="3 4" />
  </>
)
/** 그림 번호 → 썸네일(원문 임시 그림·문제 그림에 사용) */
export const THUMBS: Record<number, ComponentType> = { 2: T2, 3: T3, 4: T4, 5: T5, 6: T6, 7: T7, 9: T9 }
/** 팝업 ID → 썸네일 */
export const THUMB_BY_POPUP: Record<string, ComponentType> = {
  pgf: T2, geostrophic: T3, ekman: T4, upwelling: T5, waves: T6, shoaling: T7, tides: T9,
}
