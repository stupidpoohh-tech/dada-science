import { useMemo, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton } from '../components/ui'
import { Arrow, C, Tag } from '../components/svg'
import { useClock } from '../lib/anim'

const SURF = 196
const X0 = 0, XS = 730 // 해안선(수심 0)
const DEEP = 270
const L0 = 200, A0 = 12
const T = 2.8
const OMEGA = (2 * Math.PI) / T
const K0 = (2 * Math.PI) / L0
const DX = 2
const H_SCALE = 0.35

const depth = (x: number) => (x < 150 ? DEEP : Math.max(0, (DEEP * (XS - x)) / (XS - 150)))

/** 분산 관계 ω² = g k tanh(kh)를 풀어 수심별 파수·속력을 계산하고, 파고 증가와 쇄파 지점을 정함 */
function buildModel() {
  const n = Math.ceil((800 - X0) / DX) + 1
  const xs: number[] = [], ks: number[] = [], amps: number[] = [], phase: number[] = [], cs: number[] = []
  let acc = 0, xb = XS, ab = 0
  for (let i = 0; i < n; i++) {
    const x = X0 + i * DX
    const hp = Math.max(depth(x), 0.5) // 그림상 수심(px)
    const h = hp * H_SCALE // 계산용 수심(그림은 수직 과장)
    let k = K0
    for (let j = 0; j < 60; j++) k = K0 / Math.tanh(k * h)
    const c = OMEGA / k
    // 파고: 얕은 바다에서 수심이 얕을수록 커짐(그린의 법칙 a ∝ h^-1/4을 보기 쉽게 과장한 지수 0.4)
    let a = hp < 120 ? A0 * Math.pow(120 / hp, 0.4) : A0
    if (x >= xb) a = ab * Math.pow(Math.max(0, (XS + 12 - x) / (XS + 12 - xb)), 0.9)
    else if (a > 0.5 * hp && xb === XS) { xb = x; ab = a }
    if (i > 0) acc += ((ks[i - 1] + k) / 2) * DX
    xs.push(x); ks.push(k); amps.push(a); phase.push(acc); cs.push(c)
  }
  return { xs, ks, amps, phase, cs, xb, ab }
}

const STAGES = [
  { x0: 10, x1: 300, name: '① 먼바다', speed: '빠름', len: '김', ht: '낮음' },
  { x0: 300, x1: 510, name: '② 해안 접근', speed: '느려짐', len: '짧아지기 시작', ht: '거의 그대로' },
  { x0: 510, x1: 636, name: '③ 얕은 바다', speed: '더 느려짐', len: '짧아짐', ht: '높아짐' },
  { x0: 636, x1: 742, name: '④ 해안', speed: '가장 느림', len: '가장 짧음', ht: '가장 높아짐 → 부서짐' },
]

export default function Scene07Shoaling({ step }: SceneProps) {
  const m = useMemo(buildModel, [])
  const [playing, setPlaying] = useState(true)
  const [t] = useClock(playing)
  const st = STAGES[Math.min(step, 3)]
  const idxOf = (x: number) => Math.max(0, Math.min(m.xs.length - 1, Math.round((x - X0) / DX)))

  // 수면 좌표(트로코이드형: 해안에 가까울수록 마루가 뾰족해짐)
  const pts: string[] = []
  for (let i = 0; i < m.xs.length; i += 2) {
    const x = m.xs[i]
    if (x > XS + 14) break
    const a = m.amps[i], k = m.ks[i]
    const th = m.phase[i] - OMEGA * t
    const q = Math.min(0.9, a * k * 1.1)
    const X = x - (q / k) * Math.sin(th)
    const Y = SURF - a * Math.cos(th) - (x > m.xb ? 4 * (1 - (XS - x) / (XS - m.xb)) : 0)
    pts.push(`${X.toFixed(1)},${Y.toFixed(1)}`)
  }

  // 마루 위치 찾기: 위상이 2π의 배수가 되는 x
  const crests: number[] = []
  for (let i = 1; i < m.xs.length; i++) {
    const a = (m.phase[i - 1] - OMEGA * t) / (2 * Math.PI)
    const b = (m.phase[i] - OMEGA * t) / (2 * Math.PI)
    if (Math.floor(a) !== Math.floor(b)) crests.push(m.xs[i])
  }
  const zoneCrests = crests.filter((x) => x >= st.x0 && x <= st.x1)
  const midX = (st.x0 + st.x1) / 2
  const ref = idxOf(step === 3 ? m.xb - 4 : midX)
  const ratioC = m.cs[ref] / m.cs[0]
  const ratioL = m.ks[0] / m.ks[ref]
  const ratioH = m.amps[ref] / A0
  const breakers = crests.filter((x) => x > m.xb - 24 && x < m.xb + 40)

  // 파장 표시: 구간 안의 연속한 마루 쌍(같은 위상 기준이라 정확히 한 파장)
  const pair = (() => {
    for (let i = 0; i < crests.length - 1; i++) {
      const a = crests[i], b = crests[i + 1]
      if ((a + b) / 2 >= st.x0 && (a + b) / 2 <= st.x1 && step < 3) return [a, b]
    }
    return null
  })()

  const bottom = `M0 ${SURF + DEEP} L150 ${SURF + DEEP} L${XS} ${SURF} L800 ${SURF - 44} L800 480 L0 480 Z`

  const svg = (
    <>
      <defs>
        <linearGradient id="s7-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe8fc" />
          <stop offset="1" stopColor="#1d6db3" />
        </linearGradient>
      </defs>
      <rect width={800} height={480} fill="#f4fbff" />
      <clipPath id="s7-clip"><rect x={0} y={0} width={800} height={480} /></clipPath>
      <g clipPath="url(#s7-clip)">
        <polygon points={`-40,480 -40,${SURF} ${pts.join(' ')} ${XS + 14},${SURF} 800,480`} fill="url(#s7-w)" />
        <polyline points={pts.join(' ')} fill="none" stroke={C.current} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
      <path d={bottom} fill={C.sand} stroke={C.sandDark} strokeWidth={2} />

      {/* 구간 강조 */}
      <rect key={step} x={st.x0} y={36} width={st.x1 - st.x0} height={SURF + 30} rx={10} fill={C.ekman} fillOpacity={0.08} stroke={C.ekman} strokeWidth={2} strokeDasharray="6 5" className="fade" />
      <Tag x={midX} y={26} size={16} color="#c46a00">{st.name}</Tag>

      {/* 수심이 파장의 1/2인 지점 */}
      {(() => {
        const x = XS - ((XS - 150) * (L0 / 2)) / DEEP
        return (
          <g>
            <line x1={x} x2={x} y1={SURF + 20} y2={SURF + depth(x)} stroke={C.ink} strokeOpacity={0.4} strokeDasharray="4 4" />
            <Tag x={x - 6} y={SURF + depth(x) + 30} size={12} color={C.muted} anchor="end" bg={C.sand}>수심 = 파장의 1/2</Tag>
          </g>
        )
      })()}
      <Tag x={90} y={SURF + 120} size={14} color="white" bg="none">깊은 바다</Tag>
      <Tag x={560} y={SURF + 128} size={13} color={C.ink} bg="none">얕은 바다</Tag>

      {/* 쇄파 */}
      {breakers.map((x) => {
        const i = idxOf(x)
        const y = SURF - m.amps[i]
        return (
          <g key={x}>
            <path d={`M${x - 26} ${y + 14} Q${x - 10} ${y - 26} ${x + 20} ${y - 14} Q${x + 30} ${y - 8} ${x + 18} ${y + 8}`} fill="none" stroke="white" strokeWidth={6} strokeLinecap="round" />
            <path d={`M${x - 26} ${y + 14} Q${x - 10} ${y - 26} ${x + 20} ${y - 14} Q${x + 30} ${y - 8} ${x + 18} ${y + 8}`} fill="none" stroke={C.current} strokeWidth={3} strokeLinecap="round" />
            {[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={x + 6 + j * 6} cy={y + 2 + (j % 2) * 7} r={3 + (j % 3)} fill="white" />)}
          </g>
        )
      })}
      {Array.from({ length: 14 }, (_, j) => {
        const x = m.xb + 8 + ((j * 53) % Math.max(10, XS - m.xb))
        return <circle key={j} cx={x} cy={SURF - 3 + (j % 3) * 3} r={2.5 + (j % 2)} fill="white" opacity={0.9} />
      })}
      {step === 3 && <Tag x={m.xb + 4} y={SURF - 70} size={16} color={C.coriolis} className="pop">쇄파!</Tag>}

      {/* 파장 */}
      {pair && (
        <g>
          <line x1={pair[0]} x2={pair[0]} y1={SURF - 52} y2={SURF - 30} stroke={C.ink} strokeWidth={1.5} />
          <line x1={pair[1]} x2={pair[1]} y1={SURF - 52} y2={SURF - 30} stroke={C.ink} strokeWidth={1.5} />
          <Arrow x1={(pair[0] + pair[1]) / 2} y1={SURF - 44} x2={pair[0] + 1} y2={SURF - 44} color={C.ink} width={2.2} head={8} />
          <Arrow x1={(pair[0] + pair[1]) / 2} y1={SURF - 44} x2={pair[1] - 1} y2={SURF - 44} color={C.ink} width={2.2} head={8} />
          <Tag x={(pair[0] + pair[1]) / 2} y={SURF - 60} size={14}>파장</Tag>
        </g>
      )}
      {/* 파고 */}
      {zoneCrests[0] !== undefined && step < 3 && (() => {
        const x = zoneCrests[0], a = m.amps[idxOf(x)]
        return (
          <g>
            <line x1={x + 10} x2={x + 10} y1={SURF - a} y2={SURF + a} stroke={C.coriolis} strokeWidth={3} />
            <Tag x={x + 18} y={SURF + a + 14} anchor="start" size={13} color={C.coriolis}>파고</Tag>
          </g>
        )
      })()}
      {/* 파속 */}
      <g>
        <Arrow x1={midX - 50 * ratioC} y1={SURF + 34} x2={midX + 50 * ratioC} y2={SURF + 34} color={C.motion} width={6} halo />
        <Tag x={midX} y={SURF + 58} size={13} color={C.motion}>파속</Tag>
      </g>
    </>
  )

  const card = (label: string, word: string, pct: number, color: string, dir: number) => (
    <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-ink/10 bg-paper px-3 py-2">
      <span className="text-[13px] font-bold text-ink/55">{label}</span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[18px] font-extrabold" style={{ color }}>{word}</span>
        <span className="text-[13px] font-bold text-ink/50">{dir > 0 ? '▲' : dir < 0 ? '▼' : '■'} 먼바다의 {Math.round(pct * 100)}%</span>
      </span>
    </div>
  )

  return (
    <SceneFrame label="깊은 바다에서 해안으로 다가오며 변하는 파도" svg={svg}
      below={
        <div key={step} className="rise flex flex-col gap-2 px-3 pb-1 pt-2 sm:flex-row sm:px-4">
          {card('파속', st.speed, ratioC, C.motion, step === 0 ? 0 : -1)}
          {card('파장', st.len, ratioL, C.ink, step === 0 ? 0 : -1)}
          {card('파고', st.ht, ratioH, C.coriolis, step <= 1 ? 0 : 1)}
        </div>
      }
      controls={<SceneButton onClick={() => setPlaying((v) => !v)} active={playing}>{playing ? '❚❚ 일시 정지' : '▶ 재생'}</SceneButton>}
      legend={<Legend items={[{ color: C.motion, label: '파속(길이 = 빠르기)' }]} />}
      note={<ModelNote>파속과 파장은 파동 이론(분산 관계)으로 계산했고, 주기는 일정하다고 가정했습니다. 수심과 파고 변화는 보기 쉽게 과장했습니다.</ModelNote>}
    />
  )
}
