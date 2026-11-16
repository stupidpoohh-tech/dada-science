import { useEffect, useMemo, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { ModelNote, SceneButton, Toggle } from '../components/ui'
import { Arrow, Bubble, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const SURF = 150
const DEEP_Y = 420
const SLOPE0 = 420, COAST = 720
const SRC = 200, UPLIFT = 24
const H0 = DEEP_Y - SURF

const floorY = (x: number) => (x < SLOPE0 ? DEEP_Y : x < COAST ? DEEP_Y - ((DEEP_Y - SURF) * (x - SLOPE0)) / (COAST - SLOPE0) : SURF - (x - COAST) * 0.55)
const depthAt = (x: number) => Math.max(2, floorY(x) <= SURF ? 2 : floorY(x) - SURF)

/** τ(진행 정도)에 따른 오른쪽 해일 위치: dx/dτ ∝ √h (천해파) */
function buildTrack() {
  const xs: number[] = [SRC]
  let x = SRC
  for (let i = 0; i < 4000 && x < COAST + 10; i++) {
    x += 0.35 * Math.sqrt(depthAt(x) / H0)
    xs.push(x)
  }
  return xs
}

/** 단계별 해일의 목표 위치(x) */
const TARGET_X = [SRC, SRC + 36, 400, 610, COAST + 10]

export default function Scene08Tsunami({ step }: SceneProps) {
  const track = useMemo(buildTrack, [])
  const [quake, setQuake] = useState(false)
  const [tab, setTab] = useState<'eq' | 'storm'>('eq')
  useEffect(() => { if (step >= 1) setQuake(true) }, [step])

  const u = useTween(quake ? 1 : 0, 260)
  const tauOf = (x: number) => { const i = track.findIndex((v) => v >= x); return (i < 0 ? track.length - 1 : i) / (track.length - 1) }
  const TARGET = TARGET_X.map(tauOf)
  const tau = useTween(step === 0 ? 0 : TARGET[step], step >= 2 ? 3200 : 1200, step >= 2 ? TARGET[step - 1] : undefined)
  const xi = Math.min(track.length - 1, Math.floor(tau * (track.length - 1)))
  const xp = track[xi]
  const splitting = Math.min(1, tau / Math.max(0.001, TARGET[1])) // 0 → 한 덩어리, 1 → 두 파로 분리
  const hHere = depthAt(xp)
  // 높이: 얕아질수록 증가(그린의 법칙을 과장), 폭(파장): 속력에 비례해 감소
  const amp = Math.min(62, (UPLIFT / 2) * Math.pow(H0 / hHere, 0.45))
  const width = 80 * Math.sqrt(hHere / H0) + 14
  const xl = SRC - (xp - SRC) // 왼쪽으로 가는 파(깊은 바다라 대칭)

  const eta = (x: number) => {
    if (!quake) return 0
    if (tau < 0.002) return UPLIFT * u * Math.exp(-(((x - SRC) / 94) ** 2))
    const a1 = amp * Math.exp(-(((x - xp) / width) ** 2))
    const a2 = (UPLIFT / 2) * Math.exp(-(((x - xl) / 94) ** 2))
    return a1 + a2
  }
  const runup = step === 4 ? Math.max(0, Math.min(60, (tau - 0.95) * 1200)) : 0
  const pts: string[] = []
  for (let x = 0; x <= COAST; x += 4) pts.push(`${x},${(SURF - eta(x)).toFixed(1)}`)
  // 해안에 도달한 뒤 육지로 밀려드는 해수(침수)
  for (let x = COAST + 4; x <= COAST + runup; x += 4) {
    const th = 4 + 26 * (1 - (x - COAST) / Math.max(1, runup))
    pts.push(`${x},${(floorY(x) - th).toFixed(1)}`)
  }
  if (runup > 0) pts.push(`${COAST + runup},${floorY(COAST + runup).toFixed(1)}`)
  const floorPath = `M0 ${DEEP_Y} L${SLOPE0} ${DEEP_Y} L${COAST} ${SURF} L800 ${SURF - 44} L800 480 L0 480 Z`
  const block = UPLIFT * u * 0.6

  const svg = (
    <>
      <defs>
        <linearGradient id="s8-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe8fc" />
          <stop offset="1" stopColor="#14599e" />
        </linearGradient>
      </defs>
      <rect width={800} height={480} fill="#f4fbff" />
      <polygon points={`0,480 ${pts.join(' ')} ${COAST + runup},480`} fill="url(#s8-w)" />
      <polyline points={pts.join(' ')} fill="none" stroke={C.current} strokeWidth={3.5} />
      <line x1={0} x2={COAST} y1={SURF} y2={SURF} stroke={C.ink} strokeOpacity={0.25} strokeDasharray="5 6" />

      {/* 해저 지각 */}
      <g className={quake && step <= 1 ? 'shake' : undefined}>
        <path d={floorPath} fill={C.rock} />
        <path d={`M${SRC - 70} ${DEEP_Y - block} L${SRC + 70} ${DEEP_Y - block} L${SRC + 52} 480 L${SRC - 88} 480 Z`} fill="#a49378" stroke={C.rockDark} strokeWidth={2} />
        <path d={`M${SRC + 70} ${DEEP_Y - 1} L${SRC + 52} 480`} stroke={C.coriolis} strokeWidth={3} strokeDasharray="7 5" />
        <path d={`M${SLOPE0} ${DEEP_Y} L${COAST} ${SURF} L800 ${SURF - 44}`} fill="none" stroke={C.rockDark} strokeWidth={2} />
        <Tag x={SRC + 92} y={456} anchor="start" size={13} color="white" bg="none">단층</Tag>
      </g>
      {quake && step <= 1 && (
        <g>
          <circle cx={SRC + 60} cy={455} r={10} fill="none" stroke={C.coriolis} strokeWidth={3} className="pulse-ring" />
          <polygon points={`${SRC + 60},443 ${SRC + 64},452 ${SRC + 74},452 ${SRC + 66},458 ${SRC + 69},468 ${SRC + 60},462 ${SRC + 51},468 ${SRC + 54},458 ${SRC + 46},452 ${SRC + 56},452`} fill={C.ekman} />
          <Tag x={SRC} y={DEEP_Y - 40} size={14} color="white" bg="none">해저면 융기 ↑</Tag>
          <Arrow x1={SRC} y1={DEEP_Y - 4} x2={SRC} y2={DEEP_Y - 26} color="white" width={4} />
        </g>
      )}
      <Tag x={80} y={DEEP_Y + 30} size={13} color="white" bg="none">깊은 바다</Tag>
      <Tag x={770} y={SURF - 70} size={14} color="#7a5d22" bg="none">육지</Tag>

      {/* 양쪽으로 퍼짐 */}
      {step === 1 && splitting > 0.5 && (
        <g className="fade">
          <Arrow x1={xl - 10} y1={SURF - 44} x2={xl - 70} y2={SURF - 44} color={C.ink} width={4} />
          <Arrow x1={xp + 10} y1={SURF - 44} x2={xp + 70} y2={SURF - 44} color={C.ink} width={4} />
          <Tag x={SRC} y={SURF - 70} size={14}>양쪽으로 퍼져 나감</Tag>
        </g>
      )}

      {/* 속력·높이 말풍선 */}
      {step === 2 && (
        <Bubble x={Math.max(10, xp - 150)} y={30} w={300} color={C.motion} className="rise"
          lines={['수심 약 4000 m', '속력 약 700 km/h · 높이 1 m 이하', '파장 수백 km']} />
      )}
      {step === 3 && (
        <Bubble x={300} y={30} w={300} color={C.ekman} className="rise"
          lines={['수심 약 100 m', '속력 약 110 km/h로 감소', '파장 ↓ · 높이 ↑']} />
      )}
      {step === 4 && (
        <Bubble x={330} y={22} w={300} color={C.coriolis} className="rise"
          lines={['수심 약 10 m', '속력 약 36 km/h', '높이가 수 m 이상으로 커질 수 있음']} />
      )}
      {step === 4 && runup > 20 && <Arrow x1={COAST - 6} y1={SURF - 50} x2={COAST + 66} y2={floorY(COAST + 66) - 48} color={C.coriolis} width={5} halo />}
      {step === 4 && runup > 20 && <Tag x={COAST + 40} y={floorY(COAST + 40) - 78} size={13} color={C.coriolis}>육지로 밀려듦</Tag>}
      {step >= 2 && (
        <g>
          <Arrow x1={xp - 10} y1={SURF + 26} x2={xp - 10 + 70 * Math.sqrt(hHere / H0) + 12} y2={SURF + 26} color={C.motion} width={6} halo />
          <Tag x={xp} y={SURF + 50} size={13} color={C.motion} bg="none">속력</Tag>
        </g>
      )}
      {step === 0 && !quake && <Bubble x={250} y={210} w={300} color={C.coriolis} lines={['아래 버튼을 눌러', '해저 지진을 일으켜 보세요']} />}
    </>
  )

  return (
    <SceneFrame label="해저 지진으로 발생한 지진해일이 해안으로 전파되는 단면" svg={svg}
      controls={
        <SceneButton onClick={() => setQuake(true)} disabled={quake} pulse={!quake}>
          {quake ? '지진 발생함' : '⚡ 해저 지진 발생'}
        </SceneButton>
      }
      below={
        <div className="mx-3 mb-1 rounded-xl border border-ink/10 bg-paper p-3 sm:mx-4">
          <Toggle value={tab} onChange={setTab} label="비교"
            options={[{ value: 'eq', label: '지진해일' }, { value: 'storm', label: '폭풍해일' }]} />
          <div key={tab} className="rise mt-2 flex items-center gap-3">
            <svg viewBox="0 0 160 64" className="h-14 w-36 shrink-0" aria-hidden>
              {tab === 'eq' ? (
                <>
                  <rect width={160} height={64} fill="#d8f1fd" rx={6} />
                  <path d="M0 22 Q40 22 60 12 Q80 22 160 22 L160 64 L0 64 Z" fill="#4fb4e8" />
                  <path d="M0 50 L50 50 L56 42 L110 42 L104 50 L160 50 L160 64 L0 64 Z" fill={C.rock} />
                  <path d="M58 30 L58 40" stroke="white" strokeWidth={3} /><polygon points="58,26 53,33 63,33" fill="white" />
                </>
              ) : (
                <>
                  <rect width={160} height={64} fill="#eef1f5" rx={6} />
                  <circle cx={46} cy={16} r={11} fill="none" stroke={C.wind} strokeWidth={3} strokeDasharray="14 6" />
                  <text x={46} y={20} fontSize={11} fontWeight={800} textAnchor="middle" fill={C.coriolis}>L</text>
                  <path d="M0 36 Q80 34 128 26 L128 64 L0 64 Z" fill="#4fb4e8" />
                  <line x1={0} x2={128} y1={40} y2={40} stroke={C.ink} strokeDasharray="3 3" strokeWidth={1} />
                  <path d="M128 26 L160 18 L160 64 L128 64 Z" fill={C.sand} />
                  <line x1={60} y1={30} x2={104} y2={26} stroke={C.wind} strokeWidth={3} /><polygon points="112,25 102,21 103,31" fill={C.wind} />
                </>
              )}
            </svg>
            <p className="text-[15px] leading-snug">
              {tab === 'eq'
                ? <><b>지진해일</b>: 해저 지진, 해저 화산 분화, 해저 산사태 등으로 해수 전체가 급격히 움직여 생깁니다. 파장이 매우 길어 수심이 깊은 곳에서도 천해파로 행동합니다.</>
                : <><b>폭풍해일</b>: 태풍 같은 저기압 중심에서 기압이 낮아 해수면이 부풀고, 강한 바람이 해수를 해안으로 밀어 해수면이 높아집니다. 만조와 겹치면 피해가 커집니다.</>}
            </p>
          </div>
        </div>
      }
      note={<ModelNote>수직 방향(해일 높이·해저 융기)은 크게 과장했습니다. 속력은 √(중력 가속도 × 수심)으로 계산한 대략적인 값입니다.</ModelNote>}
    />
  )
}
