import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote } from '../components/ui'
import { Arrow, Bubble, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

// 공기 덩어리 조건: 지표 기온 20℃, 이슬점 12℃ → 상승 응결 고도 1 km, 산 정상 3 km
const T0 = 20, TD0 = 12, LCL = 1, TOP = 3
const GROUND = 420, KM = 105 // 1 km = 105 px
const yOf = (z: number) => GROUND - z * KM
const X0 = 70, XL = 260, XT = 400, XR = 700

/** 경로 매개변수 s(0~3): 0→1 바람받이 상승(구름 아래), 1→2 구름 속 상승, 2→3 바람그늘 하강 */
function stateAt(s: number) {
  if (s <= 1) {
    const z = LCL * s
    return { x: X0 + (XL - X0) * s, z, T: T0 - 10 * z, Td: TD0 - 2 * z, phase: 'dry-up' as const }
  }
  if (s <= 2) {
    const f = s - 1, z = LCL + (TOP - LCL) * f
    const T = T0 - 10 * LCL - 5 * (z - LCL)
    return { x: XL + (XT - XL) * f, z, T, Td: T, phase: 'moist' as const }
  }
  const f = s - 2, z = TOP * (1 - f)
  const Ttop = T0 - 10 * LCL - 5 * (TOP - LCL)
  return { x: XT + (XR - XT) * f, z, T: Ttop + 10 * (TOP - z), Td: Ttop + 2 * (TOP - z), phase: 'dry-down' as const }
}

const mountain = (x: number) => {
  if (x < XL - 40) return GROUND
  if (x < XT) return GROUND - ((x - (XL - 40)) / (XT - (XL - 40))) * TOP * KM
  if (x < XR - 40) return yOf(TOP) + ((x - XT) / (XR - 40 - XT)) * TOP * KM
  return GROUND
}

export default function Scene12Adiabatic({ step }: SceneProps) {
  const target = [0, 1, 2, 3][step] ?? 3
  const s = useTween(target, 2600, step > 0 ? target - 1 : undefined)
  const st = stateAt(s)
  const px = st.x, py = yOf(st.z) - 18
  const cloud = s > 1

  const svg = (
    <>
      <rect width={800} height={480} fill="#f3f8fd" />
      {/* 높이 눈금 */}
      {[0, 1, 2, 3].map((z) => (
        <g key={z}>
          <line x1={30} x2={780} y1={yOf(z)} y2={yOf(z)} stroke={C.line} strokeDasharray="4 6" />
          <Tag x={26} y={yOf(z)} anchor="end" size={12} color={C.muted} bg="none">{`${z} km`}</Tag>
        </g>
      ))}
      <polygon points={`0,480 ${Array.from({ length: 81 }, (_, i) => `${i * 10},${mountain(i * 10).toFixed(1)}`).join(' ')} 800,480`} fill={C.sand} stroke={C.sandDark} strokeWidth={2} />
      <Tag x={XT} y={yOf(TOP) - 16} size={13} color="#7a5d22" bg="none">산 정상</Tag>
      <Tag x={150} y={GROUND + 30} size={13} color={C.ink} bg="none">바람받이 사면</Tag>
      <Tag x={620} y={GROUND + 30} size={13} color={C.ink} bg="none">바람그늘 사면</Tag>

      {/* 상승 응결 고도와 구름 */}
      {step >= 1 && (
        <g className="fade">
          <line x1={XL - 60} x2={XT + 30} y1={yOf(LCL)} y2={yOf(LCL)} stroke={C.coriolis} strokeWidth={2} strokeDasharray="6 4" />
          <Tag x={XL - 66} y={yOf(LCL)} anchor="end" size={13} color={C.coriolis}>상승 응결 고도</Tag>
        </g>
      )}
      {cloud && (
        <g className="fade">
          {[[300, 1.4], [340, 2.0], [380, 2.6], [320, 1.7]].map(([x, z], i) => (
            <ellipse key={i} cx={x} cy={yOf(z)} rx={48} ry={26} fill="white" stroke="#c6d0dd" />
          ))}
          {step >= 2 && [290, 310, 330, 350].map((x) => (
            <line key={x} x1={x} x2={x - 8} y1={yOf(1.2)} y2={yOf(0.75)} stroke={C.current} strokeWidth={2} className="fade" />
          ))}
          {step >= 2 && <Tag x={250} y={yOf(0.6)} size={12} color={C.current} bg="none">비</Tag>}
        </g>
      )}

      {/* 경로 */}
      <path d={`M${X0} ${yOf(0) - 18} L${XL} ${yOf(LCL) - 18} L${XT} ${yOf(TOP) - 18} L${XR} ${yOf(0) - 18}`} fill="none" stroke={C.ink} strokeOpacity={0.25} strokeDasharray="3 6" strokeWidth={2} />
      <Arrow x1={X0 - 50} y1={yOf(0) - 18} x2={X0 - 12} y2={yOf(0) - 18} color={C.wind} width={6} />

      {/* 공기 덩어리 */}
      <g>
        <circle cx={px} cy={py} r={16} fill={st.phase === 'dry-down' ? '#ffd8cc' : st.phase === 'moist' ? '#dbeafe' : '#e9f6ff'} stroke={C.ink} strokeWidth={2} />
        <Bubble x={Math.min(Math.max(px - 95, 10), 600)} y={py - 92} w={190} color={st.phase === 'dry-down' ? C.coriolis : C.current}
          lines={[`높이 ${st.z.toFixed(1)} km`, `기온 ${st.T.toFixed(1)}℃ · 이슬점 ${st.Td.toFixed(1)}℃`]} />
      </g>

      {/* 감률 안내 */}
      <g transform="translate(560 30)">
        <rect width={226} height={st.phase === 'moist' ? 64 : 64} rx={10} fill="white" stroke={C.line} />
        <Tag x={113} y={20} size={13} bg="none">{st.phase === 'moist' ? '포화 → 습윤 단열 감률' : '불포화 → 건조 단열 감률'}</Tag>
        <Tag x={113} y={44} size={13} color={st.phase === 'moist' ? C.current : C.coriolis} bg="none">
          {st.phase === 'moist' ? '1 km마다 약 5℃' : `1 km마다 10℃ ${st.phase === 'dry-up' ? '↓' : '↑'} (이슬점 2℃)`}
        </Tag>
      </g>
      {step === 3 && s > 2.95 && (
        <Bubble x={470} y={130} w={280} color={C.coriolis} className="rise"
          lines={['처음 20℃ → 산을 넘어 30℃', '이슬점 12℃ → 6℃ : 고온 건조', '푄 현상 (예: 높새바람)']} />
      )}
    </>
  )

  return (
    <SceneFrame label="산을 넘는 공기 덩어리의 기온과 이슬점 변화" svg={svg}
      legend={<Legend items={[{ color: C.wind, label: '바람' }]} />}
      note={<ModelNote>건조 단열 감률 10℃/km, 습윤 단열 감률 5℃/km, 이슬점 감률 2℃/km를 적용한 예시입니다. 실제 습윤 단열 감률은 기온에 따라 달라집니다.</ModelNote>}
    />
  )
}
