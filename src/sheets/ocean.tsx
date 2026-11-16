import type { ReactNode } from 'react'
import { Arw, BLUE, Boxed, Circled, Cloud, Curve, GRAY, Hot, INK, RED, Txt, Wave, textWidth } from './primitives'

/**
 * Ⅱ. 해수의 운동과 순환 — 원본 손글씨 노트(source/…_04.jpg, _05.jpg)의 배치를 행 단위로 재현
 * 각 행의 id는 필기·문제 연결 기준이므로 바꾸지 마세요.
 */

const H = ({ x, y, children }: { x: number; y: number; children: string }) => <Txt x={x} y={y} size={21} weight={800}>{children}</Txt>
const L = ({ x, y, children }: { x: number; y: number; children: string }) => <Txt x={x} y={y} size={15} weight={800}>{children}</Txt>

/** 막대 사람(원본의 작은 사람 그림) */
function Person({ x, y, run, s = 1 }: { x: number; y: number; run?: boolean; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={1.4} fill="none" strokeLinecap="round">
      <circle cx={0} cy={-14} r={4} />
      <path d={run ? 'M0 -10 L-2 0 M-2 0 L-9 7 M-2 0 L5 8 M-1 -6 L-8 -9 M-1 -6 L7 -4' : 'M0 -10 L0 1 M0 1 L-5 9 M0 1 L5 9 M0 -6 L-6 -2 M0 -6 L6 -2'} />
    </g>
  )
}
function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={1.2} fill="none">
      <circle cx={x} cy={y} r={7} />
      <path d={`M${x - 2} ${y} a2 2 0 1 1 3 1.6`} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180
        return <line key={a} x1={x + Math.cos(r) * 10} y1={y + Math.sin(r) * 10} x2={x + Math.cos(r) * 14} y2={y + Math.sin(r) * 14} />
      })}
    </g>
  )
}

export const OCEAN_ROWS: Record<string, { h: number; label: string; render: () => ReactNode }> = {
  // ───────── 01. 해수를 움직이는 힘 ─────────
  'ocean-01-vertical': {
    h: 250, label: '01 해수를 움직이는 힘 — 수직: 수압, 수압 경도력, 정역학 평형',
    render: () => (
      <>
        <H x={2} y={26}>01. 해수를 움직이는 힘</H>
        <L x={14} y={70}>[수직]</L>
        <g>
          <Wave x={110} y={64} w={112} a={3.5} l={24} />
          <Curve x1={222} y1={60} cx={232} cy={46} x2={246} y2={52} />
          <Txt x={252} y={58} size={14}>수압(중력)</Txt>
          {[132, 154, 176].map((x) => <Arw key={x} x1={x} y1={78} x2={x} y2={100} color={RED} w={1.6} head={6} />)}
          {/* 엎드린 잠수부와 말풍선 */}
          <g stroke={INK} strokeWidth={1.5} fill="none" strokeLinecap="round">
            <circle cx={156} cy={134} r={9} />
            <path d="M151 131 l2 0 M158 131 l2 0 M153 137 q2.5 -2 5 0" strokeWidth={1.1} />
            <path d="M147 140 L112 150 M112 150 L96 146 M112 150 L98 156 M138 143 L124 136 M128 147 L118 156" />
          </g>
          <text x={168} y={124} fontSize={10} fill={INK}>• •</text>
          <Cloud x={184} y={100} w={58} h={20} />
          <Txt x={213} y={115} size={12} anchor="middle">무거워</Txt>
          <Arw x1={156} y1={164} x2={156} y2={190} />
          <Txt x={156} y={216} size={15} anchor="middle" weight={600}>깊어질수록 수압↑</Txt>
          <Txt x={242} y={216} size={16}>⇒</Txt>
          {/* 작은 압력 ↑ 큰 압력 */}
          <Cloud x={332} y={54} w={84} h={22} />
          <Txt x={374} y={70} size={13.5} anchor="middle" weight={600}>작은 압력</Txt>
          <Arw x1={374} y1={188} x2={374} y2={84} color={RED} w={2} />
          <Txt x={388} y={112} size={13}>큰 압력에서 작은 압력으로</Txt>
          <Txt x={388} y={132} size={13}>압력차에 의해 힘이 생김</Txt>
          <Cloud x={318} y={196} w={96} h={24} />
          <Txt x={366} y={214} size={14} anchor="middle" weight={600}>큰 압력</Txt>
          <Txt x={428} y={214} size={16}>⇒</Txt>
          <Boxed x={452} y={214} size={14.5}>수압 경도력</Boxed>
          <Txt x={446} y={240} size={13}>연직 (아래에서 위로)</Txt>
        </g>
        {/* 정역학 평형 */}
        <Txt x={622} y={62} size={14} anchor="middle" weight={600}>연직 수압 경도력</Txt>
        <Arw x1={622} y1={112} x2={622} y2={76} w={2} />
        <circle cx={622} cy={124} r={3} fill={INK} />
        <Arw x1={622} y1={136} x2={622} y2={172} w={2} />
        <Txt x={622} y={194} size={14} anchor="middle" weight={600}>중력</Txt>
        <Txt x={652} y={130} size={16} color={RED} weight={800}>정역학</Txt>
        <Circled x={724} y={130} size={15} color={RED}>평형</Circled>
      </>
    ),
  },
  'ocean-01-horizontal': {
    h: 196, label: '수평: 해수면의 높이 차와 해수의 밀도 차에 의한 수평 수압 경도력',
    render: () => (
      <>
        <L x={14} y={26}>[수평]</L>
        <Txt x={70} y={26} size={14}>~ 해수면의 높이 차</Txt>
        <Txt x={118} y={46} size={12} color={GRAY}>or</Txt>
        <Txt x={92} y={66} size={14}>해수의 밀도 차</Txt>
        <Txt x={248} y={26} size={14} weight={600}>① 해수면의 높이 차</Txt>
        <Hot x={238} y={36} w={250} h={146} popup="pgf" label="해수면 기울기와 수압경도력">
          <polygon points="258,52 258,160 414,160 414,104" fill="none" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
          <Arw x1={316} y1={128} x2={350} y2={128} color={RED} w={1.8} />
          <Txt x={336} y={150} size={13} color={RED} weight={700} anchor="middle">수평 수압 경도력</Txt>
          <Txt x={418} y={136} size={11}>×</Txt>
          <Txt x={428} y={126} size={13}>경사</Txt>
          <Txt x={428} y={146} size={13}>중력가속도</Txt>
        </Hot>
        <Txt x={506} y={26} size={14} weight={600}>② 해수의 밀도 차</Txt>
        <Txt x={622} y={26} size={14}>←</Txt>
        <Circled x={656} y={26} size={14}>온도</Circled>
        <Sun x={540} y={68} />
        <Txt x={640} y={60} size={13} color={RED} weight={700} anchor="middle">수평수압경도력</Txt>
        <Arw x1={668} y1={74} x2={610} y2={74} color={RED} w={1.6} />
        <g stroke={INK} strokeWidth={1.3} fill="none">
          <path d="M690 58 l16 -6 l14 6 l-16 6 z M690 58 v12 l14 6 v-12 M704 76 l16 -6 v-12" />
          <path d="M724 64 q10 4 2 12 q-8 6 4 12" />
        </g>
        <Person x={538} y={128} run />
        <Person x={568} y={124} run />
        <Txt x={584} y={102} size={12}>더워…</Txt>
        <Arw x1={668} y1={124} x2={616} y2={124} color={RED} w={1.6} />
        {[688, 702, 716, 730].map((x) => <Person key={x} x={x} y={128} s={0.9} />)}
        <Txt x={706} y={98} size={12} anchor="middle">추워…</Txt>
        <Txt x={556} y={170} size={14} anchor="middle" weight={600}>밀도↓ 압력↓</Txt>
        <Txt x={710} y={170} size={14} anchor="middle" weight={600}>밀도↑ 압력↑</Txt>
      </>
    ),
  },
  'ocean-01-coriolis': {
    h: 206, label: '전향력: 정의와 북반구·남반구의 방향',
    render: () => (
      <>
        <L x={14} y={26}>[전향력]</L>
        <Txt x={94} y={26} size={14}>= 회전하는 표면 위에서 운동하는 물체에 작용하는,</Txt>
        <Txt x={194} y={50} size={14}>운동방향을 휘어지게 하는 가상의 힘</Txt>
        {/* 회전판 위의 사람 */}
        <ellipse cx={150} cy={122} rx={58} ry={17} fill="none" stroke={INK} strokeWidth={1.5} />
        <Person x={128} y={110} s={0.85} />
        <Person x={170} y={116} s={0.85} />
        <Curve x1={136} y1={98} cx={150} cy={90} x2={164} y2={100} head={5} />
        <Curve x1={84} y1={130} cx={78} cy={112} x2={88} y2={104} head={6} />
        <Curve x1={214} y1={112} cx={222} cy={132} x2={206} y2={142} head={6} />
        <Hot x={244} y={62} w={360} h={142} popup="geostrophic" step={2} label="북반구·남반구의 전향력 방향">
          <circle cx={342} cy={130} r={42} fill="none" stroke={INK} strokeWidth={1.6} />
          <Curve x1={322} y1={84} cx={342} cy={74} x2={360} y2={84} head={6} />
          <Txt x={341} y={78} size={11.5} anchor="middle">자전</Txt>
          <Circled x={342} y={110} size={12}>북</Circled>
          <Txt x={334} y={136} size={12}>지구</Txt>
          <Circled x={342} y={166} size={12}>남</Circled>
          {/* 전향력 크기: 고위도(북·남)에서 大, 적도에서 0 */}
          <Txt x={296} y={98} size={13} weight={700} color={RED}>大</Txt>
          <Txt x={298} y={176} size={13} weight={700} color={RED}>大</Txt>
          <circle cx={270} cy={130} r={9} fill="none" stroke={RED} strokeWidth={1.5} />
          <Txt x={270} y={134.5} size={12} weight={700} anchor="middle">0</Txt>
          <Arw x1={298} y1={130} x2={282} y2={130} />
          <Arw x1={356} y1={106} x2={386} y2={106} w={1.3} head={6} />
          <Txt x={392} y={104} size={13}>물체 운동방향의</Txt>
          <Txt x={392} y={124} size={13}>'오른쪽' 직각방향</Txt>
          <Arw x1={356} y1={162} x2={386} y2={162} w={1.3} head={6} />
          <Txt x={392} y={166} size={13}>'왼쪽' 직각방향으로</Txt>
          <Txt x={412} y={190} size={13.5} weight={600} u="wavy">전향력 작용</Txt>
        </Hot>
        {/* 02. 지형류의 에크만 수송으로 이어지는 화살표 */}
        <path d="M440 196 Q438 202 436 206" fill="none" stroke={INK} strokeWidth={1.4} />
      </>
    ),
  },

  // ───────── 02. 지형류 ─────────
  'ocean-02-ekman': {
    h: 336, label: '02 지형류 — 에크만 수송, 에크만 나선, 마찰 저항 심도, 대기 대순환과 해류',
    render: () => (
      <>
        <Curve x1={436} y1={0} cx={430} cy={46} x2={262} y2={58} />
        <H x={2} y={28}>02. 지형류</H>
        <L x={14} y={80}>[에크만 수송]</L>
        <Circled x={132} y={80} size={12}>북</Circled>
        <Txt x={146} y={80} size={14}>바람</Txt>
        <Arw x1={184} y1={76} x2={300} y2={76} w={1.6} />
        <Txt x={242} y={66} size={13} anchor="middle" weight={600}>전향력</Txt>
        <Txt x={242} y={94} size={12} anchor="middle">바람</Txt>
        <Txt x={308} y={80} size={14}>해수는 바람의 오른쪽 45° 방향</Txt>
        <line x1={450} y1={88} x2={450} y2={110} stroke={GRAY} strokeDasharray="2 3" />
        <Hot x={8} y={100} w={276} h={160} popup="ekman" label="에크만 나선과 에크만 수송">
          <Arw x1={92} y1={112} x2={92} y2={254} both w={1.4} />
          <Txt x={14} y={176} size={13} weight={600}>에크만층</Txt>
          <Txt x={22} y={198} size={13} weight={600}>마찰층</Txt>
          <Arw x1={112} y1={142} x2={196} y2={116} w={1.6} />
          <Arw x1={168} y1={124} x2={196} y2={138} w={1.4} head={6} />
          <Txt x={206} y={140} size={12}>⌋ 해수</Txt>
          <Txt x={196} y={160} size={12}>⌋ 이동방향</Txt>
          <Boxed x={124} y={208} size={14}>에크만 나선!</Boxed>
          <line x1={152} y1={222} x2={152} y2={244} stroke={GRAY} strokeDasharray="2 3" />
        </Hot>
        <Txt x={302} y={140} size={13.5}>심층해수도 같이 움직이기…</Txt>
        <Txt x={302} y={166} size={13.5}>근데 마찰 때문에 유속 느려지기…</Txt>
        <Txt x={302} y={192} size={13.5}>방향이 더더더 꺾이기…</Txt>
        <Txt x={548} y={124} size={14} weight={700}>〈에크만 수송〉</Txt>
        <Txt x={548} y={146} size={13}>에크만 층에서 해수의 '평균' 이동방향</Txt>
        <Circled x={562} y={170} size={12}>북</Circled>
        <Txt x={578} y={170} size={13}>풍향의 오른쪽 90°</Txt>
        <Circled x={562} y={194} size={12}>남</Circled>
        <Txt x={578} y={194} size={13}>〃 왼쪽 90°</Txt>
        {/* 마찰 저항 심도 */}
        <Curve x1={118} y1={274} cx={102} cy={268} x2={96} y2={256} color={RED} />
        <Txt x={124} y={280} size={13.5}>표면과 해수이동방향이 정반대가 되는 깊이</Txt>
        <Txt x={124} y={308} size={15}>⇒</Txt>
        <Boxed x={150} y={308} size={14.5} border={RED}>마찰 저항심도</Boxed>
        {/* (대기대순환) */}
        <Txt x={416} y={268} size={12}>북동무역풍 … 위도 0~30</Txt>
        <Boxed x={560} y={268} size={11.5}>서쪽방향</Boxed>
        <Txt x={416} y={292} size={12}>편서풍 … 위도 30~60</Txt>
        <Boxed x={560} y={292} size={11.5}>동쪽방향</Boxed>
        <Txt x={340} y={316} size={12} color={GRAY}>(대기대순환)</Txt>
        <Txt x={622} y={284} size={12}>지형류</Txt>
        {/* 쿠로시오 메모: 북태평양 시계방향 순환. 순환 중심이 서쪽으로 치우쳐 서쪽 해수면이 높고(高) 경사가 커서 서쪽 경계의 쿠로시오(흑조)가 강하다 */}
        <Txt x={676} y={226} size={12} color={RED} weight={700} anchor="middle">쿠로시오 해류</Txt>
        <Txt x={676} y={242} size={11} color={RED} anchor="middle">빠르고 강하다</Txt>
        <g fill="none" strokeLinecap="round">
          {/* 위: 편서풍 → 동쪽 */}
          <path d="M680 250 Q712 238 742 252" stroke={INK} strokeWidth={1.4} />
          <path d="M736 246 L743 252 L734 255" stroke={INK} strokeWidth={1.4} />
          {/* 동쪽: 남쪽으로 */}
          <path d="M745 258 Q750 270 742 282" stroke={INK} strokeWidth={1.2} />
          {/* 아래: 무역풍 → 서쪽 */}
          <path d="M738 288 Q712 298 684 290" stroke={INK} strokeWidth={1.4} />
          <path d="M690 286 L683 290 L691 294" stroke={INK} strokeWidth={1.4} />
          {/* 서쪽 경계: 쿠로시오(북쪽으로, 강함) */}
          <path d="M676 288 L676 252" stroke={RED} strokeWidth={2.6} />
          <path d="M671 259 L676 250 L681 259" stroke={RED} strokeWidth={2.2} />
        </g>
        <Txt x={694} y={273} size={12} weight={700} color={RED} anchor="middle">高</Txt>
        <Txt x={722} y={273} size={10} anchor="middle">시계방향</Txt>
        <Txt x={720} y={286} size={10} weight={700} anchor="middle">순환</Txt>
        <Txt x={584} y={314} size={10.5}>(바람이 서쪽에서 불어야 ~ 편서풍)</Txt>
        <Txt x={640} y={331} size={11.5} weight={600}>표류하면 미국 가!</Txt>
      </>
    ),
  },
  'ocean-02-geostrophic': {
    h: 262, label: '지형류 형성: 수압 경도력과 전향력의 평형',
    render: () => (
      <>
        <L x={14} y={26}>[지형류 형성]</L>
        <Txt x={132} y={26} size={14}>에크만 수송 → 해수 이동 →</Txt>
        <Txt x={316} y={26} size={14} weight={600} u="double">해수면 경사</Txt>
        <Txt x={396} y={26} size={14}>→</Txt>
        <Circled x={454} y={26} size={13.5}>수압경도력</Circled>
        <Txt x={504} y={26} size={14}>발생</Txt>
        <Arw x1={454} y1={38} x2={454} y2={62} />
        <Txt x={416} y={82} size={14}>해수 움직임.</Txt>
        <Curve x1={540} y1={52} cx={524} cy={58} x2={512} y2={74} color={RED} />
        <Txt x={546} y={56} size={13.5} color={RED} weight={700}>전향력 작용</Txt>
        <Circled x={638} y={56} size={12}>북</Circled>
        <Txt x={654} y={56} size={13}>점점 오른쪽으로…</Txt>
        <Txt x={506} y={106} size={13.5}>① ⇒ 등수압선에</Txt>
        <Txt x={610} y={106} size={13.5} u="line">나란하게</Txt>
        <Txt x={666} y={106} size={13.5}>해수 흐르게 됨.</Txt>
        <Txt x={566} y={142} size={15}>=</Txt>
        <Circled x={612} y={142} size={15}>지형류</Circled>
        <Hot x={20} y={112} w={462} h={148} popup="geostrophic" label="수압 경도력과 전향력의 평형으로 형성되는 지형류">
          {/* 왼쪽 그림 */}
          <path d="M52 230 L52 196 Q72 194 84 172 Q100 142 132 140 L196 140 L196 230 Z" fill="none" stroke={INK} strokeWidth={1.5} />
          <Arw x1={136} y1={216} x2={60} y2={216} w={1.5} />
          <Arw x1={134} y1={214} x2={168} y2={176} color={RED} w={2.2} />
          <Txt x={150} y={168} size={13} color={RED} weight={700}>지형류</Txt>
          <Arw x1={138} y1={216} x2={196} y2={216} color={RED} w={1.6} />
          <Txt x={202} y={220} size={13} color={RED} weight={700}>전향력</Txt>
          <Txt x={70} y={252} size={13} weight={600}>수압경도력</Txt>
          {/* 등수압선 그림 */}
          <Txt x={290} y={132} size={13.5} weight={600} u="wavy">등수압선</Txt>
          <Txt x={350} y={132} size={13.5}>← 방향 같음!</Txt>
          <Arw x1={418} y1={140} x2={418} y2={162} w={1.3} head={6} />
          {[300, 330, 360].map((x) => <line key={x} x1={x} x2={x} y1={150} y2={238} stroke={INK} strokeWidth={1.4} />)}
          <Arw x1={380} y1={224} x2={380} y2={178} color={RED} w={2.2} />
          <Txt x={388} y={186} size={13} color={RED} weight={700}>지형류</Txt>
          <Arw x1={380} y1={226} x2={432} y2={226} color={RED} w={1.6} />
          <Txt x={438} y={230} size={13} color={RED} weight={700}>전향력</Txt>
          <Arw x1={378} y1={226} x2={334} y2={226} w={1.5} />
          <Txt x={314} y={254} size={13} weight={600}>수압경도력</Txt>
        </Hot>
      </>
    ),
  },

  // ───────── 03. 해파 ─────────
  'ocean-03-structure': {
    h: 254, label: '03 해파 — 정의, 마루·골·파고·파장, 속도 = 파장/주기',
    render: () => {
      const def = '해수면의 파동이 퍼지면서 생기는 물입자의'
      const x0 = 106, w0 = textWidth(def, 14)
      const pts = Array.from({ length: 81 }, (_, i) => { const x = 60 + i * 2.5; return `${x},${(155 - 45 * Math.cos(((x - 60) / 160) * 2 * Math.PI)).toFixed(1)}` }).join(' ')
      return (
        <>
          <H x={2} y={28}>03. 해파</H>
          <Txt x={94} y={28} size={14}>:</Txt>
          <Txt x={x0} y={28} size={14}>{def}</Txt>
          <Circled x={x0 + w0 + 24} y={28} size={14} ring={RED}>주기</Circled>
          <Txt x={x0 + w0 + 46} y={28} size={14}>적인</Txt>
          <Circled x={x0 + w0 + 104} y={28} size={14}>상하</Circled>
          <Txt x={x0 + w0 + 128} y={28} size={14}>운동</Txt>
          <Hot x={590} y={40} w={162} h={86} popup="waves" label="파동의 진행과 물 입자 운동">
            <Wave x={600} y={98} w={130} a={7} l={64} />
            <path d="M650 84 l8 -12 l8 12 z" fill="none" stroke={INK} strokeWidth={1.3} />
            <line x1={658} y1={72} x2={658} y2={60} stroke={INK} strokeWidth={1.3} />
            <path d="M658 60 h10 v6 h-10" fill="none" stroke={INK} strokeWidth={1.2} />
            <Arw x1={658} y1={90} x2={658} y2={118} both w={1.3} head={5} />
          </Hot>
          <Txt x={672} y={62} size={13} weight={600}>그대로 제자리!</Txt>
          <Txt x={680} y={142} size={13} weight={600} anchor="middle">이동X E만 전달!</Txt>
          <Hot x={14} y={66} w={300} h={184} popup="waves" step={3} label="마루·골·파고·파장">
            <polyline points={pts} fill="none" stroke={INK} strokeWidth={1.7} />
            <line x1={60} x2={226} y1={110} y2={110} stroke={GRAY} strokeDasharray="2 4" />
            <line x1={140} x2={300} y1={200} y2={200} stroke={GRAY} strokeDasharray="2 4" />
            <Txt x={60} y={98} size={13} anchor="middle" weight={600}>마루</Txt>
            <Boxed x={138} y={98} size={13} anchor="middle">파장</Boxed>
            <Txt x={226} y={98} size={13} anchor="middle" weight={600}>마루</Txt>
            <Arw x1={46} y1={114} x2={46} y2={198} both w={1.3} head={6} />
            <Boxed x={20} y={162} size={13} anchor="end" pad={3}>파고</Boxed>
            <Txt x={140} y={226} size={13} anchor="middle" weight={600}>골</Txt>
          </Hot>
          <Txt x={334} y={92} size={12.5}>마루~마루</Txt>
          <Txt x={334} y={112} size={12.5}>골~골</Txt>
          <Txt x={404} y={104} size={17} color={RED} weight={700}>시간</Txt>
          <rect x={330} y={140} width={164} height={74} fill="none" stroke={INK} strokeWidth={1.4} />
          <Txt x={346} y={184} size={15} weight={600}>* 속도 =</Txt>
          <Txt x={444} y={170} size={15} anchor="middle" weight={600}>파장</Txt>
          <line x1={418} x2={470} y1={177} y2={177} stroke={INK} strokeWidth={1.3} />
          <Txt x={444} y={198} size={15} anchor="middle" weight={600}>주기</Txt>
        </>
      )
    },
  },
  'ocean-03-shape': {
    h: 146, label: '모양: 풍랑, 너울, 연안 쇄파',
    render: () => {
      let zig = 'M62 66'
      for (let i = 0; i < 6; i++) zig += ` L${67 + i * 10} 52 L${72 + i * 10} 66`
      return (
        <>
          <L x={14} y={30}>[모양]</L>
          <Hot x={58} y={8} w={276} h={100} popup="shoaling" label="해안 접근에 따른 파속·파장·파고 변화">
            <Txt x={92} y={36} size={14} anchor="middle" weight={600}>풍랑</Txt>
            <path d={zig} fill="none" stroke={INK} strokeWidth={1.5} strokeLinejoin="miter" />
            <Txt x={186} y={44} size={14} anchor="middle" weight={600}>너울</Txt>
            <Wave x={136} y={64} w={100} a={7} l={50} />
            <Txt x={286} y={28} size={14} anchor="middle" weight={600}>연안쇄파</Txt>
            <path d="M240 66 Q270 64 282 44 Q290 32 306 36 Q312 40 304 46 Q296 52 300 60 Q304 66 312 68" fill="none" stroke={INK} strokeWidth={1.5} />
            <Txt x={118} y={96} size={12.5}>* 그림으로 기억!</Txt>
          </Hot>
          <Curve x1={532} y1={28} cx={530} cy={12} x2={556} y2={12} head={5} />
          <Txt x={562} y={16} size={12.5} weight={600}>풍역대</Txt>
          <Txt x={350} y={40} size={13.5}>- 풍랑 : 마루가 뾰족 (바람부는 해역) 방향 일정</Txt>
          <Txt x={350} y={74} size={13.5}>- 너울 : 마루가 둥글, 긴 파장</Txt>
          <Txt x={350} y={108} size={13.5}>- 연안쇄파 : (수심 얕아져) 느린속도, 짧은 파장,</Txt>
          <Txt x={448} y={130} size={13.5}>높은 파고 → 부서짐.</Txt>
        </>
      )
    },
  },
  'ocean-03-types': {
    h: 236, label: '파장과 수심의 비교: 심해파, 천이파, 천해파',
    render: () => (
      <>
        <L x={14} y={24}>[파장과 수심의 비교]</L>
        <Hot x={22} y={34} w={316} h={200} popup="waves" step={4} label="심해파와 천해파의 물 입자 운동">
          <Txt x={74} y={54} size={13.5} anchor="middle" weight={600}>심해파</Txt>
          <Txt x={184} y={46} size={13} anchor="middle" weight={600}>천이파</Txt>
          <Txt x={184} y={62} size={12} anchor="middle" color={GRAY}>전이파</Txt>
          <Txt x={292} y={54} size={13.5} anchor="middle" weight={600}>천해파</Txt>
          <Wave x={34} y={76} w={296} a={3} l={26} />
          <g fill="none" stroke={INK} strokeWidth={1.3}>
            <circle cx={74} cy={96} r={8} /><circle cx={74} cy={120} r={3.5} /><circle cx={74} cy={140} r={1.6} />
            <circle cx={184} cy={96} r={7} /><circle cx={184} cy={118} r={3} />
            <ellipse cx={292} cy={94} rx={12} ry={5} />
          </g>
          <line x1={180} x2={188} y1={136} y2={136} stroke={INK} strokeWidth={1.3} />
          <Arw x1={280} y1={114} x2={306} y2={114} both w={1.3} head={5} />
          <path d="M34 166 Q190 168 330 124" fill="none" stroke={INK} strokeWidth={1.4} />
          <Txt x={60} y={206} size={13.5} anchor="middle" weight={600}>깊다</Txt>
          <Circled x={190} y={204} size={13}>수심이 파장의 1/2보다</Circled>
          <Txt x={318} y={206} size={13.5} anchor="middle" weight={600}>얕다</Txt>
        </Hot>
        <Txt x={482} y={42} size={12} anchor="middle" color={GRAY}>물입자</Txt>
        <Txt x={572} y={42} size={12} anchor="middle" color={GRAY}>깊은곳</Txt>
        <Txt x={690} y={42} size={12} anchor="middle" color={GRAY}>속도를 결정하는 것</Txt>
        <Txt x={360} y={74} size={13.5} weight={600}>- 심해파 :</Txt>
        <Txt x={482} y={74} size={13.5} anchor="middle">원운동</Txt>
        <Txt x={572} y={74} size={13.5} anchor="middle">작아져 무시</Txt>
        <Txt x={690} y={74} size={13.5} anchor="middle">파장 (파장↑ 속도↑)</Txt>
        <Txt x={360} y={112} size={13.5} weight={600}>- 천이파 :</Txt>
        <Txt x={526} y={112} size={13.5} anchor="middle">중간</Txt>
        <line x1={526} x2={526} y1={82} y2={100} stroke={GRAY} strokeDasharray="2 3" />
        <line x1={526} x2={526} y1={120} y2={140} stroke={GRAY} strokeDasharray="2 3" />
        <Txt x={690} y={136} size={12} anchor="middle">수심의 제곱근에 비례</Txt>
        <Txt x={360} y={158} size={13.5} weight={600}>- 천해파 :</Txt>
        <Txt x={430} y={158} size={13.5}>타원운동 수평왕복운동</Txt>
        <Txt x={616} y={158} size={13.5}>수심 (얕을수록 느려짐.</Txt>
        <Txt x={690} y={180} size={13.5} anchor="middle">파고는 높아짐)</Txt>
      </>
    ),
  },
  'ocean-03-refraction': {
    h: 160, label: '만과 곶에서의 해파 굴절',
    render: () => (
      <>
        <path d="M140 46 Q200 48 236 96 Q258 124 280 96 Q318 46 380 44" fill="none" stroke={INK} strokeWidth={1.6} />
        <Txt x={164} y={30} size={13.5} anchor="middle" weight={600}>만</Txt>
        <Txt x={164} y={64} size={12.5} anchor="middle" weight={600}>퇴적</Txt>
        <Txt x={164} y={80} size={11.5} anchor="middle">(모래사장)</Txt>
        <Txt x={258} y={100} size={13.5} anchor="middle" weight={600}>곶</Txt>
        <Txt x={258} y={140} size={12.5} anchor="middle" weight={600}>침식</Txt>
        <Txt x={258} y={156} size={11.5} anchor="middle">(절벽)</Txt>
        <Circled x={392} y={30} size={12}>땅</Circled>
        <Circled x={396} y={62} size={11}>바다</Circled>
        {[[180, 154, 222, 116], [214, 148, 238, 122], [302, 148, 276, 122], [350, 140, 300, 110]].map(([a, b, c, d], i) => <Curve key={i} x1={a} y1={b} cx={(a + c) / 2 + (i < 2 ? -6 : 6)} cy={(b + d) / 2} x2={c} y2={d} head={6} />)}
        <Txt x={440} y={88} size={13.5}>수심의 변화가 큼 → 해파 진행속도 차이가 큼</Txt>
        <Txt x={440} y={114} size={13.5}>해파는 곶으로</Txt>
        <Circled x={554} y={114} size={13.5}>굴절</Circled>
      </>
    ),
  },

  // ───────── 04. 해일 ─────────
  'ocean-04-surge': {
    h: 168, label: '04 해일 — 폭풍 해일과 지진 해일',
    render: () => (
      <>
        <H x={2} y={28}>04. 해일</H>
        <Txt x={112} y={28} size={14} weight={700}>- 폭풍해일</Txt>
        <g>
          <Circled x={136} y={66} size={12.5}>고기압</Circled>
          <Circled x={218} y={66} size={12.5}>저기압</Circled>
          <Txt x={246} y={66} size={12.5}>(태풍)</Txt>
          <Arw x1={132} y1={80} x2={132} y2={116} w={1.6} />
          <Arw x1={214} y1={80} x2={214} y2={94} w={1.4} head={6} />
          <path d="M110 112 Q132 122 160 112 Q206 90 250 106" fill="none" stroke={INK} strokeWidth={1.6} />
        </g>
        <Txt x={112} y={156} size={13.5}>해면기압 1hPa 낮아지면 해수면 1cm 높아짐</Txt>
        <g>
          <Txt x={482} y={30} size={14} weight={700}>- 지진해일 = 쓰나미</Txt>
          <line x1={494} x2={556} y1={36} y2={36} stroke={INK} strokeWidth={1.3} />
          <Txt x={500} y={62} size={13.5}>파장이 100~200km로 매우 길다</Txt>
          <Txt x={506} y={88} size={13.5}>(* 대양 평균 수심은 4km) ⇒</Txt>
          <Txt x={700} y={88} size={13.5} weight={700} u="wavy">천해파</Txt>
          <Txt x={490} y={120} size={13.5}>매우 빠르다 → 느려지면서</Txt>
          <Txt x={540} y={144} size={13.5}>파장 짧아지고 파고 ↑↑</Txt>
        </g>
      </>
    ),
  },

  // ───────── 05. 조석 ─────────
  'ocean-05-tide': {
    h: 176, label: '05 조석 — 만조·간조, 조류·조차, 사리와 조금',
    render: () => {
      const moons = [612, 646, 680, 712, 744]
      return (
        <>
          <H x={2} y={98}>05. 조석</H>
          <g>
            <Txt x={108} y={98} size={14}>= 주기적으로 해수면의 높이가</Txt>
            <Txt x={302} y={98} size={14} u="wavy">높아졌다</Txt>
            <Txt x={366} y={98} size={14} u="wavy">낮아지는</Txt>
            <Txt x={428} y={98} size={14}>현상</Txt>
            <Txt x={252} y={60} size={12}>하루中</Txt>
            <Circled x={318} y={60} size={12.5} ring={RED}>만조</Circled>
            <Circled x={378} y={60} size={12.5} ring={RED}>간조</Circled>
            <Curve x1={324} y1={42} cx={350} cy={28} x2={374} y2={42} head={5} />
            <Txt x={350} y={34} size={11}>썰물</Txt>
            <Circled x={326} y={128} size={12.5} ring={RED}>고조</Circled>
            <Circled x={390} y={128} size={12.5} ring={RED}>저조</Circled>
            <Curve x1={392} y1={146} cx={360} cy={156} x2={328} y2={146} head={5} />
            <Txt x={350} y={168} size={11}>밀물</Txt>
          </g>
          <rect x={466} y={70} width={126} height={30} fill="none" stroke={INK} strokeWidth={1.3} />
          <Circled x={496} y={91} size={12.5}>흐름</Circled>
          <Txt x={518} y={91} size={13.5} weight={700}>→ 조류</Txt>
          <rect x={466} y={110} width={126} height={30} fill="none" stroke={INK} strokeWidth={1.3} />
          <Circled x={502} y={131} size={12.5}>높이차</Circled>
          <Txt x={530} y={131} size={13.5} weight={700}>→ 조차</Txt>
          <Hot x={600} y={6} w={152} h={166} popup="tides" label="달의 위치와 사리·조금">
            <Txt x={678} y={22} size={13} anchor="middle" weight={700}>조금(소조)</Txt>
            <path d="M610 38 Q678 26 746 38" fill="none" stroke={INK} strokeWidth={1.3} />
            {['삭', '상현', '망', '하현', '삭'].map((t, i) => <Txt key={i} x={moons[i]} y={56} size={12} anchor="middle">{t}</Txt>)}
            <g stroke={INK} strokeWidth={1.2}>
              <circle cx={612} cy={74} r={6} fill="none" strokeDasharray="2 2" />
              <path d="M646 68 a6 6 0 0 1 0 12 z" fill={INK} /><circle cx={646} cy={74} r={6} fill="none" />
              <circle cx={680} cy={74} r={6} fill="none" />
              <path d="M712 68 a6 6 0 0 0 0 12 z" fill={INK} /><circle cx={712} cy={74} r={6} fill="none" />
              <circle cx={744} cy={74} r={6} fill="none" strokeDasharray="2 2" />
            </g>
            <path d="M610 90 Q678 122 746 90" fill="none" stroke={INK} strokeWidth={1.3} />
            <Arw x1={678} y1={106} x2={678} y2={128} w={1.3} head={6} />
            <Txt x={678} y={150} size={12.5} anchor="middle" weight={700}>사리(대조) → 조차 가장 클 때</Txt>
          </Hot>
        </>
      )
    },
  },
  'ocean-05-force': {
    h: 214, label: '기조력과 조석의 주기',
    render: () => (
      <>
        <L x={14} y={24}>[기조력]</L>
        <Txt x={90} y={24} size={14}>= 조석을 일으키는 힘</Txt>
        <Hot x={30} y={36} w={470} h={102} popup="tides" label="기조력과 해수면의 부풀어 오름">
          <Txt x={46} y={64} size={14} weight={600} u="line">'지구 원운동 원심력'</Txt>
          <Txt x={200} y={64} size={14}>+</Txt>
          <Txt x={216} y={64} size={14} weight={600} u="line">'달이 지구에 작용하는 인력'</Txt>
          <Txt x={402} y={64} size={14}>의 합력</Txt>
          <Txt x={60} y={94} size={13}>달에서 멀어지는 방향</Txt>
          <Txt x={258} y={94} size={13}>달을 향한 방향</Txt>
          <Txt x={190} y={126} size={13.5}>→ 달에서 가장 가까운 쪽 + 가장 먼 쪽 모두 가장 높아짐</Txt>
        </Hot>
        <Txt x={508} y={64} size={13} color={RED} weight={700}>* 태양은 멀어서 달 기조력의 1/2</Txt>
        <circle cx={640} cy={110} r={20} fill="none" stroke={INK} strokeWidth={1.4} />
        <Txt x={640} y={114} size={12} anchor="middle">지구</Txt>
        <Arw x1={618} y1={104} x2={586} y2={104} w={1.3} head={6} />
        <Txt x={588} y={128} size={11}>멀어</Txt>
        <Arw x1={662} y1={104} x2={694} y2={104} w={1.3} head={6} />
        <Txt x={672} y={128} size={11}>가까워</Txt>
        <Circled x={728} y={108} size={12}>달</Circled>
        {/* 조석의 주기 */}
        <circle cx={40} cy={176} r={9} fill="none" stroke={INK} strokeWidth={1.4} />
        <line x1={32} y1={186} x2={48} y2={166} stroke={INK} strokeWidth={1.4} />
        <Txt x={56} y={174} size={13.5}>적도가 기울어져 있어서</Txt>
        <Txt x={56} y={198} size={13.5} weight={600}>실제 조석은 매우 복잡!</Txt>
        <Curve x1={330} y1={160} cx={280} cy={154} x2={230} y2={176} />
        <g>
          <Txt x={340} y={164} size={13.5}>자전하니까 하루에 만조, 간조 나타남</Txt>
          <Txt x={562} y={180} size={10.5} color={RED} weight={700}>지구가 더 25분 자전해야</Txt>
          <Txt x={300} y={198} size={13.5}>그런데! 자전하는 동안 달도 공전(6.5°)해서 이동.</Txt>
          <Txt x={680} y={186} size={12.5}>⇒ 주기 =</Txt>
          <Txt x={680} y={204} size={12.5} weight={700}>12시간 25분</Txt>
        </g>
      </>
    ),
  },
}

export { BLUE }
