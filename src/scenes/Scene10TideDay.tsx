import { useEffect, useRef, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton } from '../components/ui'
import { Arrow, C, Tag } from '../components/svg'
import { useClock } from '../lib/anim'

const T = 12 + 25 / 60 // 반일주조 주기 ≈ 12시간 25분
const TMAX = 2 * T
const MID = 128, AMP = 38
const level = (t: number) => MID - AMP * Math.sin((2 * Math.PI * t) / T)
const rate = (t: number) => Math.cos((2 * Math.PI * t) / T) // >0: 상승(밀물)
const HIGHS = [T / 4, T / 4 + T]
const LOWS = [(3 * T) / 4, (3 * T) / 4 + T]
const GX0 = 76, GX1 = 776, GY = 372, GA = 62
const gx = (t: number) => GX0 + ((GX1 - GX0) * t) / TMAX
const gy = (t: number) => GY - GA * Math.sin((2 * Math.PI * t) / T)
/** 해안 지형 높이(y): 육지 → 완만한 갯벌 → 조금 더 깊은 바다 */
const ground = (x: number) => (x < 60 ? 62 + x * 0.27 : x < 560 ? 78 + (x - 60) * 0.19 : 173 + (x - 560) * 0.22)
const fmt = (t: number) => { const h = Math.floor(t), m = Math.round((t - h) * 60); return m === 60 ? `${h + 1}시간 0분` : `${h}시간 ${m}분` }

export default function Scene10TideDay({ step }: SceneProps) {
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useClock(playing, 2.4)
  const raf = useRef(0)
  const tRef = useRef(t)
  tRef.current = t

  const animateTo = (target: number) => {
    cancelAnimationFrame(raf.current)
    setPlaying(false)
    const start = performance.now()
    const from = tRef.current
    const dur = 1600
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setT(from + (target - from) * e)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (step === 1) animateTo(HIGHS[0])
    if (step === 2) animateTo(LOWS[0])
    if (step === 3) animateTo(TMAX)
    if (step === 4) { cancelAnimationFrame(raf.current); setT(LOWS[0] + 0.6); setPlaying(true) }
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // 끝까지 재생되면 멈추거나(1~4단계) 반복(조류 단계)
  useEffect(() => {
    if (t >= TMAX) {
      if (step === 4) setT(t - TMAX)
      else { setT(TMAX); setPlaying(false) }
    }
  }, [t, step, setT])

  const tt = Math.min(t, TMAX)
  const wl = level(tt)
  const r = rate(tt)
  // 수면과 갯벌의 교점
  const shoreX = 60 + (wl - 78) / 0.19 // 수면과 갯벌의 교점(수면은 항상 갯벌 구간에서 만남)
  const groundPts = Array.from({ length: 41 }, (_, i) => { const x = (800 * i) / 40; return `${x},${ground(x).toFixed(1)}` }).join(' ')
  const waterPts = [`${shoreX},${wl}`, `800,${wl}`, `800,${ground(800)}`]
  for (let x = 800; x > shoreX; x -= 10) waterPts.push(`${x},${ground(x).toFixed(1)}`)
  const curve = Array.from({ length: Math.max(2, Math.ceil(tt * 8)) + 1 }, (_, i) => {
    const ti = (tt * i) / Math.max(1, Math.ceil(tt * 8))
    return `${gx(ti).toFixed(1)},${gy(ti).toFixed(1)}`
  }).join(' ')
  const full = Array.from({ length: 201 }, (_, i) => { const ti = (TMAX * i) / 200; return `${gx(ti).toFixed(1)},${gy(ti).toFixed(1)}` }).join(' ')
  const showMarks = step >= 1
  const showRange = step >= 3
  const slack = Math.abs(r) < 0.2

  const svg = (
    <>
      <rect width={800} height={480} fill="#f4fbff" />
      {/* 해안 단면 */}
      <rect x={0} y={0} width={800} height={236} fill="#eef7fd" />
      <polygon points={`0,236 ${groundPts} 800,236`} fill={C.sand} />
      <polygon points={waterPts.join(' ')} fill="#7cc6ef" />
      <line x1={shoreX} x2={800} y1={wl} y2={wl} stroke={C.current} strokeWidth={3} />
      <Tag x={30} y={44} size={14} color="#7a5d22" bg="none" anchor="start">육지</Tag>
      {wl > 132 && <Tag x={Math.max(150, shoreX - 120)} y={ground(Math.max(150, shoreX - 120)) - 14} size={13} color="#7a5d22" bg="none">드러난 갯벌</Tag>}
      {/* 기준선 */}
      {showMarks && (
        <g>
          <line x1={430} x2={800} y1={MID - AMP} y2={MID - AMP} stroke={C.ink} strokeOpacity={0.45} strokeDasharray="5 5" />
          <text x={796} y={MID - AMP - 6} fontSize={12} textAnchor="end" fill={C.muted} fontWeight={700}>만조 해수면</text>
          <line x1={430} x2={800} y1={MID + AMP} y2={MID + AMP} stroke={C.ink} strokeOpacity={0.45} strokeDasharray="5 5" />
          <text x={796} y={MID + AMP + 14} fontSize={12} textAnchor="end" fill={C.muted} fontWeight={700}>간조 해수면</text>
        </g>
      )}
      {showRange && (
        <g>
          <Arrow x1={460} y1={MID} x2={460} y2={MID - AMP + 2} color={C.coriolis} width={2.5} head={8} />
          <Arrow x1={460} y1={MID} x2={460} y2={MID + AMP - 2} color={C.coriolis} width={2.5} head={8} />
          <Tag x={474} y={MID} anchor="start" size={14} color={C.coriolis}>조차</Tag>
        </g>
      )}
      {/* 조류 */}
      {step >= 4 && (
        <g>
          {slack ? (
            <Tag x={640} y={wl + 30} size={15} color={C.ink}>정조(흐름이 거의 멈춤)</Tag>
          ) : (
            <>
              <Arrow x1={640 + (r > 0 ? 60 : -60) * Math.abs(r)} y1={wl + 26} x2={640 - (r > 0 ? 60 : -60) * Math.abs(r)} y2={wl + 26} color={C.motion} width={7} halo />
              <Tag x={640} y={wl + 52} size={14} color={C.motion}>{r > 0 ? '밀물(창조류) → 육지 쪽' : '썰물(낙조류) → 바다 쪽'}</Tag>
            </>
          )}
        </g>
      )}
      <Tag x={790} y={18} size={14} anchor="end" color={C.ink}>{`경과 시간 ${fmt(tt)}`}</Tag>
      {showMarks && Math.abs(wl - (MID - AMP)) < 3 && <Tag x={620} y={MID - AMP - 22} size={18} color={C.current} className="pop">만조</Tag>}
      {showMarks && Math.abs(wl - (MID + AMP)) < 3 && <Tag x={620} y={MID + AMP - 18} size={18} color={C.current} className="pop">간조</Tag>}

      {/* 조위 그래프 */}
      <rect x={20} y={248} width={770} height={226} rx={12} fill="white" stroke={C.line} />
      <text x={34} y={270} fontSize={13} fontWeight={800} fill={C.ink}>조위 그래프</text>
      <line x1={GX0} x2={GX1} y1={GY} y2={GY} stroke={C.line} />
      <line x1={GX0} x2={GX0} y1={GY - GA - 22} y2={GY + GA + 14} stroke={C.ink} strokeWidth={1.5} />
      <text x={GX0 - 8} y={GY - GA} fontSize={11} textAnchor="end" fill={C.muted}>높음</text>
      <text x={GX0 - 8} y={GY + GA} fontSize={11} textAnchor="end" fill={C.muted}>낮음</text>
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
        <g key={h}>
          <line x1={gx(h)} x2={gx(h)} y1={GY + GA + 8} y2={GY + GA + 14} stroke={C.ink} />
          <text x={gx(h)} y={GY + GA + 26} fontSize={11} textAnchor="middle" fill={C.muted}>{h}시</text>
        </g>
      ))}
      <polyline points={full} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="3 5" />
      <polyline points={curve} fill="none" stroke={C.current} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cx={gx(tt)} cy={gy(tt)} r={7} fill={C.current} stroke="white" strokeWidth={3} />
      {showMarks && HIGHS.filter((h) => tt >= h - 0.05).map((h) => (
        <g key={`h${h}`} className="pop"><circle cx={gx(h)} cy={gy(h)} r={5} fill={C.coriolis} />
          <Tag x={gx(h)} y={gy(h) - 16} size={13} color={C.coriolis}>만조</Tag></g>
      ))}
      {showMarks && LOWS.filter((l) => tt >= l - 0.05).map((l) => (
        <g key={`l${l}`} className="pop"><circle cx={gx(l)} cy={gy(l)} r={5} fill={C.pgf} />
          <Tag x={gx(l) + 10} y={gy(l) - 2} size={13} color={C.pgf} anchor="start">간조</Tag></g>
      ))}
      {showRange && (
        <g className="fade">
          <line x1={gx(HIGHS[0])} x2={gx(LOWS[0]) + 30} y1={gy(HIGHS[0])} y2={gy(HIGHS[0])} stroke={C.coriolis} strokeDasharray="3 3" />
          <Arrow x1={gx(LOWS[0]) + 24} y1={GY} x2={gx(LOWS[0]) + 24} y2={GY - GA + 2} color={C.coriolis} width={2.2} head={8} />
          <Arrow x1={gx(LOWS[0]) + 24} y1={GY} x2={gx(LOWS[0]) + 24} y2={GY + GA - 2} color={C.coriolis} width={2.2} head={8} />
          <Tag x={gx(LOWS[0]) + 34} y={GY + 4} size={13} color={C.coriolis} anchor="start">조차</Tag>
          <Arrow x1={(gx(HIGHS[0]) + gx(HIGHS[1])) / 2} y1={GY - GA - 34} x2={gx(HIGHS[0]) + 2} y2={GY - GA - 34} color={C.ink} width={2} head={8} />
          <Arrow x1={(gx(HIGHS[0]) + gx(HIGHS[1])) / 2} y1={GY - GA - 34} x2={gx(HIGHS[1]) - 2} y2={GY - GA - 34} color={C.ink} width={2} head={8} />
          <Tag x={(gx(HIGHS[0]) + gx(HIGHS[1])) / 2} y={GY - GA - 48} size={13}>주기 약 12시간 25분</Tag>
        </g>
      )}
    </>
  )

  return (
    <SceneFrame label="하루 동안 변하는 해안의 해수면 높이와 조위 그래프" svg={svg}
      controls={
        <>
          <SceneButton onClick={() => { if (t >= TMAX) setT(0); setPlaying((v) => !v) }} active={playing} pulse={step === 0 && !playing && t === 0}>
            {playing ? '❚❚ 일시 정지' : t >= TMAX ? '↺ 처음부터 재생' : '▶ 시간 재생'}
          </SceneButton>
          <label className="flex min-w-[200px] flex-1 items-center gap-2 text-[14px] font-bold text-ink/70">
            시간
            <input type="range" min={0} max={TMAX} step={0.05} value={tt} aria-label="경과 시간"
              onChange={(e) => { setPlaying(false); cancelAnimationFrame(raf.current); setT(Number(e.target.value)) }}
              className="h-2 flex-1 cursor-pointer accent-[#2870ff]" />
          </label>
        </>
      }
      legend={<Legend items={[{ color: C.current, label: '해수면 높이(조석)' }, ...(step >= 4 ? [{ color: C.motion, label: '조류(수평 흐름)' }] : [])]} />}
      note={<ModelNote>반일주조의 대표적인 예시입니다. 실제로는 지역에 따라 하루 두 번의 만조 높이가 서로 다르거나(일조 부등), 하루 한 번만 나타나기도 합니다. 조류가 가장 센 시점도 해안 지형에 따라 다릅니다.</ModelNote>}
    />
  )
}
