import type { AnswerKey, BankQuestion } from './types'

/**
 * Ⅲ. 강수 과정과 대기의 운동 — 교과서 문제
 * 교과서의 번호·순서·보기를 그대로 옮겼습니다. 그림은 교과서 사진에서 잘라 public/textbook/atmosphere/에 두었습니다.
 */
type Q = Omit<BankQuestion, 'id' | 'unitId' | 'set' | 'number' | 'points' | 'difficulty'> & { difficulty?: BankQuestion['difficulty'] }

const S1 = '1단계 개념 이해'
const S2 = '2단계 개념 통합'
const S3 = '대단원 마무리 — 핵심 정리'
const S4 = '대단원 마무리 — 개념 적용하기'
const S5 = '대단원 마무리 — 과학 역량 키우기'
const OX_STEM = '다음 설명이 옳으면 O, 옳지 않으면 X를 고르시오.\n'
const IMG = (n: string) => `textbook/atmosphere/${n}.png`
const PICK = '이에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?'
const G1 = ['ㄱ', 'ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ']
const G2 = ['ㄱ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ']
/** 보기 번호가 없는 '골라 보자' 문항 */
const ALL7 = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ']

const LIST: Q[] = [
  // ───────── 1단계 개념 이해 ─────────
  { code: 'TB01', no: '1', section: S1, topic: 'radiation', type: 'short_answer', format: 'text', question: '다음 용어에 대해 아는 대로 설명해 보시오. (옆 친구에게 설명하고 서로 잘 알고 있는지 의견을 나누어 보자.)\n· 선택적 흡수체  · 지구 복사 에너지  · 절대 불안정  · 기압 경도력  · 지균풍  · 행성파', images: [IMG('tb01')], conceptIds: ['atm.absorption', 'atm.stability', 'atm.forces', 'atm.geo-wind', 'atm.westerly'] },
  { code: 'TB02a', no: '2-(1)', section: S1, topic: 'radiation', type: 'ox', question: OX_STEM + '(1) 오존은 수증기보다 흡수하는 복사의 파장이 짧다.', conceptIds: ['atm.absorption'] },
  { code: 'TB02b', no: '2-(2)', section: S1, topic: 'radiation', type: 'ox', question: '(2) 지표에서의 에너지 방출 요인 중 지표면 복사의 비중이 가장 크다.', conceptIds: ['atm.budget'] },
  { code: 'TB02c', no: '2-(3)', section: S1, topic: 'adiabatic', type: 'ox', question: '(3) 상승하는 공기 덩어리는 주위 기압이 낮아지며 부피가 팽창하므로 이슬점이 낮아진다.', conceptIds: ['atm.lcl'] },
  { code: 'TB02d', no: '2-(4)', section: S1, topic: 'precip', type: 'ox', question: '(4) 같은 온도에서 과냉각 물방울보다 빙정의 포화 수증기압이 더 높다.', conceptIds: ['atm.precip'] },
  { code: 'TB02e', no: '2-(5)', section: S1, topic: 'forces', type: 'ox', question: '(5) 기압 경도력이 같을 때 지균풍의 풍속은 위도가 낮을수록 빠르다.', conceptIds: ['atm.geo-wind'] },
  { code: 'TB02f', no: '2-(6)', section: S1, topic: 'winds', type: 'ox', question: '(6) 편서풍 파동의 기압 마루 부근에는 고기압성 경도풍이, 기압골 부근에는 저기압성 경도풍이 분다.', conceptIds: ['atm.westerly', 'atm.gradient-wind'] },
  { code: 'TB03a', no: '3-(1)', section: S1, topic: 'radiation', type: 'short_answer', format: 'text', question: '다음 물음에 답하시오.\n(1) 태양 복사 에너지가 지구 대기에 입사하면서 일어나는 여러 가지 물리 과정을 쓰시오.', conceptIds: ['atm.budget'] },
  { code: 'TB03b', no: '3-(2)', section: S1, topic: 'adiabatic', type: 'short_answer', format: 'text', question: '(2) 공기 덩어리가 상승하여 단열 팽창이 일어날 때 기온이 낮아지는 까닭을 쓰시오.', conceptIds: ['atm.adiabatic'] },
  { code: 'TB03c', no: '3-(3)', section: S1, topic: 'forces', type: 'short_answer', format: 'text', question: '(3) 상층에서 등압선이 나란할 때 부는 바람에 작용하는 힘의 평형 관계를 쓰시오.', conceptIds: ['atm.geo-wind'] },
  { code: 'TB03d', no: '3-(4)', section: S1, topic: 'winds', type: 'short_answer', format: 'text', question: '(4) 편서풍 파동에서 기압골의 동쪽과 서쪽의 지상에서 발달하는 기압을 각각 쓰시오.', conceptIds: ['atm.westerly'] },
  { code: 'TB04', no: '4', section: S1, topic: 'radiation', type: 'multiple_choice', question: `그림은 파장에 따라 지표면에 도달하는 태양 복사 에너지의 상대 세기를 나타낸 것이다. 이때, A와 B는 지구 대기에 흡수된 영역을 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tb04') }, statements: ['지표면에 도달하는 태양 복사 에너지의 상대 세기는 가시광선이 자외선보다 세다.', 'A 영역은 주로 수증기에 흡수된다.', '대기 중의 온실 기체 농도가 증가할수록 B 영역이 늘어날 것이다.'], options: G1, conceptIds: ['atm.absorption'] },
  { code: 'TB05', no: '5', section: S1, topic: 'radiation', type: 'multiple_choice', question: `그림 (가)와 (나)는 대기의 유무에 따른 복사 평형 상태에서의 지구 열수지를 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tb05') }, statements: ['지표면의 평균 온도는 (가)가 (나)보다 높다.', '(나)에서 지구의 반사율은 30%이다.', 'A는 129이다.'], options: G1, conceptIds: ['atm.budget'] },

  // ───────── 2단계 개념 통합 ─────────
  { code: 'TB06', no: '6', section: S2, topic: 'adiabatic', type: 'multiple_choice', question: `그림은 지표에서 가열되어 기온 30 ℃, 이슬점 14 ℃인 공기 덩어리와 높이에 따른 기온 분포를 나타낸 것이다.\n${PICK} (단, 건조 단열 감률은 10 ℃/km, 습윤 단열 감률은 5 ℃/km, 이슬점 감률은 2 ℃/km이다.)`, diagram: { img: IMG('tb06') }, statements: ['1 km~2 km 구간의 기온 감률은 가열된 공기 덩어리가 상승할 때 단열 감률보다 크다.', '3 km~4 km 구간은 절대 안정한 상태이다.', '가열된 공기 덩어리의 최대 상승 높이는 약 3 km이다.'], options: ['ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['atm.stability', 'atm.lcl'] },
  { code: 'TB07', no: '7', section: S2, topic: 'forces', type: 'multiple_choice', question: `그림은 지표면 부근에서 등압면의 연직 분포와 정역학 평형을 이루고 있는 P 점에 작용하는 힘 A~D의 크기와 방향을 화살표로 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tb07') }, statements: ['A와 D의 크기는 같다.', 'P 점에서 바람을 일으키는 힘은 B이다.', '지표면 부근의 공기는 C 방향으로 움직이기 시작한다.'], options: ['ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['atm.forces'] },
  { code: 'TB08', no: '8', section: S2, topic: 'winds', type: 'multiple_choice', question: `그림은 어느 지역의 상층과 지표면의 A와 B에서 불고 있는 지균풍과 지상풍을 나타낸 것이다.\n${PICK} (단, A와 B에 작용하는 기압 경도력과 등압선 사이의 거리는 같다.)`, diagram: { img: IMG('tb08') }, statements: ['이 지역은 북반구이다.', '|ΔP| < |ΔP′|이다.', '풍속은 B보다 A에서 더 강하다.'], options: G1, conceptIds: ['atm.geo-wind', 'atm.surface-wind'] },
  { code: 'TB09', no: '9', section: S2, topic: 'winds', type: 'multiple_choice', question: `그림은 북반구 어느 지역에서 등압면의 등고선 일부를 나타낸 것이다.\n${PICK} (단, 등고선의 간격은 일정하다.)`, diagram: { img: IMG('tb09') }, statements: ['A에서는 공기가 수렴한다.', '등고선의 고도는 h₁ > h₂이다.', 'B의 지상에서는 고기압이 형성된다.'], options: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ'], conceptIds: ['atm.westerly'] },
  { code: 'TB10', no: '10', section: S2, topic: 'radiation', type: 'multiple_choice', question: `그림 (가)는 높이 70 km에서의 태양 복사 에너지와 지구 복사 에너지 중 하나의 파장에 따른 상대 세기를 나타낸 것이고, (나)는 지구에 입사하는 태양 복사 에너지의 양을 100이라고 할 때, 복사 평형 상태에서의 지구 열수지를 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tb10') }, statements: ['(가)는 (나)에서 A를 나타낸 것이다.', '대기 중 온실 기체의 농도가 증가하면 B도 증가할 것이다.', 'A는 23, B는 104, C는 116이다.'], options: G2, conceptIds: ['atm.budget', 'atm.absorption'] },
  { code: 'TB11', no: '11', section: S2, topic: 'winds', type: 'multiple_choice', question: `그림 (가)와 (나)는 각각 같은 시각 우리나라 주변의 지상 일기도와 500 hPa의 일기도를 나타낸 것이다.\n${PICK} (단, A와 B는 지상에, C와 D는 등압면에 위치한 지점이다.)`, diagram: { img: IMG('tb11') }, statements: ['A에서는 고기압이, B에서는 저기압이 나타난다.', 'C에서 기압 경도력은 고위도 방향으로 작용한다.', 'D에서는 공기의 발산이 일어난다.'], options: ['ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['atm.westerly', 'atm.forces'] },

  // ───────── 대단원 마무리: 핵심 정리(빈칸) ─────────
  { code: 'TS01', no: '01', section: S3, topic: 'radiation', type: 'blank', question: '[지구의 대기와 생명체]\n· 지구 대기의 선택적 흡수: 대기는 특정 파장의 복사 에너지는 흡수하고 다른 파장의 복사 에너지는 투과시키는 선택적 흡수체이다.\n· 지구 생명체의 존재 조건: 지구는 ( ① ) 안에 있어 표면에 액체 상태의 물이 존재하고 대기의 자외선 차단 효과, 온실 효과로 생명체가 존재할 수 있다.', blanks: ['①'], conceptIds: ['atm.absorption'] },
  { code: 'TS02', no: '02', section: S3, topic: 'radiation', type: 'blank', question: '[지구 열수지]\n· 지표와 대기의 열 출입: 태양 복사 에너지가 지구 대기에 도달하면 ( ② ), 반사, 흡수, 굴절이 일어나면서 지표와 대기의 열 출입에 영향을 준다.\n· 지구 열수지 균형: 지구가 태양으로부터 흡수하고 방출하는 에너지의 양이 같아 평균 기온이 일정하게 유지된다.', blanks: ['②'], conceptIds: ['atm.budget'] },
  { code: 'TS03', no: '03', section: S3, topic: 'adiabatic', type: 'blank', question: '[대기 안정도와 강수]\n· ( ③ ): 불포화 상태의 공기가 높이 변화에 따라 단열 변화할 때의 기온 변화율 ⇒ 약 10 ℃/km\n· ( ④ ): 포화 상태의 공기가 높이 변화에 따라 단열 변화할 때의 기온 변화율 ⇒ 약 5 ℃/km\n· 상승 응결 고도: 불포화 상태의 공기가 상승하면서 단열 변화가 일어나고 구름이 생성되기 시작하는 고도\n· 안정 상태: 연직 운동 억제 ⇒ ( ⑤ ) 구름 생성\n· 불안정 상태: 연직 운동 활발 ⇒ ( ⑥ ) 구름 생성\n· 안개의 생성: 지표면 부근의 공기 냉각, 단열 팽창으로 인한 공기 냉각으로 수증기가 응결해 안개가 생성된다.\n· 병합설: 저위도 지방, 여름철 중위도 지방의 강수 과정 — 구름 속 물방울이 서로 충돌하고 합쳐지면서 성장해 지표로 떨어진다.\n· 빙정설: 고위도 지방, 중위도 지방의 강수 과정 — 구름 속 ( ⑦ )에서 증발이 일어나 수증기가 빙정에 달라붙으면서 빙정이 성장해 지표로 떨어진다.', blanks: ['③', '④', '⑤', '⑥', '⑦'], images: [IMG('ts03a'), IMG('ts03b')], conceptIds: ['atm.adiabatic', 'atm.stability', 'atm.precip'] },
  { code: 'TS04', no: '04', section: S3, topic: 'forces', type: 'blank', question: '[기압의 연직 분포와 대기를 움직이는 힘]\n· 정역학 평형: 공기 덩어리에 작용하는 연직 기압 경도력과 ( ⑧ )이/가 평형을 이루고 있는 상태\n· 대기를 움직이는 힘: 대기를 움직이는 힘에는 ( ⑨ ), 전향력, 구심력, 마찰력이 있다.', blanks: ['⑧', '⑨'], conceptIds: ['atm.forces'] },
  { code: 'TS05', no: '05', section: S3, topic: 'winds', type: 'blank', question: '[여러 가지 바람]\n· ( ⑩ ): 기압 경도력과 전향력이 평형을 이루며 등압선에 나란하게 부는 바람\n· 경도풍: 기압 경도력, 전향력, 구심력이 균형을 이루며 등압선에 나란하게 원형으로 부는 바람\n· 지상풍(등압선이 직선일 때): 기압 경도력, 전향력, ( ⑪ )이/가 평형을 이루며 등압선을 가로질러 분다.\n· 지상풍(등압선이 곡선일 때): 기압 경도력, 전향력, 마찰력, 구심력이 균형을 이루며 등압선을 가로질러 분다.', blanks: ['⑩', '⑪'], conceptIds: ['atm.geo-wind', 'atm.gradient-wind', 'atm.surface-wind'] },
  { code: 'TS06', no: '06', section: S3, topic: 'winds', type: 'blank', question: '[편서풍 파동]\n· 편서풍 파동: 중위도 지방의 상층에서 파장이 긴 파동의 형태로 전 지구를 감싸면서 회전하는 행성파\n· ( ⑫ ): 편서풍 파동 내에서 주위보다 풍속이 매우 강한 흐름\n· 기압골 서쪽: 상층 공기 수렴 ⇒ 하강 기류 형성 ⇒ 지상 ( ⑬ ) 발달\n· 기압골 동쪽: 상층 공기 발산 ⇒ 상승 기류 형성 ⇒ 지상 ( ⑭ ) 발달', blanks: ['⑫', '⑬', '⑭'], conceptIds: ['atm.westerly'] },

  // ───────── 대단원 마무리: 개념 적용하기 ─────────
  { code: 'TM01', no: '01', section: S4, topic: 'radiation', type: 'multiple_choice', question: `그림은 지구 대기의 태양 복사 에너지 흡수율을 파장에 따라 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tm01') }, statements: ['A는 대부분 지표에 도달한다.', '대기 중의 온실 기체에 흡수되는 에너지의 양은 B가 C보다 많다.', '인공위성으로 지표의 정보를 얻고자 할 때는 ㉠ 영역보다 ㉡ 영역을 이용하는 것이 유리하다.'], options: G2, conceptIds: ['atm.absorption'] },
  { code: 'TM02', no: '02', section: S4, topic: 'radiation', type: 'multiple_choice', question: '그림은 복사 평형 상태에 있는 지구 열수지를 나타낸 것이다.\n이에 대한 설명으로 옳은 것만을 <보기>에서 골라 보자.', diagram: { img: IMG('tm02') }, statements: ['A는 B보다 크다.', '성층권 오존의 양이 감소하면 A가 감소한다.', '대기 중 온실 기체의 양이 증가하면 B가 증가한다.'], options: ALL7, conceptIds: ['atm.budget'] },
  { code: 'TM03', no: '03', section: S4, topic: 'adiabatic', type: 'multiple_choice', question: `그림은 어느 지역의 높이에 따른 기온 분포와 단열선을 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tm03') }, statements: ['지표면~2 km 구간의 기층은 절대 안정 상태이다.', '2 km~5 km 구간의 기층은 절대 불안정 상태이다.', '지표면에서 단열 상승한 공기 덩어리의 온도는 주위 공기보다 항상 높다.'], options: G2, conceptIds: ['atm.stability'] },
  { code: 'TM04', no: '04', section: S4, topic: 'precip', type: 'multiple_choice', question: '강수 과정에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?', statements: ['빙정설에 따르면 과냉각 물방울에서 증발이 일어난다.', '병합설에 따르면 구름 속 물방울의 크기가 다양하게 분포할 때 빗방울로 잘 성장한다.', '우리나라에서 일어나는 강수 현상은 주로 병합설로 설명한다.'], options: G2, conceptIds: ['atm.precip'] },
  { code: 'TM05', no: '05', section: S4, topic: 'forces', type: 'multiple_choice', question: '그림은 연직 방향으로 정역학 평형을 이루는 공기 덩어리에 수평 방향으로 기압 차가 발생한 모습을 나타낸 것이다.\n이에 대한 설명으로 옳은 것만을 <보기>에서 골라 보자. (단, 공기 덩어리의 밀도는 ρ, ΔP > 0이다.)', diagram: { img: IMG('tm05') }, statements: ['A에 작용하는 힘은 B에 작용하는 힘보다 크다.', '기압 경도력은 B에서 A 쪽으로 작용한다.', '단위 질량의 공기 덩어리에 작용하는 기압 경도력의 크기는 (1/ρ)·(ΔP/ΔL)이다.'], options: ALL7, conceptIds: ['atm.forces'] },
  { code: 'TM06', no: '06', section: S4, topic: 'winds', type: 'multiple_choice', question: `그림 (가)와 (나)는 북반구의 지상과 상층에서 부는 바람을 순서 없이 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tm06') }, statements: ['바람이 부는 고도는 (가)가 (나)보다 높다.', '(나)의 중심부는 저기압이다.', '(가)와 (나)는 모두 지표면에 의한 마찰력의 영향을 받지 않는다.'], options: G2, conceptIds: ['atm.geo-wind', 'atm.gradient-wind', 'atm.surface-wind'] },
  { code: 'TM07', no: '07', section: S4, topic: 'winds', type: 'multiple_choice', question: `그림은 북반구의 대기 대순환을 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tm07') }, statements: ['(가)에는 저압대가, (나)에는 고압대가 형성된다.', 'A와 C는 직접 순환이고 B는 간접 순환이다.', '지구가 자전하지 않는다면 A, B, C는 하나의 순환을 형성하게 될 것이다.'], options: G2, conceptIds: ['atm.circulation'] },
  { code: 'TM08', no: '08', section: S4, topic: 'winds', type: 'multiple_choice', question: `그림은 북반구 중위도 상층의 편서풍 파동과 지상의 기압 배치를 나타낸 것이다.\n${PICK}`, diagram: { img: IMG('tm08') }, statements: ['A에서는 저기압성 경도풍이 분다.', 'B에서는 공기의 수렴이, C에서는 공기의 발산이 일어난다.', '(가)에는 고기압이, (나)에는 저기압이 발달한다.'], options: G2, conceptIds: ['atm.westerly'] },

  // ───────── 대단원 마무리: 과학 역량 키우기 ─────────
  { code: 'TM09a', no: '09-(1)', title: '과학적 탐구 능력', section: S5, topic: 'adiabatic', type: 'short_answer', format: 'text', question: '그림은 지표면에서 온도가 같은 공기 덩어리 A와 B가 상승해 구름이 생성되는 모습을 나타낸 것이다.\n(1) 지표면에서 공기 덩어리 A와 B의 이슬점을 비교해 보자.', diagram: { img: IMG('tm09') }, conceptIds: ['atm.lcl'] },
  { code: 'TM09b', no: '09-(2)', title: '과학적 탐구 능력', section: S5, topic: 'adiabatic', type: 'short_answer', format: 'text', question: '(2) 공기 덩어리 B가 지표면에서 높이 h₂까지 상승하는 동안에 일어나는 단열 변화를 서술해 보자.', conceptIds: ['atm.adiabatic', 'atm.lcl'] },
  { code: 'TM10', no: '10', title: '과학적 문제해결 능력', section: S5, topic: 'winds', type: 'short_answer', format: 'text', question: '그림 (가)와 (나)는 북반구의 위도가 같은 두 지점 P와 Q에서 경도풍이 불 때 바람에 작용하는 기압 경도력을 나타낸 것이다. (단, P와 Q에서 기압 경도력의 크기는 같고, 화살표는 힘의 방향만을 나타낸다.)\n지점 P와 Q에 작용하는 전향력의 크기와 풍속을 비교하여 서술해 보자.', diagram: { img: IMG('tm10') }, conceptIds: ['atm.gradient-wind'] },
  { code: 'TM11a', no: '11-(1)', title: '과학적 의사결정 능력', section: S5, topic: 'winds', type: 'short_answer', format: 'text', question: '다음은 말 위도대라고 불리던 아열대 무풍대를 설명한 글이다.\n(1) 위도 30° 부근의 날씨가 대체로 맑고 건조한 까닭을 대기 대순환과 관련지어 서술해 보자.', material: ['위도 30° 부근에는 바람이 거의 없거나 매우 약하게 불고, 대체로 날씨가 맑으며 넓고 건조한 위도대가 있다. 옛날 사람들은 이 지역을 말 위도대(horse latitudes)라고 불렀다. 이는 범선을 이용해 항해를 하던 시기에 스페인의 항해사들이 붙인 이름이다. 항해사들이 대서양을 항해하는 동안 때때로 바람이 거의 불지 않아 배가 몇 주씩 장기간 이동할 수 없게 되었다. 이때 배에 싣고 있던 말에게 먹이를 먹일 수 없게 되자 많은 말을 바다에 던져 버려야 했던 것으로부터 말 위도대라는 이름이 붙여졌다.', '오늘날에는 이 지역을 아열대 무풍대 또는 아열대 고압대라고 한다. 이 지역은 굉장히 건조하기 때문에 사하라 사막이나 아라비아 사막과 같이 세계적으로 유명한 사막이 많이 분포해 있다.'], conceptIds: ['atm.circulation'] },
  { code: 'TM11b', no: '11-(2)', title: '과학적 의사결정 능력', section: S5, topic: 'winds', type: 'short_answer', format: 'text', question: '(2) 말 위도대는 여름에 북상하고 겨울에 남하한다. 그 까닭에 대해 설명하는 글을 써 보자.', conceptIds: ['atm.circulation'] },
]

export const ATMOSPHERE_TEXTBOOK: BankQuestion[] = LIST.map((q, i) => ({ difficulty: '중', ...q, id: `atmosphere-${q.code}`, unitId: 'atmosphere', set: 'textbook', number: i + 1, points: 0 }))

const ox = (a: 'O' | 'X'): AnswerKey => ({ answer: a, display: a })
const mc = (n: number, explanation?: string): AnswerKey => ({ answer: n, display: '①②③④⑤⑥⑦'[n - 1], explanation })
const self = (modelAnswer: string): AnswerKey => ({ manual: true, answer: '', display: '모범답안 참고', modelAnswer })

/** 정답: 교과서 '스스로 평가하기'·'대단원 마무리' 정답. 서술형 중 교과서 해설이 없는 문항의 모범답안은 개념을 바탕으로 작성 */
export const ATMOSPHERE_TEXTBOOK_ANSWERS: Record<string, AnswerKey> = {
  TB01: self('· 선택적 흡수체: 특정 파장의 복사 에너지는 흡수하고 다른 파장은 투과시키는 물질(지구 대기)\n· 지구 복사 에너지: 지구가 방출하는 주로 적외선 영역의 복사 에너지\n· 절대 불안정: 기온 감률이 건조 단열 감률보다 커서 공기의 포화 여부와 관계없이 불안정한 상태\n· 기압 경도력: 두 지점의 기압 차이로 기압이 높은 곳에서 낮은 곳으로 작용하는 힘\n· 지균풍: 상층에서 기압 경도력과 전향력이 평형을 이루며 등압선에 나란하게 부는 바람\n· 행성파: 중위도 상층에서 파장이 긴 파동 형태로 지구를 감싸며 부는 편서풍 파동'),
  TB02a: ox('O'), TB02b: ox('X'), TB02c: ox('O'), TB02d: ox('X'), TB02e: ox('O'), TB02f: ox('O'),
  TB03a: self('산란, 반사, 흡수, 굴절 등'),
  TB03b: self('단열 팽창하는 과정에서 내부 에너지가 감소하기 때문이다.'),
  TB03c: self('기압 경도력과 전향력이 평형을 이룬다.'),
  TB03d: self('기압골의 동쪽 지상에는 저기압이, 서쪽 지상에는 고기압이 발달한다.'),
  TB04: mc(3), TB05: mc(2), TB06: mc(1), TB07: mc(4), TB08: mc(3), TB09: mc(4), TB10: mc(4), TB11: mc(5),
  TS01: { answer: [['생명 가능 지대', '생명가능지대']], display: '① 생명 가능 지대' },
  TS02: { answer: [['산란']], display: '② 산란' },
  TS03: { answer: [['건조 단열 감률'], ['습윤 단열 감률'], ['층운형'], ['적운형'], ['과냉각 물방울']], display: '③ 건조 단열 감률 ④ 습윤 단열 감률 ⑤ 층운형 ⑥ 적운형 ⑦ 과냉각 물방울' },
  TS04: { answer: [['중력'], ['기압 경도력']], display: '⑧ 중력 ⑨ 기압 경도력' },
  TS05: { answer: [['지균풍'], ['마찰력']], display: '⑩ 지균풍 ⑪ 마찰력' },
  TS06: { answer: [['제트류'], ['고기압'], ['저기압']], display: '⑫ 제트류 ⑬ 고기압 ⑭ 저기압' },
  TM01: mc(2), TM02: mc(6), TM03: mc(4), TM04: mc(3), TM05: mc(6), TM06: mc(1), TM07: mc(5), TM08: mc(4),
  TM09a: self('지표면에서 두 공기 덩어리의 온도가 같을 때 상승 응결 고도는 기온과 이슬점의 차이가 작을수록 낮다. 구름이 더 낮은 높이(h₁)에서 생성되기 시작한 B의 이슬점이 A보다 높다.'),
  TM09b: self('지표면에서 h₁까지는 불포화 상태로 건조 단열 변화를 하며 기온이 약 10 ℃/km(이슬점은 약 2 ℃/km)씩 낮아진다. h₁(상승 응결 고도)에서 포화되어 구름이 생기기 시작하고, h₁에서 h₂까지는 응결열이 방출되어 습윤 단열 변화를 하며 기온이 약 5 ℃/km씩 낮아진다.'),
  TM10: self('(가)의 P는 기압 경도력이 중심 쪽을 향하는 저기압성 경도풍, (나)의 Q는 기압 경도력이 바깥쪽을 향하는 고기압성 경도풍이다. 저기압에서는 기압 경도력 = 전향력 + 구심력이므로 전향력이 기압 경도력보다 작고, 고기압에서는 전향력 = 기압 경도력 + 구심력이므로 전향력이 기압 경도력보다 크다. 따라서 전향력은 Q가 P보다 크고, 위도가 같으므로 풍속도 Q가 P보다 빠르다.'),
  TM11a: self('적도에서 가열되어 상승한 공기가 상층에서 고위도로 이동하다 위도 30° 부근에서 하강한다(해들리 순환). 하강하는 공기는 단열 압축되어 기온이 높아지고 상대 습도가 낮아지므로 구름이 생기기 어려워 날씨가 맑고 건조하며, 아열대 고압대가 형성되어 바람도 약하다.'),
  TM11b: self('태양의 남중 고도가 가장 높은 곳(가장 강하게 가열되는 위도)이 여름에는 북쪽으로, 겨울에는 남쪽으로 이동한다. 이에 따라 적도 저압대의 상승 기류와 해들리 순환 전체가 계절에 따라 남북으로 이동하므로, 해들리 순환의 하강 기류가 나타나는 말 위도대도 여름에 북상하고 겨울에 남하한다.'),
}
