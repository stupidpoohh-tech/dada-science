import type { Question } from '../content/types'

const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase()

/** 자동 채점: 정답 true / 오답 false / 서술형·무응답 null */
export function grade(q: Question, ans: unknown): boolean | null {
  if (ans === undefined || ans === null || ans === '') return q.type === 'essay' ? null : false
  switch (q.type) {
    case 'choice': case 'tf-set': return ans === q.answer
    case 'ox': return ans === q.answer
    case 'short': return (q.accept ?? [String(q.answer)]).some((a) => norm(a) === norm(String(ans)))
    case 'essay': return null
  }
}

export function formatAnswer(q: Question, ans: unknown): string {
  if (ans === undefined || ans === null || ans === '') return '무응답'
  if (q.type === 'choice' || q.type === 'tf-set') {
    const i = Number(ans)
    return `${'①②③④⑤⑥'[i] ?? i + 1} ${q.choices?.[i] ?? ''}`
  }
  return String(ans)
}
export const formatCorrect = (q: Question) => (q.type === 'essay' ? '모범답안 참고' : formatAnswer(q, q.answer))
export const TYPE_LABEL: Record<Question['type'], string> = { choice: '객관식', ox: 'OX', 'tf-set': '보기(ㄱ·ㄴ·ㄷ)', short: '단답형', essay: '서술형' }
