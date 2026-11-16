import { useEffect, useState } from 'react'
import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton, Toggle } from '../components/ui'
import { Bubble, C, PolarArrow, Tag } from '../components/svg'
import { useClock, useTween } from '../lib/anim'

const CX = 260, CY = 245, R = 130
const CENTRIPETAL = '#ff8a00'

export default function Scene14GradientWind({ step, mode, setMode }: SceneProps) {
  useEffect(() => {
    if (step <= 1 && mode !== 'low') setMode('low')
    if (step === 2 && mode !== 'high') setMode('high')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])
  const high = mode === 'high'
  const [t] = useClock(step < 3, 0.35)
  const [friction, setFriction] = useState<'small' | 'large'>('small')
  const ang = useTween(friction === 'small' ? 20 : 40, 800)

  // 경도풍(북반구): 저기압은 시계 반대, 고기압은 시계 방향
  const th = (high ? -1 : 1) * t + Math.PI / 2
  const px = CX + R * Math.cos(th), py = CY - R * Math.sin(th)
  const inward = (Math.atan2(-(CY - py), CX - px) * 180) / Math.PI // 화면 좌표 → 수학 각도
  const vel = inward + (high ? 90 : -90)
  // 힘의 크기(그림용): 저기압 PGF 70, Cor 45 / 고기압 PGF 45, Cor 70 → 차이 25 = 구심력
  const pgf = high ? 40 : 72
  const cor = high ? 72 : 40

  const circles = (
    <>
      {[50, 90, 130, 170].map((r, i) => (
        <g key={r}>
          <circle cx={CX} cy={CY} r={r} fill="none" stroke={C.muted} strokeDasharray="5 5" />
          <Tag x={CX + r * 0.71} y={CY - r * 0.71} size={11} color={C.muted} bg="#f6f9fc">{`${high ? 1028 - i * 4 : 992 + i * 4}`}</Tag>
        </g>
      ))}
      <Tag x={CX} y={CY} size={30} color={high ? C.current : C.coriolis} weight={800} bg="none">{high ? '고' : '저'}</Tag>
    </>
  )

  const svg = step < 3 ? (
    <>
      <rect width={800} height={480} fill="#f6f9fc" />
      {circles}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.motion} strokeWidth={2} strokeOpacity={0.4} />
      <PolarArrow x={px} y={py} angle={inward + (high ? 180 : 0)} length={pgf} color={C.pgf} width={5} halo />
      <PolarArrow x={px} y={py} angle={inward + (high ? 0 : 180)} length={cor} color={C.coriolis} width={5} halo />
      <PolarArrow x={px} y={py} angle={vel} length={60} color={C.motion} width={6} halo />
      {step >= 1 && <PolarArrow x={px} y={py} angle={inward} length={Math.abs(pgf - cor)} color={CENTRIPETAL} width={4} dashed />}
      <circle cx={px} cy={py} r={7} fill="white" stroke={C.ink} strokeWidth={2} />
      <g transform="translate(470 40)">
        <rect width={310} height={step >= 1 ? 190 : 130} rx={12} fill="white" stroke={C.line} />
        <Tag x={155} y={24} size={16} bg="none">{high ? '고기압: 시계 방향' : '저기압: 시계 반대 방향'}</Tag>
        <Tag x={155} y={52} size={13} color={C.pgf} bg="none">{high ? '기압 경도력: 바깥쪽' : '기압 경도력: 중심 쪽'}</Tag>
        <Tag x={155} y={76} size={13} color={C.coriolis} bg="none">{high ? '전향력: 중심 쪽(더 큼)' : '전향력: 바깥쪽(더 작음)'}</Tag>
        <Tag x={155} y={100} size={13} color={C.motion} bg="none">바람: 등압선과 나란하게 회전</Tag>
        {step >= 1 && (
          <>
            <Tag x={155} y={132} size={14} color={CENTRIPETAL} bg="none">{high ? '전향력 − 기압 경도력 = 구심력' : '기압 경도력 − 전향력 = 구심력'}</Tag>
            <Tag x={155} y={158} size={13} bg="none">{high ? '→ 전향력 = 구심력 + 기압 경도력' : '→ 전향력 = 기압 경도력 − 구심력'}</Tag>
          </>
        )}
      </g>
      {step === 2 && <Bubble x={500} y={260} w={260} color={C.current} className="rise" lines={['같은 기압 경도력이면', '고기압 쪽 바람이 더 빠름']} />}
    </>
  ) : (
    <>
      <rect width={800} height={480} fill="#f6f9fc" />
      {[90, 190, 290, 390].map((y, i) => (
        <g key={y}>
          <line x1={40} x2={760} y1={y} y2={y} stroke={C.muted} strokeDasharray="6 5" />
          <Tag x={50} y={y - 12} anchor="start" size={11} color={C.muted} bg="#f6f9fc">{`${1000 + i * 4} hPa`}</Tag>
        </g>
      ))}
      <Tag x={740} y={60} anchor="end" size={14} color={C.coriolis}>저기압 쪽</Tag>
      <Tag x={740} y={430} anchor="end" size={14} color={C.current}>고기압 쪽</Tag>
      {(() => {
        const x = 380, y = 240
        const a = ang // 바람이 등압선에서 저기압 쪽으로 기운 각(경각)
        const ra = (a * Math.PI) / 180
        // 평형: 기압 경도력(위, P) = -(전향력 + 마찰력). 바람 방향 각 a
        const P = 110
        const cor = P * Math.cos(ra), fr = P * Math.sin(ra)
        return (
          <g>
            <PolarArrow x={x} y={y} angle={90} length={P} color={C.pgf} width={5} halo />
            <PolarArrow x={x} y={y} angle={a - 90} length={cor} color={C.coriolis} width={5} halo />
            <PolarArrow x={x} y={y} angle={a + 180} length={fr} color={C.wind} width={5} halo />
            <PolarArrow x={x} y={y} angle={a} length={120} color={C.motion} width={6} halo />
            <path d={`M${x + 70} ${y} A70 70 0 0 0 ${x + 70 * Math.cos(ra)} ${y - 70 * Math.sin(ra)}`} fill="none" stroke={C.ink} strokeWidth={2} />
            <Tag x={x + 96} y={y - 18} size={14}>{`경각 ${Math.round(a)}°`}</Tag>
            <circle cx={x} cy={y} r={7} fill="white" stroke={C.ink} strokeWidth={2} />
            <Tag x={x - 10} y={y - P - 14} size={13} color={C.pgf}>기압 경도력</Tag>
            <Tag x={x + 130 * Math.cos(ra) + 10} y={y - 130 * Math.sin(ra)} anchor="start" size={13} color={C.motion}>지상풍</Tag>
            <Tag x={x - 60} y={y + 30} anchor="end" size={13} color={C.wind}>마찰력</Tag>
            <Tag x={x + cor * Math.cos(((a - 90) * Math.PI) / 180) + 10} y={y - cor * Math.sin(((a - 90) * Math.PI) / 180) + 16} anchor="start" size={13} color={C.coriolis}>전향력</Tag>
          </g>
        )
      })()}
      <Bubble x={470} y={330} w={300} color={C.ink} lines={['지상풍: 등압선을 비스듬히 가로질러', '저기압 쪽으로 붊', friction === 'large' ? '마찰력이 크면 경각도 커짐' : '마찰력이 작으면 경각이 작음']} />
    </>
  )

  return (
    <SceneFrame label="경도풍과 지상풍에 작용하는 힘" svg={svg}
      controls={step < 3 ? (
        <Toggle label="기압" value={high ? 'high' : 'low'} onChange={setMode}
          options={[{ value: 'low', label: '저기압' }, { value: 'high', label: '고기압' }]} />
      ) : (
        <>
          <Toggle label="마찰력" value={friction} onChange={setFriction}
            options={[{ value: 'small', label: '작음(해상)' }, { value: 'large', label: '큼(육상)' }]} />
          <SceneButton tone="ink" onClick={() => setFriction(friction === 'small' ? 'large' : 'small')}>⇄ 비교</SceneButton>
        </>
      )}
      legend={<Legend items={[{ color: C.pgf, label: '기압 경도력' }, { color: C.coriolis, label: '전향력' }, { color: C.motion, label: '바람' }, ...(step < 3 ? [{ color: CENTRIPETAL, label: '구심력(합력)', dashed: true }] : [{ color: C.wind, label: '마찰력' }])]} />}
      note={<ModelNote>북반구 기준입니다. 화살표 길이는 힘의 상대적 크기를 단순화해 나타냈습니다. 실제 경각은 지표 상태에 따라 다릅니다.</ModelNote>}
    />
  )
}
