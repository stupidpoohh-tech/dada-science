import type { AnswerKey, BankQuestion } from './types'

/**
 * Ⅱ. 해수의 운동과 순환 — 교과서 문제
 * 교과서의 번호·순서·보기를 그대로 옮겼습니다. 그림은 교과서 사진에서 잘라 public/textbook/ocean/에 두었습니다.
 * 문항 코드: TB(1·2단계), TS(대단원 마무리 핵심 정리), TM(대단원 마무리 문제)
 * 글로 쓰는 문항(format: 'text')은 모범답안과 비교해 스스로 채점합니다.
 */
type Q = Omit<BankQuestion, 'id' | 'unitId' | 'set' | 'number' | 'points' | 'difficulty'> & { difficulty?: BankQuestion['difficulty'] }

const S1 = '1단계 개념 이해'
const S2 = '2단계 개념 통합'
const S3 = '대단원 마무리 — 핵심 정리'
const S4 = '대단원 마무리 — 개념 적용하기'
const S5 = '대단원 마무리 — 과학 역량 키우기'
const OX_STEM = '다음 설명이 옳으면 O, 옳지 않으면 X를 고르시오.\n'
const G1 = ['ㄱ', 'ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ']
const G2 = ['ㄱ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ']
const PICK = '이에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?'

const LIST: Q[] = [
  // ───────── 1단계 개념 이해 ─────────
  { code: 'TB01', no: '1', section: S1, topic: 'forces', type: 'short_answer', format: 'text', question: '다음 용어에 대해 아는 대로 설명해 보시오. (옆 친구에게 설명하고 서로 잘 알고 있는지 의견을 나누어 보자.)\n· 수압 경도력  · 지형류  · 풍랑  · 심해파  · 쓰나미  · 조차', images: ['textbook/ocean/tb01.png'], conceptIds: ['ocean.pgf', 'ocean.geostrophic', 'ocean.wave-types', 'ocean.tsunami', 'ocean.tide-day'] },
  { code: 'TB02a', no: '2-(1)', section: S1, topic: 'forces', type: 'ox', question: OX_STEM + '(1) 수압 경도력은 수압이 낮은 곳에서 높은 곳으로 작용한다.', conceptIds: ['ocean.pgf'] },
  { code: 'TB02b', no: '2-(2)', section: S1, topic: 'ekman-geo', type: 'ox', question: '(2) 환류의 중심은 서쪽으로 치우쳐 있다.', conceptIds: ['ocean.geostrophic'] },
  { code: 'TB02c', no: '2-(3)', section: S1, topic: 'waves', type: 'ox', question: '(3) 해파가 해안으로 접근하면 파장은 짧아지고, 속도는 느려진다.', conceptIds: ['ocean.shoaling'] },
  { code: 'TB02d', no: '2-(4)', section: S1, topic: 'surge', type: 'ox', question: '(4) 해안이 해저 지형의 경사가 크면 쓰나미의 파고가 높아진다.', conceptIds: ['ocean.tsunami'] },
  { code: 'TB02e', no: '2-(5)', section: S1, topic: 'tide', type: 'ox', question: '(5) 우리나라 동해안의 조차는 남해안이나 서해안보다 크다.', conceptIds: ['ocean.tide-day'] },
  { code: 'TB03a', no: '3-(1)', section: S1, topic: 'forces', type: 'short_answer', question: '다음 물음에 답하시오.\n(1) 해수가 연직 방향으로 움직임이 거의 나타나지 않는 까닭을 쓰시오.', conceptIds: ['ocean.pressure'] },
  { code: 'TB03b', no: '3-(2)', section: S1, topic: 'ekman-geo', type: 'short_answer', question: '(2) 북반구에서 바람이 불 때 에크만 수송은 어느 방향으로 일어나는지 쓰시오.', conceptIds: ['ocean.ekman'] },
  { code: 'TB03c', no: '3-(3)', section: S1, topic: 'waves', type: 'short_answer', question: '(3) 해파가 전파될 때 물 입자의 운동을 쓰시오.', conceptIds: ['ocean.wave-particle'] },
  { code: 'TB03d', no: '3-(4)', section: S1, topic: 'tide', type: 'short_answer', question: '(4) 조차가 가장 클 때 달의 위상은 무엇인지 쓰시오.', conceptIds: ['ocean.tide-force'] },
  { code: 'TB04', no: '4', section: S1, topic: 'forces', type: 'multiple_choice', question: `그림은 정역학 평형 상태에 있는 해수 덩어리를 나타낸 것이다.\n${PICK} (단, 물의 밀도(ρ)는 1 g/cm³이고, 중력 가속도(g)는 10 m/s²이다.)`, diagram: { img: 'textbook/ocean/tb04.png' }, statements: ['A는 연직 방향 수압 경도력이다.', 'A와 B의 크기는 같다.', '정역학 방정식에 따라 수심 100 m에서의 수압은 10기압이다.'], options: G2, conceptIds: ['ocean.pressure'] },
  { code: 'TB05', no: '5', section: S1, topic: 'ekman-geo', type: 'multiple_choice', question: `그림 (가)는 지형류의 발생 원리이고, (나)는 북태평양에서 경사진 해수면을 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tb05.png' }, statements: ['A 해역에서 수압 경도력은 적도 방향으로 작용한다.', 'B 해역에서 전향력은 고위도 방향으로 작용한다.', 'A와 B 해역에서 지형류는 모두 서쪽으로 흐른다.'], options: G1, conceptIds: ['ocean.geostrophic', 'ocean.coriolis'] },

  // ───────── 2단계 개념 통합 ─────────
  { code: 'TB06', no: '6', section: S2, topic: 'ekman-geo', type: 'multiple_choice', question: `그림은 지형류 중 하나인 쿠로시오 해류를 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tb06.png' }, statements: ['A보다 B에서 해수면이 높다.', '쿠로시오 해류는 동안 경계류이다.', '쿠로시오 해류는 폭이 좁고 유속이 빠른 해류이다.'], options: G1, conceptIds: ['ocean.geostrophic'] },
  { code: 'TB07', no: '7', section: S2, topic: 'surge', type: 'multiple_choice', question: `그림은 2022년 남태평양 통가 인근 해저 화산 폭발로 일어난 쓰나미 전파 모습을 나타낸 것이다. 이 쓰나미는 A 지점에 12시간 만에 도착했다.\n${PICK} (단, 쓰나미가 발생한 지점에서 A 지점까지 거리는 8,400 km이다.)`, diagram: { img: 'textbook/ocean/tb07.png' }, statements: ['통가에서 A 지점까지 쓰나미의 평균 전파 속도는 700 km/h이다.', 'B 지점은 A 지점보다 더 빨리 쓰나미가 도착했다.', 'A 지점에 가까워질수록 쓰나미의 전파 속도가 빨라진다.'], options: G2, conceptIds: ['ocean.tsunami'] },
  { code: 'TB08', no: '8', section: S2, topic: 'waves', type: 'multiple_choice', question: `그림은 해파의 전파 모습을 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tb08.png' }, statements: ['해파가 해안으로 접근할수록 파장은 길어진다.', '해안으로 전파되면서 수심에 따른 속도 차이 때문에 해파가 굴절한다.', '해파는 대체로 해안선에 수평으로 접근하다 부서진다.'], options: G1, conceptIds: ['ocean.shoaling'] },
  { code: 'TB09', no: '9', section: S2, topic: 'tide', type: 'multiple_choice', question: `그림은 북반구에서 위도가 서로 다른 (가)와 (나) 지역의 조석 그래프를 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tb09.png' }, statements: ['대조일 때 조차는 (나)가 (가)보다 크다.', '하루 동안 만조와 간조 횟수는 (나)가 (가)보다 많다.', '7일 즈음 달의 위상은 보름(망)이다.'], options: G2, conceptIds: ['ocean.tide-day', 'ocean.tide-force'] },
  { code: 'TB10', no: '10', section: S2, topic: 'ekman-geo', type: 'multiple_choice', question: `그림은 북태평양 아열대 해역에 형성된 환류를 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tb10.png' }, statements: ['환류의 중심은 동쪽으로 치우쳐 있다.', '수압 경도력은 A 해역이 B 해역보다 작다.', '쿠로시오 해류가 캘리포니아 해류에 비해 유속이 빠르다.', '쓰레기가 해류를 타고 이동하다 환류의 안쪽에서 쓰레기 섬이 형성된다.'], options: ['ㄱ', 'ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄹ', 'ㄷ, ㄹ'], conceptIds: ['ocean.geostrophic'] },
  { code: 'TB11', no: '11', section: S2, topic: 'waves', type: 'multiple_choice', question: `그림은 파장과 수심의 관계에 따라 구분한 두 해파와 물 입자의 운동을 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tb11.png' }, statements: ['(가)는 해파의 속도가 수심의 영향을 받고, (나)는 파장의 영향을 받는다.', '먼바다에서 해안으로 접근하면서 해파는 (가)에서 (나)로 변한다.', '쓰나미는 (가)와 같은 형태의 해파에 해당한다.'], options: G1, conceptIds: ['ocean.wave-types', 'ocean.tsunami'] },

  // ───────── 대단원 마무리: 핵심 정리(빈칸) ─────────
  { code: 'TS01', no: '01', title: '해수를 움직이는 힘', section: S3, topic: 'forces', type: 'blank', question: '[해수를 움직이는 힘]\n· 수압 차이가 있는 두 지점 사이에는 ( ① )이/가 작용한다.\n· 정역학 평형: 연직 수압 경도력과 ( ② )이/가 평형을 이룬 상태이다.\n· 해수의 밀도가 일정할 때 수평 수압 경도력의 크기는 해수면 경사에 비례한다.\n· 전향력의 방향: 북반구에서는 물체 운동 방향의 ( ③ ) 직각 방향으로, 남반구에서는 왼쪽 직각 방향으로 작용한다.\n· 전향력의 크기: 극에서 가장 크고 ( ④ )에서 0이 된다.', blanks: ['①', '②', '③', '④'], images: ['textbook/ocean/ts01.png'], conceptIds: ['ocean.pgf', 'ocean.pressure', 'ocean.coriolis'] },
  { code: 'TS02', no: '02', title: '지형류', section: S3, topic: 'ekman-geo', type: 'blank', question: '[지형류]\n· 에크만 수송: 표층에서 ( ⑤ )의 영향이 미치는 깊이까지의 평균적인 해수의 흐름을 말하며, 에크만층에서 해수의 평균 이동 방향은 북반구에서는 풍향의 오른쪽 90° 방향으로, 남반구에서는 왼쪽 90° 방향으로 나타난다.\n· 지형류 평형: 수압 경도력과 ( ⑥ )이/가 평형을 이룬 상태이다.', blanks: ['⑤', '⑥'], images: ['textbook/ocean/ts02.png'], conceptIds: ['ocean.ekman', 'ocean.geostrophic'] },
  { code: 'TS03', no: '03', title: '해파', section: S3, topic: 'waves', type: 'blank', question: '[해파]\n· 해파: 해수면에서 생긴 교란이 파동의 형태로 퍼져 나가면서 발생하는 물 입자의 주기적인 상하 운동\n· 해파는 모양에 따라 풍랑, ( ⑦ ), 연안 쇄파로 구분한다.\n· 해파의 전파: 물 입자는 해파의 진행 방향으로 직접 이동하지 않으며, ( ⑧ )만 전달한다.\n· 수심이 파장의 약 1/2보다 깊은 곳에서 전달되는 해파를 ( ⑨ )(이)라고 하고, 수심이 파장의 약 1/20보다 얕은 곳에서 전달되는 해파를 천해파라고 한다.', blanks: ['⑦', '⑧', '⑨'], conceptIds: ['ocean.wave-structure', 'ocean.wave-types'] },
  { code: 'TS04', no: '04', title: '해일', section: S3, topic: 'surge', type: 'blank', question: '[해일]\n· 폭풍 해일: ( ⑩ ) 등 강한 저기압이 통과할 때 해수면이 높아져 바닷물이 육지로 밀려드는 현상\n· 지진 해일: 해저에서 지진 등이 일어나 발생한 해일로 ( ⑪ )(이)라고도 한다. 수심에 비해 파장이 매우 길어 천해파의 특징을 나타낸다.', blanks: ['⑩', '⑪'], conceptIds: ['ocean.storm-surge', 'ocean.tsunami'] },
  { code: 'TS05', no: '05', title: '조석', section: S3, topic: 'tide', type: 'blank', question: '[조석]\n· 기조력: 지구와 달의 공동 질량 중심을 기준으로 지구가 원운동을 하면서 생긴 원심력과 달이 지구에 작용하는 인력의 합력\n· 하루 중 해수면이 가장 높을 때를 ( ⑫ ), 가장 낮을 때를 ( ⑬ )(이)라고 한다.\n· 한 달 중 조차가 가장 큰 시기를 ( ⑭ ) 또는 ( ⑮ )(이)라고 하며, 이때 달의 위상은 망 또는 삭이다.\n· 한 달 중 조차가 가장 작은 시기를 조금 또는 소조라고 하며, 달의 위상은 ( ⑯ ) 또는 ( ⑰ )(이)다.', blanks: ['⑫', '⑬', '⑭', '⑮', '⑯', '⑰'], images: ['textbook/ocean/ts05.png'], conceptIds: ['ocean.tide-force', 'ocean.tide-day'] },

  // ───────── 대단원 마무리: 개념 적용하기 ─────────
  { code: 'TM01', no: '01', section: S4, topic: 'forces', type: 'multiple_choice', question: '해수를 움직이는 힘에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?', statements: ['수압은 수심이 깊어질수록 높아진다.', '정역학 평형 상태는 중력과 연직 수압 경도력이 평형을 이루는 상태이다.', '밀도가 일정할 때 수평 수압 경도력은 해수면이 높은 곳에서 낮은 곳으로 작용한다.', '운동 규모에 상관없이 전향력을 고려해야 한다.', '남반구에서 전향력은 운동하는 물체의 오른쪽 직각 방향으로 작용한다.'], options: ['ㄱ, ㄴ', 'ㄷ, ㅁ', 'ㄱ, ㄴ, ㄷ', 'ㄴ, ㄷ, ㄹ', 'ㄷ, ㄹ, ㅁ'], conceptIds: ['ocean.pressure', 'ocean.pgf', 'ocean.coriolis'] },
  { code: 'TM02', no: '02', section: S4, topic: 'ekman-geo', type: 'multiple_choice', question: '그림은 에크만 나선과 에크만 수송을 나타낸 것이다.\n이에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?', diagram: { img: 'textbook/ocean/tm02.png' }, statements: ['이 해역은 북반구에 위치한다.', '수심에 따라 해수의 이동 방향이 바뀌는 것은 전향력 때문이다.', '마찰저항심도에서 해수의 이동 방향은 바람의 방향과 정반대이다.'], options: G2, conceptIds: ['ocean.ekman'] },
  { code: 'TM03', no: '03', section: S4, topic: 'ekman-geo', type: 'blank', question: '그림은 지형류가 흐르는 북반구 어느 해역에서 해수의 밀도가 일정할 때 해수면 경사를 나타낸 것이다.\n(가)~(다)가 각각 무엇을 의미하는지 써 보자.', diagram: { img: 'textbook/ocean/tm03.png' }, blanks: ['(가)', '(나)', '(다)'], conceptIds: ['ocean.geostrophic'] },
  { code: 'TM04', no: '04', section: S4, topic: 'ekman-geo', type: 'multiple_choice', question: `그림은 지형류가 흐르는 북반구 어느 해역의 동일 위도에서 깊이에 따른 수온 변화를 나타낸 것이다.\n${PICK} (단, 해수의 밀도는 수온에 의해서만 결정된다고 가정한다.)`, diagram: { img: 'textbook/ocean/tm04.png' }, statements: ['해수면의 높이는 A가 B보다 낮다.', '지형류의 유속은 C가 D보다 빠르다.', 'C 지점의 해수에 작용하는 전향력의 방향은 동쪽이다.'], options: G1, conceptIds: ['ocean.geostrophic'] },
  { code: 'TM05', no: '05', section: S4, topic: 'waves', type: 'multiple_choice', question: `그림은 어느 해파의 파장과 속도의 관계를 나타낸 것이다.\n이 해파에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은? (단, 이 해파는 심해파와 천해파 중 하나이다.)`, diagram: { img: 'textbook/ocean/tm05.png' }, statements: ['심해파이다.', '물 입자는 타원 운동을 한다.', '파장이 400 m일 때 주기는 16초이다.'], options: G1, conceptIds: ['ocean.wave-types'] },
  { code: 'TM06', no: '06', section: S4, topic: 'surge', type: 'multiple_choice', question: `그림은 해저 지진으로 발생한 해파의 이동 모습을 간단히 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tm06.png' }, statements: ['A 지점에서 파장은 B 지점에서보다 크다.', 'A 지점에서 속도는 B 지점에서보다 느리다.', 'B 지점에서 파장은 80 km보다 길다.'], options: G1, conceptIds: ['ocean.tsunami', 'ocean.shoaling'] },
  { code: 'TM07', no: '07', section: S4, topic: 'tide', type: 'multiple_choice', question: `그림은 태양, 지구, 달의 상대적 위치를 나타낸 것이다.\n${PICK} (단, 태양과 달의 기조력 이외의 조석 변동 요인은 고려하지 않는다.)`, diagram: { img: 'textbook/ocean/tm07.png' }, statements: ['태양의 기조력이 달의 기조력보다 크다.', '달이 A에 위치할 때는 B에 위치할 때보다 조차가 크다.', '달이 C에 위치할 때, 우리나라는 정오에 간조가 나타난다.'], options: G1, conceptIds: ['ocean.tide-force'] },
  { code: 'TM08', no: '08', section: S4, topic: 'tide', type: 'multiple_choice', question: `그림은 우리나라 인천 앞바다에서 한 달 동안 측정한 조석 자료를 나타낸 것이다.\n${PICK}`, diagram: { img: 'textbook/ocean/tm08.png' }, statements: ['최대 조차는 약 4 m 이내이다.', '만조와 간조가 하루에 한 번씩 나타난다.', '13일 무렵의 달의 위상은 상현 또는 하현이다.'], options: G2, conceptIds: ['ocean.tide-day'] },

  // ───────── 대단원 마무리: 과학 역량 키우기 ─────────
  { code: 'TM09', no: '09', title: '과학적 의사결정 능력', section: S5, topic: 'surge', type: 'short_answer', format: 'text', question: '그림은 어느 지진에 의해 발생한 지진 해일의 도달 시간을 나타낸 것이다.\n진앙에서 A까지의 평균 수심과 진앙에서 B까지의 평균 수심 중 어느 쪽이 더 깊은지 쓰고, 그렇게 판단한 근거를 서술해 보자.', diagram: { img: 'textbook/ocean/tm09.png' }, conceptIds: ['ocean.tsunami'] },
  { code: 'TM10a', no: '10-(1)', title: '과학적 탐구 능력', section: S5, topic: 'tide', type: 'short_answer', format: 'text', question: '표는 우리나라 서해안의 어느 지역에서 이틀 동안 조석 현상을 관측한 것이다.\n(1) 11월 15일에 간조가 두 번 나타나지 않는 까닭을 서술해 보자.', table: { head: ['날짜(양력)', '날짜(음력)', '시각(시:분)', '조위(cm)', '비고'], rows: [['11월 14일', '10월 2일', '05:02', '787', '만조'], ['', '', '11:17', '35', '간조'], ['', '', '17:26', '876', '만조'], ['', '', '23:54', '108', '간조'], ['11월 15일', '10월 3일', '05:38', '779', '만조'], ['', '', '11:52', '28', '간조'], ['', '', '18:02', '876', '만조']] }, conceptIds: ['ocean.tide-day'] },
  { code: 'TM10b', no: '10-(2)', title: '과학적 탐구 능력', section: S5, topic: 'tide', type: 'short_answer', format: 'text', question: '(2) 위 표에서 11월 16일의 조차는 어떻게 변할지 예상해 보고, 그렇게 판단한 근거를 서술해 보자.', conceptIds: ['ocean.tide-day', 'ocean.tide-force'] },
  { code: 'TM11a', no: '11-(1)', title: '과학적 문제해결 능력', section: S5, topic: 'ekman-geo', type: 'short_answer', format: 'text', question: '다음은 쓰레기 섬을 설명한 글이다.\n(1) 쓰레기 섬이 특정 해역에서 주로 발견되는 까닭을 해수의 순환과 이를 구성하는 해류와 관련지어 구체적으로 서술해 보자.', material: ['전 세계 대양의 특정 해역에는 쓰레기 더미가 뭉쳐서 떠다니는 쓰레기 섬이 존재한다고 한다. 바다에 버려진 부유성 쓰레기들이 특정 해역에 존재하는 까닭은 해수의 순환과 관련이 있다.', '북태평양에 형성된 쓰레기 섬의 규모는 한반도 면적의 약 16배나 된다. 태평양뿐만 아니라 대서양, 인도양에도 쓰레기 섬이 있으며, 크기가 매년 증가한다고 한다.', '대양에 있는 쓰레기의 대부분은 육지에서 떠내려온 것이고 일부는 선박에서 버려진 것으로 추정된다. 이러한 쓰레기의 약 90%가 썩지 않는 비닐과 플라스틱으로 이루어져 있으며, 해양 생태계에 많은 문제를 일으키고 있다.'], conceptIds: ['ocean.geostrophic', 'ocean.ekman'] },
  { code: 'TM11b', no: '11-(2)', title: '과학적 문제해결 능력', section: S5, topic: 'ekman-geo', type: 'short_answer', format: 'text', question: '(2) 개인과 국가 차원에서 쓰레기 섬의 크기를 줄이기 위한 방안을 제안하는 글을 써 보자.', conceptIds: ['ocean.geostrophic'] },
]

export const OCEAN_TEXTBOOK: BankQuestion[] = LIST.map((q, i) => ({ difficulty: '중', ...q, id: `ocean-${q.code}`, unitId: 'ocean', set: 'textbook', number: i + 1, points: 0 }))

const ox = (a: 'O' | 'X', explanation: string): AnswerKey => ({ answer: a, display: a, explanation })
const mc = (n: number, explanation: string): AnswerKey => ({ answer: n, display: '①②③④⑤'[n - 1], explanation })
const self = (modelAnswer: string, explanation?: string): AnswerKey => ({ manual: true, answer: '', display: '모범답안 참고', modelAnswer, explanation })

export const OCEAN_TEXTBOOK_ANSWERS: Record<string, AnswerKey> = {
  TB01: self('· 수압 경도력: 수압 차이에 의해 수압이 높은 곳에서 낮은 곳으로 작용하는 힘\n· 지형류: 수평 수압 경도력과 전향력이 평형을 이루며 등수압선과 나란하게 흐르는 해류\n· 풍랑: 바람에 의해 직접 만들어져 마루가 뾰족하고 파장이 짧은 해파\n· 심해파: 수심이 파장의 약 1/2보다 깊은 곳에서 전달되는 해파(물 입자는 원운동, 속도는 파장에 따라 달라짐)\n· 쓰나미: 해저 지진 등으로 발생하는 파장이 매우 긴 지진 해일(천해파)\n· 조차: 만조와 간조 때의 해수면 높이 차이'),
  TB02a: ox('X', '수압 경도력은 수압이 높은 곳에서 낮은 곳으로 작용한다.'),
  TB02b: ox('O', '전향력의 크기가 위도에 따라 달라 아열대 환류의 중심은 서쪽으로 치우치고, 서안 경계류가 강해진다.'),
  TB02c: ox('O', '수심이 얕아지면 해저 마찰로 속도가 느려지고, 주기는 일정하므로 파장이 짧아진다.'),
  TB02d: ox('O', '수심이 급하게 얕아지는 해안에서는 에너지가 좁은 곳에 모여 쓰나미의 파고가 크게 높아진다.'),
  TB02e: ox('X', '동해안은 조차가 작고, 서해안의 조차가 가장 크다.'),
  TB03a: { answer: [['정역학 평형', '연직 수압 경도력과 중력이 평형을 이루기 때문']], keywords: [['정역학', '평형']], display: '연직 수압 경도력과 중력이 평형을 이루기(정역학 평형) 때문', explanation: '연직 방향으로는 아래로 작용하는 중력과 위로 작용하는 연직 수압 경도력이 평형을 이루므로 해수의 연직 운동이 거의 없다.' },
  TB03b: { answer: [['풍향의 오른쪽 90°', '오른쪽 90°', '오른쪽 90도', '풍향의 오른쪽 90도']], keywords: [['오른쪽 90', '오른쪽90', '오른쪽 직각', '오른쪽으로 90']], display: '풍향의 오른쪽 90° 방향' },
  TB03c: { answer: [['원운동', '원 운동', '타원 운동']], keywords: [['원운동', '원 운동', '원을', '원 궤도', '타원']], display: '원운동(천해파에서는 타원 운동)', explanation: '물 입자는 제자리에서 원(심해파) 또는 타원(천해파) 궤도를 그리며 운동하고, 에너지만 전달된다.' },
  TB03d: { answer: [['삭 또는 망', '삭', '망']], keywords: [['삭', '망', '신월', '보름']], display: '삭 또는 망', explanation: '태양·지구·달이 일직선에 놓이는 삭과 망 무렵에 조차가 가장 큰 사리가 나타난다.' },
  TB04: mc(5, 'A는 위쪽으로 작용하는 연직 수압 경도력, B는 중력이며 정역학 평형이므로 크기가 같다. P = ρgh = 1000 kg/m³ × 10 m/s² × 100 m = 10⁶ Pa ≈ 10기압이다.'),
  TB05: mc(1, '(나)에서 해수면은 5°N에서 가장 높다. A(0°~5°N)에서 수압 경도력은 해수면이 낮은 적도 쪽으로, 전향력은 반대인 북쪽으로 작용하므로 지형류는 서쪽으로 흐른다. B(5°N~10°N)에서 수압 경도력은 고위도 쪽, 전향력은 저위도 쪽으로 작용하고 지형류는 동쪽으로 흐른다.'),
  TB06: mc(3, '북반구 지형류는 흐름 방향의 오른쪽(남쪽, B)의 해수면이 높다. 쿠로시오 해류는 서안 경계류로, 폭이 좁고 유속이 빠르다.'),
  TB07: mc(3, '8,400 km ÷ 12시간 = 700 km/h. B는 약 6시간 선에 있어 A보다 먼저 도착했다. A(해안)에 가까워질수록 수심이 얕아져 전파 속도는 느려진다.'),
  TB08: mc(4, '해안으로 접근하면 속도가 느려지고 파장은 짧아진다. 수심에 따른 속도 차이로 해파가 굴절하여 해안선에 거의 나란하게 다가와 부서진다.'),
  TB09: mc(3, '(나)의 진폭(조차)이 더 크고, 하루 동안 (나)는 만조·간조가 두 번씩, (가)는 한 번씩 나타난다. 음력 7일 무렵은 상현이다.'),
  TB10: mc(5, '환류의 중심은 서쪽으로 치우쳐 서쪽(A)의 해수면 경사가 커서 수압 경도력이 크고, 쿠로시오 해류가 캘리포니아 해류보다 빠르다. 떠다니는 쓰레기는 환류를 따라 이동하다 해수가 모이는 환류 안쪽에 쌓인다.'),
  TB11: mc(2, '(가)는 물 입자가 원운동하며 깊이 갈수록 운동이 작아지는 심해파, (나)는 해저면까지 타원 운동하며 해저면에서 수평 왕복 운동하는 천해파이다. 심해파의 속도는 파장, 천해파의 속도는 수심의 영향을 받는다. 해안으로 오면 심해파 → 천해파로 바뀌고, 쓰나미는 천해파((나))이다.'),
  TS01: { answer: [['수압 경도력', '수평 수압 경도력'], ['중력'], ['오른쪽'], ['적도']], display: '① 수압 경도력 ② 중력 ③ 오른쪽 ④ 적도' },
  TS02: { answer: [['바람', '바람 응력'], ['전향력']], display: '⑤ 바람 ⑥ 전향력' },
  TS03: { answer: [['너울'], ['에너지'], ['심해파']], display: '⑦ 너울 ⑧ 에너지 ⑨ 심해파' },
  TS04: { answer: [['태풍', '열대 저기압'], ['쓰나미']], display: '⑩ 태풍 ⑪ 쓰나미' },
  TS05: { answer: [['만조'], ['간조'], ['사리', '대조'], ['대조', '사리'], ['상현', '하현'], ['하현', '상현']], display: '⑫ 만조 ⑬ 간조 ⑭ 사리 ⑮ 대조 ⑯ 상현 ⑰ 하현' },
  TM01: mc(3, 'ㄹ: 규모가 작은 운동에서는 전향력을 무시할 수 있다. ㅁ: 남반구에서 전향력은 운동 방향의 왼쪽 직각 방향으로 작용한다.'),
  TM02: mc(3, '표면 해수가 풍향의 오른쪽으로 치우쳐 이동하므로 북반구이다. 수심에 따라 방향이 바뀌는 것은 전향력 때문이다. 마찰 저항 심도에서 해수의 이동 방향은 표면 해수의 이동 방향과 정반대이다.'),
  TM03: { answer: [['지형류'], ['수압 경도력', '수평 수압 경도력'], ['전향력']], display: '(가) 지형류 (나) 수압 경도력 (다) 전향력', explanation: '수압 경도력은 해수면이 높은 쪽에서 낮은 쪽으로, 전향력은 그 반대로 작용하며 두 힘이 평형을 이루는 방향으로 지형류가 흐른다.' },
  TM04: mc(5, '수온 약층이 동쪽(B 쪽)으로 갈수록 깊어 따뜻한 해수층이 두꺼우므로 해수면은 B가 A보다 높다. 등온선 경사가 급한 C에서 수평 수압 경도력이 커 유속이 빠르다. C에서 수압 경도력은 서쪽, 전향력은 동쪽으로 작용한다.'),
  TM05: mc(3, '파장이 길수록 속도가 빠르므로 심해파이며, 물 입자는 원운동을 한다. 주기 = 파장 ÷ 속도 = 400 m ÷ 25 m/s = 16초.'),
  TM06: mc(4, '수심이 얕은 A에서 속도가 느리고 파장이 짧다. B는 수심 4 km에서 천해파이므로 파장이 수심의 20배인 80 km보다 길다.'),
  TM07: mc(2, '달의 기조력이 태양의 약 2배이다. A(삭)일 때 사리, B(상현·하현)일 때 조금이다. C(망)일 때 정오에 우리나라는 태양–달을 잇는 선 위에 있어 만조가 나타난다.'),
  TM08: mc(2, '인천의 최대 조차는 약 8 m 이상이다. 만조와 간조가 하루에 두 번씩 나타나는 반일주조이다. 13일 무렵은 조차가 작은 조금이므로 달의 위상은 상현 또는 하현이다.'),
  TM09: self('도달 시간이 같을 때 진앙에서 더 먼 거리까지 지진 해일이 이동한 쪽의 평균 수심이 더 깊다. 지진 해일은 천해파이므로 전파 속도(√(gh))가 수심이 깊을수록 빠르기 때문이다.'),
  TM10a: self('조석 주기가 약 12시간 25분이어서 만조·간조 시각이 매일 약 50분씩 늦어진다. 15일 11시 52분 간조 다음의 간조는 약 12시간 25분 뒤인 16일 0시 무렵에 나타나므로, 15일에는 간조가 한 번만 나타난다.'),
  TM10b: self('11월 14~15일(음력 10월 2~3일)은 삭 직후로 조차가 큰 사리 시기이다. 사리가 지나면 조차는 점차 작아지므로, 16일(음력 4일)의 조차는 15일과 비슷하거나 조금 작아질 것이다.'),
  TM11a: self('쓰레기 섬은 아열대 환류의 안쪽에서 주로 발견된다. 북태평양에서는 북적도 해류–쿠로시오 해류–북태평양 해류–캘리포니아 해류가 시계 방향의 환류를 이룬다. 무역풍과 편서풍에 의한 에크만 수송으로 해수가 환류 중심 쪽으로 모이고 그곳은 흐름이 약하므로, 해류를 따라 이동하던 쓰레기가 빠져나가지 못하고 쌓인다.'),
  TM11b: self('개인: 일회용 플라스틱 사용 줄이기, 분리배출 실천, 해변 정화 활동 참여\n국가: 플라스틱 생산·사용 규제, 해양 쓰레기 투기 단속, 폐기물 처리 시설 확충, 국제 협력을 통한 해양 쓰레기 수거'),
}
