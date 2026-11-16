import type { ComponentType, ReactNode } from 'react'
import { Arrow, C } from '../components/svg'

/**
 * 교과서 문제 그림(정적 SVG). 교과서 그림의 구성을 단순화해 다시 그렸습니다.
 * 기본 viewBox 320×200, wide 그림은 560×220 (문항의 diagram.wide)
 */
const T = ({ x, y, children, c = C.ink, s = 11, a = 'middle', w = 600 }: { x: number; y: number; children: ReactNode; c?: string; s?: number; a?: 'start' | 'middle' | 'end'; w?: number }) => (
  <text x={x} y={y} fontSize={s} fontWeight={w} fill={c} textAnchor={a} dominantBaseline="middle">{children}</text>
)
const RED = '#e8384f'
const WATER = '#cdeefe'
const YEL = '#f5b400'
const GREEN = '#16a34a'
const Dot = ({ x, y, label, dx = 0, dy = -9 }: { x: number; y: number; label: string; dx?: number; dy?: number }) => (
  <><circle cx={x} cy={y} r={2.6} fill={C.ink} /><T x={x + dx} y={y + dy} w={700}>{label}</T></>
)

/** 1단계 4: 정역학 평형 상태의 해수 덩어리 */
const Column = () => (
  <>
    <path d="M120 40 L200 40 L200 190 L120 190 Z" fill={WATER} stroke={C.water4} strokeWidth={1.2} />
    <path d="M120 40 L145 22 L225 22 L200 40 Z" fill="#e6f7ff" stroke={C.water4} strokeWidth={1.2} />
    <path d="M200 40 L225 22 L225 172 L200 190 Z" fill="#b5e3f9" stroke={C.water4} strokeWidth={1.2} />
    {[80, 120, 160].map((y) => <line key={y} x1={120} x2={200} y1={y} y2={y} stroke="white" strokeWidth={1.5} />)}
    <path d="M120 100 L200 100 L200 140 L120 140 Z" fill="#8fd2f5" opacity={0.7} />
    <T x={170} y={31} s={10}>해수면(ρ)</T>
    <Arrow x1={160} y1={118} x2={160} y2={84} color={YEL} width={3.5} />
    <Arrow x1={160} y1={122} x2={160} y2={156} color={C.current} width={3.5} />
    <T x={174} y={92} w={800}>A</T>
    <T x={174} y={150} w={800}>B</T>
  </>
)

/** 1단계 5: (가) 지형류의 발생 원리, (나) 북태평양 0°~10°N의 경사진 해수면 */
const GeoPair = () => (
  <>
    {/* (가) */}
    <path d="M30 110 L160 70 L230 70 L230 190 L30 190 Z" fill={WATER} stroke={C.water4} strokeWidth={1.2} />
    <path d="M30 110 L100 70 L160 70" fill="none" stroke={C.water4} strokeWidth={1} opacity={0.5} />
    <T x={60} y={92} s={10}>낮은 해수면</T>
    <T x={190} y={58} s={10}>높은 해수면</T>
    <Arrow x1={130} y1={160} x2={70} y2={160} color={GREEN} width={3} />
    <Arrow x1={130} y1={160} x2={190} y2={160} color={RED} width={3} />
    <Arrow x1={130} y1={160} x2={170} y2={118} color={C.current} width={3} />
    <T x={70} y={176} s={10} c={GREEN}>수압 경도력</T>
    <T x={190} y={176} s={10} c={RED}>전향력</T>
    <T x={182} y={110} s={10} c={C.current}>지형류</T>
    <T x={130} y={208} s={12} w={700}>(가)</T>
    {/* (나) */}
    <line x1={290} x2={530} y1={190} y2={190} stroke={C.ink} strokeWidth={1.2} />
    <path d="M300 160 Q350 158 410 70 Q470 158 520 160 L520 190 L300 190 Z" fill={WATER} />
    <path d="M300 160 Q350 158 410 70 Q470 158 520 160" fill="none" stroke={C.water4} strokeWidth={2} />
    <T x={410} y={40} s={10}>위도</T>
    {[['0°', 300], ['5°N', 410], ['10°N', 520]].map(([l, x]) => <g key={l as string}><line x1={x as number} x2={x as number} y1={50} y2={56} stroke={C.ink} /><T x={x as number} y={62} s={10}>{l}</T></g>)}
    <line x1={300} x2={520} y1={53} y2={53} stroke={C.ink} />
    <T x={340} y={100} s={10}>해수면</T>
    <line x1={410} x2={410} y1={70} y2={190} stroke={C.ink} strokeDasharray="3 3" strokeOpacity={0.5} />
    <T x={355} y={176} w={800}>A</T>
    <T x={465} y={176} w={800}>B</T>
    <T x={410} y={208} s={12} w={700}>(나)</T>
  </>
)

/** 2단계 6: 쿠로시오 해류 */
const Kuroshio = () => (
  <>
    <rect width={320} height={200} fill={WATER} />
    <path d="M150 0 L320 0 L320 40 Q280 60 250 58 Q215 66 190 80 Q170 70 150 76 Q130 60 150 40 Z" fill={C.sand} stroke={C.sandDark} />
    <T x={250} y={30} s={11}>일본</T>
    <path d="M30 150 Q120 140 180 112 Q230 92 300 86" fill="none" stroke="#ff9d3b" strokeWidth={22} strokeLinecap="round" opacity={0.85} />
    <Arrow x1={260} y1={90} x2={306} y2={85} color="#ff7a00" width={8} />
    <T x={150} y={126} s={11} w={700}>쿠로시오 해류</T>
    <T x={135} y={100} s={13} w={800}>A</T>
    <T x={160} y={160} s={13} w={800}>B</T>
  </>
)

/** 2단계 7: 통가 화산 폭발 쓰나미 도달 시간 */
const Tonga = () => {
  const cx = 250, cy = 165
  return (
    <>
      <rect width={320} height={200} fill="#cfe9f7" />
      <path d="M0 0 L60 0 L70 30 L40 70 L0 80 Z" fill={C.sand} />
      <path d="M60 120 Q90 110 120 128 Q118 160 90 168 Q60 160 60 120 Z" fill={C.sand} />
      <T x={92} y={145} s={9} c={C.muted}>오스트레일리아</T>
      {[2, 4, 6, 8, 10, 12].map((h) => (
        <g key={h}>
          <ellipse cx={cx} cy={cy} rx={h * 17} ry={h * 13} fill="none" stroke={C.water5} strokeWidth={0.9} opacity={0.8} />
          <T x={cx + 14} y={cy - h * 13 + 6} s={8} c={C.water5} a="start">{h}시간</T>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={3} fill={RED} /><T x={cx + 4} y={cy + 10} s={9} a="start">통가</T>
      <line x1={cx} y1={cy} x2={58} y2={18} stroke={RED} strokeWidth={1.4} strokeDasharray="4 3" />
      <T x={112} y={82} s={9} c={RED} a="end">8,400 km</T>
      <Dot x={58} y={18} label="A" dx={-8} dy={4} />
      <Dot x={210} y={92} label="B" dx={-9} dy={0} />
    </>
  )
}

/** 2단계 8: 해안으로 다가오는 해파 */
const CoastWaves = () => (
  <>
    <rect width={320} height={200} fill="#3a8fc4" />
    <path d="M0 200 L0 160 Q80 140 160 150 Q240 160 320 120 L320 200 Z" fill={C.sand} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const y = 30 + i * 20
      const bend = i * 4
      return <path key={i} d={`M-10 ${y - 20 + bend} Q100 ${y} 170 ${y + 6} Q250 ${y + 4 - bend} 330 ${y - 26 + i * 3}`} fill="none" stroke="white" strokeWidth={3 - i * 0.2} opacity={0.9} />
    })}
    <T x={250} y={186} s={10} c={C.rockDark}>해안</T>
  </>
)

/** 2단계 9: 두 지역의 조석 (가)·(나) */
const TideTwo = () => {
  const graph = (x0: number, amp: (d: number) => number, perDay: number, label: string) => {
    const w = 220, h = 140, y0 = 30
    let d = ''
    for (let i = 0; i <= 1600; i++) {
      const day = (i / 1600) * 20
      const v = amp(day) * Math.sin(day * perDay * 2 * Math.PI)
      d += `${d ? 'L' : 'M'}${(x0 + (day / 20) * w).toFixed(1)} ${(y0 + h / 2 - (v / 4) * (h / 2)).toFixed(1)} `
    }
    return (
      <g>
        <rect x={x0} y={y0} width={w} height={h} fill="white" stroke={C.ink} strokeWidth={0.8} />
        <line x1={x0} x2={x0 + w} y1={y0 + h / 2} y2={y0 + h / 2} stroke={C.line} />
        <path d={d} fill="none" stroke={RED} strokeWidth={0.7} />
        {[-4, -2, 0, 2, 4].map((v) => <T key={v} x={x0 - 4} y={y0 + h / 2 - (v / 4) * (h / 2)} s={8} a="end">{v}</T>)}
        {[0, 5, 10, 15, 20].map((v) => <T key={v} x={x0 + (v / 20) * w} y={y0 + h + 9} s={8}>{v}</T>)}
        <T x={x0 + w - 2} y={y0 + h + 20} s={8} a="end">음력(일)</T>
        <T x={x0 + w / 2} y={y0 + h + 32} s={11} w={700}>{label}</T>
      </g>
    )
  }
  return (
    <>
      <T x={14} y={100} s={8.5}>해</T><T x={14} y={110} s={8.5}>수</T><T x={14} y={120} s={8.5}>면</T>
      {graph(40, (d) => 1.5 + 0.9 * Math.cos((d / 14.8) * 2 * Math.PI), 1, '(가)')}
      {graph(320, (d) => 2.6 + 1.1 * Math.cos((d / 14.8) * 2 * Math.PI), 1.93, '(나)')}
    </>
  )
}

/** 2단계 10: 북태평양 아열대 환류 */
const Gyre = () => (
  <>
    <rect width={320} height={200} fill="#bfe3f5" />
    <path d="M0 0 L46 0 Q60 40 48 80 Q40 120 20 150 L0 160 Z" fill={C.sand} />
    <path d="M320 0 L262 0 Q250 40 270 90 Q285 120 300 150 L320 160 Z" fill={C.sand} />
    {/* 시계 방향 환류 */}
    <path d="M70 120 Q60 70 110 52" fill="none" stroke={GREEN} strokeWidth={5} />
    <Arrow x1={100} y1={55} x2={118} y2={50} color={GREEN} width={5} />
    <path d="M120 46 Q180 34 238 52" fill="none" stroke={GREEN} strokeWidth={4} />
    <Arrow x1={228} y1={48} x2={244} y2={56} color={GREEN} width={4} />
    <path d="M250 64 Q262 100 250 128" fill="none" stroke={GREEN} strokeWidth={3} />
    <Arrow x1={254} y1={118} x2={248} y2={132} color={GREEN} width={3} />
    <path d="M240 140 Q170 150 90 138" fill="none" stroke={GREEN} strokeWidth={4} />
    <Arrow x1={100} y1={140} x2={80} y2={134} color={GREEN} width={4} />
    <path d="M80 168 L250 168" fill="none" stroke={GREEN} strokeWidth={3} strokeDasharray="0" />
    <Arrow x1={230} y1={168} x2={256} y2={168} color={GREEN} width={3} />
    <path d="M250 186 L90 186" fill="none" stroke={GREEN} strokeWidth={3} />
    <Arrow x1={110} y1={186} x2={84} y2={186} color={GREEN} width={3} />
    <ellipse cx={180} cy={92} rx={48} ry={22} fill="#e9d6f7" opacity={0.85} />
    <T x={180} y={86} s={8.5} c="#7a2bb5">북태평양의 거대한</T>
    <T x={180} y={98} s={8.5} c="#7a2bb5">쓰레기 구역</T>
    <T x={180} y={30} s={9}>북태평양 해류</T>
    <T x={40} y={92} s={9} a="start">쿠로시오</T><T x={44} y={104} s={9} a="start">해류</T>
    <T x={80} y={80} s={12} w={800}>A</T>
    <T x={272} y={98} s={9}>캘리포니아</T><T x={272} y={110} s={9}>해류</T>
    <T x={238} y={100} s={12} w={800}>B</T>
    <T x={170} y={130} s={9}>북적도 해류</T>
    <T x={170} y={160} s={8.5}>적도 반류</T>
    <T x={170} y={178} s={8.5}>남적도 해류</T>
  </>
)

/** 2단계 11: 물 입자 운동 (가)·(나) */
const DeepShallow = () => {
  const box = (x0: number, label: string, shallow: boolean) => (
    <g>
      <rect x={x0} y={20} width={230} height={160} fill={WATER} stroke={C.water4} />
      <path d={`M${x0} 30 ${Array.from({ length: 24 }, (_, i) => `L${x0 + (i + 1) * 10} ${30 - 5 * Math.cos(((i + 1) / 6) * Math.PI)}`).join(' ')}`} fill="none" stroke={C.water5} strokeWidth={1.4} />
      {[0, 1, 2, 3, 4].map((col) => [0, 1, 2, 3].map((row) => {
        const cx = x0 + 28 + col * 44, cy = 52 + row * 34
        const rx = shallow ? 14 - row * 1 : 14 * Math.exp(-row * 0.75)
        const ry = shallow ? 12 - row * 3.4 : 14 * Math.exp(-row * 0.75)
        return <ellipse key={`${col}-${row}`} cx={cx} cy={cy} rx={rx} ry={Math.max(ry, 0.6)} fill="none" stroke={C.ink} strokeWidth={0.9} />
      }))}
      {shallow && <><rect x={x0} y={168} width={230} height={12} fill={C.sand} /><T x={x0 + 200} y={174} s={9}>해저면</T></>}
      <T x={x0 + 115} y={196} s={11} w={700}>{label}</T>
    </g>
  )
  return <>{box(30, '(가)', false)}{box(300, '(나)', true)}</>
}

/** 05: 해파의 파장과 속도 */
const WaveSpeed = () => {
  const x0 = 50, y0 = 170, sx = 240 / 560, sy = 140 / 30
  let d = ''
  for (let L = 0; L <= 560; L += 5) d += `${d ? 'L' : 'M'}${(x0 + L * sx).toFixed(1)} ${(y0 - Math.sqrt(1.5625 * L) * sy).toFixed(1)} `
  return (
    <>
      <line x1={x0} y1={y0} x2={x0 + 250} y2={y0} stroke={C.ink} /><line x1={x0} y1={y0} x2={x0} y2={20} stroke={C.ink} />
      {[0, 5, 10, 15, 20, 25].map((v) => <g key={v}><T x={x0 - 6} y={y0 - v * sy} s={8.5} a="end">{v}</T><line x1={x0} x2={x0 + 240} y1={y0 - v * sy} y2={y0 - v * sy} stroke={C.line} strokeWidth={0.5} /></g>)}
      {[100, 200, 300, 400, 500].map((v) => <T key={v} x={x0 + v * sx} y={y0 + 10} s={8.5}>{v}</T>)}
      <path d={d} fill="none" stroke="#ff7a00" strokeWidth={2} />
      <line x1={x0} x2={x0 + 400 * sx} y1={y0 - 25 * sy} y2={y0 - 25 * sy} stroke={C.ink} strokeDasharray="3 3" />
      <line x1={x0 + 400 * sx} x2={x0 + 400 * sx} y1={y0 - 25 * sy} y2={y0} stroke={C.ink} strokeDasharray="3 3" />
      <T x={x0 + 250} y={y0 + 22} s={9} a="end">파장(m)</T>
      <T x={20} y={60} s={9}>속도</T><T x={20} y={72} s={9}>(m/s)</T>
    </>
  )
}

/** 06: 해저 지진으로 발생한 해파의 이동 */
const TsunamiSection = () => (
  <>
    <path d="M0 70 L320 70 L320 175 L250 175 L120 110 L40 80 L0 70 Z" fill={WATER} />
    <path d="M0 70 L40 80 L120 110 L250 175 L320 175 L320 200 L0 200 Z" fill={C.sand} stroke={C.sandDark} />
    <path d="M0 55 Q20 50 40 70" fill="none" stroke={C.sandDark} strokeWidth={0} />
    <rect x={0} y={40} width={30} height={30} fill={C.sand} />
    <line x1={90} x2={90} y1={70} y2={98} stroke={C.ink} strokeWidth={1.2} />
    <T x={98} y={88} s={9} a="start">100 m</T>
    <Dot x={90} y={70} label="A" />
    <line x1={180} x2={180} y1={70} y2={140} stroke={C.ink} strokeWidth={1.2} />
    <T x={188} y={120} s={9} a="start">4 km</T>
    <Dot x={180} y={70} label="B" />
    <path d={`M250 62 ${Array.from({ length: 20 }, (_, i) => `L${252 + i * 3} ${62 - 5 * Math.sin(i / 3)}`).join(' ')}`} fill="none" stroke={RED} strokeWidth={1.4} />
    <Arrow x1={260} y1={44} x2={220} y2={44} color={C.ink} width={1.6} />
    <T x={272} y={44} s={10} a="start">해파</T>
  </>
)

/** 07: 태양·지구·달의 상대적 위치 */
const SunEarthMoon = () => (
  <>
    <circle cx={45} cy={100} r={26} fill="#ffb02e" />
    <T x={45} y={140} s={10}>태양</T>
    <line x1={72} x2={260} y1={100} y2={100} stroke={C.line} />
    <circle cx={200} cy={100} r={60} fill="none" stroke={C.line} strokeDasharray="3 3" />
    <circle cx={200} cy={100} r={18} fill="#4fb4e8" />
    <circle cx={200} cy={100} r={9} fill="#2f8f5b" />
    <T x={200} y={130} s={10}>지구</T>
    {[['A', 140, 100, -10, 0], ['B', 200, 40, 0, -12], ['C', 260, 100, 12, 0]].map(([l, x, y, dx, dy]) => (
      <g key={l as string}><circle cx={x as number} cy={y as number} r={6} fill="#d6d6cc" stroke={C.muted} /><T x={(x as number) + (dx as number)} y={(y as number) + (dy as number)} s={11} w={800}>{l}</T></g>
    ))}
    <circle cx={200} cy={160} r={6} fill="#d6d6cc" stroke={C.muted} /><T x={200} y={176} s={10}>달</T>
  </>
)

/** 08: 인천 앞바다 한 달 조석 */
const IncheonTide = () => {
  const x0 = 34, y0 = 170, w = 270, h = 150
  let d = ''
  for (let i = 0; i <= 1600; i++) {
    const day = 1 + (i / 1600) * 30
    const amp = 2.9 + 1.4 * Math.cos(((day - 6) / 14.8) * 2 * Math.PI)
    const v = 4.8 + amp * Math.sin(day * 1.93 * 2 * Math.PI)
    d += `${d ? 'L' : 'M'}${(x0 + ((day - 1) / 30) * w).toFixed(1)} ${(y0 - (v / 10) * h).toFixed(1)} `
  }
  return (
    <>
      <rect x={x0} y={y0 - h} width={w} height={h} fill="white" stroke={C.ink} strokeWidth={0.8} />
      {[0, 2, 4, 6, 8, 10].map((v) => <T key={v} x={x0 - 4} y={y0 - (v / 10) * h} s={8} a="end">{v}</T>)}
      {[1, 5, 9, 13, 17, 21, 25, 29].map((v) => <T key={v} x={x0 + ((v - 1) / 30) * w} y={y0 + 9} s={8}>{v}</T>)}
      <path d={d} fill="none" stroke={C.current} strokeWidth={0.5} />
      <T x={x0 + w} y={y0 + 21} s={8.5} a="end">양력(일)</T>
      <T x={12} y={95} s={8.5}>해</T><T x={12} y={105} s={8.5}>수</T><T x={12} y={115} s={8.5}>면</T>
      <T x={12} y={127} s={7.5}>(m)</T>
    </>
  )
}

/** 대단원 마무리 02: 에크만 나선과 에크만 수송 */
const EkmanSpiral = () => {
  const ox = 150, oy = 60
  const arrows = [0, 1, 2, 3, 4, 5, 6].map((k) => {
    const ang = (-45 - k * 30) * (Math.PI / 180)
    const len = 60 * Math.exp(-k * 0.45)
    const y = oy + k * 18
    return { x1: ox, y1: y, x2: ox + Math.cos(ang + Math.PI / 2) * len, y2: y + Math.sin(ang + Math.PI / 2) * len * 0.45 }
  })
  return (
    <>
      <path d="M60 50 L250 50 L280 30 L280 170 L250 190 L60 190 Z" fill={WATER} opacity={0.7} />
      <line x1={ox} x2={ox} y1={60} y2={180} stroke={C.ink} strokeWidth={0.8} />
      <Arrow x1={ox} y1={60} x2={ox - 10} y2={8} color={C.wind} width={3} />
      <T x={ox - 26} y={16} s={10}>바람</T>
      {arrows.map((a, i) => <Arrow key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} color={RED} width={i === 0 ? 2.4 : 1.6} />)}
      <T x={226} y={30} s={9.5}>표면 해수의</T><T x={226} y={42} s={9.5}>이동 방향</T>
      <T x={ox + 18} y={54} s={9} c={C.muted}>45°</T>
      <Arrow x1={ox} y1={110} x2={262} y2={118} color={C.current} width={4} />
      <T x={236} y={136} s={10} c={C.current}>에크만</T><T x={236} y={148} s={10} c={C.current}>수송</T>
      <T x={40} y={110} s={10}>깊</T><T x={40} y={122} s={10}>이</T>
    </>
  )
}

/** 대단원 마무리 03: 지형류가 흐르는 해역의 해수면 경사 */
const GeoBox = () => (
  <>
    <path d="M30 120 L190 70 L290 50 L290 180 L30 180 Z" fill="#7fc8ee" />
    <path d="M30 120 L110 80 L270 30 L190 70 Z" fill="#b8e4f8" opacity={0.8} />
    <T x={60} y={92} s={10}>낮은 수면</T>
    <T x={250} y={22} s={10}>높은 수면</T>
    <Arrow x1={160} y1={110} x2={110} y2={110} color={GREEN} width={3.4} />
    <Arrow x1={160} y1={110} x2={215} y2={110} color={YEL} width={3.4} />
    <Arrow x1={160} y1={110} x2={196} y2={80} color={RED} width={3.4} />
    <T x={206} y={72} s={11} w={800}>(가)</T>
    <T x={100} y={126} s={11} w={800}>(나)</T>
    <T x={232} y={110} s={11} w={800}>(다)</T>
  </>
)

/** 대단원 마무리 04: 동일 위도에서 깊이에 따른 수온 */
const TempSection = () => {
  const x0 = 40, y0 = 22, w = 270, h = 148
  const X = (km: number) => x0 + (km / 800) * w
  const Y = (m: number) => y0 + (m / 1400) * h
  // 등온선: 서쪽(해안 쪽)은 얕고 동쪽으로 갈수록 깊어짐. 경사는 150~350 km 구간에서 가장 급함
  const lines: [number, number][] = [[20, 140], [18, 320], [16, 520], [12, 760], [8, 960], [6, 1090], [4, 1230]]
  const depthAt = (deep: number, km: number) => deep * (0.12 + 0.88 * (0.5 + 0.5 * Math.tanh((km - 230) / 90)))
  return (
    <>
      <rect x={x0} y={y0} width={w} height={h} fill="white" stroke={C.ink} strokeWidth={0.8} />
      <rect x={x0 - 6} y={y0} width={6} height={h} fill={C.sandDark} />
      {lines.map(([t, deep]) => {
        let d = ''
        for (let km = 0; km <= 800; km += 10) d += `${d ? 'L' : 'M'}${X(km).toFixed(1)} ${Y(depthAt(deep, km)).toFixed(1)} `
        return <g key={t}><path d={d} fill="none" stroke={C.water5} strokeWidth={1} /><T x={X(700)} y={Y(deep) - 6} s={8} c={C.water5}>{t} ℃</T></g>
      })}
      {[0, 200, 400, 600, 800, 1000, 1200, 1400].map((v) => <T key={v} x={x0 - 9} y={Y(v)} s={7.5} a="end">{v}</T>)}
      {[0, 200, 400, 600, 800].map((v) => <T key={v} x={X(v)} y={y0 + h + 9} s={7.5}>{v}</T>)}
      <T x={x0 + w} y={y0 + h + 20} s={8} a="end">거리(km)</T>
      <T x={12} y={90} s={8}>깊</T><T x={12} y={100} s={8}>이</T><T x={12} y={110} s={7}>(m)</T>
      <T x={x0 + 10} y={y0 + h - 8} s={9} w={700}>서</T><T x={x0 + w - 10} y={y0 + h - 8} s={9} w={700}>동</T>
      <Dot x={X(40)} y={Y(0) + 2} label="A" dy={-9} />
      <Dot x={X(250)} y={Y(0) + 2} label="B" dy={-9} />
      <Dot x={X(230)} y={Y(depthAt(520, 230))} label="C" dx={-9} dy={0} />
      <Dot x={X(560)} y={Y(depthAt(520, 560))} label="D" dx={0} dy={-9} />
    </>
  )
}

export const TEXTBOOK_FIGURES: Record<string, ComponentType> = {
  'tb-column': Column,
  'tb-geo-pair': GeoPair,
  'tb-kuroshio': Kuroshio,
  'tb-tonga': Tonga,
  'tb-coast-waves': CoastWaves,
  'tb-tide-two': TideTwo,
  'tb-gyre': Gyre,
  'tb-deep-shallow': DeepShallow,
  'tb-wave-speed': WaveSpeed,
  'tb-tsunami-section': TsunamiSection,
  'tb-sun-earth-moon': SunEarthMoon,
  'tb-incheon-tide': IncheonTide,
  'tb-ekman': EkmanSpiral,
  'tb-geo-box': GeoBox,
  'tb-temp-section': TempSection,
}
