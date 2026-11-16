import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, Toggle } from '../components/ui'
import { C, Compass, PolarArrow, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const OX = 250, OY = 262
const L0 = 150
const LAYERS = 6
const STEP_ROT = 36 // 층마다 회전 각(도). 감쇠율을 같은 값(라디안)으로 맞춘 이상화된 에크만 모형
const layerLen = (k: number) => L0 * Math.exp(-(k * STEP_ROT * Math.PI) / 180)
const blues = ['#2870ff', '#3d7ff0', '#4f8cdf', '#6399cc', '#78a6bb', '#8fb2ad']

export default function Scene04Ekman({ step, mode, setMode }: SceneProps) {
  const h = mode === 'S' ? -1 : 1
  const windAng = 90
  const layerAng = (k: number) => windAng - h * (45 + k * STEP_ROT)
  const shown = useTween(step >= 2 ? LAYERS : step >= 1 ? 1 : 0, step === 2 ? 3200 : 600, step === 2 ? 1 : undefined)
  const nShow = Math.floor(shown + 0.001)
  const transAng = windAng - h * 90

  const tips = Array.from({ length: LAYERS }, (_, k) => {
    const r = (layerAng(k) * Math.PI) / 180
    return [OX + Math.cos(r) * layerLen(k), OY - Math.sin(r) * layerLen(k)]
  })
  // 나선(층 끝점을 잇는 곡선) — 더 촘촘히 계산
  const spiral = Array.from({ length: 61 }, (_, i) => {
    const k = (i / 60) * (LAYERS - 1)
    const r = (layerAng(k) * Math.PI) / 180
    return `${(OX + Math.cos(r) * layerLen(k)).toFixed(1)},${(OY - Math.sin(r) * layerLen(k)).toFixed(1)}`
  }).join(' ')

  const rowY = (k: number) => 118 + k * 56

  const svg = (
    <>
      <rect x={0} y={0} width={800} height={480} fill="#f4fbff" />
      {/* 평면도 */}
      <rect x={24} y={24} width={452} height={432} rx={18} fill="#d8f1fd" />
      <Tag x={44} y={48} anchor="start" size={15} color={C.muted} bg="#d8f1fd">위에서 본 바다</Tag>
      <Compass x={436} y={70} size={18} />
      {[-160, -100, -40, 20, 80, 140].map((dx, i) => (
        <line key={i} x1={OX + dx} x2={OX + dx} y1={430} y2={60} stroke="white" strokeWidth={3} className="flow" opacity={0.75} />
      ))}
      <line x1={OX - 200} x2={OX + 200} y1={OY} y2={OY} stroke={C.line} strokeWidth={1} />
      <line x1={OX} x2={OX} y1={OY - 200} y2={OY + 190} stroke={C.line} strokeWidth={1} />

      {/* 바람 */}
      <g className="pop">
        <PolarArrow x={OX} y={OY + 10} angle={windAng} length={200} color={C.wind} width={20} opacity={0.55} />
        <Tag x={OX - 24} y={OY - 166} size={16} color="#5f6878" anchor="end">바람(북쪽으로)</Tag>
      </g>

      {/* 나선 곡선 */}
      {step >= 2 && nShow >= LAYERS && <polyline points={spiral} fill="none" stroke={C.current} strokeWidth={1.6} strokeDasharray="4 4" className="fade" />}
      {/* 층별 해류 */}
      {Array.from({ length: nShow }, (_, k) => (
        <g key={`${k}-${h}`} className="pop">
          <PolarArrow x={OX} y={OY} angle={layerAng(k)} length={layerLen(k)} color={blues[k]} width={k === 0 ? 7 : 5 - k * 0.5} halo />
        </g>
      ))}
      {nShow >= 1 && (
        <Tag x={tips[0][0] + h * 18} y={tips[0][1] - 14} size={15} color={C.current} anchor={h > 0 ? 'start' : 'end'}>표층 해류</Tag>
      )}
      {nShow >= 1 && step <= 2 && (() => {
        // 45° 각도 표시
        const a0 = (windAng * Math.PI) / 180, a1 = (layerAng(0) * Math.PI) / 180
        const r = 64
        return (
          <g>
            <path d={`M${OX + Math.cos(a0) * r} ${OY - Math.sin(a0) * r} A ${r} ${r} 0 0 ${h > 0 ? 1 : 0} ${OX + Math.cos(a1) * r} ${OY - Math.sin(a1) * r}`} fill="none" stroke={C.ink} strokeWidth={2} />
            <Tag x={OX + h * 40} y={OY - 82} size={14}>약 45°</Tag>
          </g>
        )
      })()}

      {/* 에크만 수송 */}
      {step >= 3 && (
        <g key={`t${h}`} className="pop">
          <PolarArrow x={OX} y={OY} angle={transAng} length={170} color={C.ekman} width={12} halo />
          <Tag x={OX + h * 170} y={OY + 30} size={16} color={C.ekman} anchor={h > 0 ? 'end' : 'start'}>에크만 수송</Tag>
          <path d={`M${OX} ${OY - 40} A 40 40 0 0 ${h > 0 ? 1 : 0} ${OX + h * 40} ${OY}`} fill="none" stroke={C.ekman} strokeWidth={2.5} />
          <Tag x={OX + h * 46} y={OY - 40} size={14} color={C.ekman}>90°</Tag>
        </g>
      )}
      <circle cx={OX} cy={OY} r={5} fill={C.ink} />

      {/* 수심별 단면(오른쪽) */}
      <rect x={500} y={24} width={276} height={432} rx={18} fill="white" stroke={C.line} />
      <Tag x={638} y={48} size={15} color={C.muted}>수심별 해류(위에서 본 방향)</Tag>
      <g>
        <rect x={516} y={68} width={244} height={28} rx={6} fill="#eef1f5" />
        <text x={530} y={83} fontSize={13} fontWeight={700} fill="#5f6878" dominantBaseline="middle">바람</text>
        <PolarArrow x={700} y={93} angle={90} length={22} color={C.wind} width={6} />
      </g>
      {Array.from({ length: LAYERS }, (_, k) => {
        const y = rowY(k)
        const visible = k < nShow
        const dark = `rgba(13,79,143,${0.08 + k * 0.1})`
        const len = Math.max(6, layerLen(k) * 0.3)
        const r = (layerAng(k) * Math.PI) / 180
        return (
          <g key={k}>
            <rect x={516} y={y - 4} width={244} height={50} fill={dark} rx={k === 0 ? 0 : 0} />
            <text x={530} y={y + 21} fontSize={13} fontWeight={700} fill={k > 3 ? 'white' : C.ink} dominantBaseline="middle">
              {k === 0 ? '표층' : k === LAYERS - 1 ? '마찰층 바닥' : `${k}층`}
            </text>
            {visible && (
              <g className="pop">
                <circle cx={700} cy={y + 21} r={24} fill="white" opacity={0.85} />
                <PolarArrow x={700 - (Math.cos(r) * len) / 2} y={y + 21 + (Math.sin(r) * len) / 2} angle={layerAng(k)} length={len} color={blues[k]} width={4} />
              </g>
            )}
            {visible && <text x={620} y={y + 21} fontSize={12} fill={k > 3 ? 'white' : C.muted} dominantBaseline="middle">{`세기 ${Math.round((layerLen(k) / L0) * 100)}%`}</text>}
          </g>
        )
      })}
      <text x={524} y={rowY(LAYERS) + 4} fontSize={12} fill={C.muted}>↓ 깊어질수록 방향이 돌고 약해짐</text>
    </>
  )

  return (
    <SceneFrame label="바람, 수심별 해류(에크만 나선), 에크만 수송의 방향" svg={svg}
      controls={step >= 1 ? (
        <Toggle label="반구" value={h > 0 ? 'N' : 'S'} onChange={setMode}
          options={[{ value: 'N', label: '북반구' }, { value: 'S', label: '남반구' }]} />
      ) : undefined}
      legend={<Legend items={[{ color: C.wind, label: '바람', thick: true }, { color: C.current, label: '해류(층별)' }, { color: C.ekman, label: '에크만 수송(마찰층 전체 평균)', thick: true }]} />}
      note={<ModelNote>표층 해류가 바람 방향에서 45° 벗어나는 것은 깊이에 따라 성질이 일정한 바다를 가정한 이상화된 에크만 모형입니다. 실제 바다에서는 각도가 이보다 작게 나타나기도 합니다.</ModelNote>}
    />
  )
}
