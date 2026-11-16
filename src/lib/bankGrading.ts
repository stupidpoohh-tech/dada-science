import type { AnswerKey, BankQuestion } from '../content/bank/types'

/** 학생 답: 빈칸형은 칸별 문자열 배열, 객관식은 번호(1부터), OX는 'O'|'X', 서술형은 문자열 */
export type BankAnswer = string[] | number | 'O' | 'X' | string | undefined

export type ItemStatus = 'unanswered' | 'correct' | 'wrong' | 'pending'
export interface ItemResult { status: ItemStatus; score: number; blanks?: boolean[] }

/** 입력값 정규화: 앞뒤 공백, 띄어쓰기, 가운뎃점·쉼표·괄호 차이, 전각/반각, 대소문자 무시 */
export function norm(s: string): string {
  return s.normalize('NFKC').toLowerCase().replace(/[\s·ㆍ・,，/()（）"'“”‘’.。]/g, '').replace(/[°˚º]c|℃|도$/g, '℃')
}
const UNIT_RE = /(km|m\/s|m|℃|°|도|개|%|퍼센트|시간|분|초)$/

/** 숫자 답은 단위를 붙이거나 빼도 같은 값이면 정답 */
function numberOf(s: string): number | null {
  const t = norm(s).replace(UNIT_RE, '').replace(UNIT_RE, '')
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null
}

export function blankCount(q: BankQuestion) { return q.blanks?.length ?? 1 }

/** 여러 빈칸을 한 칸에 쉼표로 적은 경우 나눔 */
export function splitBlanks(q: BankQuestion, v: string[]): string[] {
  const n = blankCount(q)
  if (n > 1 && v.filter((x) => x?.trim()).length === 1 && v[0]?.includes(',')) {
    const parts = v[0].split(/[,，]/).map((x) => x.trim())
    if (parts.length === n) return parts
  }
  return v
}

function judgeBlank(input: string, accepted: string[], keywords?: string[]): boolean {
  if (!input?.trim()) return false
  const ni = norm(input)
  if (keywords?.length) return keywords.some((k) => ni.includes(norm(k)))
  for (const a of accepted) {
    if (ni === norm(a)) return true
    const na = numberOf(a), nb = numberOf(input)
    if (na !== null && nb !== null && na === nb) return true
  }
  return false
}

export const isAnswered = (q: BankQuestion, v: BankAnswer) => {
  if (v === undefined || v === null) return false
  // 객관식은 번호만 답으로 인정(서술형에서 바뀐 문항의 예전 글 답안은 미응답 처리)
  if (q.type === 'multiple_choice') return typeof v === 'number'
  if (Array.isArray(v)) return v.some((x) => x?.trim())
  if (typeof v === 'string') return v.trim().length > 0
  return true
}

/** 자동 채점(수동 채점 문항은 pending) */
export function gradeItem(q: BankQuestion, key: AnswerKey, v: BankAnswer, opts: { override?: boolean; manual?: { rubric?: boolean[]; correct?: boolean; confirmed?: boolean } } = {}): ItemResult {
  if (!isAnswered(q, v)) return { status: 'unanswered', score: 0 }
  if (key.manual) {
    const m = opts.manual
    if (!m?.confirmed) return { status: 'pending', score: 0 }
    if (key.rubric) {
      const score = key.rubric.reduce((a, r, i) => a + (m.rubric?.[i] ? r.points : 0), 0)
      return { status: score === q.points ? 'correct' : 'wrong', score }
    }
    return { status: m.correct ? 'correct' : 'wrong', score: m.correct ? q.points : 0 }
  }
  let ok = false
  let blanks: boolean[] | undefined
  if (q.type === 'multiple_choice') ok = v === key.answer
  else if (q.type === 'ox') ok = v === key.answer
  else {
    const vals = splitBlanks(q, Array.isArray(v) ? v : [String(v)])
    const acc = key.answer as string[][]
    blanks = acc.map((a, i) => judgeBlank(vals[i] ?? '', a, key.keywords?.[i]))
    ok = blanks.every(Boolean)
  }
  if (!ok && opts.override) ok = true
  return { status: ok ? 'correct' : 'wrong', score: ok ? q.points : 0, blanks }
}

export function formatBankAnswer(q: BankQuestion, v: BankAnswer): string {
  if (!isAnswered(q, v)) return '무응답'
  if (q.type === 'multiple_choice') return `${'①②③④⑤'[Number(v) - 1]} ${q.options?.[Number(v) - 1] ?? ''}`
  if (Array.isArray(v)) return v.map((x, i) => (q.blanks ? `${q.blanks[i]}: ${x || '—'}` : x)).join(' / ')
  return String(v)
}

export const TYPE_LABEL: Record<BankQuestion['type'], string> = {
  blank: '빈칸', ox: 'OX', multiple_choice: '객관식', short_answer: '단답형', calculation: '계산형', essay: '서술형',
}
export const typeLabel = (q: BankQuestion) => (q.type === 'short_answer' && q.set === 'exam' ? '서술형' : TYPE_LABEL[q.type])
