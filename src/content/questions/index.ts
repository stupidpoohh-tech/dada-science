import type { Question, QuestionSet } from '../types'
import { OCEAN_QUESTIONS } from './ocean'
import { ATMOSPHERE_QUESTIONS } from './atmosphere'

export const QUESTIONS: Question[] = [...ATMOSPHERE_QUESTIONS, ...OCEAN_QUESTIONS]
export const questionById = (id: string) => QUESTIONS.find((q) => q.id === id)
export const questionsOf = (unitId: string, set: QuestionSet) =>
  QUESTIONS.filter((q) => q.unitId === unitId && q.set === set).sort((a, b) => a.number - b.number)
