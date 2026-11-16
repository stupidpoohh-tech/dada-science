/** 모드(북반구/남반구, 용승/침강 등)에 따라 문장이 달라질 수 있습니다. */
export type StepText = string | Record<string, string>

export interface StepDef {
  /** 단계 이름(짧게) */
  title: string
  /** 화면 하단 1~2문장 설명 */
  text: StepText
}

export interface QuizOption {
  text: string
  correct?: boolean
  /** 정답이면 칭찬 대신 원리, 오답이면 틀린 이유 */
  feedback: string
}

export interface Quiz {
  question: string
  options: QuizOption[]
  /** 정답 시 핵심 원리 한 문장 */
  summary: string
  /** 오답 시 다시 볼 단계(0부터) */
  reviewStep: number
  /** 다시 볼 때 적용할 모드 */
  reviewMode?: string
}

export interface Lesson {
  id: number
  title: string
  goal: string
  keyPoints: string[]
  steps: StepDef[]
  /** 장면 안에서 고르는 모드의 기본값 */
  defaultMode?: string
  quiz: Quiz
}

export interface SceneProps {
  step: number
  mode: string
  setMode: (m: string) => void
}
