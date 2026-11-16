import { useEffect, useMemo, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton, Toggle } from '../components/ui'
import { Bubble, C, Compass, PolarArrow, RightAngle, Tag } from '../components/svg'
import { smooth, useClock, useTween } from '../lib/anim'

const SY = 416
const N = 300
const PGF_LEN = 88

/** 이상화한 경로: 처음엔 북쪽, 점점 휘어 최종적으로 수압경도력과 수직 */
function buildPath(hemi: 1 | -1) {
  const pts: { x: number; y: number; ang: number; v: number }[] = []
  let x = 400 - hemi * 175, y = SY
  for (let i = 0; i <= N; i++) {
    const s = i / N
    const e = s < 0.12 ? 0 : 1 - Math.pow(1 - (s - 0.12) / 0.88, 2.2)
    const ang = 90 - hemi * 90 * e // 수학 각도(도)
    const v = Math.min(1, 0.22 + s * 1.15)
    pts.push({ x, y, ang, v })
    const r = (ang * Math.PI) / 180
    const ds = 1.55 * v
    x += Math.cos(r) * ds
    y -= Math.sin(r) * ds
  }
  return pts
}

const LABELS = {
  sea: { pgf: '수압경도력', flow: '지형류', N: '북쪽: 해수면 낮음 · 수압 낮음', S: '남쪽: 해수면 높음 · 수압 높음', line: (i: number) => `해수면 높이 +${i}`, legend: '수압경도력(힘)', label: '위에서 본 바다에서 수압경도력, 전향력, 지형류의 방향', bg: ['#5fb6ea', '#e2f5fe'], note: '마찰이 없는 이상적인 경우를 단순화한 모식도입니다. 실제 해수는 진동하면서 평형 상태에 가까워집니다.' },
  air: { pgf: '기압 경도력', flow: '지균풍', N: '북쪽: 저기압', S: '남쪽: 고기압', line: (i: number) => `${1000 + i * 4} hPa`, legend: '기압 경도력(힘)', label: '상층 대기에서 기압 경도력, 전향력, 지균풍의 방향', bg: ['#cfe3f7', '#f3f8fd'], note: '마찰이 없는 상층(약 1 km 이상) 대기를 단순화한 모식도입니다. 실제 공기는 진동하면서 평형 상태에 가까워집니다.' },
}

export function Scene03Air(props: SceneProps) {
  return <Scene03Geostrophic {...props} air />
}

export default function Scene03Geostrophic({ step, mode, setMode, air }: SceneProps & { air?: boolean }) {
  const L = LABELS[air ? 'air' : 'sea']
  const hemi: 1 | -1 = mode === 'S' ? -1 : 1
  const path = useMemo(() => buildPath(hemi), [hemi])
  const PLAY = 4.6
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useClock(playing)
  const finished = t >= PLAY
  useEffect(() => { if (finished) setPlaying(false) }, [finished])
  useEffect(() => { if (step !== 3) { setPlaying(false); setT(0) } }, [step, setT])
  const play = () => { setT(0); setPlaying(true) }

  const target = step === 0 ? 0 : step === 1 ? 0.07 : step === 2 ? 0.3 : step === 3 ? (finished ? 1 : 0.3) : 1
  const tw = useTween(target, 1000, step === 4 ? 0.3 : undefined)
  const p = step === 3 ? 0.3 + 0.7 * smooth(Math.min(1, t / PLAY)) : tw
  const idx = Math.round(p * N)
  const cur = path[idx]

  const showV = step >= 1
  const showCor = step >= 2
  const balanced = p > 0.985
  const corAng = cur.ang - hemi * 90
  const corLen = PGF_LEN * cur.v
  const trail = path.slice(0, idx + 1).map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')
  const end = path[N]

  const svg = (
    <>
      <defs>
        <linearGradient id="s3-sea" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={L.bg[0]} />
          <stop offset="1" stopColor={L.bg[1]} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={800} height={480} fill="url(#s3-sea)" />
      {/* 해수면 높이 등치선 */}
      {[80, 160, 240, 320, 400].map((yy, i) => (
        <g key={yy}>
          <line x1={0} x2={800} y1={yy} y2={yy} stroke="white" strokeWidth={1.6} strokeOpacity={0.8} />
          <text x={12} y={yy - 7} fontSize={12} fill={C.muted} fontWeight={600}>{L.line(air ? i : 4 - i)}</text>
        </g>
      ))}
      <Tag x={400} y={22} size={15} color={C.muted}>{L.N}</Tag>
      <Tag x={790} y={458} anchor="end" size={15} color={C.ink}>{L.S}</Tag>
      <Compass x={44} y={446} size={18} />

      {/* 배경 수압경도력 화살표 */}
      {[70, 730].map((xx) => (
        <PolarArrow key={xx} x={xx} y={470} angle={90} length={100} color={C.pgf} width={5} opacity={0.35} />
      ))}

      {/* 지나온 경로 */}
      {showV && idx > 1 && <polyline points={trail} fill="none" stroke={C.motion} strokeWidth={3} strokeDasharray="2 7" strokeLinecap="round" />}

      {/* 지형류 띠 */}
      {step === 4 && (
        <g className="fade">
          <PolarArrow x={hemi > 0 ? 70 : 730} y={end.y} angle={hemi > 0 ? 0 : 180} length={660} color={C.motion} width={14} opacity={0.18} />
          <Tag x={hemi > 0 ? 160 : 640} y={end.y - 30} size={18} color={C.motion}>{`${L.flow} → ${hemi > 0 ? '동쪽' : '서쪽'}`}</Tag>
        </g>
      )}

      {/* 해수 덩어리와 힘 */}
      <g>
        <PolarArrow x={cur.x} y={cur.y} angle={90} length={PGF_LEN} color={C.pgf} width={7} halo className={step === 0 ? 'pop' : undefined} />
        <Tag x={cur.x + (hemi > 0 ? -14 : 14)} y={cur.y - PGF_LEN - 16} size={15} color={C.pgf} anchor={hemi > 0 ? 'end' : 'start'}>{L.pgf}</Tag>
        {showCor && corLen > 4 && (
          <g key={`c${step}${hemi}`} className={step === 2 ? 'pop' : undefined}>
            <PolarArrow x={cur.x} y={cur.y} angle={corAng} length={corLen} color={C.coriolis} width={7} halo />
            <Tag x={cur.x + Math.cos((corAng * Math.PI) / 180) * (corLen + 26)} y={cur.y - Math.sin((corAng * Math.PI) / 180) * (corLen + 22)} size={15} color={C.coriolis}>전향력</Tag>
            <RightAngle x={cur.x} y={cur.y} a1={cur.ang} a2={corAng} size={14} color={C.coriolis} />
          </g>
        )}
        {showV && (
          <g key={`v${step}`} className={step === 1 ? 'pop' : undefined}>
            <PolarArrow x={cur.x} y={cur.y} angle={cur.ang} length={44 + 46 * cur.v} color={C.motion} width={6} halo />
            {!balanced && <Tag x={cur.x + Math.cos((cur.ang * Math.PI) / 180) * (44 + 46 * cur.v + 24)} y={cur.y - Math.sin((cur.ang * Math.PI) / 180) * (44 + 46 * cur.v + 18)} size={14} color={C.motion}>운동 방향</Tag>}
          </g>
        )}
        <circle cx={cur.x} cy={cur.y} r={11} fill="white" stroke={C.ink} strokeWidth={2.5} />
        <circle cx={cur.x} cy={cur.y} r={4.5} fill={C.ink} />
      </g>

      {balanced && step >= 3 && (
        <Bubble x={hemi > 0 ? 24 : 536} y={44} w={240} color={C.ink} className="rise"
          lines={['힘의 평형', `${L.pgf} = 전향력 (반대 방향)`, `→ ${L.flow}: ${L.pgf}에 수직`]} />
      )}
      {step === 2 && (
        <Bubble x={hemi > 0 ? 536 : 24} y={44} w={240} color={C.coriolis} className="rise"
          lines={[hemi > 0 ? '북반구: 운동 방향의 오른쪽' : '남반구: 운동 방향의 왼쪽', '항상 운동 방향에 수직(90°)']} />
      )}
    </>
  )

  return (
    <SceneFrame label={L.label} svg={svg}
      controls={
        <>
          {step >= 2 && (
            <Toggle label="반구" value={hemi > 0 ? 'N' : 'S'} onChange={setMode}
              options={[{ value: 'N', label: '북반구' }, { value: 'S', label: '남반구' }]} />
          )}
          {step === 3 && (
            <SceneButton onClick={play} pulse={!playing && t === 0} active={playing}>
              {finished ? '↺ 다시 재생' : playing ? '재생 중…' : '▶ 재생'}
            </SceneButton>
          )}
        </>
      }
      legend={<Legend items={[{ color: C.pgf, label: L.legend }, { color: C.coriolis, label: '전향력(힘)' }, { color: C.motion, label: '실제 운동 방향' }]} />}
      note={<ModelNote>{L.note}</ModelNote>}
    />
  )
}
