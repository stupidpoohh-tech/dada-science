import type { BankQuestion, BankTopic } from './types'

/**
 * 강수 과정과 대기의 운동 — 문제은행(문제만, 정답은 atmosphere.answers.ts)
 * 개념 확인 Q01~Q30 / 내신 대비 객관식 1~20번(각 4점) + 서술형 21~25번(3·4·4·4·5점)
 * 내부 코드: 개념 확인 Q01~Q30, 내신 대비 E01~E25(원본 번호 Q01~Q25)
 */
export const ATMOSPHERE_TOPICS: BankTopic[] = [
  { id: 'radiation', chapterIds: ['atmosphere-01', 'atmosphere-02'], label: '지구의 대기와 복사 평형', conceptIds: ['atm.absorption', 'atm.budget'] },
  { id: 'adiabatic', chapterIds: ['atmosphere-03'], label: '단열 변화와 대기 안정도', conceptIds: ['atm.adiabatic', 'atm.lcl', 'atm.stability'] },
  { id: 'precip', chapterIds: ['atmosphere-03'], label: '구름과 강수', conceptIds: ['atm.precip'] },
  { id: 'forces', chapterIds: ['atmosphere-04'], label: '기압과 대기를 움직이는 힘', conceptIds: ['atm.forces', 'atm.geo-wind'] },
  { id: 'winds', chapterIds: ['atmosphere-05', 'atmosphere-06'], label: '여러 가지 바람과 대기 대순환', conceptIds: ['atm.gradient-wind', 'atm.surface-wind', 'atm.circulation', 'atm.westerly'] },
]

type Q = Omit<BankQuestion, 'id' | 'unitId' | 'set' | 'number' | 'points'> & { points?: number }
const make = (set: 'concept' | 'exam', list: Q[], defPoints: number): BankQuestion[] =>
  list.map((q, i) => ({ ...q, id: `atmosphere-${q.code}`, unitId: 'atmosphere', set, number: i + 1, points: q.points ?? defPoints }))

export const ATMOSPHERE_CONCEPT: BankQuestion[] = make('concept', [
  // A-1. 지구의 대기와 복사 평형
  { code: 'Q01', title: '대기의 조성', topic: 'radiation', type: 'blank', difficulty: '하', question: '지구 대기를 구성하는 기체 중 가장 많은 것은 (①)이며, 약 (②)%를 차지한다. 두 번째로 많은 기체는 (③)이다.', blanks: ['①', '②', '③'], conceptIds: ['atm.absorption'] },
  { code: 'Q02', title: '선택적 흡수', topic: 'radiation', type: 'blank', difficulty: '하', question: '특정 파장의 복사에너지만 흡수하고 나머지는 통과시키는 성질을 (　　　　)라고 한다.', conceptIds: ['atm.absorption'] },
  { code: 'Q03', title: '복사에너지와 대기 성분', topic: 'radiation', type: 'short_answer', difficulty: '하', question: '다음 복사에너지를 주로 흡수하는 대기 성분을 쓰시오.', blanks: ['① 자외선', '② 적외선'], conceptIds: ['atm.absorption'] },
  { code: 'Q04', title: '지구 복사에너지', topic: 'radiation', type: 'ox', difficulty: '하', question: '지표에서 방출하는 복사에너지는 주로 가시광선 영역에 해당한다.', conceptIds: ['atm.absorption'] },
  { code: 'Q05', title: '복사 평형', topic: 'radiation', type: 'blank', difficulty: '하', question: '지구가 태양으로부터 흡수하는 에너지와 우주로 방출하는 에너지가 같아지는 상태를 (　　　　)이라고 한다.', conceptIds: ['atm.budget'] },
  { code: 'Q06', format: 'text', title: '생명가능지대', topic: 'radiation', type: 'short_answer', difficulty: '중', question: '생명가능지대란 무엇인지 한 문장으로 설명하시오.', conceptIds: ['atm.absorption'] },
  // A-2. 단열 변화와 대기 안정도
  { code: 'Q07', title: '공기의 상승', topic: 'adiabatic', type: 'ox', difficulty: '하', question: '공기 덩어리가 상승하면 주변 기압이 낮아지므로 팽창하면서 온도가 낮아진다.', conceptIds: ['atm.adiabatic'] },
  { code: 'Q08', title: '단열 변화', topic: 'adiabatic', type: 'blank', difficulty: '하', question: '공기가 외부와 열을 주고받지 않고 부피 변화에 따라 온도가 달라지는 현상을 (　　　　)라고 한다.', conceptIds: ['atm.adiabatic'] },
  { code: 'Q09', format: 'text', title: '공기의 하강', topic: 'adiabatic', type: 'short_answer', difficulty: '하', question: '공기가 하강할 때 기온이 높아지는 이유를 설명하시오.', conceptIds: ['atm.adiabatic'] },
  { code: 'Q10', title: '건조 단열 감률', topic: 'adiabatic', type: 'blank', difficulty: '하', question: '건조 단열 감률은 공기가 1km 상승할 때 기온이 약 (　　)℃ 낮아지는 것을 의미한다.', unitHint: '숫자만 입력해도 됩니다.', conceptIds: ['atm.adiabatic'] },
  { code: 'Q11', title: '습윤 단열 감률', topic: 'adiabatic', type: 'blank', difficulty: '하', question: '습윤 단열 감률은 공기가 1km 상승할 때 기온이 약 (　　)℃ 낮아지는 것을 의미한다.', unitHint: '숫자만 입력해도 됩니다.', conceptIds: ['atm.adiabatic'] },
  { code: 'Q12', title: '습윤 단열 감률', topic: 'adiabatic', type: 'multiple_choice', difficulty: '중', question: '습윤 단열 감률이 건조 단열 감률보다 작은 이유는 무엇인가?', options: ['수증기가 태양에너지를 흡수하기 때문', '수증기가 응결하면서 잠열을 방출하기 때문', '공기의 밀도가 항상 증가하기 때문', '공기가 주변으로부터 열을 흡수하기 때문'], conceptIds: ['atm.adiabatic'] },
  { code: 'Q13', title: '이슬점 감률', topic: 'adiabatic', type: 'blank', difficulty: '하', question: '불포화 공기가 상승할 때 이슬점은 1km당 약 (　　)℃ 낮아진다.', unitHint: '숫자만 입력해도 됩니다.', conceptIds: ['atm.lcl'] },
  { code: 'Q14', title: '상승 응결 고도', topic: 'adiabatic', type: 'short_answer', difficulty: '하', question: '상승하는 공기의 기온과 이슬점이 같아지는 높이를 무엇이라고 하는가?', conceptIds: ['atm.lcl'] },
  { code: 'Q15', title: '상승 응결 고도 계산', topic: 'adiabatic', type: 'calculation', difficulty: '중', question: '지표에서 기온이 25℃, 이슬점이 17℃인 불포화 공기가 상승한다.\n건조 단열 감률과 이슬점 감률을 이용할 때 구름이 생성되기 시작하는 높이는 몇 km인가?', unitHint: '단위: km', conceptIds: ['atm.lcl'] },
  { code: 'Q16', title: '대기 안정도', topic: 'adiabatic', type: 'ox', difficulty: '하', question: '대기가 절대 안정 상태라면 공기 덩어리가 상승한 후에도 계속 상승하려는 경향이 강하다.', conceptIds: ['atm.stability'] },
  { code: 'Q17', title: '조건부 불안정', topic: 'adiabatic', type: 'blank', difficulty: '중', question: '불포화 상태에서는 안정하지만 포화 상태에서는 불안정해지는 대기 상태를 (　　　　)이라고 한다.', conceptIds: ['atm.stability'] },
  { code: 'Q18', title: '푄 현상', topic: 'adiabatic', type: 'short_answer', difficulty: '하', question: '산을 넘어 하강한 공기가 주변보다 따뜻하고 건조해지는 현상을 무엇이라고 하는가?', conceptIds: ['atm.lcl'] },
  // A-3. 구름과 강수
  { code: 'Q19', title: '고위도 강수', topic: 'precip', type: 'blank', difficulty: '하', question: '고위도 지역에서는 주로 (　　　　) 과정을 통해 강수가 형성된다.', conceptIds: ['atm.precip'] },
  { code: 'Q20', title: '저위도 강수', topic: 'precip', type: 'blank', difficulty: '하', question: '저위도 지역에서는 주로 구름 속 물방울들이 서로 (　　　　)하여 커지는 과정을 통해 비가 형성된다.', conceptIds: ['atm.precip'] },
  { code: 'Q21', title: '구름 속 물방울의 성장', topic: 'precip', type: 'multiple_choice', difficulty: '하', question: '구름 속 물방울이 성장하는 과정에 대한 설명으로 옳은 것은?', options: ['물방울은 크기가 변하지 않는다.', '구름은 반드시 얼음 결정으로만 이루어진다.', '물방울들이 충돌하고 병합하여 커질 수 있다.', '구름이 형성되면 반드시 눈이 내린다.'], conceptIds: ['atm.precip'] },
  // A-4. 기압과 대기를 움직이는 힘
  { code: 'Q22', title: '기압 경도력', topic: 'forces', type: 'blank', difficulty: '하', question: '기압 차이에 의해 공기를 움직이게 하는 힘을 (　　　　)이라고 한다.', conceptIds: ['atm.forces'] },
  { code: 'Q23', title: '정역학 평형', topic: 'forces', type: 'blank', difficulty: '중', question: '대기의 연직 방향에서 기압 경도력과 중력이 평형을 이루는 상태를 (　　　　)이라고 한다.', conceptIds: ['atm.forces'] },
  { code: 'Q24', title: '전향력', topic: 'forces', type: 'multiple_choice', difficulty: '하', question: '북반구에서 전향력은 공기의 운동 방향에 대해 어느 쪽으로 작용하는가?', options: ['왼쪽 직각 방향', '오른쪽 직각 방향', '항상 운동 방향과 같은 방향', '항상 운동 방향과 반대 방향'], conceptIds: ['atm.forces'] },
  { code: 'Q25', title: '지균풍', topic: 'forces', type: 'blank', difficulty: '하', question: '기압 경도력과 전향력이 평형을 이루어 등압선에 나란하게 부는 바람을 (　　　　)이라고 한다.', conceptIds: ['atm.geo-wind'] },
  { code: 'Q26', title: '지균풍과 등압선', topic: 'forces', type: 'ox', difficulty: '중', question: '지균풍은 기압 경도력과 전향력이 평형을 이루므로 등압선을 가로질러 저기압 중심으로 곧장 분다.', conceptIds: ['atm.geo-wind'] },
  // A-5. 여러 가지 바람과 대기 대순환
  { code: 'Q27', format: 'text', title: '마찰력의 영향', topic: 'winds', type: 'short_answer', difficulty: '하', question: '지표면 부근의 바람이 상층의 바람보다 느린 주된 이유는 무엇인가?', conceptIds: ['atm.surface-wind'] },
  { code: 'Q28', title: '고기압과 저기압', topic: 'winds', type: 'blank', difficulty: '하', question: '북반구에서 저기압을 중심으로 바람은 (시계 / 반시계) 방향으로 회전하며, 고기압을 중심으로는 (시계 / 반시계) 방향으로 회전한다.', blanks: ['저기압', '고기압'], conceptIds: ['atm.gradient-wind'] },
  { code: 'Q29', title: '대기 대순환', topic: 'winds', type: 'blank', difficulty: '하', question: '지구의 대기 대순환은 지구 자전의 영향으로 각 반구에서 (　　)개의 순환 세포로 나뉜다.', unitHint: '숫자만 입력해도 됩니다.', conceptIds: ['atm.circulation'] },
  { code: 'Q30', title: '대기 대순환과 상승 기류', topic: 'winds', type: 'multiple_choice', difficulty: '중', question: '대기 대순환에서 공기가 주로 상승하여 저기압대를 형성하는 위도 조합은?', options: ['적도와 위도 60° 부근', '위도 30°와 극지방', '적도와 위도 30° 부근', '위도 30°와 위도 60° 부근'], conceptIds: ['atm.circulation'] },
], 0)

export const ATMOSPHERE_EXAM: BankQuestion[] = make('exam', [
  { code: 'E01', title: '대기의 조성', topic: 'radiation', type: 'multiple_choice', difficulty: '하', question: '지구 대기의 조성과 역할에 대한 설명으로 옳은 것은?', options: ['산소는 대기에서 가장 많은 비율을 차지한다.', '질소는 대기의 약 78%를 차지한다.', '이산화 탄소는 대기의 약 21%를 차지한다.', '오존은 주로 지표에서 방출되는 적외선을 흡수한다.', '대기를 구성하는 모든 기체는 복사에너지를 같은 비율로 흡수한다.'], conceptIds: ['atm.absorption'] },
  { code: 'E02', title: '선택적 흡수', topic: 'radiation', type: 'multiple_choice', difficulty: '중', question: '대기의 선택적 흡수에 대한 설명으로 옳은 것만을 보기에서 고른 것은?', statements: ['오존은 자외선을 흡수하는 역할을 한다.', '수증기와 이산화 탄소는 적외선을 흡수한다.', '태양 복사에너지의 대부분은 대기에서 흡수되므로 가시광선은 지표에 도달하지 못한다.'], options: ['ㄱ', 'ㄴ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['atm.absorption'] },
  { code: 'E03', title: '복사 평형', topic: 'radiation', type: 'multiple_choice', difficulty: '중', question: '지구의 복사 평형에 대한 설명으로 옳지 않은 것은?', options: ['지구는 태양으로부터 복사에너지를 공급받는다.', '지구는 흡수한 에너지를 적외선 등의 형태로 방출한다.', '복사 평형에서는 흡수 에너지와 방출 에너지가 같다.', '지구의 복사 평형은 지구 평균 기온이 일정하게 유지되는 데 기여한다.', '복사 평형 상태에서는 지구가 우주로 방출하는 에너지가 0이 된다.'], conceptIds: ['atm.budget'] },
  { code: 'E04', title: '단열 변화', topic: 'adiabatic', type: 'multiple_choice', difficulty: '하', question: '공기 덩어리의 단열 변화에 대한 설명으로 옳은 것은?', options: ['공기가 상승하면 주변 기압이 높아져 압축된다.', '공기가 하강하면 팽창하여 기온이 낮아진다.', '단열 변화는 외부와 열을 주고받으면서 일어나는 변화이다.', '상승하는 공기는 팽창하면서 기온이 높아진다.', '하강하는 공기는 압축되면서 기온이 높아진다.'], conceptIds: ['atm.adiabatic'] },
  { code: 'E05', title: '상승 응결 고도', topic: 'adiabatic', type: 'multiple_choice', difficulty: '중', question: '지표에서 기온이 26℃, 이슬점이 18℃인 불포화 공기 덩어리가 상승하고 있다.\n건조 단열 감률은 10℃/km, 이슬점 감률은 2℃/km일 때, 구름이 생성되기 시작하는 높이는?', options: ['0.5km', '0.7km', '1.0km', '1.5km', '2.0km'], conceptIds: ['atm.lcl'] },
  { code: 'E06', title: '상승하는 공기의 기온', topic: 'adiabatic', type: 'multiple_choice', difficulty: '중', question: '지표에서 기온이 25℃인 공기 덩어리가 상승한다.\n이 공기는 1km 고도에서 포화 상태에 도달한 뒤 계속 상승하였다.\n건조 단열 감률이 10℃/km, 습윤 단열 감률이 5℃/km일 때, 고도 3km에서 공기 덩어리의 기온은?', options: ['0℃', '5℃', '10℃', '15℃', '20℃'], conceptIds: ['atm.adiabatic', 'atm.lcl'] },
  { code: 'E07', title: '습윤 단열 감률', topic: 'adiabatic', type: 'multiple_choice', difficulty: '중', question: '습윤 단열 감률이 건조 단열 감률보다 작은 주된 이유는?', options: ['포화 공기는 중력의 영향을 받지 않기 때문이다.', '포화 공기는 팽창하지 않기 때문이다.', '수증기가 태양 복사에너지를 흡수하기 때문이다.', '수증기가 응결하면서 잠열을 방출하기 때문이다.', '포화 공기는 주변 기압이 일정하기 때문이다.'], conceptIds: ['atm.adiabatic'] },
  { code: 'E08', title: '대기 안정도 판별', topic: 'adiabatic', type: 'multiple_choice', difficulty: '상', question: '다음은 세 지역의 기온 감률을 나타낸 자료이다.\n건조 단열 감률은 10℃/km, 습윤 단열 감률은 5℃/km라고 할 때, 세 지역의 대기 안정도를 올바르게 연결한 것은?', material: ['지역 A: 환경 기온 감률 3℃/km', '지역 B: 환경 기온 감률 7℃/km', '지역 C: 환경 기온 감률 12℃/km'], options: ['A 절대 불안정 / B 조건부 불안정 / C 절대 안정', 'A 절대 안정 / B 조건부 불안정 / C 절대 불안정', 'A 조건부 불안정 / B 절대 안정 / C 절대 불안정', 'A 절대 안정 / B 절대 불안정 / C 조건부 불안정', 'A 절대 불안정 / B 절대 안정 / C 조건부 불안정'], conceptIds: ['atm.stability'] },
  { code: 'E09', title: '공기 덩어리의 운동', topic: 'adiabatic', type: 'multiple_choice', difficulty: '상', question: '지표의 기온이 30℃인 지역에서 환경 기온 감률이 6℃/km로 일정하다.\n지표에서 기온이 30℃인 불포화 공기 덩어리를 강제로 1km 상승시켰다.\n상승 후 공기 덩어리의 운동에 대한 설명으로 가장 적절한 것은?\n단, 수증기의 응결은 일어나지 않는다.', options: ['주변보다 기온이 높아 계속 상승한다.', '주변과 기온이 같아 중립 상태가 된다.', '주변보다 기온이 높아 다시 하강한다.', '주변보다 기온이 낮아 원래 위치로 돌아가려는 경향이 있다.', '공기 덩어리의 기온은 변하지 않으므로 상승을 유지한다.'], conceptIds: ['atm.stability'] },
  { code: 'E10', title: '푄 현상', topic: 'adiabatic', type: 'multiple_choice', difficulty: '중', question: '다음 중 푄 현상이 발생하는 과정을 가장 적절하게 설명한 것은?', options: ['공기가 산을 오르면서 압축되어 기온이 높아진다.', '산을 오르는 공기는 항상 건조 단열 감률로만 냉각된다.', '공기가 산을 넘을 때 반드시 강수가 발생하지 않아야 한다.', '공기는 산을 넘은 후 하강하면서 팽창하여 기온이 낮아진다.', '산의 풍상측에서 응결과 강수가 발생한 후, 풍하측으로 하강한 공기가 따뜻하고 건조해질 수 있다.'], conceptIds: ['atm.lcl'] },
  { code: 'E11', title: '구름 생성과 강수', topic: 'precip', type: 'multiple_choice', difficulty: '중', question: '구름의 생성과 강수 과정에 대한 설명으로 옳은 것만을 보기에서 고른 것은?', statements: ['상승하는 공기 덩어리가 포화 상태에 도달하면 구름이 형성될 수 있다.', '빙정 과정에서는 얼음 결정이 성장하여 강수 입자가 형성된다.', '병합 과정은 반드시 얼음 결정이 존재해야 일어난다.'], options: ['ㄱ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['atm.precip', 'atm.lcl'] },
  { code: 'E12', title: '빙정 과정과 병합 과정', topic: 'precip', type: 'multiple_choice', difficulty: '중', question: '고위도 지역과 저위도 지역의 대표적인 강수 형성 과정에 대한 설명으로 옳은 것은?', options: ['고위도에서는 주로 빙정 과정이, 저위도에서는 주로 병합 과정이 중요하다.', '고위도에서는 항상 액체 물방울만 존재한다.', '저위도에서는 얼음 결정이 존재하지 않아야만 강수가 발생한다.', '병합 과정에서는 물방울의 크기가 계속 작아진다.', '빙정 과정과 병합 과정 모두 수증기의 응결 없이 진행된다.'], conceptIds: ['atm.precip'] },
  { code: 'E13', title: '기압 경도력의 크기', topic: 'forces', type: 'multiple_choice', difficulty: '상', question: '다음은 다섯 지역에서 같은 고도의 두 지점 사이 기압 차와 거리를 나타낸 자료이다.\n공기의 밀도가 동일할 때, 기압 경도력이 가장 크게 작용하는 지역은?', material: ['A: 기압 차 4hPa / 거리 100km', 'B: 기압 차 4hPa / 거리 50km', 'C: 기압 차 2hPa / 거리 100km', 'D: 기압 차 6hPa / 거리 150km', 'E: 기압 차 3hPa / 거리 100km'], options: ['A', 'B', 'C', 'D', 'E'], conceptIds: ['atm.forces'] },
  { code: 'E14', title: '정역학 평형', topic: 'forces', type: 'multiple_choice', difficulty: '중', question: '정역학 평형 상태에 대한 설명으로 가장 적절한 것은?', options: ['기압 경도력과 전향력이 평형을 이루는 상태이다.', '중력과 마찰력이 평형을 이루는 상태이다.', '연직 기압 경도력과 중력이 평형을 이루는 상태이다.', '수평 기압 경도력과 마찰력이 평형을 이루는 상태이다.', '모든 힘이 사라져 공기의 운동이 불가능해지는 상태이다.'], conceptIds: ['atm.forces'] },
  { code: 'E15', title: '전향력의 방향', topic: 'forces', type: 'multiple_choice', difficulty: '하', question: '북반구에서 운동하는 공기 덩어리에 작용하는 전향력에 대한 설명으로 옳은 것은?', options: ['공기의 운동 방향에 대해 오른쪽 직각 방향으로 작용한다.', '공기의 운동 방향에 대해 왼쪽 직각 방향으로 작용한다.', '항상 고기압 중심을 향한다.', '항상 저기압 중심을 향한다.', '공기의 운동 방향과 반대 방향으로 작용한다.'], conceptIds: ['atm.forces'] },
  { code: 'E16', title: '지균풍의 방향', topic: 'winds', type: 'multiple_choice', difficulty: '상', question: '북반구의 상층 대기에서 동서 방향으로 나란한 직선 등압선이 형성되어 있다.\n북쪽은 저기압, 남쪽은 고기압이며, 기압 경도력과 전향력이 평형을 이루고 있다.\n이때 바람의 방향으로 옳은 것은?', diagram: { fig: 'quiz-geo-wind', caption: '북쪽(위)이 저기압, 남쪽(아래)이 고기압인 직선 등압선' }, options: ['북쪽', '남쪽', '서쪽', '북서쪽', '동쪽'], conceptIds: ['atm.geo-wind'] },
  { code: 'E17', title: '지균풍의 특징', topic: 'winds', type: 'multiple_choice', difficulty: '중', question: '지균풍에 대한 설명으로 옳은 것은?', options: ['지표면의 마찰력이 가장 크게 작용할 때 나타난다.', '기압 경도력과 중력이 평형을 이룬다.', '바람은 항상 저기압 중심으로 이동한다.', '기압 경도력과 전향력이 평형을 이룬다.', '등압선에 수직인 방향으로 바람이 분다.'], conceptIds: ['atm.geo-wind'] },
  { code: 'E18', title: '지표면 부근의 바람', topic: 'winds', type: 'multiple_choice', difficulty: '중', question: '지표 부근의 바람이 상층의 지균풍과 다르게 나타나는 가장 중요한 원인은?', options: ['중력이 사라지기 때문이다.', '기압 경도력이 사라지기 때문이다.', '마찰력으로 인해 풍속이 감소하고 전향력도 약해지기 때문이다.', '전향력이 항상 기압 경도력보다 커지기 때문이다.', '지표면에서는 공기에 작용하는 힘이 없어지기 때문이다.'], conceptIds: ['atm.surface-wind'] },
  { code: 'E19', title: '고기압과 저기압의 바람', topic: 'winds', type: 'multiple_choice', difficulty: '중', question: '북반구의 지표면에서 저기압과 고기압 주변 공기의 운동에 대한 설명으로 옳은 것은?', options: ['저기압 주변에서는 반시계 방향으로 바람이 불어 들어와 공기가 수렴한다.', '저기압 주변에서는 시계 방향으로 공기가 발산한다.', '고기압 주변에서는 반시계 방향으로 공기가 수렴한다.', '저기압과 고기압 모두 중심에서 공기가 상승한다.', '지표면의 바람은 마찰력과 관계없이 항상 등압선에 평행하다.'], conceptIds: ['atm.surface-wind', 'atm.gradient-wind'] },
  { code: 'E20', title: '대기 대순환', topic: 'winds', type: 'multiple_choice', difficulty: '상', question: '지구의 대기 대순환에 대한 설명으로 옳은 것만을 보기에서 고른 것은?', statements: ['지구의 자전으로 인해 각 반구에는 대표적으로 세 개의 순환 세포가 나타난다.', '적도 부근에서는 강한 가열로 공기가 주로 상승한다.', '위도 30° 부근에서는 공기가 주로 상승하여 저기압대가 형성된다.', '위도 60° 부근에서는 서로 다른 공기 덩어리가 만나 상승 운동이 나타날 수 있다.'], options: ['ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄹ', 'ㄱ, ㄴ, ㄷ, ㄹ'], conceptIds: ['atm.circulation'] },
  // B-2. 서술형
  { code: 'E21', title: '상승 응결 고도 및 기온 계산', topic: 'adiabatic', type: 'essay', difficulty: '중', points: 3, question: '지표면의 기온이 28℃, 이슬점이 12℃인 불포화 공기 덩어리가 상승하고 있다.\n건조 단열 감률은 10℃/km, 습윤 단열 감률은 5℃/km, 이슬점 감률은 2℃/km로 일정하다.\n(1) 상승 응결 고도를 구하시오.\n(2) 고도 3km에서 공기 덩어리의 기온을 구하시오.\n(3) 각 계산 과정을 서술하시오.', conceptIds: ['atm.lcl', 'atm.adiabatic'] },
  { code: 'E22', title: '대기 안정도 판별', topic: 'adiabatic', type: 'essay', difficulty: '상', points: 4, question: '다음은 세 지역의 환경 기온 감률이다.\n건조 단열 감률은 10℃/km, 습윤 단열 감률은 5℃/km이다.\n(1) 세 지역의 대기 안정도를 각각 분류하시오.\n(2) B 지역에서 불포화 공기 덩어리와 포화 공기 덩어리의 상승 경향이 서로 다른 이유를 설명하시오.', material: ['A: 4℃/km', 'B: 8℃/km', 'C: 11℃/km'], conceptIds: ['atm.stability'] },
  { code: 'E23', title: '푄 현상 계산', topic: 'adiabatic', type: 'essay', difficulty: '상', points: 4, question: '높이 3km인 산의 풍상측 지표면에서 기온이 25℃, 이슬점이 9℃인 공기 덩어리가 산을 넘어간다.\n공기는 상승 응결 고도까지 건조 단열 감률로 냉각되고, 그 이후에는 습윤 단열 감률로 냉각된다.\n산 정상에서 풍하측 지표면까지 하강할 때는 건조 단열 감률로 가열된다.\n단, 건조 단열 감률은 10℃/km, 습윤 단열 감률은 5℃/km, 이슬점 감률은 2℃/km이다.\n(1) 상승 응결 고도를 구하시오.\n(2) 산 정상에서의 기온을 구하시오.\n(3) 풍하측 지표면에 도달했을 때의 기온을 구하시오.\n(4) 풍하측 공기가 처음보다 따뜻해지는 이유를 단열 변화와 잠열을 이용하여 설명하시오.', conceptIds: ['atm.lcl', 'atm.adiabatic'] },
  { code: 'E24', title: '지균풍과 지상풍의 비교', topic: 'winds', type: 'essay', difficulty: '상', points: 4, question: '북반구의 상층과 지표면 부근에서 나타나는 바람의 차이를 설명하시오.\n답안에는 반드시 다음 개념을 모두 포함하시오.\n· 기압 경도력  · 전향력  · 마찰력  · 등압선과 바람의 방향', conceptIds: ['atm.geo-wind', 'atm.surface-wind'] },
  { code: 'E25', title: '대기 대순환과 편서풍 파동', topic: 'winds', type: 'essay', difficulty: '상', points: 5, question: '다음은 대기 대순환과 편서풍 파동에 관한 문제이다.\n(1) 적도, 위도 30°, 위도 60° 부근에서 나타나는 대표적인 공기의 연직 운동 방향을 각각 쓰시오.\n(2) 위도 30° 부근에 고기압대가 형성되는 이유를 대기 대순환과 관련지어 설명하시오.\n(3) 중위도 상공의 편서풍이 남북 방향으로 크게 굽이치는 편서풍 파동이 발생하면 고위도의 찬 공기와 저위도의 따뜻한 공기는 각각 어느 방향으로 이동할 수 있는지 설명하시오.', conceptIds: ['atm.circulation', 'atm.westerly'] },
], 4)
