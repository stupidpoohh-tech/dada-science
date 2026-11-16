import { useEffect, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, Toggle } from '../components/ui'
import { Arrow, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const EX = 430, EY = 240, ER = 44, ORBIT = 178
const BASE = 76, AM = 22, AS = 10 // 달 기조력 : 태양 기조력 ≈ 1 : 0.46
const POS = { new: 180, first: 270, full: 0, last: 90 } as const
type Pos = keyof typeof POS
const NAMES: Record<Pos, string> = { new: '삭', first: '상현', full: '망', last: '하현' }
const MOON_C = '#6f36ff', SUN_C = '#ff8a00'
const rad = (d: number) => (d * Math.PI) / 180

export default function Scene09Tides({ step, mode, setMode }: SceneProps) {
  const pos = (mode in POS ? mode : 'new') as Pos
  useEffect(() => {
    if (step === 2 && (pos === 'first' || pos === 'last')) setMode('new')
    if (step === 3 && (pos === 'new' || pos === 'full')) setMode('first')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // 달은 반시계 방향(북극 위에서 본 공전 방향)으로 이동
  const [unwrapped, setUnwrapped] = useState<number>(POS[pos])
  useEffect(() => {
    setUnwrapped((cur) => cur + ((POS[pos] - (cur % 360) + 720) % 360))
  }, [pos])
  const ang = useTween(unwrapped, 1300)
  const moonAng = ((ang % 360) + 360) % 360
  const showSun = step >= 1
  const combined = step >= 2
  const am = AM, as = showSun ? AS : 0

  const r = (phi: number, m: number, s: number) => BASE + m * Math.cos(2 * rad(phi - moonAng)) + s * Math.cos(2 * rad(phi - 180))
  const curve = (m: number, s: number) =>
    Array.from({ length: 145 }, (_, i) => {
      const phi = i * 2.5
      const rr = r(phi, m, s)
      return `${(EX + Math.cos(rad(phi)) * rr).toFixed(1)},${(EY - Math.sin(rad(phi)) * rr).toFixed(1)}`
    }).join(' ')
  let hi = 0, lo = 999
  for (let i = 0; i < 360; i += 2) { const v = r(i, am, combined ? as : 0); hi = Math.max(hi, v); lo = Math.min(lo, v) }
  const range = hi - lo
  const aligned = Math.abs(Math.sin(rad(moonAng))) < 0.05
  const quad = Math.abs(Math.cos(rad(moonAng))) < 0.05

  const mx = EX + Math.cos(rad(moonAng)) * ORBIT, my = EY - Math.sin(rad(moonAng)) * ORBIT

  // 기조력 화살표: 천체 방향을 x축으로 할 때 (2cosψ, −sinψ)
  const tideArrows = (dirDeg: number, scale: number, color: string) =>
    Array.from({ length: 12 }, (_, i) => {
      const psi = i * 30
      const fx = 2 * Math.cos(rad(psi)), fy = -Math.sin(rad(psi))
      const g = rad(dirDeg)
      const wx = fx * Math.cos(g) - fy * Math.sin(g), wy = fx * Math.sin(g) + fy * Math.cos(g)
      const p = rad(psi + dirDeg)
      const x0 = EX + Math.cos(p) * (ER + 4), y0 = EY - Math.sin(p) * (ER + 4)
      return <Arrow key={i} x1={x0} y1={y0} x2={x0 + wx * scale} y2={y0 - wy * scale} color={color} width={3} head={9} halo />
    })

  const svg = (
    <>
      <rect width={800} height={480} fill="#0b1a2b" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 137) % 800} cy={(i * 89) % 480} r={i % 5 === 0 ? 1.4 : 0.8} fill="white" opacity={0.5} />)}
      {/* 태양 */}
      <g opacity={showSun ? 1 : 0.25} style={{ transition: 'opacity .6s' }}>
        <circle cx={-70} cy={EY} r={150} fill="#ffb02e" />
        <circle cx={-70} cy={EY} r={170} fill="#ffb02e" opacity={0.25} />
        <Tag x={40} y={EY} size={17} color="#7a3d00" bg="none">태양</Tag>
        {showSun && [-60, -20, 20, 60].map((dy) => <Arrow key={dy} x1={110} y1={EY + dy} x2={170} y2={EY + dy} color="#ffcf7a" width={2} head={8} opacity={0.6} />)}
        <text x={14} y={24} fontSize={12} fill="#c9d3e0">(태양은 실제로 매우 멀리 있음)</text>
      </g>

      {/* 공전 궤도 */}
      <circle cx={EX} cy={EY} r={ORBIT} fill="none" stroke="#5c6f87" strokeWidth={1.5} strokeDasharray="4 6" />
      {(Object.keys(POS) as Pos[]).map((k) => {
        const a = rad(POS[k])
        const x = EX + Math.cos(a) * ORBIT, y = EY - Math.sin(a) * ORBIT
        return (
          <g key={k} onClick={() => setMode(k)} style={{ cursor: 'pointer' }} className="no-tap">
            <circle cx={x} cy={y} r={26} fill="transparent" />
            <circle cx={x} cy={y} r={20} fill="none" stroke={k === pos ? '#00dc84' : '#5c6f87'} strokeWidth={2} />
            <Tag x={x + (k === 'full' ? 0 : 0)} y={y + (k === 'last' ? -34 : 34)} size={14} color={k === pos ? '#00dc84' : '#c9d3e0'} bg="none">{NAMES[k]}</Tag>
          </g>
        )
      })}

      {/* 해수(부풀어 오름) */}
      {combined ? (
        <>
          <polygon points={curve(am, 0)} fill="none" stroke={MOON_C} strokeWidth={1.8} strokeDasharray="5 4" opacity={0.85} />
          <polygon points={curve(0, as)} fill="none" stroke={SUN_C} strokeWidth={1.8} strokeDasharray="5 4" opacity={0.85} />
          <polygon points={curve(am, as)} fill="#4fb4e8" fillOpacity={0.85} stroke="#9fe7ff" strokeWidth={2.5} />
        </>
      ) : (
        <>
          <polygon points={curve(am, 0)} fill="#4fb4e8" fillOpacity={0.85} stroke="#9fe7ff" strokeWidth={2.5} />
          {showSun && <polygon points={curve(0, as)} fill="none" stroke={SUN_C} strokeWidth={2.5} strokeDasharray="6 4" className="fade" />}
        </>
      )}
      {/* 지구 */}
      <circle cx={EX} cy={EY} r={ER} fill="#2f8f5b" stroke="#bfe8fc" strokeWidth={2} />
      <path d={`M${EX - 20} ${EY - 30} q 14 6 10 22 q -10 14 6 26 M${EX + 10} ${EY - 38} q 20 10 14 30`} stroke="#9bd38c" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M${EX} ${EY - ER} A ${ER} ${ER} 0 0 1 ${EX} ${EY + ER} Z`} fill="#000a14" opacity={0.35} />
      <Tag x={EX} y={EY} size={14} color="white" bg="none">지구</Tag>

      {/* 기조력 화살표 */}
      {step <= 1 && <g key={`m${pos}`} className="fade">{tideArrows(moonAng, 15, MOON_C)}</g>}
      {step === 1 && <g className="fade">{tideArrows(180, 15 * 0.46, SUN_C)}</g>}

      {/* 달 */}
      <g>
        <circle cx={mx} cy={my} r={16} fill="#3a4556" />
        <path d={`M${mx} ${my - 16} A 16 16 0 0 0 ${mx} ${my + 16} Z`} fill="#f2f2e6" />
        <circle cx={mx} cy={my} r={16} fill="none" stroke="#c9d3e0" strokeWidth={1.5} />
      </g>
      {step === 0 && <Tag x={mx} y={my - 30} size={14} color="white" bg="none">달</Tag>}

      {/* 조차 패널 */}
      <g transform="translate(660 70)">
        <rect width={128} height={300} rx={14} fill="white" />
        <text x={64} y={26} fontSize={15} fontWeight={800} textAnchor="middle" fill={C.ink}>해안의 조차</text>
        {(() => {
          const s = 2.2
          const yHi = 160 - (hi - BASE) * s, yLo = 160 - (lo - BASE) * s
          return (
            <g>
              <rect x={24} y={yHi} width={44} height={260 - yHi} fill="#bfe8fc" />
              <line x1={18} x2={74} y1={yHi} y2={yHi} stroke={C.current} strokeWidth={3} />
              <line x1={18} x2={74} y1={yLo} y2={yLo} stroke={C.current} strokeWidth={3} strokeDasharray="5 3" />
              <text x={78} y={yHi + 4} fontSize={12} fontWeight={700} fill={C.current}>만조</text>
              <text x={78} y={yLo + 4} fontSize={12} fontWeight={700} fill={C.current}>간조</text>
              <Arrow x1={46} y1={(yHi + yLo) / 2} x2={46} y2={yHi + 2} color={C.coriolis} width={2.5} head={8} />
              <Arrow x1={46} y1={(yHi + yLo) / 2} x2={46} y2={yLo - 2} color={C.coriolis} width={2.5} head={8} />
              <text x={64} y={282} fontSize={14} fontWeight={800} textAnchor="middle" fill={C.coriolis}>조차 {Math.round((range / (2 * (AM + AS))) * 100)}%</text>
            </g>
          )
        })()}
      </g>
      {combined && (aligned || quad) && (
        <g key={pos} className="pop">
          <rect x={660} y={384} width={128} height={56} rx={14} fill={aligned ? '#00dc84' : '#00b7ff'} />
          <text x={724} y={406} fontSize={22} fontWeight={800} textAnchor="middle" dominantBaseline="middle" fill={C.ink}>{aligned ? '사리' : '조금'}</text>
          <text x={724} y={428} fontSize={12} fontWeight={700} textAnchor="middle" fill={C.ink}>{aligned ? '조차가 큼' : '조차가 작음'}</text>
        </g>
      )}
      {step >= 2 && (aligned || quad) && (
        <text x={EX} y={462} fontSize={15} fontWeight={700} textAnchor="middle" fill="#c9d3e0">
          {aligned ? '태양·지구·달이 일직선 → 두 기조력의 방향 일치' : '태양과 달이 지구에서 직각 → 기조력이 서로 일부 상쇄'}
        </text>
      )}
    </>
  )

  return (
    <SceneFrame label="태양, 지구, 달의 위치와 기조력에 의한 해수면의 부풀어 오름" svg={svg}
      controls={
        <Toggle label="달의 위치" value={pos} onChange={(v) => setMode(v)}
          options={(['new', 'first', 'full', 'last'] as Pos[]).map((k) => ({ value: k, label: NAMES[k] }))} />
      }
      legend={<Legend items={[{ color: MOON_C, label: '달의 기조력' }, { color: SUN_C, label: '태양의 기조력' }, { color: '#4fb4e8', label: '해수면 모양(합성)', thick: true }]} />}
      note={<ModelNote>북극 위에서 내려다본 모습이며 해수의 부풀어 오름은 크게 과장했습니다. 실제 해안에서는 대륙과 해저 지형의 영향으로 사리가 삭·망보다 1~2일 늦게 나타나기도 합니다.</ModelNote>}
    />
  )
}
