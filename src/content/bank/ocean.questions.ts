import type { BankQuestion, BankTopic } from './types'

/**
 * Ⅱ. 해수의 운동과 순환 — 문제은행(문제만, 정답은 ocean.answers.ts)
 * 개념 확인 C01~C25(문항당 4점, 100점) / 내신 대비 E01~E20 객관식(4점) + E21~E25 서술형(4점)
 */
export const OCEAN_TOPICS: BankTopic[] = [
  { id: 'forces', chapterIds: ['ocean-01'], label: '해수를 움직이는 힘', conceptIds: ['ocean.pressure', 'ocean.pgf', 'ocean.coriolis'] },
  { id: 'ekman-geo', chapterIds: ['ocean-02'], label: '에크만 수송과 지형류', conceptIds: ['ocean.ekman', 'ocean.geostrophic', 'ocean.upwelling'] },
  { id: 'waves', chapterIds: ['ocean-03'], label: '해파', conceptIds: ['ocean.wave-structure', 'ocean.wave-particle', 'ocean.wave-types', 'ocean.shoaling'] },
  { id: 'surge', chapterIds: ['ocean-04'], label: '해일', conceptIds: ['ocean.storm-surge', 'ocean.tsunami'] },
  { id: 'tide', chapterIds: ['ocean-05'], label: '조석과 기조력', conceptIds: ['ocean.tide-force', 'ocean.tide-day'] },
]

type Q = Omit<BankQuestion, 'id' | 'unitId' | 'set' | 'number' | 'points'> & { points?: number }
const make = (set: 'concept' | 'exam', list: Q[]): BankQuestion[] =>
  list.map((q, i) => ({ ...q, id: `ocean-${q.code}`, unitId: 'ocean', set, number: i + 1, points: q.points ?? 4 }))


export const OCEAN_CONCEPT: BankQuestion[] = make('concept', [
  // A-1. 해수를 움직이는 힘
  { code: 'C01', topic: 'forces', type: 'blank', difficulty: '하', question: '해수는 깊이가 깊어질수록 수압이 (      ).', conceptIds: ['ocean.pressure'] },
  { code: 'C02', topic: 'forces', type: 'blank', difficulty: '하', question: '정역학 평형에서 연직 수압 경도력은 (      )과 평형을 이룬다.', conceptIds: ['ocean.pressure'] },
  { code: 'C03', topic: 'forces', type: 'blank', difficulty: '하', question: '수평 수압 경도력이 발생하는 원인 두 가지는 해수면의 (      ) 차이와 해수의 (      ) 차이이다.', blanks: ['첫 번째', '두 번째'], conceptIds: ['ocean.pgf'] },
  { code: 'C04', topic: 'forces', type: 'ox', difficulty: '하', question: '전향력은 지구의 자전에 의해 나타나는 가상의 힘이다.', conceptIds: ['ocean.coriolis'] },
  { code: 'C05', topic: 'forces', type: 'multiple_choice', difficulty: '하', question: '북반구에서 운동하는 해수에 작용하는 전향력의 방향은?', options: ['진행 방향의 왼쪽', '진행 방향의 오른쪽', '항상 북쪽', '항상 남쪽'], conceptIds: ['ocean.coriolis'] },
  // A-2. 에크만 수송과 지형류
  { code: 'C06', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '중', question: '북반구에서 표층 해수는 바람 방향의 오른쪽으로 대략 몇 도 이동하는가?\n(이상화한 에크만 모형 기준)', options: ['0°', '45°', '90°', '180°'], conceptIds: ['ocean.ekman'] },
  { code: 'C07', topic: 'ekman-geo', type: 'blank', difficulty: '중', question: '북반구에서 전체 에크만 수송 방향은 바람 방향의 오른쪽 (      )°이다.', unitHint: '숫자만 입력해도 됩니다.', conceptIds: ['ocean.ekman'] },
  { code: 'C08', topic: 'ekman-geo', type: 'ox', difficulty: '중', question: '에크만층에서는 깊어질수록 해수의 이동 속력이 감소하고 이동 방향도 달라진다.', conceptIds: ['ocean.ekman'] },
  { code: 'C09', topic: 'ekman-geo', type: 'blank', difficulty: '하', question: '수평 수압 경도력과 전향력이 평형을 이루면서 흐르는 해류를 (      )라고 한다.', conceptIds: ['ocean.geostrophic'] },
  { code: 'C10', topic: 'ekman-geo', type: 'ox', difficulty: '중', question: '지형류는 수압 경도력과 전향력이 같은 방향으로 작용하여 만들어진다.', conceptIds: ['ocean.geostrophic'] },
  // A-3. 해파
  { code: 'C11', topic: 'waves', type: 'blank', difficulty: '하', question: '파랑에서 연속한 두 마루 사이의 수평거리를 (      )이라고 한다.', conceptIds: ['ocean.wave-structure'] },
  { code: 'C12', topic: 'waves', type: 'blank', difficulty: '하', question: '파랑에서 마루와 골 사이의 연직 높이 차이를 (      )라고 한다.', conceptIds: ['ocean.wave-structure'] },
  { code: 'C13', topic: 'waves', type: 'multiple_choice', difficulty: '하', question: '파랑의 속력을 구하는 올바른 식은?', options: ['파장 × 주기', '파장 ÷ 주기', '주기 ÷ 파장', '파고 ÷ 주기'], conceptIds: ['ocean.wave-structure'] },
  { code: 'C14', topic: 'waves', type: 'blank', difficulty: '중', question: '바람이 직접 부는 해역에서 발생하는 불규칙한 파랑을 (      ), 발생 해역을 벗어나 전파되는 비교적 규칙적인 파랑을 (      )이라고 한다.', blanks: ['첫 번째', '두 번째'], conceptIds: ['ocean.shoaling'] },
  { code: 'C15', topic: 'waves', type: 'multiple_choice', difficulty: '중', question: '천해파의 속력을 결정하는 가장 중요한 요인은?', options: ['풍향', '수심', '염분', '해수의 색'], conceptIds: ['ocean.wave-types'] },
  // A-4. 해일
  { code: 'C16', topic: 'surge', type: 'blank', difficulty: '하', question: '태풍의 강풍과 낮은 기압으로 해수면이 비정상적으로 높아지는 현상을 (      )이라고 한다.', conceptIds: ['ocean.storm-surge'] },
  { code: 'C17', topic: 'surge', type: 'ox', difficulty: '하', question: '기압이 낮아지면 해수면이 높아지는 경향이 있다.', conceptIds: ['ocean.storm-surge'] },
  { code: 'C18', topic: 'surge', type: 'blank', difficulty: '하', question: '해저 지진 등에 의해 발생하는 파장이 매우 긴 해일을 (      )라고 한다.', conceptIds: ['ocean.tsunami'] },
  { code: 'C19', topic: 'surge', type: 'ox', difficulty: '중', question: '지진 해일은 수심이 얕은 연안으로 접근할 때 속력이 빨라진다.', conceptIds: ['ocean.tsunami'] },
  { code: 'C20', topic: 'surge', type: 'multiple_choice', difficulty: '중', question: '지진 해일의 특징으로 가장 적절한 것은?', options: ['파장이 매우 짧다.', '해안에 접근하면 반드시 소멸한다.', '파장이 매우 길다.', '깊은 바다에서는 항상 파고가 가장 높다.'], conceptIds: ['ocean.tsunami'] },
  // A-5. 조석과 기조력
  { code: 'C21', topic: 'tide', type: 'blank', difficulty: '하', question: '해수면의 높이가 주기적으로 높아지고 낮아지는 현상을 (      )이라고 한다.', conceptIds: ['ocean.tide-day'] },
  { code: 'C22', topic: 'tide', type: 'blank', difficulty: '하', question: '만조 때의 해수면 높이와 간조 때의 해수면 높이의 차이를 (      )라고 한다.', conceptIds: ['ocean.tide-day'] },
  { code: 'C23', topic: 'tide', type: 'multiple_choice', difficulty: '중', question: '일반적으로 조차가 가장 커지는 시기는?', options: ['사리(대조)', '조금(소조)', '상현 무렵', '하현 무렵'], conceptIds: ['ocean.tide-force'] },
  { code: 'C24', topic: 'tide', type: 'blank', difficulty: '하', question: '조석을 일으키는 힘을 (      )이라고 한다.', conceptIds: ['ocean.tide-force'] },
  { code: 'C25', topic: 'tide', type: 'ox', difficulty: '중', question: '반일주조가 우세한 지역에서 연속한 두 만조의 평균 시간 간격은 약 12시간 25분이다.', conceptIds: ['ocean.tide-day'] },
])

export const OCEAN_EXAM: BankQuestion[] = make('exam', [
  { code: 'E01', title: '수압과 정역학 평형', topic: 'forces', type: 'multiple_choice', difficulty: '하', question: '깊이에 따른 수압과 정역학 평형에 대한 설명으로 옳은 것은?', options: ['해수의 깊이가 깊어질수록 수압은 감소한다.', '정역학 평형 상태에서는 중력이 작용하지 않는다.', '연직 수압 경도력은 위쪽을 향하며 중력과 평형을 이룬다.', '수압은 해수의 밀도와 관계없이 항상 일정하다.', '정역학 평형에서는 수평 수압 경도력과 중력이 평형을 이룬다.'], conceptIds: ['ocean.pressure'] },
  { code: 'E02', title: '수평 수압 경도력', topic: 'forces', type: 'multiple_choice', difficulty: '하', question: '수평 수압 경도력이 발생하는 원인으로 적절한 것만을 고른 것은?', statements: ['해수면 높이의 차이', '해수의 밀도 차이', '지구의 자전'], options: ['ㄱ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['ocean.pgf'] },
  { code: 'E03', title: '전향력', topic: 'forces', type: 'multiple_choice', difficulty: '하', question: '전향력에 대한 설명으로 옳지 않은 것은?', options: ['지구의 자전과 관계있다.', '북반구에서 움직이는 물체는 진행 방향의 오른쪽으로 편향된다.', '남반구에서는 진행 방향의 왼쪽으로 편향된다.', '전향력의 효과는 적도에서 최대이고 극으로 갈수록 작아진다.', '운동하는 물체의 속력이 클수록 전향력의 크기가 커질 수 있다.'], conceptIds: ['ocean.coriolis'] },
  { code: 'E04', title: '전향력 방향', topic: 'forces', type: 'multiple_choice', difficulty: '중', question: '북반구에서 해수가 정북쪽으로 이동하고 있다. 이 해수에 작용하는 전향력의 방향은?', options: ['동쪽', '서쪽', '북쪽', '남쪽', '연직 위쪽'], conceptIds: ['ocean.coriolis'] },
  { code: 'E05', title: '에크만 나선', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '중', question: '북반구에서 일정한 바람이 지속적으로 불 때 나타나는 에크만 나선에 대한 설명으로 가장 적절한 것은?', options: ['표층 해수는 항상 바람과 정확히 같은 방향으로 흐른다.', '수심이 깊어질수록 해수의 유속은 증가한다.', '수심이 깊어져도 해수의 이동 방향은 변하지 않는다.', '마찰이 없는 경우에만 에크만 나선이 나타난다.', '깊어질수록 유속이 감소하고 흐름의 방향도 점차 변한다.'], conceptIds: ['ocean.ekman'] },
  { code: 'E06', title: '에크만 수송', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '중', question: '이상화한 에크만 모형에서 북반구의 바람이 정동쪽으로 분다. 표층 해수의 이동 방향과 에크만 수송 방향을 올바르게 연결한 것은?', options: ['표층: 동쪽 / 수송: 동쪽', '표층: 북동쪽 / 수송: 북쪽', '표층: 남동쪽 / 수송: 남쪽', '표층: 남서쪽 / 수송: 서쪽', '표층: 북서쪽 / 수송: 북쪽'], conceptIds: ['ocean.ekman'] },
  { code: 'E07', title: '지형류', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '중', question: '마찰을 무시할 수 있는 정상적인 지형류의 주된 힘의 평형은?', options: ['중력과 부력', '전향력과 마찰력', '중력과 원심력', '수평 수압 경도력과 전향력', '수직 수압 경도력과 마찰력'], conceptIds: ['ocean.geostrophic'] },
  { code: 'E08', title: '지형류 방향', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '상', question: '북반구에서 지형류가 정북쪽으로 흐르고 있다. 해수면의 높이가 상대적으로 높은 쪽은 어느 방향인가?\n(마찰 무시)', options: ['북쪽', '동쪽', '남쪽', '서쪽', '높이 차이가 없다.'], conceptIds: ['ocean.geostrophic', 'ocean.coriolis'] },
  { code: 'E09', title: '파랑의 기본 요소', topic: 'waves', type: 'multiple_choice', difficulty: '하', question: '파랑에 대한 설명으로 옳은 것은?', options: ['파고는 연속된 두 마루 사이의 수평거리이다.', '파장은 마루에서 골까지의 연직거리이다.', '주기는 파랑이 1초 동안 진행한 거리이다.', '파랑은 항상 물 입자를 파의 진행 방향으로 운반한다.', '파장은 연속한 두 마루 사이의 거리이며 파고는 마루와 골 사이의 높이 차이다.'], conceptIds: ['ocean.wave-structure', 'ocean.wave-particle'] },
  { code: 'E10', title: '파랑 계산', topic: 'waves', type: 'multiple_choice', difficulty: '중', question: '어떤 파랑의 파장이 120m, 주기가 8초일 때 파랑의 속력은?', options: ['8m/s', '12m/s', '15m/s', '60m/s', '960m/s'], conceptIds: ['ocean.wave-structure'] },
  { code: 'E11', title: '파랑의 종류', topic: 'waves', type: 'multiple_choice', difficulty: '중', question: '풍랑, 너울, 연안 쇄파에 대한 설명으로 옳지 않은 것은?', options: ['풍랑은 바람이 직접 작용하는 해역에서 형성된다.', '너울은 발생 해역을 벗어나 전파될 수 있다.', '너울은 일반적으로 풍랑보다 규칙적이고 파장이 길다.', '파랑이 얕은 연안으로 이동하면 진행 속력이 감소할 수 있다.', '파랑은 연안에 가까워질수록 반드시 파장이 길어지고 파고가 낮아진다.'], conceptIds: ['ocean.shoaling'] },
  { code: 'E12', title: '심해파와 천해파', topic: 'waves', type: 'multiple_choice', difficulty: '중', question: '심해파와 천해파의 특징을 비교한 것으로 옳은 것은?', options: ['심해파의 속력은 주로 수심만으로 결정된다.', '천해파의 속력은 주로 수심에 의해 결정된다.', '천해파에서는 물 입자가 해저의 영향을 받지 않는다.', '심해파에서는 수심이 얕아질수록 속력이 반드시 증가한다.', '심해파와 천해파는 물 입자의 운동 형태가 항상 같다.'], conceptIds: ['ocean.wave-types'] },
  { code: 'E13', title: '파랑의 굴절', topic: 'waves', type: 'multiple_choice', difficulty: '상', question: '파랑이 해안선에 비스듬하게 접근하며 얕은 수역으로 진입할 때 나타날 현상으로 가장 적절한 것은?', options: ['먼저 얕은 곳에 도달한 부분의 속력이 감소하여 파봉선이 해안선과 나란해지는 방향으로 회전한다.', '먼저 얕은 곳에 도달한 부분의 속력이 증가한다.', '파랑의 주기는 해안에 가까워질수록 반드시 감소한다.', '수심과 관계없이 파랑의 진행 방향은 일정하다.', '파랑이 굴절하면 에너지는 모두 소멸한다.'], conceptIds: ['ocean.shoaling'] },
  { code: 'E14', title: '해일', topic: 'surge', type: 'multiple_choice', difficulty: '중', question: '폭풍 해일과 지진 해일에 대한 설명으로 옳은 것만을 고른 것은?', statements: ['폭풍 해일은 강한 바람과 낮은 기압에 의해 발생할 수 있다.', '지진 해일은 파장이 매우 길어 깊은 바다에서도 천해파로 전파될 수 있다.', '지진 해일은 해안에 접근할수록 반드시 속력이 증가한다.'], options: ['ㄱ', 'ㄴ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'], conceptIds: ['ocean.storm-surge', 'ocean.tsunami'] },
  { code: 'E15', title: '조석과 기조력', topic: 'tide', type: 'multiple_choice', difficulty: '중', question: '조석에 대한 설명으로 옳지 않은 것은?', options: ['조석은 해수면 높이의 주기적 변화이다.', '기조력은 달과 태양의 위치와 관련이 있다.', '달의 인력은 지구 전체에 균일하게 작용하지 않는다.', '조석을 일으키는 기조력은 달의 인력만으로 설명하며 지구-달 계의 운동은 고려하지 않는다.', '지역에 따라 실제 조차와 만조 시각이 달라질 수 있다.'], conceptIds: ['ocean.tide-force'] },
  { code: 'E16', title: '사리와 조금', topic: 'tide', type: 'multiple_choice', difficulty: '중', question: '달과 태양의 위치에 따른 조차의 변화에 대한 설명으로 옳은 것은?', options: ['상현과 하현에는 일반적으로 사리가 나타난다.', '삭과 망 무렵에는 일반적으로 사리가 나타난다.', '사리는 조차가 가장 작아지는 시기이다.', '태양은 조석에 아무런 영향을 주지 않는다.', '사리와 조금은 반드시 하루 간격으로 반복된다.'], conceptIds: ['ocean.tide-force'] },
  { code: 'E17', title: '조석 주기', topic: 'tide', type: 'multiple_choice', difficulty: '상', question: '어떤 지역에서 반일주조가 우세하며 오늘 오전 6시에 만조가 나타났다. 다음 날의 비슷한 만조 시각으로 가장 적절한 것은?\n(달의 일주기를 약 24시간 50분으로 가정)', options: ['오전 5시 10분', '오전 6시 정각', '오전 6시 25분', '오전 6시 50분', '오전 7시 40분'], conceptIds: ['ocean.tide-day'] },
  { code: 'E18', title: '연안 용승', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '상', question: '북반구의 남북 방향 해안에서 육지는 동쪽, 바다는 서쪽에 있다. 해안을 따라 남쪽으로 지속적인 바람이 불 경우 예상되는 현상은?\n(이상화한 에크만 수송 가정)', options: ['표층 해수는 동쪽으로 수송되어 침강이 발생한다.', '표층 해수는 북쪽으로 수송되어 침강이 발생한다.', '표층 해수는 서쪽으로 수송되어 연안 용승이 발생한다.', '에크만 수송은 바람과 같은 방향으로 발생한다.', '전향력이 작용하지 않으므로 용승이 불가능하다.'], conceptIds: ['ocean.upwelling', 'ocean.ekman'] },
  { code: 'E19', title: '종합 개념', topic: 'forces', type: 'multiple_choice', difficulty: '상', question: '다음 설명 중 옳은 것만을 고른 것은?', statements: ['정역학 평형에서는 연직 수압 경도력과 중력이 평형을 이룬다.', '지형류는 수평 수압 경도력과 전향력의 평형으로 설명할 수 있다.', '에크만 수송은 마찰이 전혀 없는 심층에서만 나타난다.', '북반구의 전향력은 운동 방향의 오른쪽으로 작용한다.'], options: ['ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄴ, ㄹ', 'ㄱ, ㄴ, ㄹ'], conceptIds: ['ocean.pressure', 'ocean.geostrophic', 'ocean.ekman', 'ocean.coriolis'] },
  { code: 'E20', title: '천해파 계산', topic: 'waves', type: 'multiple_choice', difficulty: '상', question: '천해파의 속력이 수심의 제곱근에 비례한다고 할 때, 수심 100m인 곳에서 속력이 v였다. 수심 25m인 곳에서 속력은?\n(다른 조건은 동일)', options: ['v/4', 'v/2', 'v', '2v', '4v'], conceptIds: ['ocean.wave-types', 'ocean.tsunami'] },
  // B-2. 서술형
  { code: 'E21', title: '해수를 움직이는 힘', topic: 'forces', type: 'multiple_choice', difficulty: '중', question: "수평 수압 경도력과 전향력에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?", statements: ["해수면의 높이 차이로 수평 수압 경도력이 발생할 수 있다.", "해수의 밀도 차이로 수평 수압 경도력이 발생할 수 있다.", "전향력은 수평 방향의 압력 차이에 의해 실제로 작용하는 힘이다."], options: ["ㄱ", "ㄷ", "ㄱ, ㄴ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"], conceptIds: ["ocean.pgf", "ocean.coriolis"] },
  { code: 'E22', title: '에크만 수송과 지형류', topic: 'ekman-geo', type: 'multiple_choice', difficulty: '상', question: "북반구에서 바람이 정북쪽으로 불 때에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?", statements: ["표층 해수는 대략 북동쪽(풍향의 오른쪽 약 45°)으로 이동한다.", "에크만 수송 방향은 서쪽이다.", "지형류는 수평 수압 경도력과 전향력이 평형을 이루며 흐르는 해류이다."], options: ["ㄱ", "ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"], conceptIds: ["ocean.ekman", "ocean.geostrophic"] },
  { code: 'E23', title: '파랑과 지진 해일', topic: 'surge', type: 'multiple_choice', difficulty: '중', question: "지진 해일이 깊은 바다에서 연안으로 접근할 때 나타나는 변화로 옳은 것은?", options: ["속력 증가, 파장 증가, 파고 감소", "속력 감소, 파장 증가, 파고 증가", "속력 감소, 파장 감소, 파고 증가", "속력 증가, 파장 감소, 파고 증가", "속력·파장·파고 모두 변하지 않는다"], conceptIds: ["ocean.tsunami", "ocean.shoaling"] },
  { code: 'E24', title: '조석과 기조력', topic: 'tide', type: 'multiple_choice', difficulty: '상', question: "달에 가까운 지구 쪽과 달에서 먼 지구 쪽 모두에서 해수면이 부풀어 오르는 까닭으로 가장 적절한 것은?", options: ["달에 가까운 쪽만 달의 인력을 받기 때문이다.", "가까운 쪽은 달의 인력이 지구 중심보다 크고, 먼 쪽은 지구 중심보다 작아 각각 해수가 상대적으로 바깥쪽으로 밀려나기 때문이다.", "지구 자전에 의한 전향력이 양쪽 해수를 밀어 올리기 때문이다.", "태양의 인력이 달 반대쪽 해수를 끌어당기기 때문이다.", "달에서 먼 쪽의 해수 밀도가 커지기 때문이다."], conceptIds: ["ocean.tide-force"] },
  { code: 'E25', title: '조석 자료 해석', topic: 'tide', type: 'multiple_choice', difficulty: '중', question: "어떤 지역에서 6일에는 조차가 1.2m, 13일에는 4.6m로 관측되었다. 사리에 가까운 날짜와 그때 천체의 배열을 옳게 짝지은 것은?", options: ["6일 — 태양·지구·달이 직각으로 배열", "6일 — 태양·지구·달이 거의 일직선으로 배열", "13일 — 태양·지구·달이 직각으로 배열", "13일 — 태양·지구·달이 거의 일직선으로 배열(삭 또는 망)", "두 날 모두 사리이다"], conceptIds: ["ocean.tide-force", "ocean.tide-day"] },
])
