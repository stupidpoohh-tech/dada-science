/**
 * 콘텐츠 데이터 타입.
 * 관계: 대단원(Unit) → 소챕터(Chapter) → 본문 블록(Block, 원문 Markdown) → 개념(Concept) → 팝업(Popup) / 문제(Question)
 * 모든 연결은 문자열 ID로 합니다. ID는 콘텐츠를 고쳐도 바꾸지 마세요(필기·오답 기록이 ID에 연결됩니다).
 */

export type ContentStatus = 'original' | 'demo' | 'pending'

export interface ChapterMeta {
  /** 예: 'ocean-01' */
  id: string
  /** 화면 표시 번호, 예: '01' */
  no: string
  title: string
  /**
   * 학습 완료 조건.
   * - popups: 지정한 팝업의 확인 문제를 모두 맞히면 완료(생략 시 원문에 연결된 이 소챕터의 팝업 전체)
   * - manual: 소챕터 끝의 '학습 완료' 체크로 완료
   */
  completion?: { type: 'popups'; popupIds?: string[] } | { type: 'manual' }
}

export interface UnitMeta {
  id: string
  /** 예: 'Ⅱ' */
  numeral: string
  title: string
  /** 원문 상태: original(실제 원문), demo(기능 확인용 예시), pending(입력 대기) */
  status: ContentStatus
  chapters: ChapterMeta[]
  /** 원문 Markdown(아래 형식 참고: src/content/manuscripts/README.md) */
  manuscript: string
  /** 문제 자료 상태 */
  questionStatus: ContentStatus
}

/** 개념: 문제와 원문·팝업을 이어 주는 단위 */
export interface Concept {
  id: string
  unitId: string
  chapterId: string
  title: string
  /** 원문에서 이 개념이 설명되는 블록 ID */
  blockId: string
  popupId?: string
  /** 팝업을 특정 단계(0부터)에서 열기 */
  popupStep?: number
}

// ───────── 문제 ─────────

export type QuestionSet = 'practice' | 'exam'

export type QuestionType =
  | 'choice'    // 객관식(2~5지), 방향 선택 포함
  | 'ox'        // O/X
  | 'tf-set'    // ㄱ·ㄴ·ㄷ 진위 판단(보기 + 선택지)
  | 'short'     // 단답형(허용 답안 목록으로 채점)
  | 'essay'     // 서술형(자동 채점하지 않음, 모범답안·채점 요소 제공)

export interface QuestionFigure {
  /** 이미지 경로(public/ 기준) */
  src?: string
  /** 내장 SVG 그림 키(src/scenes/thumbs.tsx) */
  thumb?: number
  alt?: string
  caption?: string
}

export interface Question {
  id: string
  unitId: string
  set: QuestionSet
  /** 표시 번호 */
  number: number
  type: QuestionType
  /** 문제 본문(원문 인라인 문법 사용 가능: **굵게**, ==용어==, ^{위첨자}, _{아래첨자}) */
  stem: string
  figure?: QuestionFigure
  /** 자료 설명(표·그래프 해석 문제의 자료 문장) */
  material?: string
  /** tf-set의 보기 문장(ㄱ, ㄴ, ㄷ 순) */
  statements?: string[]
  /** choice / tf-set 선택지 */
  choices?: string[]
  /** choice·tf-set: 정답 선택지 번호(0부터), ox: 'O' | 'X', short: 대표 정답 */
  answer: number | string
  /** short: 정답으로 인정할 답(공백·대소문자 무시) */
  accept?: string[]
  /** 해설(핵심 풀이 과정) */
  explanation: string
  /** essay: 모범답안 */
  modelAnswer?: string
  /** essay: 핵심 채점 요소 */
  rubric?: string[]
  /** 배점(기본 1) */
  points?: number
  /** 관련 개념 ID */
  conceptIds: string[]
  /** 데모 문항 여부 */
  demo?: boolean
}
