import type { UnitMeta } from './types'
import oceanMd from './manuscripts/ocean.md?raw'
import atmosphereMd from './manuscripts/atmosphere.md?raw'

/**
 * 대단원 목록. 새 대단원은 이 배열에 추가합니다.
 * 소챕터 ID는 원문 파일의 `@chapter <ID>`와 같아야 합니다.
 * 단원 번호(Ⅱ, Ⅲ)는 손글씨 원문 노트의 표기를 따랐습니다.
 */
export const UNITS: UnitMeta[] = [
  {
    id: 'ocean',
    numeral: 'Ⅱ',
    title: '해수의 운동과 순환',
    status: 'original',
    questionStatus: 'demo',
    manuscript: oceanMd,
    sourcePages: ['source-04.jpg', 'source-05.jpg'],
    chapters: [
      { id: 'ocean-01', no: '01', title: '해수를 움직이는 힘' },
      { id: 'ocean-02', no: '02', title: '지형류' },
      { id: 'ocean-03', no: '03', title: '해파' },
      { id: 'ocean-04', no: '04', title: '해일' },
      { id: 'ocean-05', no: '05', title: '조석과 조류' },
    ],
  },
  {
    id: 'atmosphere',
    numeral: 'Ⅲ',
    title: '강수 과정과 대기의 운동',
    status: 'original',
    questionStatus: 'pending',
    manuscript: atmosphereMd,
    sourcePages: ['source-06.jpg', 'source-07.jpg'],
    chapters: [
      // 팝업이 없는 소챕터는 소챕터 끝의 '학습 완료' 체크로 완료합니다.
      { id: 'atmosphere-01', no: '01', title: '지구의 대기와 생명체', completion: { type: 'manual' } },
      { id: 'atmosphere-02', no: '02', title: '지구 열수지', completion: { type: 'manual' } },
      { id: 'atmosphere-03', no: '03', title: '대기 안정도와 강수' },
      { id: 'atmosphere-04', no: '04', title: '기압의 연직 분포와 대기를 움직이는 힘', completion: { type: 'manual' } },
      { id: 'atmosphere-05', no: '05', title: '여러 가지 바람' },
      { id: 'atmosphere-06', no: '06', title: '편서풍 파동', completion: { type: 'manual' } },
    ],
  },
]

export const unitById = (id: string) => UNITS.find((u) => u.id === id)
