import type { SceneProps } from '../data/types'
import { SceneFrame } from '../components/SceneViewer'
import { Legend, ModelNote, SceneButton, Toggle } from '../components/ui'
import { Arrow, Bubble, C, Compass, Tag } from '../components/svg'
import { useTween } from '../lib/anim'

const SEA = 150      // 기본 해수면
const COAST = 210    // 해안선 x
const FAR = 800

export default function Scene05Upwelling({ step, mode, setMode }: SceneProps) {
  const up = mode !== 'down'
  const flip = () => setMode(up ? 'down' : 'up')
  // 표층(따뜻한 층) 두께 변화: 용승 → 해안 쪽이 얇아지고 경계면이 솟음, 침강 → 두꺼워지고 내려감
  const k = useTween(step >= 2 ? (up ? 1 : -1) : 0, 1400)
  const kk = Math.abs(k)
  const seaAt = (x: number) => SEA + k * 8 * Math.exp(-(x - COAST) / 160) // 해수면 높이(용승 시 해안이 약간 낮아짐)
  const thermo = (x: number) => 238 - k * 78 * Math.exp(-(x - COAST) / 190) // 표층/심층 경계

  const xs = Array.from({ length: 30 }, (_, i) => COAST + ((FAR - COAST) * i) / 29)
  const seaLine = xs.map((x) => `${x.toFixed(1)},${seaAt(x).toFixed(1)}`).join(' L')
  const thermoLine = xs.map((x) => `${x.toFixed(1)},${thermo(x).toFixed(1)}`).join(' L')
  const shelf = (x: number) => 260 + (x - 150) * 0.58 // 대륙붕 경사

  const transportDir = up ? 1 : -1
  const nutrients = up && step >= 3

  const svg = (
    <>
      <defs>
        <linearGradient id="s5-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a6fb5" />
          <stop offset="1" stopColor="#0d3c70" />
        </linearGradient>
      </defs>
      <rect width={800} height={480} fill="#f4fbff" />
      {/* 심층수 */}
      <rect x={COAST - 60} y={SEA} width={FAR - COAST + 70} height={330} fill="url(#s5-deep)" />
      {/* 표층수 */}
      <path d={`M${seaLine} L${thermoLine.split(' L').reverse().join(' L')} Z`} fill="#8fd6f6" />
      <path d={`M${seaLine}`} fill="none" stroke={C.current} strokeWidth={3} />
      <path d={`M${thermoLine}`} fill="none" stroke="white" strokeWidth={1.5} strokeDasharray="5 5" />
      <Tag x={740} y={thermo(740) - 40} size={14} color={C.ink} bg="#8fd6f6">따뜻한 표층수</Tag>
      <Tag x={720} y={456} size={14} color="white" bg="none">차가운 심층수</Tag>

      {/* 육지와 해저 */}
      <path d={`M0 128 L${COAST - 40} 132 Q${COAST - 10} 138 ${COAST} ${SEA} L${COAST} ${shelf(COAST)} L${FAR + 10} ${shelf(FAR + 10)} L${FAR + 10} 480 L0 480 Z`} fill={C.sand} />
      <path d={`M${COAST} ${SEA} L${COAST} ${shelf(COAST)} L${FAR + 10} ${shelf(FAR + 10)}`} fill="none" stroke={C.sandDark} strokeWidth={3} />
      <path d={`M0 128 L${COAST - 40} 132 Q${COAST - 10} 138 ${COAST} ${SEA} L${COAST} 480 L0 480 Z`} fill="#d8c08a" />
      <Tag x={90} y={108} size={16} color="#7a5d22" bg="none">육지</Tag>
      <Tag x={500} y={118} size={14} color={C.muted} bg="none">← 해안 · 서쪽                                   먼바다 · 동쪽 →</Tag>

      {/* 바람 기호(단면에서 바람은 지면을 드나듦) */}
      <g>
        <circle cx={330} cy={88} r={16} fill="white" stroke={C.wind} strokeWidth={3} />
        {up ? (
          <path d="M320 78 L340 98 M340 78 L320 98" stroke={C.wind} strokeWidth={3} />
        ) : (
          <circle cx={330} cy={88} r={4.5} fill={C.wind} />
        )}
        <Tag x={354} y={88} anchor="start" size={14} color="#5f6878">{up ? '바람: 화면 안쪽(북쪽)으로' : '바람: 화면 바깥(남쪽)으로'}</Tag>
      </g>

      {/* 지도 삽화 */}
      <g transform="translate(600 14)">
        <rect width={186} height={96} rx={10} fill="white" stroke={C.line} />
        <rect x={0} y={0} width={42} height={96} rx={10} fill={C.sand} />
        <rect x={30} y={0} width={14} height={96} fill={C.sand} />
        <rect x={44} y={0} width={142} height={96} fill="#d8f1fd" rx={0} />
        <text x={8} y={16} fontSize={11} fontWeight={700} fill="#7a5d22">육지</text>
        <Arrow x1={80} y1={up ? 84 : 12} x2={80} y2={up ? 14 : 82} color={C.wind} width={7} />
        <text x={92} y={50} fontSize={11} fontWeight={700} fill="#5f6878">바람</text>
        {step >= 1 && <Arrow x1={up ? 100 : 170} y1={70} x2={up ? 170 : 100} y2={70} color={C.ekman} width={5} className="pop" />}
        {step >= 1 && <text x={136} y={88} fontSize={11} fontWeight={700} fill={C.ekman} textAnchor="middle">에크만 수송</text>}
        <Compass x={164} y={24} size={11} />
      </g>

      {/* 에크만 수송(표층의 수평 이동) */}
      {step >= 1 && (
        <g key={`t${up}`} className="fade">
          {[300, 430, 560].map((x) => (
            <Arrow key={x} x1={x - transportDir * 50} y1={seaAt(x) + 26} x2={x + transportDir * 50} y2={seaAt(x) + 26} color={C.ekman} width={7} halo />
          ))}
          <Tag x={430} y={seaAt(430) + 52} size={14} color={C.ekman} bg="#8fd6f6">{up ? '표층수가 먼바다로 이동' : '표층수가 해안으로 이동'}</Tag>
        </g>
      )}

      {/* 해안 부근 표층수 부족/쌓임 */}
      {step >= 2 && kk > 0.3 && (
        <g className="fade">
          <ellipse cx={COAST + 50} cy={(seaAt(COAST + 50) + thermo(COAST + 50)) / 2} rx={44} ry={Math.max(14, (thermo(COAST + 50) - seaAt(COAST + 50)) / 2 + 6)}
            fill="none" stroke={up ? C.coriolis : C.pgf} strokeWidth={2.5} strokeDasharray="5 4" />
          <Tag x={COAST + 50} y={SEA - 22} size={14} color={up ? C.coriolis : C.pgf}>{up ? '표층수 부족(발산)' : '표층수 쌓임(수렴)'}</Tag>
        </g>
      )}

      {/* 연직 운동 */}
      {step >= 3 && (
        <g key={`v${up}`} className="pop">
          {up ? (
            <>
              <path d={`M640 430 Q 420 430 ${COAST + 80} 360 L ${COAST + 50} 260`} fill="none" stroke="#7fd3ff" strokeWidth={9} strokeLinecap="round" className="flow" />
              <Arrow x1={COAST + 60} y1={300} x2={COAST + 45} y2={196} color="#00b7ff" width={10} halo />
              <Arrow x1={COAST + 110} y1={320} x2={COAST + 100} y2={226} color="#00b7ff" width={7} halo />
            </>
          ) : (
            <>
              <Arrow x1={COAST + 40} y1={176} x2={COAST + 52} y2={300} color={C.ekman} width={10} halo />
              <path d={`M ${COAST + 60} 320 Q ${COAST + 110} 400 640 420`} fill="none" stroke="#ffc27a" strokeWidth={8} strokeLinecap="round" className="flow" />
            </>
          )}
          <Tag x={COAST + 150} y={up ? 254 : 330} size={22} color={up ? '#0083c4' : '#c46a00'} weight={800}>{up ? '용승' : '침강'}</Tag>
        </g>
      )}
      {nutrients && Array.from({ length: 22 }, (_, i) => {
        const x = COAST + 16 + ((i * 37) % 170), y = SEA + 14 + ((i * 23) % 70)
        return <circle key={i} cx={x} cy={y} r={3} fill="#00a865" className="fade" style={{ animationDelay: `${i * 40}ms` }} />
      })}
      {step >= 3 && (
        <Bubble x={COAST + 290} y={300} w={270} color={up ? '#0083c4' : '#c46a00'} className="rise"
          lines={up ? ['해안의 표층 수온 ↓', '영양염류 ↑ (초록 점) → 좋은 어장'] : ['표층수가 아래로 내려감', '산소가 풍부한 물을 깊은 곳에 공급']} />
      )}
    </>
  )

  return (
    <SceneFrame label="해안 단면에서 에크만 수송에 따른 용승과 침강" svg={svg}
      controls={
        <>
          <Toggle label="현상" value={up ? 'up' : 'down'} onChange={setMode}
            options={[{ value: 'up', label: 'A. 용승' }, { value: 'down', label: 'B. 침강' }]} />
          <SceneButton onClick={flip} tone="ink" title="용승과 침강을 번갈아 봅니다">⇄ 번갈아 비교</SceneButton>
        </>
      }
      legend={<Legend items={[{ color: C.wind, label: '바람' }, { color: C.ekman, label: '에크만 수송(표층수 이동)' }, { color: C.sky, label: '용승하는 심층수' }]} />}
      note={<ModelNote>북반구, 서쪽이 육지인 해안을 예로 들었습니다. 연직 방향의 크기와 해수면 변화는 과장했습니다(실제 해수면 변화는 수 cm 정도).</ModelNote>}
    />
  )
}
