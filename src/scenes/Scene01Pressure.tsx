import { useEffect, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, Toggle, SceneButton } from '../components/ui'
import { Arrow, Bubble, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'
import Diver from './Diver'

const SURF = 76
const PX_PER_M = 9
const LEVELS = [0, 10, 20, 30, 40]
const DENS = { normal: 1.025, low: 1.02, high: 1.03 } as const
/** 수압(기압) = ρgh / 101325 */
const pressure = (rho: number, depth: number) => (rho * 1000 * 9.8 * depth) / 101325

export default function Scene01Pressure({ step, mode, setMode }: SceneProps) {
  const [level, setLevel] = useState(0)
  const compare = step >= 3
  const densKey = compare ? (mode === 'high' ? 'high' : 'low') : 'normal'
  const rho = DENS[densKey]

  // 수압 비교 단계에서는 잠수부가 수면에 있으면 의미가 없으므로 30 m로 이동
  useEffect(() => {
    if (step >= 2 && level < 2) setLevel(step >= 3 ? 3 : 2)
    if (step >= 3 && mode !== 'low' && mode !== 'high') setMode('low')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const depth = LEVELS[level]
  const y = useTween(SURF + depth * PX_PER_M, 700)
  const curDepth = (y - SURF) / PX_PER_M
  const P = pressure(rho, curDepth)
  const Pnow = pressure(rho, depth)
  const other = densKey === 'low' ? DENS.high : DENS.low

  const descend = () => setLevel((l) => (l + 1) % LEVELS.length)

  // 게이지(막대). 비교 단계는 밀도 차이를 과장해 표시
  const gaugeTop = 96, gaugeBot = 436, gaugeH = gaugeBot - gaugeTop
  const barFor = (r: number, d: number) => {
    const base = (d / 40) * gaugeH * 0.86
    return compare ? base * (1 + (r - 1.025) * 22) : base
  }
  const darker = densKey === 'high'

  const svg = (
    <>
      <defs>
        <linearGradient id="s1-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darker ? '#a9dcf7' : '#cdeefe'} />
          <stop offset="0.35" stopColor={darker ? '#3f9fdc' : '#7ccaf2'} />
          <stop offset="0.7" stopColor={darker ? '#1a5fa6' : '#2f8fd2'} />
          <stop offset="1" stopColor={darker ? '#0a3368' : '#145a9e'} />
        </linearGradient>
      </defs>
      {/* 하늘·바다 */}
      <rect x={0} y={0} width={800} height={SURF} fill="#f4fbff" />
      <rect x={0} y={SURF} width={800} height={404} fill="url(#s1-water)" style={{ transition: 'opacity .4s' }} />
      <path d={`M0 ${SURF} Q 50 ${SURF - 6} 100 ${SURF} T 200 ${SURF} T 300 ${SURF} T 400 ${SURF} T 500 ${SURF} T 600 ${SURF} T 700 ${SURF} T 800 ${SURF}`} fill="none" stroke="#2870ff" strokeWidth={3} />
      <Tag x={20} y={SURF - 20} anchor="start" size={14} color={C.muted}>해수면</Tag>
      {/* 해저 */}
      <path d="M0 462 Q200 452 400 462 T800 458 L800 480 L0 480 Z" fill={C.sand} />

      {/* 깊이 눈금 */}
      {LEVELS.map((d) => (
        <g key={d}>
          <line x1={62} x2={560} y1={SURF + d * PX_PER_M} y2={SURF + d * PX_PER_M} stroke="white" strokeOpacity={d ? 0.35 : 0} strokeDasharray="4 8" />
          <line x1={52} x2={68} y1={SURF + d * PX_PER_M} y2={SURF + d * PX_PER_M} stroke={C.ink} strokeWidth={2} />
          <Tag x={46} y={SURF + d * PX_PER_M} anchor="end" size={14}>{`${d} m`}</Tag>
        </g>
      ))}
      <line x1={60} x2={60} y1={SURF} y2={SURF + 40 * PX_PER_M} stroke={C.ink} strokeWidth={2} />

      {/* 잠수부 위 해수 기둥 */}
      {step >= 1 && curDepth > 0.5 && (
        <g className="fade">
          <rect x={258} y={SURF} width={84} height={Math.max(0, y - SURF - 46)} fill="white" fillOpacity={0.22} stroke="white" strokeDasharray="6 5" strokeWidth={2} />
          {curDepth > 8 && <Tag x={300} y={SURF + 18} size={13} color={C.ink} bg="white">위에 쌓인 해수</Tag>}
          {curDepth > 8 && <Arrow x1={300} y1={SURF + 34} x2={300} y2={Math.max(SURF + 50, y - 56)} color="white" width={3} />}
        </g>
      )}

      {/* 사방에서 작용하는 수압 */}
      {step >= 2 && curDepth > 0.5 && (
        <g key={`arr-${step}`} className="fade">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            const L = 14 + P * 11
            const r0 = 66
            const cx = 300, cy = y - 4
            return (
              <Arrow key={i} x1={cx + Math.cos(a) * (r0 + L)} y1={cy + Math.sin(a) * (r0 + L)}
                x2={cx + Math.cos(a) * r0} y2={cy + Math.sin(a) * r0} color={C.pgf} width={4.5} halo />
            )
          })}
        </g>
      )}

      {/* 잠수부 */}
      <g transform={`translate(300 ${y})`} onClick={descend} style={{ cursor: 'pointer' }} className="no-tap">
        <circle r={56} fill="transparent" />
        {step <= 1 && level === 0 && <circle r={10} fill="none" stroke="#ff8a00" strokeWidth={3} className="pulse-ring" />}
        <Diver />
      </g>
      {step <= 1 && (
        <Bubble x={370} y={Math.min(y - 60, 340)} w={180} tail="left" color={C.current}
          lines={[`수심 ${Math.round(curDepth)} m`, `수압 약 ${P.toFixed(1)}기압`]} />
      )}
      {step === 0 && level === 0 && <Tag x={300} y={SURF + 82} size={14} color={C.ink}>클릭!</Tag>}

      {/* 수압 게이지 */}
      <g>
        <rect x={600} y={gaugeTop - 50} width={184} height={gaugeH + 82} rx={14} fill="white" stroke={C.line} strokeWidth={1.5} />
        <Tag x={692} y={gaugeTop - 28} size={15}>수압 게이지</Tag>
        {compare ? (
          <>
            {(['low', 'high'] as const).map((k, i) => {
              const r = DENS[k]
              const h = barFor(r, curDepth)
              const sel = k === densKey
              const x = 628 + i * 72
              return (
                <g key={k} opacity={sel ? 1 : 0.45}>
                  <rect x={x} y={gaugeTop} width={56} height={gaugeH} rx={8} fill="#eef3f8" />
                  <rect x={x} y={gaugeBot - h} width={56} height={h} rx={8} fill={k === 'high' ? '#0d4f8f' : '#4fb4e8'} />
                  <Tag x={x + 28} y={gaugeBot - h - 14} size={14}>{pressure(r, curDepth).toFixed(2)}</Tag>
                  <Tag x={x + 28} y={gaugeBot + 16} size={13} color={sel ? C.ink : C.muted}>{k === 'low' ? `밀도 ${r.toFixed(3)}` : `밀도 ${r.toFixed(3)}`}</Tag>
                </g>
              )
            })}
          </>
        ) : (
          <>
            <rect x={650} y={gaugeTop} width={56} height={gaugeH} rx={8} fill="#eef3f8" />
            <rect x={650} y={gaugeBot - barFor(rho, curDepth)} width={56} height={barFor(rho, curDepth)} rx={8} fill={C.current} />
            {[1, 2, 3, 4].map((a) => {
              const yy = gaugeBot - (a / 3.97) * gaugeH * 0.86
              return (
                <g key={a}>
                  <line x1={710} x2={720} y1={yy} y2={yy} stroke={C.ink} strokeWidth={1.5} />
                  <text x={726} y={yy} fontSize={13} dominantBaseline="middle" fill={C.muted}>{a}기압</text>
                </g>
              )
            })}
            <Tag x={678} y={gaugeBot + 16} size={13} color={C.muted}>단위: 기압</Tag>
          </>
        )}
      </g>

      {compare && (
        <Bubble x={366} y={Math.min(y - 56, 330)} w={208} tail="left" color={darker ? C.water5 : C.current}
          lines={[`수심 ${Math.round(curDepth)} m · 밀도 ${rho.toFixed(3)}`, `수압 ${P.toFixed(2)}기압`, densKey === 'high' ? '밀도 큰 해수 → 수압 더 큼' : `밀도가 크면 ${pressure(other, curDepth).toFixed(2)}기압`]} />
      )}
      {step === 2 && curDepth > 1 && (
        <Bubble x={60} y={SURF + 8} w={220} color={C.pgf} className="rise"
          lines={['수압은 모든 방향으로 작용', `같은 깊이에서 크기가 같음`]} />
      )}
    </>
  )

  return (
    <SceneFrame label="바다 단면과 잠수부, 수심에 따른 수압 게이지" svg={svg}
      controls={
        <>
          <SceneButton onClick={descend} pulse={step <= 1 && level === 0}>
            {level === LEVELS.length - 1 ? '↑ 수면으로 돌아가기' : `↓ 10 m 내려가기 (현재 ${depth} m)`}
          </SceneButton>
          {compare && (
            <Toggle label="해수 선택" value={densKey as 'low' | 'high'} onChange={setMode}
              options={[{ value: 'low', label: '밀도 작은 해수' }, { value: 'high', label: '밀도 큰 해수' }]} />
          )}
          <span className="ml-auto text-[14px] font-bold text-ink/60">현재 수압 {Pnow.toFixed(compare ? 2 : 1)}기압</span>
        </>
      }
      legend={step >= 2 ? <Legend items={[{ color: C.pgf, label: '수압(해수가 누르는 힘)' }]} /> : undefined}
      note={
        <ModelNote>
          {compare
            ? '실제 해수의 밀도 차이에 따른 수압 차이는 약 1% 정도입니다. 막대 길이는 차이가 보이도록 과장했습니다. 대기압은 제외한 값입니다.'
            : '표시한 값은 대기압을 제외하고 해수만이 누르는 압력(밀도 1.025 g/cm³ 기준)입니다.'}
        </ModelNote>
      }
    />
  )
}
