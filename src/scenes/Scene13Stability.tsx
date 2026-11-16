import { useEffect, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton, Toggle } from '../components/ui'
import { Bubble, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const ENV = { stable: 3, conditional: 7, unstable: 12 } as const // 환경 기온 감률(℃/km)
type Kind = keyof typeof ENV
const T_BASE = 20
const GX0 = 470, GX1 = 770, GY0 = 410, GY1 = 70 // 그래프 영역
const tx = (t: number) => GX0 + ((t - (-20)) / 45) * (GX1 - GX0) // -20~25℃
const zy = (z: number) => GY0 - (z / 3) * (GY0 - GY1) // 0~3 km
const COL_X = 180, ZB = 1 // 공기 덩어리를 1 km에서 1 km 더 들어 올림

export default function Scene13Stability({ step, mode, setMode }: SceneProps) {
  const kind: Kind = mode in ENV ? (mode as Kind) : 'stable'
  const [saturated, setSaturated] = useState(false)
  const [lifted, setLifted] = useState(false)
  useEffect(() => {
    if (step === 1) setMode('stable')
    if (step === 2) setMode('unstable')
    if (step === 3) setMode('conditional')
    setLifted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])
  useEffect(() => setLifted(false), [kind, saturated])
  useEffect(() => { if (kind !== 'conditional') setSaturated(false) }, [kind])

  const env = ENV[kind]
  const parcelLapse = saturated ? 5 : 10
  const dz = 1
  const Tenv = T_BASE - env * (ZB + dz)
  const Tparcel = T_BASE - env * ZB - parcelLapse * dz
  const stable = Tparcel < Tenv
  // 들어 올린 뒤 결과 위치: 안정이면 원래 높이(0)로, 불안정이면 더 위로(1.6)
  const pos = useTween(!lifted ? 0 : 1, 1200)
  const after = useTween(lifted && pos > 0.98 ? 1 : 0, 1400)
  const zParcel = ZB + dz * pos + (lifted ? (stable ? -dz * after : 0.6 * after) : 0)

  const line = (lapse: number, z0: number, t0: number, z1: number) => `${tx(t0)},${zy(z0)} ${tx(t0 - lapse * (z1 - z0))},${zy(z1)}`

  const svg = (
    <>
      <rect width={800} height={480} fill="#f6f9fc" />
      {/* 공기 기둥 */}
      <rect x={60} y={60} width={240} height={360} rx={12} fill="#e8f2fc" />
      {[0, 1, 2, 3].map((z) => <g key={z}><line x1={60} x2={300} y1={420 - z * 115} y2={420 - z * 115} stroke={C.line} strokeDasharray="4 5" /><Tag x={54} y={420 - z * 115} anchor="end" size={12} color={C.muted} bg="none">{`${z} km`}</Tag></g>)}
      <Tag x={180} y={44} size={13} bg="none">{`주변 공기: 1 km마다 ${env}℃ 낮아짐`}</Tag>
      {(() => {
        const y = 420 - zParcel * 115
        return (
          <g>
            <circle cx={COL_X} cy={y} r={22} fill={lifted && pos > 0.98 ? (stable ? '#cfe0ff' : '#ffd0c4') : 'white'} stroke={C.ink} strokeWidth={2} />
            <Tag x={COL_X} y={y} size={11} bg="none">공기</Tag>
            {lifted && pos > 0.98 && (
              <Bubble x={70} y={Math.max(56, y - 120)} w={220} color={stable ? C.current : C.coriolis} className="rise"
                lines={[`덩어리 ${Tparcel}℃ vs 주변 ${Tenv}℃`, stable ? '더 차가움 → 무거워 되돌아감' : '더 따뜻함 → 가벼워 계속 상승', stable ? '안정' : '불안정']} />
            )}
          </g>
        )
      })()}

      {/* 그래프 */}
      <line x1={GX0} x2={GX0} y1={GY0} y2={GY1 - 10} stroke={C.ink} strokeWidth={1.5} />
      <line x1={GX0} x2={GX1 + 10} y1={GY0} y2={GY0} stroke={C.ink} strokeWidth={1.5} />
      <Tag x={GX0 - 8} y={GY1 - 4} anchor="end" size={12} bg="none">높이</Tag>
      <Tag x={GX1 + 8} y={GY0 + 18} anchor="end" size={12} bg="none">기온</Tag>
      {[0, 1, 2, 3].map((z) => <Tag key={z} x={GX0 - 6} y={zy(z)} anchor="end" size={11} color={C.muted} bg="none">{`${z}`}</Tag>)}
      <polyline points={line(10, 0, T_BASE, 3)} fill="none" stroke={C.coriolis} strokeWidth={2.5} />
      <polyline points={line(5, 0, T_BASE, 3)} fill="none" stroke={C.current} strokeWidth={2.5} strokeDasharray="6 4" />
      <polyline points={line(env, 0, T_BASE, 3)} fill="none" stroke={C.ink} strokeWidth={4} />
      <Tag x={tx(T_BASE - 30) - 4} y={zy(3) + 4} size={11} color={C.coriolis} anchor="end">건조 단열선</Tag>
      <Tag x={tx(T_BASE - 15)} y={zy(3) - 12} size={11} color={C.current}>습윤 단열선</Tag>
      <Tag x={Math.min(GX1 - 20, tx(T_BASE - env * 3) + 6)} y={zy(3) + 24} size={12} anchor="start">환경 기온</Tag>
      {/* 판정 */}
      <g transform="translate(470 432)">
        <rect width={300} height={36} rx={10} fill={kind === 'stable' ? '#e1f7ec' : kind === 'unstable' ? '#ffe4e6' : '#fff4d6'} />
        <Tag x={150} y={18} size={14} bg="none">
          {kind === 'stable' ? '절대 안정: 환경 감률 < 습윤 단열 감률 → 층운형' : kind === 'unstable' ? '절대 불안정: 환경 감률 > 건조 단열 감률 → 적운형' : '조건부 불안정: 습윤 < 환경 < 건조'}
        </Tag>
      </g>
    </>
  )

  return (
    <SceneFrame label="공기 덩어리를 들어 올렸을 때의 대기 안정도 판단" svg={svg}
      controls={
        <>
          <SceneButton onClick={() => setLifted((v) => !v)} pulse={!lifted && step >= 1} active={lifted}>{lifted ? '↺ 원래 높이로' : '↑ 공기 덩어리 1 km 들어 올리기'}</SceneButton>
          {step >= 1 && (
            <Toggle label="대기" value={kind} onChange={(v) => setMode(v)}
              options={[{ value: 'stable', label: '절대 안정' }, { value: 'conditional', label: '조건부' }, { value: 'unstable', label: '절대 불안정' }]} />
          )}
          {kind === 'conditional' && (
            <Toggle label="공기 덩어리" value={saturated ? 'sat' : 'unsat'} onChange={(v) => setSaturated(v === 'sat')}
              options={[{ value: 'unsat', label: '불포화' }, { value: 'sat', label: '포화' }]} />
          )}
        </>
      }
      legend={<Legend items={[{ color: C.ink, label: '환경 기온 감률', thick: true }, { color: C.coriolis, label: '건조 단열선(10℃/km)' }, { color: C.current, label: '습윤 단열선(5℃/km)', dashed: true }]} />}
      note={<ModelNote>공기 덩어리를 1 km 높이에서 1 km 더 들어 올린다고 가정했습니다. 숫자는 이해를 돕기 위한 예시 값입니다.</ModelNote>}
    />
  )
}
