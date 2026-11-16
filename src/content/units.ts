import type { UnitMeta } from './types'
import oceanMd from './manuscripts/ocean.md?raw'
import atmosphereMd from './manuscripts/atmosphere.md?raw'

/**
 * 대단원 목록. 새 대단원은 이 배열에 추가합니다.
 * 소챕터 ID는 원문 파일의 `@chapter <ID>`와 같아야 합니다.
 */
export const UNITS: UnitMeta[] = [
  {
    id: 'atmosphere',
    numeral: 'Ⅰ',
    title: '강수 과정과 대기의 운동',
    status: 'pending',
    questionStatus: 'pending',
    manuscript: atmosphereMd,
    chapters: [
      // 원문이 제공되면 제목을 바꾸세요. 팝업이 없는 소챕터는 '학습 완료' 체크로 완료합니다.
      { id: 'atmosphere-01', no: '01', title: '소챕터 제목 입력 대기', completion: { type: 'manual' } },
      { id: 'atmosphere-02', no: '02', title: '소챕터 제목 입력 대기', completion: { type: 'manual' } },
      { id: 'atmosphere-03', no: '03', title: '소챕터 제목 입력 대기', completion: { type: 'manual' } },
    ],
  },
  {
    id: 'ocean',
    numeral: 'Ⅱ',
    title: '해수의 운동과 순환',
    status: 'demo',
    questionStatus: 'demo',
    manuscript: oceanMd,
    chapters: [
      { id: 'ocean-01', no: '01', title: '해수를 움직이는 힘' },
      { id: 'ocean-02', no: '02', title: '지형류' },
      { id: 'ocean-03', no: '03', title: '해파' },
      { id: 'ocean-04', no: '04', title: '해일' },
      { id: 'ocean-05', no: '05', title: '조석과 조류' },
    ],
  },
]

export const unitById = (id: string) => UNITS.find((u) => u.id === id)
