import { useEffect, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton } from '../components/ui'
import { Arrow, Bubble, C, Tag } from '../components/svg'
import { useClock } from '../lib/anim'

const LAMBDA = 300
const K = (2 * Math.PI) / LAMBDA
const A = 24
const T = 3.2 // 주기(초, 화면상)
const W = (2 * Math.PI) / T
const SURF = 160
const X0 = 20, X1 = 780
const DEPTHS = [0, 40, 80, 120, LAMBDA / 2]
const COLS = Array.from({ length: 10 }, (_, i) => 60 + i * 75)
type Mark = 'crest' | 'trough' | 'height' | 'length'

/** 심해파 선형 이론: 수면 η = A cos(kx − ωt), 입자 변위 ξ = −A e^{−kz} sin(·), ζ = A e^{−kz} cos(·) */
const eta = (x: number, t: number) => A * Math.cos(K * x - W * t)

export default function Scene06Waves({ step }: SceneProps) {
  const [playing, setPlaying] = useState(false)
  const [t] = useClock(playing)
  const [picked, setPicked] = useState<[number, number] | null>(null)
  const [marks, setMarks] = useState<Mark[]>([])

  useEffect(() => {
    if (step >= 1) setPlaying(true)
  }, [step])

  const toggleMark = (m: Mark) => setMarks((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]))
  const showOrbits = step >= 4

  const surface = Array.from({ length: 153 }, (_, i) => {
    const x = X0 + ((X1 - X0) * i) / 152
    return `${x.toFixed(1)},${(SURF - eta(x, t)).toFixed(1)}`
  }).join(' ')

  // 현재 화면 안의 마루/골 위치
  const phase0 = (W * t) / K // 마루 위치: kx − ωt = 2πn → x = ωt/k + nλ
  const crests: number[] = [], troughs: number[] = []
  for (let n = -3; n <= 4; n++) {
    const xc = phase0 + n * LAMBDA
    if (xc > X0 + 10 && xc < X1 - 10) crests.push(xc)
    const xt = xc + LAMBDA / 2
    if (xt > X0 + 10 && xt < X1 - 10) troughs.push(xt)
  }
  const c1 = crests.find((c) => c + LAMBDA < X1 - 10) ?? crests[0]

  const particle = (x0: number, d: number) => {
    const r = A * Math.exp(-K * d)
    const ph = K * x0 - W * t
    return { x: x0 - r * Math.sin(ph), y: SURF + d - r * Math.cos(ph), r }
  }

  const svg = (
    <>
      <defs>
        <linearGradient id="s6-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe8fc" />
          <stop offset="1" stopColor="#2a7fc4" />
        </linearGradient>
      </defs>
      <rect width={800} height={480} fill="#f4fbff" />
      <polygon points={`${X0},480 ${surface} ${X1},480`} fill="url(#s6-w)" />
      <polyline points={surface} fill="none" stroke={C.current} strokeWidth={4} strokeLinejoin="round" />
      <line x1={X0} x2={X1} y1={SURF} y2={SURF} stroke={C.ink} strokeOpacity={0.3} strokeDasharray="5 6" />
      <Tag x={X1 - 4} y={SURF + 2} anchor="end" size={12} color={C.muted} bg="none">정지 수면</Tag>

      {/* 진행 방향 */}
      <g>
        <Arrow x1={560} y1={46} x2={720} y2={46} color={C.ink} width={6} />
        <Tag x={640} y={22} size={15}>파도의 진행 방향</Tag>
      </g>

      {/* 원 궤도 */}
      {COLS.map((x0) => DEPTHS.map((d) => {
        const r = A * Math.exp(-K * d)
        const sel = picked && picked[0] === x0 && picked[1] === d
        if (!(showOrbits || sel)) return null
        return <circle key={`o${x0}-${d}`} cx={x0} cy={SURF + d} r={Math.max(r, 0.8)} fill="none"
          stroke={sel ? C.ekman : 'white'} strokeWidth={sel ? 3 : 1.4} strokeOpacity={sel ? 1 : 0.7} />
      }))}

      {/* 물 입자 */}
      {COLS.map((x0) => DEPTHS.map((d) => {
        const p = particle(x0, d)
        const sel = picked && picked[0] === x0 && picked[1] === d
        return (
          <g key={`p${x0}-${d}`} onClick={() => setPicked(sel ? null : [x0, d])} style={{ cursor: 'pointer' }} className="no-tap">
            <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
            {sel && <line x1={x0} y1={SURF + d} x2={p.x} y2={p.y} stroke={C.ekman} strokeWidth={2} />}
            <circle cx={p.x} cy={p.y} r={sel ? 9 : 6} fill={sel ? C.ekman : 'white'} stroke={sel ? 'white' : C.water5} strokeWidth={sel ? 3 : 2} />
          </g>
        )
      }))}
      {picked && (() => {
        const p = particle(picked[0], picked[1])
        const ph = K * picked[0] - W * t
        const vx = Math.cos(ph), vy = -Math.sin(ph) // 속도 방향(화면 좌표)
        return (
          <g>
            <circle cx={picked[0]} cy={SURF + picked[1]} r={3} fill={C.ekman} />
            {p.r > 6 && <Arrow x1={p.x} y1={p.y} x2={p.x + vx * 34} y2={p.y + vy * 34} color={C.motion} width={4} halo />}
            <Bubble x={Math.min(Math.max(picked[0] - 110, 10), 570)} y={Math.min(SURF + picked[1] + p.r + 18, 400)} w={220} color={C.ekman}
              lines={['이 입자의 궤적', p.r > 6 ? '한 바퀴 돌고 제자리로' : '거의 움직이지 않음']} />
          </g>
        )
      })()}

      {/* 용어 표시 */}
      {marks.includes('crest') && crests.map((x) => (
        <g key={`c${x}`}><line x1={x} x2={x} y1={SURF - A - 30} y2={SURF - A} stroke={C.coriolis} strokeWidth={2} />
          <Tag x={x} y={SURF - A - 40} size={15} color={C.coriolis}>마루</Tag></g>
      ))}
      {marks.includes('trough') && troughs.map((x) => (
        <g key={`t${x}`}><line x1={x} x2={x} y1={SURF + A} y2={SURF + A + 24} stroke={C.pgf} strokeWidth={2} />
          <Tag x={x} y={SURF + A + 36} size={15} color={C.pgf}>골</Tag></g>
      ))}
      {marks.includes('height') && c1 !== undefined && (
        <g>
          <line x1={c1 - 30} x2={c1 + LAMBDA / 2 + 30} y1={SURF - A} y2={SURF - A} stroke={C.ink} strokeDasharray="4 4" />
          <line x1={c1 + LAMBDA / 2 - 30} x2={c1 + LAMBDA / 2 + 40} y1={SURF + A} y2={SURF + A} stroke={C.ink} strokeDasharray="4 4" />
          <Arrow x1={c1 + LAMBDA / 2 + 30} y1={SURF} x2={c1 + LAMBDA / 2 + 30} y2={SURF - A + 1} color={C.ink} width={2.4} head={9} />
          <Arrow x1={c1 + LAMBDA / 2 + 30} y1={SURF} x2={c1 + LAMBDA / 2 + 30} y2={SURF + A - 1} color={C.ink} width={2.4} head={9} />
          <Tag x={c1 + LAMBDA / 2 + 44} y={SURF} anchor="start" size={15}>파고</Tag>
        </g>
      )}
      {marks.includes('length') && c1 !== undefined && (
        <g>
          <line x1={c1} x2={c1} y1={SURF - A - 4} y2={SURF - A - 22} stroke={C.ink} strokeWidth={1.5} />
          <line x1={c1 + LAMBDA} x2={c1 + LAMBDA} y1={SURF - A - 4} y2={SURF - A - 22} stroke={C.ink} strokeWidth={1.5} />
          <Arrow x1={c1 + LAMBDA / 2} y1={SURF - A - 14} x2={c1 + 2} y2={SURF - A - 14} color={C.ink} width={2.4} head={9} />
          <Arrow x1={c1 + LAMBDA / 2} y1={SURF - A - 14} x2={c1 + LAMBDA - 2} y2={SURF - A - 14} color={C.ink} width={2.4} head={9} />
          <Tag x={c1 + LAMBDA / 2} y={SURF - A - 30} size={15}>파장</Tag>
        </g>
      )}

      {/* 깊이 안내 */}
      {showOrbits && (
        <g className="fade">
          <line x1={X0} x2={X1} y1={SURF + LAMBDA / 2} y2={SURF + LAMBDA / 2} stroke="white" strokeWidth={2} strokeDasharray="8 6" />
          <Tag x={X0 + 6} y={SURF + LAMBDA / 2 + 18} anchor="start" size={14} color={C.ink}>수심 = 파장의 1/2 : 원운동이 거의 사라짐</Tag>
          <Tag x={X0 + 6} y={SURF + 46} anchor="start" size={14} color={C.ink}>깊어질수록 원이 작아짐 ↓</Tag>
        </g>
      )}
      {step === 0 && !playing && <Bubble x={250} y={330} w={300} color={C.current} lines={['▶ 재생을 눌러 보세요', '파형과 물 입자를 함께 보세요']} />}
      {step === 1 && playing && <Bubble x={250} y={360} w={300} color={C.motion} lines={['파형은 계속 오른쪽으로 이동', '물 입자는 제자리에서 원운동']} />}
      {step === 2 && !picked && <Bubble x={250} y={360} w={300} color={C.ekman} lines={['수면 근처의 점 하나를', '클릭해 보세요']} />}
    </>
  )

  return (
    <SceneFrame label="오른쪽으로 진행하는 파도와 물 입자의 원운동" svg={svg}
      controls={
        <>
          <SceneButton onClick={() => setPlaying((v) => !v)} active={playing} pulse={!playing && step <= 1}>
            {playing ? '❚❚ 일시 정지' : '▶ 재생'}
          </SceneButton>
          {step >= 3 && (['crest', 'trough', 'height', 'length'] as Mark[]).map((m) => (
            <SceneButton key={m} tone="ink" onClick={() => toggleMark(m)} active={marks.includes(m)}>
              {{ crest: '마루', trough: '골', height: '파고', length: '파장' }[m]}
            </SceneButton>
          ))}
          {picked && <SceneButton tone="ink" onClick={() => setPicked(null)}>선택 해제</SceneButton>}
        </>
      }
      legend={<Legend items={[{ color: C.ink, label: '파도(파형)의 진행' }, { color: C.motion, label: '선택한 입자의 운동 방향' }]} />}
      note={<ModelNote>이상적인 심해파(진폭이 작은 선형파)를 나타냈으며, 파고는 보기 쉽게 과장했습니다. 수심이 얕은 천해파에서는 물 입자가 타원 운동을 합니다.</ModelNote>}
    />
  )
}
