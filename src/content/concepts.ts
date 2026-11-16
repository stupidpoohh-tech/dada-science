import type { Concept } from './types'

/**
 * 개념 목록: 문제의 conceptIds가 가리키는 대상입니다.
 * blockId는 원문의 {#ID}, popupId는 팝업 ID입니다.
 */
export const CONCEPTS: Concept[] = [
  // Ⅱ. 해수의 운동과 순환
  { id: 'ocean.pressure', unitId: 'ocean', chapterId: 'ocean-01', title: '수압과 정역학 평형', blockId: 'ocean-01-vertical', popupId: 'pressure' },
  { id: 'ocean.pgf', unitId: 'ocean', chapterId: 'ocean-01', title: '수평 수압 경도력', blockId: 'ocean-01-horizontal', popupId: 'pgf' },
  { id: 'ocean.coriolis', unitId: 'ocean', chapterId: 'ocean-01', title: '전향력', blockId: 'ocean-01-coriolis', popupId: 'geostrophic', popupStep: 2 },
  { id: 'ocean.ekman', unitId: 'ocean', chapterId: 'ocean-02', title: '에크만 나선과 에크만 수송', blockId: 'ocean-02-ekman', popupId: 'ekman' },
  { id: 'ocean.upwelling', unitId: 'ocean', chapterId: 'ocean-02', title: '용승과 침강', blockId: 'ocean-02-ekman', popupId: 'upwelling' },
  { id: 'ocean.geostrophic', unitId: 'ocean', chapterId: 'ocean-02', title: '지형류', blockId: 'ocean-02-geostrophic', popupId: 'geostrophic' },
  { id: 'ocean.wave-structure', unitId: 'ocean', chapterId: 'ocean-03', title: '해파의 구조', blockId: 'ocean-03-structure', popupId: 'waves', popupStep: 3 },
  { id: 'ocean.wave-particle', unitId: 'ocean', chapterId: 'ocean-03', title: '물 입자의 운동', blockId: 'ocean-03-structure', popupId: 'waves' },
  { id: 'ocean.wave-types', unitId: 'ocean', chapterId: 'ocean-03', title: '심해파와 천해파', blockId: 'ocean-03-types', popupId: 'waves', popupStep: 4 },
  { id: 'ocean.shoaling', unitId: 'ocean', chapterId: 'ocean-03', title: '연안 쇄파', blockId: 'ocean-03-shape', popupId: 'shoaling' },
  { id: 'ocean.storm-surge', unitId: 'ocean', chapterId: 'ocean-04', title: '폭풍 해일', blockId: 'ocean-04-surge', popupId: 'storm-surge' },
  { id: 'ocean.tsunami', unitId: 'ocean', chapterId: 'ocean-04', title: '지진 해일', blockId: 'ocean-04-surge', popupId: 'tsunami' },
  { id: 'ocean.tide-force', unitId: 'ocean', chapterId: 'ocean-05', title: '기조력과 사리·조금', blockId: 'ocean-05-force', popupId: 'tides' },
  { id: 'ocean.tide-day', unitId: 'ocean', chapterId: 'ocean-05', title: '만조·간조·조차·조류', blockId: 'ocean-05-tide', popupId: 'tide-day' },
  // Ⅲ. 강수 과정과 대기의 운동
  { id: 'atm.absorption', unitId: 'atmosphere', chapterId: 'atmosphere-01', title: '선택적 흡수와 온실 효과', blockId: 'atmosphere-01-composition' },
  { id: 'atm.budget', unitId: 'atmosphere', chapterId: 'atmosphere-02', title: '지구 열수지', blockId: 'atmosphere-02-budget' },
  { id: 'atm.adiabatic', unitId: 'atmosphere', chapterId: 'atmosphere-03', title: '단열 변화와 단열 감률', blockId: 'atmosphere-03-lapse', popupId: 'adiabatic' },
  { id: 'atm.lcl', unitId: 'atmosphere', chapterId: 'atmosphere-03', title: '이슬점과 상승 응결 고도·푄', blockId: 'atmosphere-03-lcl', popupId: 'adiabatic', popupStep: 2 },
  { id: 'atm.stability', unitId: 'atmosphere', chapterId: 'atmosphere-03', title: '대기 안정도', blockId: 'atmosphere-03-stability', popupId: 'stability' },
  { id: 'atm.precip', unitId: 'atmosphere', chapterId: 'atmosphere-03', title: '빙정설과 병합설', blockId: 'atmosphere-03-precip' },
  { id: 'atm.forces', unitId: 'atmosphere', chapterId: 'atmosphere-04', title: '대기를 움직이는 힘', blockId: 'atmosphere-04-forces' },
  { id: 'atm.geo-wind', unitId: 'atmosphere', chapterId: 'atmosphere-05', title: '지균풍', blockId: 'atmosphere-05-upper', popupId: 'geo-wind' },
  { id: 'atm.gradient-wind', unitId: 'atmosphere', chapterId: 'atmosphere-05', title: '경도풍', blockId: 'atmosphere-05-upper', popupId: 'gradient-wind' },
  { id: 'atm.surface-wind', unitId: 'atmosphere', chapterId: 'atmosphere-05', title: '지상풍과 경각', blockId: 'atmosphere-05-surface', popupId: 'gradient-wind', popupStep: 3 },
  { id: 'atm.westerly', unitId: 'atmosphere', chapterId: 'atmosphere-06', title: '편서풍 파동과 제트류', blockId: 'atmosphere-06-def' },
  { id: 'atm.circulation', unitId: 'atmosphere', chapterId: 'atmosphere-06', title: '대기 대순환', blockId: 'atmosphere-06-circulation' },
]

export const conceptById = (id: string) => CONCEPTS.find((c) => c.id === id)
