import { UNITS, unitById } from '../content/units'
import { POPUPS } from '../content/popups'
import { CONCEPTS } from '../content/concepts'
import { parseManuscript, parseInline, parseTarget, type ParsedManuscript, type Inline } from './manuscript'
import type { ProgressState } from './store'
import type { ChapterMeta, UnitMeta } from '../content/types'

const cache = new Map<string, ParsedManuscript>()
export function manuscriptOf(unitId: string): ParsedManuscript {
  let m = cache.get(unitId)
  if (!m) {
    m = parseManuscript(unitById(unitId)?.manuscript ?? '')
    if (import.meta.env.DEV && m.warnings.length) console.warn(`[원문:${unitId}]`, m.warnings)
    cache.set(unitId, m)
  }
  return m
}

export const popupById = (id: string) => POPUPS.find((p) => p.id === id)

function collectLinks(nodes: Inline[], out: Set<string>) {
  for (const n of nodes) {
    if (n.t === 'link') { const t = parseTarget(n.target); if (t.popup) out.add(t.popup) }
    else if (n.t === 'b' || n.t === 'i' || n.t === 'term') collectLinks(n.v, out)
  }
}

/** 소챕터에 연결된 팝업(팝업 데이터의 chapterId 기준 + 원문에서 참조한 팝업 중 같은 소챕터 소속) */
export function popupsOfChapter(unitId: string, chapterId: string): string[] {
  return POPUPS.filter((p) => p.unitId === unitId && p.chapterId === chapterId).map((p) => p.id)
}

/** 원문에서 참조하는 모든 팝업 ID */
export function referencedPopups(unitId: string): Set<string> {
  const out = new Set<string>()
  for (const ch of manuscriptOf(unitId).chapters) for (const b of ch.blocks) {
    if (b.kind === 'figure' && b.popup) out.add(b.popup)
    if ('text' in b) collectLinks(parseInline(b.text), out)
  }
  return out
}

export function requiredPopups(unitId: string, ch: ChapterMeta): string[] | null {
  if (ch.completion?.type === 'manual') return null
  const ids = ch.completion?.type === 'popups' && ch.completion.popupIds ? ch.completion.popupIds : popupsOfChapter(unitId, ch.id)
  return ids.length ? ids : null
}

export function chapterDone(p: ProgressState, unitId: string, ch: ChapterMeta): boolean {
  const req = requiredPopups(unitId, ch)
  if (!req) return !!p.chapters[ch.id]?.manualDone
  return req.every((id) => p.popups[id]?.done)
}

export interface UnitStats {
  chaptersDone: number; chapters: number
  conceptsDone: number; concepts: number
  firstTryRate: number | null
  practiceDone: number; practiceCorrect: number
  examScore?: number; examMax?: number; examAt?: number
  wrongOpen: number
}

export function unitStats(p: ProgressState, unit: UnitMeta, practiceIds: string[]): UnitStats {
  const pops = POPUPS.filter((x) => x.unitId === unit.id)
  const tried = pops.filter((x) => p.popups[x.id]?.attempts)
  const first = tried.filter((x) => p.popups[x.id]?.firstTry).length
  const pr = practiceIds.map((id) => p.practice[id]).filter(Boolean)
  const ex = p.exams[unit.id]
  return {
    chaptersDone: unit.chapters.filter((c) => chapterDone(p, unit.id, c)).length,
    chapters: unit.chapters.length,
    conceptsDone: pops.filter((x) => p.popups[x.id]?.done).length,
    concepts: pops.length,
    firstTryRate: tried.length ? first / tried.length : null,
    practiceDone: pr.length,
    practiceCorrect: pr.filter((r) => r.correct).length,
    examScore: ex?.submittedAt ? ex.score : undefined,
    examMax: ex?.submittedAt ? ex.maxScore : undefined,
    examAt: ex?.submittedAt,
    wrongOpen: Object.values(p.wrong).filter((w) => w.unitId === unit.id && !w.resolved).length,
  }
}

export { UNITS, POPUPS, CONCEPTS }
