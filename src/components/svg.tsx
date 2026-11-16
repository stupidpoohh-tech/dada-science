import type { ReactNode } from 'react'

export const C = {
  ink: '#000a14',
  pgf: '#6f36ff',
  coriolis: '#e8384f',
  motion: '#00a865',
  ekman: '#ff8a00',
  wind: '#8a94a6',
  current: '#2870ff',
  sky: '#00b7ff',
  mint: '#00dc84',
  water1: '#d9f3ff',
  water2: '#9fdcfa',
  water3: '#4fb4e8',
  water4: '#1d7cc4',
  water5: '#0d4f8f',
  sand: '#ecd9a8',
  sandDark: '#c9ad6e',
  rock: '#8b7d6b',
  rockDark: '#5f5446',
  muted: '#5b6779',
  line: '#c6d0dd',
}

type ArrowProps = {
  x1: number; y1: number; x2: number; y2: number
  color?: string; width?: number; head?: number
  dashed?: boolean; className?: string; opacity?: number; halo?: boolean
}

/** 직선 화살표(머리를 직접 계산해 그려 id 충돌이 없음) */
export function Arrow({ x1, y1, x2, y2, color = C.ink, width = 4, head, dashed, className, opacity = 1, halo }: ArrowProps) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len < 0.5) return null
  const h = Math.min(head ?? width * 3.4 + 4, len * 0.7)
  const ux = dx / len, uy = dy / len
  const bx = x2 - ux * h, by = y2 - uy * h
  const hw = h * 0.58
  const pts = `${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`
  return (
    <g className={className} opacity={opacity}>
      {halo && (
        <g>
          <line x1={x1} y1={y1} x2={bx} y2={by} stroke="white" strokeWidth={width + 5} strokeLinecap="round" />
          <polygon points={pts} fill="white" stroke="white" strokeWidth={6} strokeLinejoin="round" />
        </g>
      )}
      <line x1={x1} y1={y1} x2={bx + ux * 1} y2={by + uy * 1} stroke={color} strokeWidth={width}
        strokeLinecap="round" strokeDasharray={dashed ? `${width * 2} ${width * 1.6}` : undefined} />
      <polygon points={pts} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={1} />
    </g>
  )
}

/** 시작점, 각도(도, 수학 좌표: 0=오른쪽, 90=위), 길이로 화살표 그리기 */
export function PolarArrow({ x, y, angle, length, ...rest }: Omit<ArrowProps, 'x1' | 'y1' | 'x2' | 'y2'> & { x: number; y: number; angle: number; length: number }) {
  const r = (angle * Math.PI) / 180
  return <Arrow x1={x} y1={y} x2={x + Math.cos(r) * length} y2={y - Math.sin(r) * length} {...rest} />
}

/** 흰 배경이 깔린 라벨 */
export function Tag({ x, y, children, color = C.ink, bg = 'white', size = 15, anchor = 'middle', weight = 700, className }: {
  x: number; y: number; children: ReactNode; color?: string; bg?: string; size?: number
  anchor?: 'start' | 'middle' | 'end'; weight?: number; className?: string
}) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor} dominantBaseline="middle"
      stroke={bg} strokeWidth={bg === 'none' ? 0 : 5} paintOrder="stroke" strokeLinejoin="round" className={className}>
      {children}
    </text>
  )
}

/** 말풍선(그림 안 짧은 설명) */
export function Bubble({ x, y, w, lines, color = C.ink, className, tail = 'none' }: {
  x: number; y: number; w: number; lines: string[]; color?: string; className?: string
  tail?: 'none' | 'down' | 'up' | 'left' | 'right'
}) {
  const lh = 21
  const h = lines.length * lh + 16
  const tails: Record<string, string> = {
    down: `M${x + w / 2 - 9},${y + h} L${x + w / 2},${y + h + 11} L${x + w / 2 + 9},${y + h}`,
    up: `M${x + w / 2 - 9},${y} L${x + w / 2},${y - 11} L${x + w / 2 + 9},${y}`,
    left: `M${x},${y + h / 2 - 9} L${x - 11},${y + h / 2} L${x},${y + h / 2 + 9}`,
    right: `M${x + w},${y + h / 2 - 9} L${x + w + 11},${y + h / 2} L${x + w},${y + h / 2 + 9}`,
  }
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="white" stroke={color} strokeWidth={2} />
      {tail !== 'none' && <path d={tails[tail]} fill="white" stroke={color} strokeWidth={2} strokeLinejoin="round" />}
      {tail !== 'none' && <rect x={tail === 'left' ? x + 1 : tail === 'right' ? x + w - 4 : x + w / 2 - 8} y={tail === 'up' ? y + 1 : tail === 'down' ? y + h - 4 : y + h / 2 - 8} width={tail === 'left' || tail === 'right' ? 3 : 16} height={tail === 'left' || tail === 'right' ? 16 : 3} fill="white" />}
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={y + 8 + lh * i + lh / 2} fontSize={15} fontWeight={i === 0 ? 700 : 500}
          fill={i === 0 ? color : C.ink} textAnchor="middle" dominantBaseline="middle">{l}</text>
      ))}
    </g>
  )
}

/** 직각 표시 */
export function RightAngle({ x, y, a1, a2, size = 12, color = C.ink }: { x: number; y: number; a1: number; a2: number; size?: number; color?: string }) {
  const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180
  const p1 = [x + Math.cos(r1) * size, y - Math.sin(r1) * size]
  const p2 = [x + Math.cos(r2) * size, y - Math.sin(r2) * size]
  const p3 = [p1[0] + Math.cos(r2) * size, p1[1] - Math.sin(r2) * size]
  return <path d={`M${p1[0]},${p1[1]} L${p3[0]},${p3[1]} L${p2[0]},${p2[1]}`} fill="none" stroke={color} strokeWidth={1.8} />
}

/** 나침반(북쪽 표시) */
export function Compass({ x, y, size = 22 }: { x: number; y: number; size?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={size} fill="white" stroke={C.line} strokeWidth={1.5} />
      <polygon points={`${x},${y - size + 5} ${x - 6},${y + 4} ${x},${y} ${x + 6},${y + 4}`} fill={C.ink} />
      <text x={x} y={y - size - 9} fontSize={13} fontWeight={800} textAnchor="middle" fill={C.ink}>N</text>
    </g>
  )
}
