import type { ComponentType, ReactNode } from 'react'
import { Arrow, C } from '../components/svg'

/**
 * 원문 그림(정적 SVG). 손글씨 노트의 그림을 같은 구성으로 다시 그렸습니다.
 * 원문에서 `@figure fig=<키>`로 사용합니다. 모든 그림은 viewBox 320×200 기준입니다.
 */
const T = ({ x, y, children, c = C.ink, s = 12, a = 'middle', w = 700 }: { x: number; y: number; children: ReactNode; c?: string; s?: number; a?: 'start' | 'middle' | 'end'; w?: number }) => (
  <text x={x} y={y} fontSize={s} fontWeight={w} fill={c} textAnchor={a} dominantBaseline="middle">{children}</text>
)
const RED = '#e8384f'
const WATER = '#cdeefe'
const wave = (y: number, a: number, l: number, x0: number, x1: number, phase = 0) => {
  let d = ''
  for (let x = x0; x <= x1; x += 2) d += `${d ? 'L' : 'M'}${x} ${(y - a * Math.cos(((x - x0) / l) * 2 * Math.PI + phase)).toFixed(1)} `
  return d
}

const Hydrostatic = () => (
  <>
    <rect x={20} y={30} width={280} height={160} rx={8} fill={WATER} />
    <path d={wave(30, 3, 40, 20, 300)} stroke={C.current} strokeWidth={2} fill="none" />
    <circle cx={110} cy={110} r={22} fill="white" stroke={C.ink} strokeWidth={1.5} />
    <T x={110} y={110} s={11}>해수</T>
    <Arrow x1={110} y1={86} x2={110} y2={40} color={C.pgf} width={3.5} />
    <Arrow x1={110} y1={134} x2={110} y2={180} color={C.ink} width={3.5} />
    <T x={150} y={56} a="start" c={C.pgf}>연직 수압 경도력 ↑</T>
    <T x={150} y={160} a="start">중력 ↓</T>
    <T x={230} y={110} c={RED} s={14} w={800}>정역학 평형</T>
  </>
)

const Slope = () => (
  <>
    <path d="M30 40 L290 90 L290 180 L30 180 Z" fill={WATER} stroke={C.ink} strokeWidth={1.5} />
    <line x1={30} y1={40} x2={290} y2={90} stroke={C.current} strokeWidth={3} />
    <Arrow x1={90} y1={150} x2={210} y2={150} color={RED} width={3.5} />
    <T x={150} y={130} c={RED}>수평 수압 경도력</T>
    <T x={60} y={28} s={11} c={C.muted}>해수면 높음</T>
    <T x={262} y={76} s={11} c={C.muted}>낮음</T>
    <T x={232} y={110} s={11} a="start" c={C.muted}>경사</T>
  </>
)

const Density = () => (
  <>
    <circle cx={60} cy={50} r={16} fill="#ffd166" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={60 + Math.cos((a * Math.PI) / 180) * 21} y1={50 + Math.sin((a * Math.PI) / 180) * 21} x2={60 + Math.cos((a * Math.PI) / 180) * 27} y2={50 + Math.sin((a * Math.PI) / 180) * 27} stroke="#f2a900" strokeWidth={2} />)}
    <rect x={20} y={95} width={110} height={70} rx={6} fill="#ffe3e3" />
    <T x={75} y={118} s={11}>따뜻함</T>
    <T x={75} y={140} s={12}>밀도↓ 압력↓</T>
    <rect x={190} y={95} width={110} height={70} rx={6} fill="#cfe0ff" />
    <T x={245} y={118} s={11}>차가움</T>
    <T x={245} y={140} s={12}>밀도↑ 압력↑</T>
    <Arrow x1={185} y1={130} x2={135} y2={130} color={RED} width={3.5} />
    <T x={160} y={180} c={RED} s={11}>수평 수압 경도력</T>
    <T x={245} y={60} s={11} c={C.muted}>추워…</T>
  </>
)

const Coriolis = () => (
  <>
    <circle cx={150} cy={100} r={70} fill="#e8f4ff" stroke={C.ink} strokeWidth={1.5} />
    <line x1={80} x2={220} y1={100} y2={100} stroke={C.muted} strokeDasharray="4 4" />
    <T x={150} y={100} s={10} c={C.muted}>적도</T>
    <path d="M118 26 Q150 14 182 26" fill="none" stroke={C.ink} strokeWidth={1.5} />
    <polygon points="182,26 172,20 174,30" fill={C.ink} />
    <T x={150} y={12} s={10}>자전</T>
    <T x={125} y={62} s={12}>북</T>
    <Arrow x1={140} y1={62} x2={185} y2={62} color={C.motion} width={3} />
    <Arrow x1={185} y1={62} x2={185} y2={80} color={RED} width={2.5} head={8} />
    <T x={250} y={56} s={10} a="start">운동 방향의</T>
    <T x={250} y={70} s={10} a="start" c={RED}>오른쪽 직각</T>
    <T x={125} y={140} s={12}>남</T>
    <Arrow x1={140} y1={140} x2={185} y2={140} color={C.motion} width={3} />
    <Arrow x1={185} y1={140} x2={185} y2={122} color={RED} width={2.5} head={8} />
    <T x={250} y={134} s={10} a="start">운동 방향의</T>
    <T x={250} y={148} s={10} a="start" c={RED}>왼쪽 직각</T>
  </>
)

const GeoBalance = () => (
  <>
    <path d="M40 180 L40 110 Q40 40 120 40 L280 40 L280 180 Z" fill={WATER} stroke={C.ink} strokeWidth={1.5} />
    <circle cx={160} cy={130} r={5} fill={C.ink} />
    <Arrow x1={160} y1={130} x2={80} y2={130} color={C.pgf} width={3.5} />
    <Arrow x1={160} y1={130} x2={240} y2={130} color={RED} width={3.5} />
    <Arrow x1={160} y1={130} x2={160} y2={64} color={C.motion} width={4} />
    <T x={100} y={150} c={C.pgf} s={11}>수압 경도력</T>
    <T x={220} y={150} c={RED} s={11}>전향력</T>
    <T x={192} y={66} c={C.motion} s={12}>지형류</T>
    <T x={150} y={192} s={10} c={C.muted}>(북반구, 해수면은 동쪽이 높음)</T>
  </>
)

const GeoIsobar = () => (
  <>
    {[70, 120, 170, 220, 270].map((x) => <line key={x} x1={x} x2={x} y1={30} y2={180} stroke={C.muted} strokeWidth={1.5} />)}
    <T x={170} y={18} s={11}>등수압선</T>
    <circle cx={170} cy={120} r={5} fill={C.ink} />
    <Arrow x1={170} y1={120} x2={95} y2={120} color={C.pgf} width={3.5} />
    <Arrow x1={170} y1={120} x2={245} y2={120} color={RED} width={3.5} />
    <Arrow x1={170} y1={120} x2={170} y2={48} color={C.motion} width={4} />
    <T x={198} y={52} c={C.motion} s={12}>지형류</T>
    <T x={110} y={140} c={C.pgf} s={11}>수압 경도력</T>
    <T x={230} y={140} c={RED} s={11}>전향력</T>
    <T x={160} y={194} s={10} c={C.muted}>지형류는 등수압선과 나란하게 흐름</T>
  </>
)

const WaveStructure = () => (
  <>
    <path d={wave(100, 40, 160, 20, 300, Math.PI)} transform="translate(0 0)" fill="none" stroke={C.current} strokeWidth={3} />
    <line x1={20} x2={300} y1={100} y2={100} stroke={C.muted} strokeDasharray="3 4" />
    <T x={100} y={44} s={12}>마루</T>
    <T x={20} y={150} s={12} a="start">골</T>
    <T x={180} y={150} s={12}>골</T>
    <line x1={100} x2={260} y1={30} y2={30} stroke={C.ink} />
    <Arrow x1={180} y1={30} x2={101} y2={30} color={C.ink} width={1.5} head={7} />
    <Arrow x1={180} y1={30} x2={259} y2={30} color={C.ink} width={1.5} head={7} />
    <T x={180} y={18} s={11}>파장</T>
    <Arrow x1={290} y1={100} x2={290} y2={61} color={RED} width={1.6} head={7} />
    <Arrow x1={290} y1={100} x2={290} y2={139} color={RED} width={1.6} head={7} />
    <T x={276} y={100} s={11} c={RED} a="end">파고</T>
    <T x={160} y={186} s={11} c={C.muted}>마루~마루(골~골) 시간 = 주기</T>
  </>
)

const WaveShapes = () => {
  let zig = 'M20 100'
  for (let i = 0; i < 6; i++) zig += ` L${26 + i * 12} 86 L${32 + i * 12} 100`
  return (
    <>
      <path d={zig} fill="none" stroke={C.current} strokeWidth={2.5} strokeLinejoin="miter" />
      <path d={wave(100, 10, 60, 110, 220)} fill="none" stroke={C.current} strokeWidth={2.5} />
      <path d="M230 110 Q260 106 270 80 Q276 60 296 64 Q300 66 292 72 Q282 80 290 92 Q296 102 300 110" fill="none" stroke={C.current} strokeWidth={2.5} />
      <T x={52} y={140} s={12}>풍랑</T>
      <T x={52} y={158} s={10} c={C.muted}>마루가 뾰족</T>
      <T x={165} y={140} s={12}>너울</T>
      <T x={165} y={158} s={10} c={C.muted}>둥글, 긴 파장</T>
      <T x={270} y={140} s={12}>연안 쇄파</T>
      <T x={270} y={158} s={10} c={C.muted}>부서짐</T>
    </>
  )
}

const WaveTypes = () => (
  <>
    <path d="M10 170 L120 170 Q200 168 310 120" fill="none" stroke={C.sandDark} strokeWidth={2} />
    <path d={wave(40, 5, 36, 10, 310)} fill="none" stroke={C.current} strokeWidth={2} />
    {[0, 1, 2].map((i) => <circle key={i} cx={55} cy={58 + i * 28} r={10 - i * 4} fill="none" stroke={C.current} strokeWidth={1.5} />)}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={165} cy={58 + i * 28} rx={11 - i * 2} ry={8 - i * 3} fill="none" stroke={C.current} strokeWidth={1.5} />)}
    {[0, 1].map((i) => <ellipse key={i} cx={265} cy={58 + i * 24} rx={13} ry={i ? 0.8 : 5} fill="none" stroke={C.current} strokeWidth={1.5} />)}
    <Arrow x1={252} y1={104} x2={278} y2={104} color={C.current} width={1.5} head={6} />
    <Arrow x1={278} y1={104} x2={252} y2={104} color={C.current} width={1.5} head={6} />
    <T x={55} y={20} s={12}>심해파</T>
    <T x={165} y={20} s={12}>천이파</T>
    <T x={265} y={20} s={12}>천해파</T>
    <T x={55} y={186} s={10} c={C.muted}>원운동</T>
    <T x={165} y={186} s={10} c={C.muted}>중간</T>
    <T x={265} y={186} s={10} c={C.muted}>타원·수평 왕복</T>
  </>
)

const Refraction = () => (
  <>
    <path d="M10 70 Q70 70 110 100 Q150 150 190 100 Q230 60 310 60 L310 10 L10 10 Z" fill={C.sand} />
    <T x={60} y={40} s={12}>만</T>
    <T x={60} y={58} s={10} c={C.muted}>퇴적(모래사장)</T>
    <T x={150} y={40} s={12}>곶</T>
    <T x={150} y={58} s={10} c={C.muted}>침식(절벽)</T>
    <T x={260} y={40} s={12} c="#7a5d22">땅</T>
    <rect x={10} y={100} width={300} height={0} />
    {[[60, 182, 120, 140], [110, 182, 140, 150], [190, 182, 160, 150], [240, 182, 180, 140]].map(([a, b, c, d], i) => (
      <Arrow key={i} x1={a} y1={b} x2={c} y2={d} color={C.current} width={2.5} />
    ))}
    <T x={250} y={130} s={11} c={C.current}>바다</T>
    <T x={160} y={196} s={10} c={C.muted}>해파는 곶으로 굴절(집중)</T>
  </>
)

const StormPressure = () => (
  <>
    <path d="M10 130 Q80 140 130 130 Q190 110 230 112 Q280 116 310 130" fill="none" stroke={C.current} strokeWidth={3} />
    <line x1={10} x2={310} y1={124} y2={124} stroke={C.muted} strokeDasharray="4 4" />
    <circle cx={70} cy={50} r={20} fill="white" stroke={C.ink} />
    <T x={70} y={50} s={11}>고기압</T>
    <Arrow x1={70} y1={74} x2={70} y2={128} color={C.pgf} width={3} />
    <circle cx={220} cy={50} r={20} fill="white" stroke={RED} />
    <T x={220} y={50} s={11} c={RED}>저기압</T>
    <Arrow x1={220} y1={74} x2={220} y2={104} color={C.pgf} width={2} />
    <T x={70} y={164} s={11}>해수면 낮아짐</T>
    <T x={220} y={164} s={11} c={RED}>해수면 높아짐</T>
    <T x={160} y={190} s={10} c={C.muted}>1 hPa 낮아지면 약 1 cm 높아짐</T>
  </>
)

const MoonPhase = () => {
  const xs = [30, 95, 160, 225, 290]
  const names = ['삭', '상현', '망', '하현', '삭']
  return (
    <>
      {xs.map((x, i) => (
        <g key={i}>
          <T x={x} y={40} s={12}>{names[i]}</T>
          <circle cx={x} cy={80} r={14} fill={i === 2 ? '#fff7cc' : '#3a4556'} stroke={C.ink} strokeWidth={1} />
          {i === 1 && <path d={`M${x} 66 A14 14 0 0 1 ${x} 94 Z`} fill="#fff7cc" />}
          {i === 3 && <path d={`M${x} 66 A14 14 0 0 0 ${x} 94 Z`} fill="#fff7cc" />}
        </g>
      ))}
      <path d="M95 112 Q160 134 225 112" fill="none" stroke={C.current} strokeWidth={2} />
      <T x={160} y={140} s={12} c={C.current}>상현·하현 → 조금(소조)</T>
      <path d="M30 112 Q30 172 160 172 Q290 172 290 112" fill="none" stroke={RED} strokeWidth={2} />
      <line x1={160} x2={160} y1={112} y2={172} stroke={RED} strokeWidth={2} strokeDasharray="3 3" />
      <T x={160} y={188} s={12} c={RED}>삭·망 → 사리(대조): 조차 가장 클 때</T>
    </>
  )
}

const TideForce = () => (
  <>
    <ellipse cx={130} cy={100} rx={86} ry={58} fill={WATER} stroke={C.current} strokeWidth={2} />
    <circle cx={130} cy={100} r={46} fill="#2f8f5b" />
    <T x={130} y={100} c="white" s={12}>지구</T>
    <circle cx={290} cy={100} r={14} fill="#f2f2e6" stroke={C.ink} />
    <T x={290} y={128} s={11}>달</T>
    <Arrow x1={178} y1={100} x2={232} y2={100} color={RED} width={3} />
    <T x={205} y={86} s={10} c={RED}>인력</T>
    <Arrow x1={82} y1={100} x2={30} y2={100} color={C.pgf} width={3} />
    <T x={52} y={86} s={10} c={C.pgf}>원심력</T>
    <T x={130} y={186} s={10} c={C.muted}>가까운 쪽과 먼 쪽 모두 해수면이 높아짐</T>
  </>
)

const Spectrum = () => (
  <>
    <defs>
      <linearGradient id="fig-spec" x1="0" x2="1">
        <stop offset="0" stopColor="#8b5cf6" /><stop offset="0.3" stopColor="#3b82f6" /><stop offset="0.45" stopColor="#22c55e" />
        <stop offset="0.55" stopColor="#facc15" /><stop offset="0.7" stopColor="#ef4444" /><stop offset="1" stopColor="#7f1d1d" />
      </linearGradient>
    </defs>
    <rect x={20} y={80} width={280} height={24} rx={4} fill="url(#fig-spec)" />
    <T x={60} y={64} s={12}>자외선</T>
    <T x={160} y={64} s={12}>가시광선</T>
    <T x={260} y={64} s={12}>적외선</T>
    <T x={60} y={30} s={11} c={C.muted}>(단파장)</T>
    <T x={260} y={30} s={11} c={C.muted}>(장파장)</T>
    <Arrow x1={20} y1={130} x2={300} y2={130} color={C.ink} width={1.6} head={8} />
    <Arrow x1={300} y1={130} x2={20} y2={130} color={C.ink} width={1.6} head={8} />
    <T x={60} y={156} s={12}>파장↓ E↑</T>
    <T x={260} y={156} s={12}>파장↑ E↓</T>
  </>
)

const Foehn = () => (
  <>
    <path d="M10 180 L120 180 Q160 50 200 50 Q240 50 280 180 L310 180" fill={C.sand} stroke={C.sandDark} strokeWidth={1.5} />
    <Arrow x1={30} y1={170} x2={110} y2={150} color={C.current} width={2.5} />
    <Arrow x1={130} y1={120} x2={170} y2={50} color={C.current} width={2.5} />
    <Arrow x1={230} y1={56} x2={290} y2={160} color={RED} width={2.5} />
    <ellipse cx={150} cy={74} rx={30} ry={14} fill="white" stroke={C.muted} />
    {[140, 150, 160].map((x) => <line key={x} x1={x} x2={x - 4} y1={90} y2={104} stroke={C.current} strokeWidth={1.5} />)}
    <T x={150} y={74} s={10}>구름·비</T>
    <T x={60} y={120} s={10} c={C.current} a="middle">바람받이: 상승</T>
    <T x={270} y={100} s={10} c={RED}>바람그늘: 하강</T>
    <T x={262} y={190} s={11} c={RED}>고온 건조 '높새바람'</T>
    <line x1={110} x2={190} y1={92} y2={92} stroke={C.ink} strokeDasharray="3 3" />
    <T x={100} y={92} s={9} a="end">상승 응결 고도</T>
  </>
)

const StabilityGraph = () => (
  <>
    <Arrow x1={50} y1={180} x2={50} y2={20} color={C.ink} width={1.6} head={8} />
    <Arrow x1={50} y1={180} x2={300} y2={180} color={C.ink} width={1.6} head={8} />
    <T x={40} y={28} s={11} a="end">높이</T>
    <T x={296} y={194} s={11} a="end">온도</T>
    <line x1={110} y1={40} x2={250} y2={176} stroke={RED} strokeWidth={2.5} />
    <line x1={180} y1={40} x2={250} y2={176} stroke={C.current} strokeWidth={2.5} />
    <T x={104} y={34} s={10} c={RED} a="end">건조 단열선</T>
    <T x={186} y={32} s={10} c={C.current} a="start">습윤 단열선</T>
    <T x={110} y={140} s={11}>불안정</T>
    <T x={190} y={100} s={11}>조건부</T>
    <T x={260} y={70} s={11}>안정</T>
    <T x={175} y={196} s={9} c={C.muted}>환경 기온 감률이 놓이는 영역으로 판단</T>
  </>
)

const Precipitation = () => (
  <>
    <rect x={10} y={20} width={140} height={150} rx={10} fill="#eef5ff" />
    <T x={80} y={36} s={12}>빙정설 (고위도)</T>
    <T x={80} y={56} s={10} c={C.muted}>구름 상층 −40℃</T>
    <text x={45} y={92} fontSize={22} textAnchor="middle">❄</text>
    {[95, 110, 120].map((x, i) => <circle key={x} cx={x} cy={84 + i * 6} r={4} fill={C.current} opacity={0.6} />)}
    <Arrow x1={88} y1={96} x2={58} y2={92} color={C.current} width={1.5} head={6} />
    <T x={80} y={122} s={10}>과냉각 물방울 증발 →</T>
    <T x={80} y={138} s={10}>빙정에 달라붙어 성장</T>
    <T x={80} y={158} s={11} c={RED}>⇒ 눈, 비</T>
    <rect x={170} y={20} width={140} height={150} rx={10} fill="#fff4ea" />
    <T x={240} y={36} s={12}>병합설 (저위도)</T>
    <T x={240} y={56} s={10} c={C.muted}>구름 0℃ 이상</T>
    {[[210, 86, 5], [228, 92, 4], [250, 84, 6], [270, 94, 4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.current} opacity={0.7} />)}
    <T x={240} y={122} s={10}>물방울 충돌·병합 →</T>
    <T x={240} y={138} s={10}>큰 물방울로 성장</T>
    <T x={240} y={158} s={11} c={RED}>⇒ 비</T>
  </>
)

const GeoWind = () => (
  <>
    <line x1={30} x2={290} y1={50} y2={50} stroke={C.muted} strokeWidth={1.5} />
    <line x1={30} x2={290} y1={150} y2={150} stroke={C.muted} strokeWidth={1.5} />
    <T x={20} y={50} s={12} a="end">저</T>
    <T x={20} y={150} s={12} a="end">고</T>
    <T x={300} y={42} s={10} a="end" c={C.muted}>등압선</T>
    <circle cx={140} cy={100} r={5} fill={C.ink} />
    <Arrow x1={140} y1={100} x2={140} y2={58} color={C.pgf} width={3.5} />
    <Arrow x1={140} y1={100} x2={140} y2={142} color={RED} width={3.5} />
    <Arrow x1={140} y1={100} x2={230} y2={100} color={C.motion} width={4} />
    <T x={150} y={66} s={11} c={C.pgf} a="start">기압 경도력</T>
    <T x={150} y={134} s={11} c={RED} a="start">전향력</T>
    <T x={236} y={100} s={11} c={C.motion} a="start">바람</T>
    <T x={160} y={186} s={10} c={C.muted}>북반구 상층: 기압 경도력 = 전향력</T>
  </>
)

const Gradient = ({ high }: { high: boolean }) => (
  <>
    {[30, 55, 80].map((r) => <circle key={r} cx={120} cy={100} r={r} fill="none" stroke={C.muted} strokeDasharray="4 4" />)}
    <T x={120} y={100} s={16} c={high ? C.current : RED}>{high ? '고' : '저'}</T>
    <circle cx={120} cy={45} r={4} fill={C.ink} />
    <Arrow x1={120} y1={45} x2={120} y2={high ? 10 : 80} color={C.pgf} width={3} />
    <Arrow x1={120} y1={45} x2={120} y2={high ? 72 : 18} color={RED} width={3} />
    <Arrow x1={120} y1={45} x2={high ? 170 : 70} y2={45} color={C.motion} width={3.5} />
    <T x={232} y={50} s={11} a="middle" c={C.pgf}>기압 경도력</T>
    <T x={232} y={68} s={11} c={RED}>전향력</T>
    <T x={232} y={86} s={11} c={C.motion}>바람</T>
    <T x={232} y={120} s={11} w={800}>{high ? '시계 방향' : '시계 반대 방향'}</T>
    <T x={232} y={140} s={10} c={C.muted}>{high ? '전향력 > 기압 경도력' : '기압 경도력 > 전향력'}</T>
    <T x={232} y={158} s={10} c={C.muted}>차이 = 구심력(중심 방향)</T>
  </>
)

const ThreeCell = () => (
  <>
    <circle cx={110} cy={100} r={80} fill="#eef5ff" stroke={C.ink} strokeWidth={1.5} />
    {[0, 30, 60].map((lat) => {
      const y = 100 - 80 * Math.sin((lat * Math.PI) / 180)
      const x = 110 + 80 * Math.cos((lat * Math.PI) / 180)
      return <g key={lat}><line x1={110 - (x - 110)} x2={x} y1={y} y2={y} stroke={C.muted} strokeDasharray="3 3" /><T x={x + 6} y={y} s={10} a="start">{lat}°</T></g>
    })}
    <T x={110} y={14} s={10}>90°</T>
    <T x={250} y={84} s={11}>해들리 순환</T>
    <T x={250} y={62} s={11}>페렐 순환</T>
    <T x={250} y={36} s={11}>극순환</T>
    <T x={250} y={100} s={9} c={C.muted}>0~30°</T>
    <T x={250} y={74} s={9} c={C.muted}>30~60°</T>
    <T x={250} y={48} s={9} c={C.muted}>60~90°</T>
    <T x={220} y={170} s={10} c={RED}>지구 자전 때문에 3세포 순환</T>
  </>
)

const WesterlyWave = () => (
  <>
    <path d="M10 80 Q60 20 110 60 Q160 120 210 70 Q260 20 310 60" fill="none" stroke={C.ink} strokeWidth={2.5} />
    <Arrow x1={290} y1={50} x2={312} y2={60} color={C.ink} width={2} head={8} />
    <T x={58} y={28} s={10}>기압 마루</T>
    <T x={160} y={118} s={10}>기압골</T>
    <T x={120} y={86} s={10} c={C.current}>수렴</T>
    <T x={200} y={92} s={10} c={RED}>발산</T>
    <T x={290} y={30} s={10} a="end">편서풍</T>
    <line x1={120} y1={100} x2={120} y2={140} stroke={C.current} strokeWidth={2} />
    <Arrow x1={120} y1={110} x2={120} y2={150} color={C.current} width={2.5} />
    <Arrow x1={200} y1={150} x2={200} y2={110} color={RED} width={2.5} />
    <T x={120} y={166} s={11} c={C.current}>하강 → 지상 고기압</T>
    <T x={120} y={182} s={10} c={C.muted}>(시계 방향)</T>
    <T x={210} y={166} s={11} c={RED} a="start">상승 → 지상 저기압</T>
    <T x={210} y={182} s={10} c={C.muted} a="start">(시계 반대 방향)</T>
  </>
)

export const FIGURES: Record<string, ComponentType> = {
  hydrostatic: Hydrostatic,
  slope: Slope,
  density: Density,
  coriolis: Coriolis,
  'geo-balance': GeoBalance,
  'geo-isobar': GeoIsobar,
  'wave-structure': WaveStructure,
  'wave-shapes': WaveShapes,
  'wave-types': WaveTypes,
  refraction: Refraction,
  'storm-pressure': StormPressure,
  'moon-phase': MoonPhase,
  'tide-force': TideForce,
  spectrum: Spectrum,
  foehn: Foehn,
  'stability-graph': StabilityGraph,
  precipitation: Precipitation,
  'geo-wind': GeoWind,
  'gradient-low': () => <Gradient high={false} />,
  'gradient-high': () => <Gradient high />,
  'three-cell': ThreeCell,
  'westerly-wave': WesterlyWave,
}
