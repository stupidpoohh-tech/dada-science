import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote } from '../components/ui'
import { Arrow, Bubble, C, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const SURF = 250
const COAST = 640
const ground = (x: number) => (x < 420 ? 440 : x < COAST ? 440 - ((440 - SURF) * (x - 420)) / (COAST - 420) : SURF - (x - COAST) * 0.32)

export default function Scene11StormSurge({ step }: SceneProps) {
  const tx = useTween(step === 0 ? 170 : 470, 1400, step === 1 ? 170 : undefined)
  const baro = useTween(step >= 1 ? 1 : 0, 1200)     // 기압 효과
  const wind = useTween(step >= 2 ? 1 : 0, 1400)     // 바람 효과
  const tide = useTween(step >= 3 ? 1 : 0, 1400)     // 만조

  const rise = (x: number) =>
    baro * 22 * Math.exp(-(((x - tx) / 120) ** 2)) +
    wind * 34 * Math.max(0, Math.min(1, (x - 300) / (COAST - 300))) ** 2 +
    tide * 18
  const sea = (x: number) => SURF - rise(x)
  const coastLevel = sea(COAST)
  const flood = coastLevel < SURF - 4 ? Math.min(150, (SURF - coastLevel) / 0.32) : 0

  const pts: string[] = []
  for (let x = 0; x <= COAST; x += 6) pts.push(`${x},${sea(x).toFixed(1)}`)
  for (let x = COAST + 6; x <= COAST + flood; x += 6) pts.push(`${x},${Math.min(coastLevel, ground(x)).toFixed(1)}`)
  const endX = COAST + flood

  const svg = (
    <>
      <defs>
        <linearGradient id="s11-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe8fc" />
          <stop offset="1" stopColor="#1d6db3" />
        </linearGradient>
      </defs>
      <rect width={800} height={480} fill="#eef3f8" />
      <polygon points={`0,480 ${pts.join(' ')} ${endX},480`} fill="url(#s11-w)" />
      <polyline points={pts.join(' ')} fill="none" stroke={C.current} strokeWidth={3.5} />
      <line x1={0} x2={COAST} y1={SURF} y2={SURF} stroke={C.ink} strokeOpacity={0.35} strokeDasharray="6 6" />
      <Tag x={14} y={SURF + 16} anchor="start" size={12} color={C.muted} bg="none">{step >= 3 ? '평소(간조 기준) 해수면' : '평소 해수면'}</Tag>
      <path d={`M0 440 L420 440 L${COAST} ${SURF} L800 ${SURF - 51} L800 480 L0 480 Z`} fill={C.sand} stroke={C.sandDark} strokeWidth={2} />
      {/* 해안 마을 */}
      {[690, 730, 768].map((x, i) => (
        <g key={x} transform={`translate(${x} ${ground(x) - 22})`}>
          <rect x={-12} y={0} width={24} height={22} fill="white" stroke={C.ink} strokeWidth={1.5} />
          <polygon points="-15,1 0,-12 15,1" fill={i === 1 ? C.coriolis : '#8b7d6b'} />
        </g>
      ))}
      <Tag x={740} y={ground(740) + 26} size={13} color="#7a5d22" bg="none">해안 저지대</Tag>

      {/* 태풍 */}
      <g transform={`translate(${tx} 86)`}>
        <circle r={56} fill="white" opacity={0.9} />
        {[0, 120, 240].map((a) => (
          <path key={a} d="M0 0 Q 30 -40 64 -14" fill="none" stroke={C.wind} strokeWidth={9} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
        <circle r={14} fill={C.coriolis} />
        <text y={1} fontSize={16} fontWeight={800} textAnchor="middle" dominantBaseline="middle" fill="white">L</text>
        <Tag x={0} y={78} size={14} color={C.coriolis}>태풍(저기압) 중심</Tag>
      </g>

      {/* 기압 화살표: 길이 = 해수면을 누르는 공기의 압력 */}
      {step >= 1 && [80, 200, 320, 440, 560].map((x) => {
        const p = 1 - 0.55 * Math.exp(-(((x - tx) / 110) ** 2))
        const y0 = sea(x)
        return <Arrow key={x} x1={x} y1={y0 - 18 - 44 * p} x2={x} y2={y0 - 6} color={C.pgf} width={4} halo opacity={0.9} />
      })}
      {step === 1 && (
        <Bubble x={tx - 150} y={310} w={300} color={C.pgf} className="rise"
          lines={['기압이 낮은 곳: 누르는 힘이 약함', '→ 해수면이 부풀어 오름', '(1 hPa 낮아질 때 약 1 cm)']} />
      )}

      {/* 바람이 해수를 해안으로 밀어 쌓음 */}
      {step >= 2 && (
        <g className="fade">
          {[260, 380, 500].map((x) => (
            <Arrow key={x} x1={x - 50} y1={sea(x) - 30} x2={x + 50} y2={sea(x) - 40} color={C.wind} width={7} />
          ))}
          <Tag x={380} y={sea(380) - 64} size={14} color="#5f6878">강한 바람</Tag>
          {[300, 450, 580].map((x) => (
            <Arrow key={x} x1={x - 34} y1={sea(x) + 22} x2={x + 34} y2={sea(x) + 22} color={C.motion} width={5} halo />
          ))}
          <Tag x={450} y={sea(450) + 48} size={13} color={C.motion} bg="none">해수가 해안 쪽으로 쌓임</Tag>
        </g>
      )}

      {/* 해안의 해수면 상승 표시 */}
      {step >= 1 && (
        <g>
          <line x1={COAST - 20} x2={COAST - 20} y1={SURF} y2={coastLevel} stroke={C.coriolis} strokeWidth={3} />
          <line x1={COAST - 28} x2={COAST - 12} y1={coastLevel} y2={coastLevel} stroke={C.coriolis} strokeWidth={3} />
          <Tag x={COAST - 30} y={(SURF + coastLevel) / 2} anchor="end" size={13} color={C.coriolis}>해수면 상승</Tag>
        </g>
      )}
      {step === 3 && (
        <Bubble x={420} y={150} w={300} color={C.coriolis} className="rise"
          lines={['만조와 겹치면 더 높아짐', '해안 저지대 침수 위험']} />
      )}
    </>
  )

  return (
    <SceneFrame label="태풍에 의한 폭풍해일의 발생 과정 단면" svg={svg}
      legend={<Legend items={[{ color: C.pgf, label: '대기압(누르는 힘)' }, { color: C.wind, label: '바람' }, { color: C.motion, label: '해수의 이동' }]} />}
      note={<ModelNote>해수면 높이 변화는 크게 과장했습니다. 실제 폭풍해일의 높이는 태풍의 세기, 진로, 해안 지형에 따라 수십 cm에서 수 m까지 다양합니다.</ModelNote>}
    />
  )
}
