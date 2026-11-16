/**
 * 필기 저장소(IndexedDB). 범위(scope)별로 한 레코드: 대단원 원문은 unitId, 팝업 그림은 'popup:<id>'.
 * IndexedDB를 쓸 수 없는 환경에서는 메모리에만 보관합니다(창을 닫으면 사라짐).
 */
import type { Stroke } from './annotations'

const DB_NAME = 'moving-earth-science-notes'
const STORE = 'scopes'
export const ANNOTATION_FORMAT = 1

export interface ScopeRecord { scopeId: string; format: number; strokes: Stroke[]; updatedAt: number }

let dbp: Promise<IDBDatabase | null> | null = null
const memory = new Map<string, ScopeRecord>()

function db(): Promise<IDBDatabase | null> {
  if (!dbp) {
    dbp = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1)
        req.onupgradeneeded = () => { req.result.createObjectStore(STORE, { keyPath: 'scopeId' }) }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => resolve(null)
        req.onblocked = () => resolve(null)
      } catch { resolve(null) }
    })
  }
  return dbp
}

export const storageAvailable = async () => (await db()) !== null

export async function loadScope(scopeId: string): Promise<Stroke[]> {
  const d = await db()
  if (!d) return memory.get(scopeId)?.strokes ?? []
  return new Promise((resolve) => {
    const req = d.transaction(STORE).objectStore(STORE).get(scopeId)
    req.onsuccess = () => resolve(migrateRecord(req.result as ScopeRecord | undefined)?.strokes ?? [])
    req.onerror = () => resolve([])
  })
}

export async function saveScope(scopeId: string, strokes: Stroke[]): Promise<boolean> {
  const rec: ScopeRecord = { scopeId, format: ANNOTATION_FORMAT, strokes, updatedAt: Date.now() }
  const d = await db()
  if (!d) { memory.set(scopeId, rec); return false }
  return new Promise((resolve) => {
    const tx = d.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(rec)
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => resolve(false)
  })
}

export async function loadAll(): Promise<ScopeRecord[]> {
  const d = await db()
  if (!d) return [...memory.values()]
  return new Promise((resolve) => {
    const req = d.transaction(STORE).objectStore(STORE).getAll()
    req.onsuccess = () => resolve((req.result as ScopeRecord[]).map((r) => migrateRecord(r)!).filter(Boolean))
    req.onerror = () => resolve([])
  })
}

/** 저장 형식이 바뀌면 여기서 이전 형식을 변환합니다. */
function migrateRecord(r: ScopeRecord | undefined): ScopeRecord | undefined {
  if (!r) return r
  if (!r.format) return { ...r, format: ANNOTATION_FORMAT }
  return r
}
