import type { Concept } from './types'

/**
 * 개념 목록: 문제의 conceptIds가 가리키는 대상입니다.
 * blockId는 원문의 {#ID}, popupId는 팝업 ID입니다.
 */
export const CONCEPTS: Concept[] = [
  { id: 'ocean.pressure', unitId: 'ocean', chapterId: 'ocean-01', title: '수압', blockId: 'ocean-01-pressure', popupId: 'pressure' },
  { id: 'ocean.pgf', unitId: 'ocean', chapterId: 'ocean-01', title: '수압경도력', blockId: 'ocean-01-pgf', popupId: 'pgf' },
  { id: 'ocean.coriolis', unitId: 'ocean', chapterId: 'ocean-01', title: '전향력', blockId: 'ocean-01-coriolis', popupId: 'geostrophic', popupStep: 2 },
  { id: 'ocean.geostrophic', unitId: 'ocean', chapterId: 'ocean-02', title: '지형류', blockId: 'ocean-02-geostrophic', popupId: 'geostrophic' },
  { id: 'ocean.ekman', unitId: 'ocean', chapterId: 'ocean-02', title: '에크만 수송', blockId: 'ocean-02-ekman', popupId: 'ekman' },
  { id: 'ocean.upwelling', unitId: 'ocean', chapterId: 'ocean-02', title: '용승과 침강', blockId: 'ocean-02-upwelling', popupId: 'upwelling' },
  { id: 'ocean.wave-structure', unitId: 'ocean', chapterId: 'ocean-03', title: '해파의 구조', blockId: 'ocean-03-structure', popupId: 'waves', popupStep: 3 },
  { id: 'ocean.wave-particle', unitId: 'ocean', chapterId: 'ocean-03', title: '물 입자의 운동', blockId: 'ocean-03-particle', popupId: 'waves' },
  { id: 'ocean.shoaling', unitId: 'ocean', chapterId: 'ocean-03', title: '해안 접근과 쇄파', blockId: 'ocean-03-shoaling', popupId: 'shoaling' },
  { id: 'ocean.storm-surge', unitId: 'ocean', chapterId: 'ocean-04', title: '폭풍해일', blockId: 'ocean-04-storm', popupId: 'storm-surge' },
  { id: 'ocean.tsunami', unitId: 'ocean', chapterId: 'ocean-04', title: '지진해일', blockId: 'ocean-04-tsunami', popupId: 'tsunami' },
  { id: 'ocean.tide-force', unitId: 'ocean', chapterId: 'ocean-05', title: '기조력과 사리·조금', blockId: 'ocean-05-spring', popupId: 'tides' },
  { id: 'ocean.tide-day', unitId: 'ocean', chapterId: 'ocean-05', title: '만조·간조·조차·조류', blockId: 'ocean-05-day', popupId: 'tide-day' },
]

export const conceptById = (id: string) => CONCEPTS.find((c) => c.id === id)
