import type { Question } from '../types'

/**
 * Ⅱ. 해수의 운동과 순환 — 기본 예제·내신 대비 문제
 * ※ 현재 문항은 기능 확인용 데모 문항입니다(demo: true). 준비된 실제 문항으로 교체하세요.
 *   교체 방법: 같은 형식의 객체로 바꾸고 demo를 지우세요. id는 한 번 정하면 바꾸지 마세요(오답 기록이 id에 연결됩니다).
 */
export const OCEAN_QUESTIONS: Question[] = [
  // ───── 기본 예제 ─────
  {
    id: 'ocean-p-01', unitId: 'ocean', set: 'practice', number: 1, type: 'choice', demo: true,
    stem: '북반구의 어느 해역에서 해수면이 서쪽에서 높고 동쪽에서 낮다. 이 해역에서 형성되는 지형류의 방향은?',
    choices: ['동쪽', '서쪽', '남쪽', '북쪽'],
    answer: 2,
    explanation: '수압경도력은 해수면이 높은 서쪽에서 낮은 동쪽으로 작용합니다. 지형류에서는 전향력이 이와 반대인 서쪽으로 작용해야 하고, 북반구에서 전향력은 운동 방향의 오른쪽이므로 오른쪽이 서쪽이 되는 방향, 즉 남쪽으로 흐릅니다.',
    conceptIds: ['ocean.geostrophic', 'ocean.pgf'],
  },
  {
    id: 'ocean-p-02', unitId: 'ocean', set: 'practice', number: 2, type: 'ox', demo: true,
    stem: '표층 해류의 방향과 에크만 수송의 방향은 같다.',
    answer: 'X',
    explanation: '이상적인 모형에서 표층 해류는 바람 방향에서 약 45°, 에크만 수송은 90° 벗어납니다. 에크만 수송은 마찰층 전체 해수의 평균 이동 방향입니다.',
    conceptIds: ['ocean.ekman'],
  },
  {
    id: 'ocean-p-03', unitId: 'ocean', set: 'practice', number: 3, type: 'choice', demo: true,
    stem: '남반구에서 바람이 동쪽으로 계속 불 때, 에크만 수송의 방향은?',
    figure: { thumb: 4, caption: '참고: 북반구에서의 바람(회색), 층별 해류(파랑), 에크만 수송(주황)' },
    choices: ['북쪽', '남쪽', '동쪽', '서쪽'],
    answer: 0,
    explanation: '남반구의 에크만 수송은 바람 방향의 왼쪽 90°입니다. 동쪽을 향해 섰을 때 왼쪽은 북쪽입니다.',
    conceptIds: ['ocean.ekman'],
  },
  {
    id: 'ocean-p-04', unitId: 'ocean', set: 'practice', number: 4, type: 'choice', demo: true,
    stem: '해안을 따라 부는 바람에 의해 표층 해수가 해안 쪽으로 모여들 때 해안에서 일어나는 현상은?',
    choices: ['용승', '침강', '쇄파'],
    answer: 1,
    explanation: '표층수가 해안 쪽으로 수렴하면 해수가 아래로 내려가는 침강이 일어납니다. 표층수가 먼바다로 발산할 때 일어나는 것이 용승입니다.',
    conceptIds: ['ocean.upwelling', 'ocean.ekman'],
  },
  {
    id: 'ocean-p-05', unitId: 'ocean', set: 'practice', number: 5, type: 'short', demo: true,
    stem: '만조와 간조 때 해수면의 높이 차이를 무엇이라고 하는지 쓰시오.',
    answer: '조차', accept: ['조차'],
    explanation: '조차는 만조와 간조의 해수면 높이 차이입니다. 사리 때 크고 조금 때 작습니다.',
    conceptIds: ['ocean.tide-day'],
  },
  {
    id: 'ocean-p-06', unitId: 'ocean', set: 'practice', number: 6, type: 'ox', demo: true,
    stem: '심해파가 진행할 때 물 입자는 파도와 함께 진행 방향으로 계속 이동한다.',
    answer: 'X',
    explanation: '진행하는 것은 파동의 에너지이며, 심해파의 물 입자는 제자리 부근에서 원운동을 합니다.',
    conceptIds: ['ocean.wave-particle'],
  },

  // ───── 내신 대비 ─────
  {
    id: 'ocean-e-01', unitId: 'ocean', set: 'exam', number: 1, type: 'choice', demo: true, points: 4,
    stem: '지형류에 대한 설명으로 옳은 것은?',
    choices: [
      '수압경도력과 같은 방향으로 흐른다.',
      '북반구에서는 해수면이 높은 쪽을 왼쪽에 두고 흐른다.',
      '수압경도력과 전향력이 평형을 이룬 상태에서 흐른다.',
      '전향력이 0인 적도에서 가장 잘 발달한다.',
      '해수면의 경사가 작을수록 유속이 빠르다.',
    ],
    answer: 2,
    explanation: '지형류는 수압경도력과 전향력이 평형을 이룰 때 수압경도력에 수직으로 흐릅니다. 북반구에서는 해수면이 높은 쪽을 오른쪽에 두고 흐르며, 해수면의 경사가 클수록 빠릅니다. 적도에서는 전향력이 0이라 지형류가 형성되지 않습니다.',
    conceptIds: ['ocean.geostrophic', 'ocean.coriolis'],
  },
  {
    id: 'ocean-e-02', unitId: 'ocean', set: 'exam', number: 2, type: 'tf-set', demo: true, points: 4,
    stem: '그림은 북반구의 어느 해안(서쪽이 육지)에서 해안을 따라 남풍이 지속적으로 불 때의 단면을 나타낸 것이다. 이에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?',
    figure: { thumb: 5, caption: '해안 단면(왼쪽 육지, 오른쪽 먼바다)' },
    statements: [
      '에크만 수송은 해안에서 먼바다 쪽으로 향한다.',
      '해안의 표층 수온은 주변 해역보다 높다.',
      '영양염류가 풍부한 해수가 표층으로 공급된다.',
    ],
    choices: ['ㄱ', 'ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'],
    answer: 2,
    explanation: 'ㄱ. 북쪽으로 부는 바람의 오른쪽 90°는 동쪽(먼바다)입니다(옳음). ㄴ. 표층수가 빠져나가 차가운 심층수가 올라오므로 표층 수온은 낮아집니다(틀림). ㄷ. 용승으로 심층의 영양염류가 공급됩니다(옳음).',
    conceptIds: ['ocean.upwelling', 'ocean.ekman'],
  },
  {
    id: 'ocean-e-03', unitId: 'ocean', set: 'exam', number: 3, type: 'choice', demo: true, points: 4,
    stem: '자료를 보고, 지진해일이 수심 4000 m인 해역에서 수심 100 m인 해역으로 진행할 때 속력은 약 몇 배가 되는지 고른 것은?',
    material: '지진해일은 천해파이며, 천해파의 속력은 v = √(gh)이다. (g: 중력 가속도, h: 수심)',
    choices: ['약 40배', '약 6배', '변하지 않는다', '약 1/6배', '약 1/40배'],
    answer: 3,
    explanation: '속력은 수심의 제곱근에 비례하므로 √(100/4000) = √(1/40) ≈ 1/6.3 입니다. 수심이 얕아지면 속력은 약 1/6로 줄어듭니다.',
    conceptIds: ['ocean.tsunami'],
  },
  {
    id: 'ocean-e-04', unitId: 'ocean', set: 'exam', number: 4, type: 'tf-set', demo: true, points: 4,
    stem: '조석에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은?',
    statements: [
      '달이 삭의 위치에 있을 때는 사리가 나타난다.',
      '달이 상현의 위치에 있을 때 조차가 가장 크다.',
      '태양의 기조력은 달의 기조력보다 크다.',
    ],
    choices: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄴ, ㄷ'],
    answer: 0,
    explanation: 'ㄱ. 삭·망에는 태양·지구·달이 일직선이 되어 사리가 나타납니다(옳음). ㄴ. 상현·하현에는 조금이 나타나 조차가 작습니다(틀림). ㄷ. 태양의 기조력은 달의 약 1/2입니다(틀림).',
    conceptIds: ['ocean.tide-force'],
  },
  {
    id: 'ocean-e-05', unitId: 'ocean', set: 'exam', number: 5, type: 'short', demo: true, points: 3,
    stem: '지구의 자전 때문에 지구 위에서 운동하는 물체의 운동 방향이 휘어지는 것처럼 보이게 하는 겉보기 힘을 쓰시오.',
    answer: '전향력', accept: ['전향력', '코리올리 힘', '코리올리힘', '코리올리의 힘'],
    explanation: '전향력은 북반구에서 운동 방향의 오른쪽, 남반구에서 왼쪽으로 작용하는 겉보기 힘입니다.',
    conceptIds: ['ocean.coriolis'],
  },
  {
    id: 'ocean-e-06', unitId: 'ocean', set: 'exam', number: 6, type: 'essay', demo: true, points: 6,
    stem: '해파가 해안으로 다가올 때 파고가 높아지는 까닭을 파속, 파장과 관련지어 서술하시오.',
    answer: '',
    modelAnswer: '해안으로 다가와 수심이 얕아지면 해저면의 영향으로 파속이 느려진다. 주기는 거의 일정하므로 파장이 짧아지고, 파의 에너지가 좁은 구간에 모이면서 파고가 높아진다.',
    rubric: ['수심이 얕아지면 파속이 느려진다', '주기가 일정하여 파장이 짧아진다', '에너지가 좁은 구간에 모여 파고가 높아진다'],
    explanation: '파속 감소 → 파장 감소 → 에너지 집중 → 파고 증가의 인과 관계를 모두 서술해야 합니다.',
    conceptIds: ['ocean.shoaling'],
  },
]
