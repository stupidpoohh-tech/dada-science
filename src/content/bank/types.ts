/**
 * 문제은행 데이터 타입
 * - 문제(BankQuestion)와 정답·해설(AnswerKey)은 서로 다른 파일에 둡니다.
 *   화면은 학생이 제출(정답 확인·전체 채점)한 뒤에만 AnswerKey를 읽습니다.
 * - 문항 식별자(code: C01, E01, Q01 …)와 id는 바꾸지 마세요. 학습 기록·오답 노트가 id에 연결됩니다.
 */

export type BankSet = 'concept' | 'exam' | 'textbook'
export type BankType = 'blank' | 'ox' | 'multiple_choice' | 'short_answer' | 'calculation' | 'essay'
export type Difficulty = '하' | '중' | '상'

/** 소주제(문제 분류용). 화면을 나누지 않고 필터·성취도 계산에만 사용 */
export interface BankTopic { id: string; label: string; conceptIds: string[]; chapterIds: string[] }

export interface BankQuestion {
  /** 전체 고유 ID: '<단원>-<코드>' 예: ocean-C01, atmosphere-E16 */
  id: string
  /** 원본 문항 식별자: C01~C25, E01~E25, Q01~Q30 */
  code: string
  unitId: string
  set: BankSet
  /** 문항 번호(표시용) */
  number: number
  /** 표시 번호(교과서 번호 그대로, 예: '2-(1)', '05'). 없으면 number */
  no?: string
  /** 묶음 제목(교과서 쪽·단계). 바뀔 때마다 목록에 제목 표시 */
  section?: string
  /** 표 자료 */
  table?: { head: string[]; rows: string[][] }
  /** 소주제(BankTopic.id) */
  topic: string
  /** 문항 제목(원본의 소제목) */
  title?: string
  type: BankType
  difficulty: Difficulty
  points: number
  question: string
  /** 빈칸·여러 부분 답 입력 칸 이름(빈칸 수만큼). 없으면 입력 칸 1개 */
  blanks?: string[]
  /** 객관식 선택지(원본 순서 그대로) */
  options?: string[]
  /** ㄱ·ㄴ·ㄷ 보기 */
  statements?: string[]
  /** [자료] 내용(여러 줄) */
  material?: string[]
  /** 그림 키(src/figures) — 정답이 드러나지 않는 그림만 사용 */
  diagram?: { fig: string; caption?: string; wide?: boolean }
  /** 'text': 문장으로 답하는 설명형(여러 줄 입력, 교사·자기 채점) */
  format?: 'text'
  /** 단위 등 입력 안내 */
  unitHint?: string
  /** 관련 개념(src/content/concepts.ts의 ID) — 원문·팝업으로 연결 */
  conceptIds: string[]
  tags?: string[]
}

export interface RubricItem { text: string; points: number }

export interface AnswerKey {
  /**
   * 정답
   * - multiple_choice: 1부터 센 번호(②이면 2)
   * - ox: 'O' | 'X'
   * - blank / short_answer / calculation(자동 채점): 칸마다 인정 답 목록 [[정답, 동의어…], …]
   * - 서술형(수동 채점): 표시용 정답 문자열
   */
  answer: number | 'O' | 'X' | string[][] | string
  /** 표시용 정답(원본 표기) */
  display: string
  explanation?: string
  /** 수동(교사·자기) 채점 문항 */
  manual?: boolean
  modelAnswer?: string
  rubric?: RubricItem[]
  /** 키워드 채점: 칸마다 이 단어 중 하나가 들어 있으면 정답으로 봄(교사 확인 권장) */
  keywords?: string[][]
}
