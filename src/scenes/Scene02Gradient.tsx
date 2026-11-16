import { useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton, Toggle } from '../components/ui'
import { Arrow, Bubble, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const L = 110, R = 690, TOP = 40, BOT = 392, BASE = 184, PY = 330
const AX = 220, BX = 580

export default function Scene02Gradient({ step, mode, setMode }: SceneProps) {
  const [raised, setRaised] = useState(false)
  const sign = mode === 'right' ? -1 : 1
  const target = step === 0 ? 0 : step === 1 ? (raised ? 1 : 0) : sign
  const tau = useTween(target, 1100)

  const sY = (x: number) => BASE - 56 * tau * (1 - (2 * (x - L)) / (R - L))
  const hA = PY - sY(AX), hB = PY - sY(BX)
  const highLeft = tau > 0.05, highRight = tau < -0.05
  const diff = hA - hB // 양수면 A의 수압이 큼
  const mid = (L + R) / 2

  const svg = (
    <>
      <defs>
        <linearGradient id="s2-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe8fc" />
          <stop offset="1" stopColor="#3d9ad6" />
        </linearGradient>
      </defs>
      {/* 물 */}
      <path d={`M${L} ${sY(L)} L${R} ${sY(R)} L${R} ${BOT} L${L} ${BOT} Z`} fill="url(#s2-water)" />
      <line x1={L} y1={sY(L)} x2={R} y2={sY(R)} stroke={C.current} strokeWidth={4} strokeLinecap="round" />
      {/* 수조 */}
      <path d={`M${L} ${TOP} L${L} ${BOT} L${R} ${BOT} L${R} ${TOP}`} fill="none" stroke="#9aa7b8" strokeWidth={6} strokeLinejoin="round" />
      <line x1={L - 14} x2={R + 14} y1={BOT + 3} y2={BOT + 3} stroke="#9aa7b8" strokeWidth={6} strokeLinecap="round" />
      {/* 기준선(평평했을 때 해수면) */}
      {Math.abs(tau) > 0.05 && <line x1={L} x2={R} y1={BASE} y2={BASE} stroke={C.ink} strokeOpacity={0.35} strokeDasharray="6 6" strokeWidth={1.5} />}
      {Math.abs(tau) > 0.05 && <Tag x={R - 8} y={BASE - 13} anchor="end" size={13} color={C.muted} bg="none">원래 해수면</Tag>}
      {highLeft && <Tag x={L + 16} y={sY(L) - 22} anchor="start" size={15} color={C.current}>해수면 높음</Tag>}
      {highRight && <Tag x={R - 16} y={sY(R) - 22} anchor="end" size={15} color={C.current}>해수면 높음</Tag>}

      {/* 같은 깊이 선 */}
      <line x1={L} x2={R} y1={PY} y2={PY} stroke="white" strokeWidth={2} strokeDasharray="3 7" />
      <Tag x={mid} y={PY + 34} size={14} color={C.ink}>같은 깊이</Tag>

      {/* 해수 기둥 */}
      {step >= 1 && [[AX, hA, 'A'], [BX, hB, 'B']].map(([x, h, n]) => (
        <g key={n as string}>
          <rect x={(x as number) - 30} y={PY - (h as number)} width={60} height={h as number} fill="white" fillOpacity={0.28}
            stroke="white" strokeWidth={2} strokeDasharray="6 5" />
          <line x1={(x as number) + 42} x2={(x as number) + 42} y1={PY - (h as number)} y2={PY} stroke={C.ink} strokeWidth={1.6} />
          <line x1={(x as number) + 36} x2={(x as number) + 48} y1={PY - (h as number)} y2={PY - (h as number)} stroke={C.ink} strokeWidth={1.6} />
          <Tag x={(x as number) + 56} y={PY - (h as number) / 2} anchor="start" size={13}>{`해수 기둥`}</Tag>
        </g>
      ))}

      {/* 지점 A, B */}
      {[[AX, 'A'], [BX, 'B']].map(([x, n]) => (
        <g key={n as string}>
          <circle cx={x as number} cy={PY} r={13} fill="white" stroke={C.ink} strokeWidth={2.5} />
          <text x={x as number} y={PY + 1} fontSize={15} fontWeight={800} textAnchor="middle" dominantBaseline="middle">{n}</text>
        </g>
      ))}

      {/* 수압 비교 게이지 */}
      {step >= 2 && (
        <g className="fade">
          {[[AX, hA, 'A'], [BX, hB, 'B']].map(([x, h, n]) => {
            const big = n === 'A' ? diff > 3 : diff < -3
            return (
              <g key={n as string}>
                <rect x={(x as number) - 64} y={BOT + 18} width={128} height={18} rx={9} fill="#eef3f8" />
                <rect x={(x as number) - 64} y={BOT + 18} width={(h as number) * 0.64} height={18} rx={9} fill={big ? C.pgf : '#9c86f5'} />
                <Tag x={x as number} y={BOT + 46} size={13} color={big ? C.pgf : C.muted}>{`${n} 수압 ${big ? '큼' : Math.abs(diff) < 3 ? '같음' : '작음'}`}</Tag>
              </g>
            )
          })}
        </g>
      )}

      {/* 수압경도력 */}
      {step >= 3 && Math.abs(diff) > 3 && (
        <g key={sign} className="pop">
          <Arrow x1={diff > 0 ? AX + 30 : BX - 30} y1={PY - 52} x2={diff > 0 ? BX - 30 : AX + 30} y2={PY - 52} color={C.pgf} width={9} halo />
          <Tag x={mid} y={PY - 82} size={17} color={C.pgf}>수압경도력</Tag>
          <Tag x={mid} y={PY - 60 + 32} size={13} color={C.ink}>{diff > 0 ? '수압 높은 A → 수압 낮은 B' : '수압 높은 B → 수압 낮은 A'}</Tag>
        </g>
      )}
      {step === 0 && <Bubble x={250} y={96} w={300} color={C.current} lines={['해수면이 평평합니다', 'A와 B의 수압이 같습니다']} />}
      {step === 1 && !raised && <Bubble x={250} y={96} w={300} color={C.current} lines={['아래 버튼을 눌러', '왼쪽 해수면을 높여 보세요']} />}
    </>
  )

  return (
    <SceneFrame label="해수면이 기울어진 수조와 같은 깊이 A, B의 수압 비교" svg={svg}
      controls={
        <>
          {step === 1 && (
            <SceneButton onClick={() => setRaised((r) => !r)} active={raised} pulse={!raised}>
              {raised ? '해수면 평평하게' : '↑ 왼쪽 해수면 높이기'}
            </SceneButton>
          )}
          {step >= 2 && (
            <Toggle label="해수면" value={sign > 0 ? 'left' : 'right'} onChange={setMode}
              options={[{ value: 'left', label: '왼쪽이 높게' }, { value: 'right', label: '오른쪽이 높게' }]} />
          )}
        </>
      }
      legend={<Legend items={[{ color: C.pgf, label: '수압경도력(힘)', thick: true }]} />}
      note={<ModelNote>실제 바다의 해수면 기울기는 수십~수백 km에 수십 cm 정도로 매우 작습니다. 그림은 기울기를 크게 과장했습니다.</ModelNote>}
    />
  )
}
