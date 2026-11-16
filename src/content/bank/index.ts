import type { AnswerKey, BankQuestion, BankSet, BankTopic } from './types'
import { OCEAN_CONCEPT, OCEAN_EXAM, OCEAN_TOPICS } from './ocean.questions'
import { ATMOSPHERE_CONCEPT, ATMOSPHERE_EXAM, ATMOSPHERE_TOPICS } from './atmosphere.questions'
import { OCEAN_ANSWERS } from './ocean.answers'
import { ATMOSPHERE_ANSWERS } from './atmosphere.answers'

export const BANK: BankQuestion[] = [...OCEAN_CONCEPT, ...OCEAN_EXAM, ...ATMOSPHERE_CONCEPT, ...ATMOSPHERE_EXAM]
export const TOPICS: Record<string, BankTopic[]> = { ocean: OCEAN_TOPICS, atmosphere: ATMOSPHERE_TOPICS }
const ANSWERS: Record<string, Record<string, AnswerKey>> = { ocean: OCEAN_ANSWERS, atmosphere: ATMOSPHERE_ANSWERS }

export const bankOf = (unitId: string, set: BankSet) => BANK.filter((q) => q.unitId === unitId && q.set === set)
export const bankById = (id: string) => BANK.find((q) => q.id === id)
export const topicOf = (unitId: string, topicId: string) => TOPICS[unitId]?.find((t) => t.id === topicId)

/** 정답·해설 조회. 화면에서는 제출(정답 확인·채점) 이후에만 호출합니다. */
export const answerKeyOf = (q: BankQuestion): AnswerKey | undefined => ANSWERS[q.unitId]?.[q.code]

/** 데이터 무결성 검사(개발 모드와 검증 스크립트에서 사용) */
export function validateBank(): string[] {
  const errs: string[] = []
  const expect: [string, BankSet, number, number][] = [['ocean', 'concept', 25, 100], ['ocean', 'exam', 25, 100], ['atmosphere', 'concept', 30, 0], ['atmosphere', 'exam', 25, 100]]
  for (const [u, s, n, pts] of expect) {
    const list = bankOf(u, s)
    if (list.length !== n) errs.push(`${u}/${s}: ${list.length}문항(기대 ${n})`)
    const sum = list.reduce((a, q) => a + q.points, 0)
    if (sum !== pts) errs.push(`${u}/${s}: 배점 합 ${sum}(기대 ${pts})`)
  }
  const ids = new Set<string>()
  for (const q of BANK) {
    if (ids.has(q.id)) errs.push(`중복 ID ${q.id}`)
    ids.add(q.id)
    const k = answerKeyOf(q)
    if (!k) { errs.push(`${q.id}: 정답 없음`); continue }
    if (!TOPICS[q.unitId].some((t) => t.id === q.topic)) errs.push(`${q.id}: 소주제 ${q.topic} 없음`)
    if (q.type === 'multiple_choice') {
      if (typeof k.answer !== 'number' || !q.options || k.answer < 1 || k.answer > q.options.length) errs.push(`${q.id}: 객관식 정답 번호 오류`)
      if ('①②③④⑤'[Number(k.answer) - 1] !== k.display) errs.push(`${q.id}: 표시 정답(${k.display})과 번호(${k.answer}) 불일치`)
    }
    if (q.type === 'ox' && k.answer !== 'O' && k.answer !== 'X') errs.push(`${q.id}: OX 정답 오류`)
    if (!k.manual && (q.type === 'blank' || q.type === 'short_answer' || q.type === 'calculation')) {
      const n = q.blanks?.length ?? 1
      if (!Array.isArray(k.answer) || k.answer.length !== n) errs.push(`${q.id}: 빈칸 ${n}개와 정답 수 불일치`)
    }
    if (k.manual && k.rubric && k.rubric.reduce((a, r) => a + r.points, 0) !== q.points) errs.push(`${q.id}: 채점 기준 합 ≠ 배점`)
    if ((q.type === 'essay' || (q.type === 'short_answer' && q.set === 'exam')) && !k.manual) errs.push(`${q.id}: 서술형은 수동 채점이어야 함`)
  }
  return errs
}

if (import.meta.env?.DEV) {
  const e = validateBank()
  if (e.length) console.error('[문제은행 검사]', e)
}
