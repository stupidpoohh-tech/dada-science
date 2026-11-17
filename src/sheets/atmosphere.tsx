import type { ReactNode } from 'react'
import { Arw, Boxed, Circled, Curve, GRAY, Hot, INK, RED, Txt, Wave } from './primitives'

/**
 * Ⅲ. 강수 과정과 대기의 운동 — 원본 손글씨 노트(source/…_06.jpg, _07.jpg)의 배치를 행 단위로 재현
 * 각 행의 id는 필기·문제 연결 기준이므로 바꾸지 마세요.
 */
const H = ({ x, y, children, size = 21 }: { x: number; y: number; children: string; size?: number }) => <Txt x={x} y={y} size={size} weight={800}>{children}</Txt>
const L = ({ x, y, children }: { x: number; y: number; children: string }) => <Txt x={x} y={y} size={15} weight={800}>{children}</Txt>

function Umbrella({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={1.3} fill="none">
      <path d={`M${x - 11} ${y} Q${x} ${y - 14} ${x + 11} ${y} Q${x + 5} ${y - 3} ${x} ${y} Q${x - 5} ${y - 3} ${x - 11} ${y}`} />
      <path d={`M${x} ${y} v10 q0 3 -3 3`} />
    </g>
  )
}
function SmallCloud({ x, y, rain }: { x: number; y: number; rain?: boolean }) {
  return (
    <g stroke={INK} strokeWidth={1.2} fill="none">
      <path d={`M${x - 10} ${y} q-4 -8 4 -10 q2 -7 10 -4 q7 -3 9 4 q6 2 2 10 z`} />
      {rain && <path d={`M${x - 4} ${y + 4} l-1 4 M${x + 2} ${y + 4} l-1 4 M${x + 8} ${y + 4} l-1 4`} />}
    </g>
  )
}

export const ATMOSPHERE_ROWS: Record<string, { h: number; label: string; render: () => ReactNode }> = {
  // ───────── 01. 지구의 대기와 생명체 ─────────
  'atmosphere-01-composition': {
    h: 156, label: '01 지구의 대기와 생명체 — 대기 조성, 선택적 흡수, 온실 효과, 파장과 에너지',
    render: () => (
      <>
        <H x={2} y={40}>01. 지구의 대기와 생명체</H>
        <Curve x1={226} y1={16} cx={262} cy={4} x2={246} y2={34} head={6} />
        <Txt x={300} y={18} size={12}>(지표는 거의 다 흡수함!)</Txt>
        <Txt x={30} y={78} size={13.5}>① 질소 78%</Txt>
        <Txt x={30} y={102} size={13.5}>② 산소 21%</Txt>
        <Txt x={30} y={126} size={13.5}>③ 이산화탄소 0.04%</Txt>
        <Txt x={244} y={48} size={13.5}>* 선택적 흡수 : 특정 파장의 복사에너지만 흡수, 나머지 투과</Txt>
        <Txt x={262} y={74} size={13.5}>· 오존, 산소 : 태양복사E 中 자외선</Txt>
        <Circled x={212} y={100} size={12.5} color={RED}>온실효과</Circled>
        <Txt x={262} y={100} size={13.5} u="line" uColor={RED}>· 수증기, 이산화탄소</Txt>
        <Txt x={392} y={100} size={13.5}>: 적외선</Txt>
        <Txt x={448} y={100} size={12}>* 지구가 방출하는 E 대부분은 적외선!</Txt>
        <Txt x={196} y={126} size={12.5} color={RED}>⊕ 메테인,</Txt>
        <Txt x={206} y={146} size={12.5} color={RED}>산화이질소…</Txt>
        <Txt x={318} y={126} size={13.5}>* 가시광선 → 대기 거의 흡수X, 지표까지 도달</Txt>
        <Txt x={652} y={30} size={11} anchor="middle">(단파장)</Txt>
        <Txt x={730} y={30} size={11} anchor="middle">(장파장)</Txt>
        <Txt x={652} y={54} size={12} anchor="middle">자외선</Txt>
        <Txt x={692} y={54} size={12} anchor="middle">가시광선</Txt>
        <Txt x={734} y={54} size={12} anchor="middle">적외선</Txt>
        <Arw x1={634} y1={68} x2={750} y2={68} both w={1.3} head={6} />
        <Txt x={640} y={92} size={12.5}>파장↓</Txt>
        <Txt x={642} y={114} size={12.5}>E↑</Txt>
        <Txt x={716} y={92} size={12.5}>파장↑</Txt>
        <Txt x={722} y={114} size={12.5}>E↓</Txt>
      </>
    ),
  },
  'atmosphere-01-habitable': {
    h: 40, label: '생명 가능 지대',
    render: () => <><L x={14} y={26}>[생명가능지대]</L><Txt x={134} y={26} size={13.5}>: 별의 주위에서 물(액체)이 존재할 수 있는 거리의 범위</Txt></>,
  },

  // ───────── 02. 지구 열수지 ─────────
  'atmosphere-02-budget': {
    h: 116, label: '02 지구 열수지',
    render: () => (
      <>
        <H x={2} y={48}>02. 지구열수지</H>
        <Txt x={160} y={26} size={11.5}>(돈처럼 생각!)</Txt>
        <Txt x={160} y={48} size={13.5}>(수지타산!)</Txt>
        <Txt x={242} y={48} size={13.5}>: 지구가 태양으로부터</Txt>
        <Txt x={396} y={28} size={12}>⊕</Txt>
        <Txt x={384} y={48} size={13.5}>흡수하고</Txt>
        <Txt x={462} y={28} size={12}>⊖</Txt>
        <Txt x={450} y={48} size={13.5}>방출하는 에너지의 양</Txt>
        <Circled x={42} y={84} size={13}>빛</Circled>
        <Txt x={58} y={84} size={13.5}>→ 산란, 반사, 굴절,</Txt>
        <Boxed x={186} y={84} size={13.5}>흡수</Boxed>
        <Txt x={222} y={84} size={13.5}>…</Txt>
        <Txt x={150} y={108} size={13.5} weight={600}>온도로 올림!</Txt>
      </>
    ),
  },

  // ───────── 03. 대기안정도와 강수 ─────────
  'atmosphere-03-adiabatic': {
    h: 116, label: '03 대기안정도와 강수 — 단열 변화',
    render: () => (
      <>
        <H x={2} y={28}>03. 대기안정도와 강수</H>
        <L x={14} y={62}>[단열 변화]</L>
        <Txt x={104} y={62} size={13.5}>단열상태에서</Txt>
        <Circled x={204} y={62} size={13}>부피</Circled>
        <Txt x={222} y={62} size={13.5}>변화로</Txt>
        <Circled x={282} y={62} size={13}>온도</Circled>
        <Txt x={300} y={62} size={13.5}>가 변하는 현상</Txt>
        <Txt x={170} y={88} size={13}>온도가 변하는 정도</Txt>
        <Txt x={150} y={110} size={13}>→ 수증기의 포화 여부에 따라</Txt>
        <Txt x={322} y={98} size={20} color={GRAY}>{'}'}</Txt>
        <Arw x1={340} y1={84} x2={340} y2={110} w={1.2} head={5} />
        <Txt x={410} y={62} size={13} weight={700} u="line" uColor={RED}>- 단열팽창</Txt>
        <Txt x={478} y={62} size={12}>: 공기상승 → 팽창 → 내부E 감소 → 기온 낮아짐 (스프레이)</Txt>
        <Txt x={410} y={88} size={13} weight={700} u="line" uColor={RED}>- 단열압축</Txt>
        <Txt x={478} y={88} size={12}>: 공기하강 → 압축 → 내부E 증가 → 기온 높아짐 (자동차 엔진)</Txt>
      </>
    ),
  },
  'atmosphere-03-lapse': {
    h: 196, label: '단열 감률: 건조·습윤 단열 감률, 이슬점 감률, 이슬점',
    render: () => (
      <>
        <L x={14} y={24}>[단열 감률]</L>
        <Hot x={110} y={6} w={642} h={130} popup="adiabatic" label="단열 변화와 상승 응결 고도·푄 현상">
          <Txt x={116} y={24} size={13}>(불포화상태)</Txt>
          <Txt x={202} y={24} size={13.5} weight={700} u="line" uColor={RED}>- 건조단열감률</Txt>
          <Txt x={300} y={24} size={13.5}>: 1km 상승할때 기온 10℃ 낮아짐</Txt>
          <Txt x={120} y={50} size={13}>(포화상태)</Txt>
          <Txt x={202} y={50} size={13.5} weight={700} u="line" uColor={RED}>- 습윤단열감률</Txt>
          <Txt x={300} y={50} size={13.5}>: 〃</Txt>
          <Txt x={350} y={50} size={13}>5℃ 낮아짐 (수증기가 응결하면서 응결열이 방출되어 기온 덜 내려감)</Txt>
          <Txt x={520} y={72} size={12}>* 수증기 → 물 (응결)</Txt>
          <Txt x={520} y={92} size={12}>* 손난로 액체 → 고체 따뜻!</Txt>
          {/* 이슬점 감률: 불포화 2℃/km, 포화 5℃/km(포화 상태에서는 기온 = 이슬점) */}
          <Txt x={116} y={110} size={13.5} weight={700} u="line" uColor={RED}>* 이슬점 감률</Txt>
          <Txt x={212} y={110} size={13}>(불포화상태) : 1km 상승할때 이슬점 2℃ 낮아짐 (수증기압이 낮아지기 때문)</Txt>
          <Txt x={212} y={130} size={13}>(포화상태) : 〃 이슬점 5℃ 낮아짐 (기온 = 이슬점 → 습윤단열감률과 같음)</Txt>
        </Hot>
        <Txt x={104} y={148} size={12.5}>상대습도가 100%에 도달해 수증기가 응결하기 시작할때의</Txt>
        <Circled x={438} y={148} size={12.5}>기온</Circled>
        <Txt x={462} y={148} size={11}>(수증기가 많은 욕실에서는 조금만 차가워져도 물방울 맺힘)</Txt>
        <Txt x={120} y={172} size={11.5}>(공기가 담긴 상자를 차갑게 만들다보면 수증기가 물방울로 변하기 시작, 그때의 온도)</Txt>
        <Curve x1={58} y1={196} cx={36} cy={90} x2={112} y2={46} head={6} />
      </>
    ),
  },
  'atmosphere-03-lcl': {
    h: 164, label: '이슬점과 상승 응결 고도, 푄 현상',
    render: () => (
      <>
        <line x1={58} y1={0} x2={58} y2={8} stroke={INK} strokeWidth={1.4} />
        <Txt x={30} y={26} size={14} weight={600}>기온 = 이슬점</Txt>
        <SmallCloud x={44} y={58} />
        <Txt x={42} y={54} size={10}>구름</Txt>
        <Txt x={72} y={58} size={13.5}>이 생성되기 시작하는 높이 =</Txt>
        <Boxed x={272} y={58} size={14.5}>상승 응결고도</Boxed>
        <g>
          <path d="M490 140 Q540 132 556 92 Q566 66 580 66 Q594 66 604 96 Q616 132 650 140" fill="none" stroke={INK} strokeWidth={1.5} />
          <Txt x={576} y={118} size={12.5} anchor="middle">산</Txt>
          <Arw x1={438} y1={134} x2={462} y2={122} w={1.3} head={5} />
          <Arw x1={474} y1={112} x2={498} y2={100} w={1.3} head={5} />
          <SmallCloud x={516} y={58} />
          <Txt x={510} y={54} size={9.5}>구름</Txt>
          <SmallCloud x={566} y={40} rain />
          <Txt x={562} y={36} size={9.5}>비</Txt>
          <Arw x1={618} y1={64} x2={630} y2={76} w={1.3} head={5} />
          <Arw x1={644} y1={120} x2={656} y2={134} w={1.3} head={5} />
          <Boxed x={668} y={56} size={13.5}>푄 현상</Boxed>
          <Txt x={668} y={140} size={13}>고온건조한 공기</Txt>
          <Txt x={680} y={158} size={13}>'높새바람'</Txt>
        </g>
      </>
    ),
  },
  'atmosphere-03-stability': {
    h: 176, label: '대기 안정도',
    render: () => (
      <>
        <Txt x={190} y={20} size={13}>역전층 → 매우 안정 (높이↑ → 기온↑)</Txt>
        <L x={14} y={46}>[대기안정도]</L>
        <Txt x={112} y={46} size={13.5}>: 공기 덩어리가 원래 높이로 되돌아가려고 하는 정도</Txt>
        <Txt x={160} y={78} size={13.5}>→ 절대안정</Txt>
        <Txt x={232} y={78} size={13}>층운형</Txt>
        <Wave x={276} y={74} w={30} a={2} l={8} />
        <Txt x={230} y={104} size={13}>··· 조건부 불안정</Txt>
        <Txt x={344} y={108} size={22} color={GRAY}>[</Txt>
        <Txt x={354} y={94} size={12.5}>(불포화) 안정</Txt>
        <Txt x={354} y={116} size={12.5}>(포화) 불안정</Txt>
        <Txt x={160} y={130} size={13.5}>→ 절대불안정</Txt>
        <Txt x={244} y={130} size={13}>적운형</Txt>
        <SmallCloud x={300} y={130} rain />
        <Txt x={248} y={152} size={13}>소나기</Txt>
        <Hot x={526} y={4} w={226} h={170} popup="stability" label="대기 안정도">
          <Txt x={540} y={26} size={12.5}>높이</Txt>
          <Arw x1={580} y1={160} x2={580} y2={26} w={1.4} head={6} />
          <Arw x1={580} y1={160} x2={742} y2={160} w={1.4} head={6} />
          <Txt x={704} y={174} size={12}>온도</Txt>
          <Txt x={640} y={20} size={11.5} weight={600}>습윤단열선</Txt>
          <Txt x={604} y={40} size={11.5} color={RED} weight={700}>건조단열선</Txt>
          <line x1={612} y1={48} x2={700} y2={158} stroke={RED} strokeWidth={1.8} />
          <line x1={672} y1={28} x2={700} y2={158} stroke={INK} strokeWidth={1.5} />
          <Txt x={596} y={124} size={12.5} weight={600}>불안</Txt>
          <Txt x={656} y={74} size={12.5} weight={600}>조건</Txt>
          <Txt x={706} y={74} size={12.5} weight={600}>안정</Txt>
        </Hot>
      </>
    ),
  },
  'atmosphere-03-precip': {
    h: 140, label: '강수: 빙정설과 병합설',
    render: () => (
      <>
        <L x={14} y={30}>[강수]</L>
        <Txt x={66} y={30} size={14}>= 눈, 비</Txt>
        <Umbrella x={130} y={24} />
        <circle cx={70} cy={100} r={28} fill="none" stroke={INK} strokeWidth={1.4} />
        <path d="M58 92 q3 -3 6 0 M76 92 q3 -3 6 0 M60 104 q10 8 20 0" fill="none" stroke={INK} strokeWidth={1.2} />
        <Txt x={70} y={122} size={10} anchor="middle">지구</Txt>
        <Arw x1={98} y1={86} x2={150} y2={66} w={1.3} head={6} />
        <Arw x1={98} y1={110} x2={150} y2={122} w={1.3} head={6} />
        <Txt x={460} y={16} size={11.5}>포화수증기압이 더 높다 (쉽게 수증기로 변한다는 뜻!)</Txt>
        <Txt x={460} y={34} size={11.5}>↗ 0℃ 아래에서도 얼지않고 물방울로 존재.</Txt>
        <Txt x={156} y={66} size={13.5}>고위도</Txt>
        <Boxed x={202} y={66} size={13.5}>빙정설</Boxed>
        <Txt x={254} y={66} size={13}>영하의 구름 : 빙정(얼음) +</Txt>
        <Txt x={394} y={66} size={13} u="wavy">과냉각물방울</Txt>
        <Txt x={450} y={88} size={12.5}>⇒ 물방울 증발 → 수증기 → 빙정 성장 ⇒ 눈, 비</Txt>
        <Txt x={520} y={108} size={11}>* 포화수증기압: 물방울 &gt; 얼음 (같은 온도)</Txt>
        <Txt x={156} y={126} size={13.5}>저위도</Txt>
        <Boxed x={202} y={126} size={13.5}>병합설</Boxed>
        <Txt x={254} y={126} size={13}>구름 0℃ 이상 → 물방울 충돌, 병합 ⇒ 비</Txt>
      </>
    ),
  },

  // ───────── 04. 기압의 연직 분포와 대기를 움직이는 힘 ─────────
  'atmosphere-04-forces': {
    h: 210, label: '04 기압의 연직 분포와 대기를 움직이는 힘',
    render: () => (
      <>
        <H x={2} y={34} size={19}>04. 기압의 연직 분포와 대기를 움직이는 힘</H>
        <Txt x={540} y={18} size={11}>* 1hPa = 1m² 면적에 100N 힘이 작용</Txt>
        <Txt x={520} y={38} size={11}>* 1기압 = 1013hPa = 표준기압 (해수면에서의 기압)</Txt>
        <Txt x={30} y={68} size={13.5}>- 기압경도력 : 대기 중 기압 차가 생기면 발생하는 힘</Txt>
        <Txt x={30} y={94} size={13.5}>- 연직 기압경도력 : 높이에 따른 기압 차 때문에 생기는 연직(수직) 방향의 기압경도력</Txt>
        <Txt x={30} y={120} size={13.5}>- 정역학 평형 :</Txt>
        <Txt x={128} y={120} size={13.5} u="line">연직 기압경도력</Txt>
        <Txt x={236} y={120} size={13.5}>과</Txt>
        <Txt x={254} y={120} size={13.5} u="line">중력</Txt>
        <Txt x={286} y={120} size={13.5}>이 힘의 평형을 이루고 있는 상태</Txt>
        <Txt x={240} y={106} size={11}>=</Txt>
        <Txt x={30} y={146} size={13.5}>- 전향력 : 지구 자전 때문에 발생하는 가상의 힘</Txt>
        <Circled x={340} y={146} size={12}>북</Circled>
        <Txt x={356} y={146} size={13.5}>물체운동방향의 오른쪽 직각 방향에 작용</Txt>
        <Curve x1={600} y1={140} cx={606} cy={128} x2={620} y2={128} head={5} />
        <Txt x={624} y={132} size={12} weight={600}>오른쪽!</Txt>
        <Txt x={30} y={172} size={13.5}>- 구심력 : 물체가 원운동을 하도록 방향을 바꾸는</Txt>
        <Circled x={340} y={172} size={13}>역할</Circled>
        <Txt x={358} y={172} size={13.5}>을 하는 힘,</Txt>
        <Txt x={434} y={172} size={13.5} u="line">원의 중심 방향으로 작용</Txt>
        <Txt x={30} y={198} size={13.5}>- 마찰력 : 두 물체가 맞닿은 채 움직일 때 운동방향과 반대방향으로 작용하는 힘</Txt>
      </>
    ),
  },

  // ───────── 05. 여러가지 바람 ─────────
  'atmosphere-05-upper': {
    h: 344, label: '05 여러가지 바람 — 상층: 지균풍과 경도풍',
    render: () => (
      <>
        <H x={2} y={26} size={19}>05. 여러가지 바람</H>
        <L x={14} y={60}>[상층]</L>
        <Txt x={6} y={80} size={11}>(1km 이상 높이)</Txt>
        <Txt x={64} y={60} size={13}>- 지균풍 :</Txt>
        <Txt x={128} y={60} size={13} u="wavy">등압선이</Txt>
        <Boxed x={186} y={60} size={13}>직선</Boxed>
        <Txt x={222} y={60} size={13} u="wavy">일 때</Txt>
        <Txt x={128} y={80} size={13}>등압선과 나란히 부는 바람</Txt>
        <Hot x={30} y={84} w={300} h={124} popup="geo-wind" label="지균풍의 형성">
          <Txt x={44} y={110} size={12.5} weight={600}>저</Txt>
          <line x1={60} y1={106} x2={250} y2={106} stroke={INK} strokeWidth={1.3} />
          <Txt x={258} y={110} size={12}>등압선</Txt>
          <Txt x={84} y={124} size={11.5}>기압경도력</Txt>
          <line x1={60} y1={130} x2={250} y2={130} stroke={INK} strokeWidth={1.3} />
          <Txt x={44} y={162} size={12.5} weight={600}>고</Txt>
          <line x1={60} y1={158} x2={250} y2={158} stroke={INK} strokeWidth={1.3} />
          <Arw x1={110} y1={156} x2={110} y2={134} w={1.5} head={6} />
          <Arw x1={110} y1={158} x2={172} y2={158} color={RED} w={2} />
          <Txt x={178} y={154} size={12.5} color={RED} weight={700}>바람이동방향</Txt>
          <Arw x1={110} y1={160} x2={110} y2={186} w={1.5} head={6} />
          <Txt x={70} y={202} size={12}>전향력 (운동방향의 오른쪽직각 방향)</Txt>
        </Hot>
        <Txt x={120} y={232} size={13}>① 기압경도력 생김</Txt>
        <Txt x={120} y={254} size={13}>② 공기 움직이면 전향력 생김</Txt>
        <Txt x={120} y={276} size={13}>③ 점점 휘어짐 ↘</Txt>
        <Txt x={120} y={298} size={13}>④ 기압경도력 = 전향력 평형 이룰 때까지</Txt>
        <Txt x={140} y={322} size={13}>→ 힘(합력) = 0 ⇒</Txt>
        <Txt x={256} y={322} size={13} color={RED}>→</Txt>
        <Txt x={274} y={322} size={13}>으로 계속 움직임</Txt>
        {/* 경도풍 */}
        <Txt x={392} y={60} size={13}>- 경도풍 :</Txt>
        <Txt x={456} y={60} size={13} u="wavy">등압선이</Txt>
        <Boxed x={514} y={60} size={13}>원형·곡선</Boxed>
        <Txt x={574} y={60} size={13} u="wavy">일 때</Txt>
        <Txt x={456} y={80} size={13}>등압선과 나란하게 원형으로 부는 바람</Txt>
        <Hot x={376} y={86} w={210} h={258} popup="gradient-wind" label="저기압과 고기압의 경도풍" marker={[384, 96]}>
          <Txt x={396} y={112} size={12.5} weight={600}>〈저기압〉</Txt>
          <circle cx={470} cy={150} r={22} fill="none" stroke={INK} strokeDasharray="3 3" />
          <circle cx={470} cy={150} r={44} fill="none" stroke={INK} strokeDasharray="3 3" />
          <Circled x={470} y={155} size={12}>저</Circled>
          <Arw x1={514} y1={150} x2={486} y2={150} w={1.4} head={6} />
          <Txt x={500} y={176} size={10.5} anchor="middle">기압경도력</Txt>
          <Arw x1={514} y1={150} x2={560} y2={150} w={1.4} head={6} />
          <Txt x={540} y={142} size={10.5}>전향력</Txt>
          <Arw x1={514} y1={150} x2={514} y2={118} color={RED} w={1.8} head={6} />
          <Curve x1={514} y1={116} cx={514} cy={96} x2={500} y2={92} color={RED} head={5} />
          <Txt x={524} y={108} size={11} color={RED} weight={700}>진행방향이 변화</Txt>
          <Boxed x={482} y={204} size={12} color={RED}>시계반대방향</Boxed>
          <Txt x={384} y={234} size={12.5} weight={600}>〈고기압〉</Txt>
          <circle cx={470} cy={280} r={22} fill="none" stroke={INK} strokeDasharray="3 3" />
          <circle cx={470} cy={280} r={44} fill="none" stroke={INK} strokeDasharray="3 3" />
          <Circled x={470} y={285} size={12}>고</Circled>
          <Arw x1={514} y1={280} x2={486} y2={280} w={1.4} head={6} />
          <Txt x={500} y={306} size={10.5} anchor="middle">전향력</Txt>
          <Arw x1={514} y1={280} x2={560} y2={280} w={1.4} head={6} />
          <Txt x={532} y={272} size={10.5}>기압경도력</Txt>
          <Arw x1={514} y1={280} x2={514} y2={312} color={RED} w={1.8} head={6} />
          <Boxed x={540} y={334} size={12} color={RED}>시계방향</Boxed>
        </Hot>
        <Txt x={596} y={128} size={12.5}>· 기압경도력 &gt; 전향력</Txt>
        <Txt x={590} y={152} size={12}>· (기압경도력 − 전향력) = 구심력</Txt>
        <Txt x={590} y={176} size={12}>→ 전향력 = 기압경도력 − 구심력</Txt>
        <Txt x={596} y={252} size={12.5}>· 전향력 &gt; 기압경도력</Txt>
        <Txt x={590} y={276} size={12}>· (전향력 − 기압경도력) = 구심력</Txt>
        <Txt x={590} y={300} size={12}>→ 전향력 = 구심력 + 기압경도력</Txt>
        <Circled x={662} y={326} size={12}>고</Circled>
        <Txt x={676} y={326} size={12.5} weight={600}>⇒ 빠름!</Txt>
      </>
    ),
  },
  'atmosphere-05-surface': {
    h: 104, label: '지상풍과 경각, 일기도',
    render: () => (
      <>
        <L x={14} y={24}>[지상]</L>
        <Txt x={8} y={44} size={11}>마찰력有</Txt>
        <g>
          <Txt x={90} y={24} size={13.5}>- 지상풍 ← 기압경도력, 전향력,</Txt>
          <Txt x={288} y={24} size={13.5} u="wavy">마찰력</Txt>
          <Txt x={404} y={24} size={13}>*</Txt>
          <Boxed x={418} y={24} size={13}>경각</Boxed>
          <Txt x={454} y={24} size={12.5}>: 지상풍이 등압선과 이루는 각 (마찰력 클수록 경각도↑)</Txt>
        </g>
        <L x={14} y={70}>[일기도]</L>
        <Txt x={90} y={70} size={13}>- 지상일기도: 등압선 (해면기압이 같은 점 연결)</Txt>
        <Txt x={90} y={94} size={13}>- 상층 등압면일기도: 등고선 (같은 기압면의 높이 연결) 고도 높으면</Txt>
        <Circled x={522} y={94} size={12}>고</Circled>
        <Txt x={536} y={94} size={13}>기압. 고도</Txt>
        <Circled x={614} y={94} size={12}>저</Circled>
        <Txt x={628} y={94} size={13}>→</Txt>
        <Circled x={656} y={94} size={12}>저</Circled>
        <Txt x={670} y={94} size={13}>기압.</Txt>
      </>
    ),
  },

  // ───────── 06. 편서풍 파동 ─────────
  'atmosphere-06-def': {
    h: 124, label: '06 편서풍 파동, 편서풍과 제트류',
    render: () => (
      <>
        <Txt x={250} y={20} size={12}>위도↑ 올라갈수록 급격히 기압↓</Txt>
        <Arw x1={488} y1={18} x2={440} y2={18} color={RED} w={1.8} />
        <Txt x={448} y={8} size={11.5} color={RED} weight={700}>기압경도력</Txt>
        <Txt x={232} y={44} size={13} color={RED} weight={700}>* 중위도 상층(일반적): 고위도 쪽 기압↓</Txt>
        <Txt x={516} y={44} size={14}>⇒</Txt>
        <Circled x={562} y={44} size={13}>편서풍</Circled>
        <Txt x={594} y={44} size={12}>서쪽에서 불어오는 바람~</Txt>
        <H x={2} y={76} size={19}>06. 편서풍 파동</H>
        <Txt x={146} y={76} size={12.5}>: 중위도 상공에서 발생하는 행성파 (고위도와 저위도의 기온차 & 전향력 때문)</Txt>
        <Txt x={20} y={102} size={12.5}>(= 행성파 : 회전하는 행성의 대기에 형성되는 거대한 파동)</Txt>
        <Txt x={520} y={100} size={11}>* 제트류 : 편서풍에서 속도가 가장 빠른 영역</Txt>
        <Txt x={500} y={118} size={10.5}>– 한대전선·아열대 제트류: 풍속은 조건에 따라 다름</Txt>
      </>
    ),
  },
  'atmosphere-06-circulation': {
    h: 156, label: '대기 대순환: 태양 상수, 3세포 순환 모델',
    render: () => (
      <>
        <L x={14} y={24}>[대기대순환]</L>
        {[44, 62, 80, 98, 116].map((y) => <Arw key={y} x1={70} y1={y} x2={142} y2={y} color={RED} w={1.2} head={5} />)}
        <circle cx={182} cy={80} r={40} fill="none" stroke={INK} strokeWidth={1.4} />
        <Txt x={186} y={36} size={11} color={RED}>Cold</Txt>
        <Arw x1={182} y1={74} x2={182} y2={50} w={1.2} head={5} />
        <Txt x={170} y={92} size={12} color={RED} weight={700}>Hot</Txt>
        <Txt x={14} y={66} size={13} color={RED} weight={700}>태양상수</Txt>
        <Txt x={14} y={90} size={12} color={RED} weight={700}>≈1367W/m²</Txt>
        <Txt x={30} y={132} size={12}>↳ 지구가 받는 평균 태양복사에너지</Txt>
        <Txt x={60} y={150} size={12}>= 태양상수 × 1/4</Txt>
        <Curve x1={236} y1={72} cx={250} cy={52} x2={238} y2={44} head={5} />
        <Curve x1={240} y1={52} cx={228} cy={70} x2={240} y2={84} head={5} />
        <Txt x={256} y={70} size={13}>: 단일세포순환</Txt>
        <path d="M296 58 l18 16 M314 58 l-18 16" stroke={RED} strokeWidth={1.4} />
        <Txt x={360} y={70} size={13} color={RED} weight={700}>지구자전 ⇒</Txt>
        <Txt x={364} y={90} size={13} color={RED} weight={700}>때문에</Txt>
        <Txt x={446} y={70} size={13.5} weight={700}>3세포순환모델!</Txt>
        <circle cx={620} cy={80} r={38} fill="none" stroke={INK} strokeWidth={1.4} />
        {[[90, 42], [60, 58], [30, 78], [0, 96]].map(([lat, y]) => (
          <g key={lat}>
            <Txt x={602} y={y} size={10} anchor="end">{String(lat)}</Txt>
            {lat > 0 && lat < 90 && <line x1={606} x2={680} y1={y - 3} y2={y - 3} stroke={GRAY} strokeDasharray="2 2" />}
          </g>
        ))}
        <Txt x={676} y={40} size={11.5}>극순환</Txt>
        <Txt x={684} y={66} size={11.5}>페렐순환</Txt>
        <Txt x={684} y={88} size={11.5}>해들리순환</Txt>
      </>
    ),
  },
  'atmosphere-06-wave': {
    h: 190, label: '편서풍 파동과 지상의 고기압·저기압',
    render: () => (
      <>
        <Txt x={292} y={16} size={11.5}>고기압성 경도풍</Txt>
        <Boxed x={300} y={40} size={13}>기압 마루</Boxed>
        <Txt x={378} y={40} size={12}>빠름</Txt>
        <Txt x={210} y={78} size={12.5}>〈상층〉</Txt>
        <path d="M262 84 Q300 40 340 70 Q380 104 410 96 Q440 88 470 70 L540 70" fill="none" stroke={INK} strokeWidth={1.6} />
        <Arw x1={530} y1={70} x2={560} y2={70} w={1.6} />
        <Txt x={300} y={86} size={12}>수렴</Txt>
        <Txt x={392} y={78} size={12}>느림</Txt>
        <Boxed x={392} y={120} size={13}>기압골</Boxed>
        <Txt x={452} y={96} size={12}>발산</Txt>
        <Txt x={482} y={60} size={12}>빠름</Txt>
        <Txt x={566} y={74} size={12.5}>편서풍</Txt>
        <Txt x={618} y={74} size={12.5} color={RED} weight={700}>⇒ 이동</Txt>
        <Txt x={296} y={134} size={12}>하강</Txt>
        <Arw x1={330} y1={104} x2={330} y2={150} w={1.8} />
        <Txt x={350} y={142} size={11}>저기압성 경도풍</Txt>
        <Arw x1={454} y1={152} x2={454} y2={106} color={RED} w={2} />
        <Txt x={464} y={134} size={12}>상승</Txt>
        <Txt x={226} y={176} size={12.5}>〈지상〉</Txt>
        <Circled x={330} y={170} size={12}>고</Circled>
        <Curve x1={314} y1={160} cx={318} cy={150} x2={328} y2={152} head={5} />
        <Txt x={346} y={184} size={11.5}>〈시계〉</Txt>
        <Circled x={454} y={170} size={12}>저</Circled>
        <Curve x1={470} y1={160} cx={466} cy={150} x2={456} y2={152} head={5} />
        <Txt x={472} y={184} size={11.5}>〈시계반대〉</Txt>
        <Txt x={560} y={178} size={12.5} color={RED} weight={700}>⇒ 이동</Txt>
      </>
    ),
  },
}
