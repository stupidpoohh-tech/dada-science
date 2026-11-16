import { useEffect, useState } from 'react'

/**
 * 해시 라우팅(정적 호스팅·새로고침 대응)
 *  #/                         첫 대단원 교재
 *  #/ocean                    대단원 교재(연속형)
 *  #/ocean?focus=<블록ID>&back=<돌아갈 해시>   관련 개념 위치로 이동
 *  #/ocean/concept | exam | textbook | wrong   개념 확인 문제 · 내신 대비 · 교과서 문제 · 오답 노트 (?topic=소주제 필터, ?q=문항)
 */
export type Route =
  | { name: 'home' }
  | { name: 'unit'; unitId: string; focus?: string; back?: string; concept?: string }
  | { name: 'concept' | 'exam' | 'textbook' | 'wrong'; unitId: string; q?: string; topic?: string }

export function parseRoute(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const params = new URLSearchParams(query)
  const parts = path.split('/').filter(Boolean)
  if (!parts.length) return { name: 'home' }
  const [unitId, sub] = parts
  if (sub === 'practice') return { name: 'concept', unitId }
  if (sub === 'concept' || sub === 'exam' || sub === 'textbook' || sub === 'wrong') return { name: sub, unitId, q: params.get('q') ?? undefined, topic: params.get('topic') ?? undefined }
  return { name: 'unit', unitId, focus: params.get('focus') ?? undefined, back: params.get('back') ?? undefined, concept: params.get('concept') ?? undefined }
}

export function href(r: Route): string {
  if (r.name === 'home') return '#/'
  if (r.name === 'unit') {
    const p = new URLSearchParams()
    if (r.focus) p.set('focus', r.focus)
    if (r.back) p.set('back', r.back)
    if (r.concept) p.set('concept', r.concept)
    const q = p.toString()
    return `#/${r.unitId}${q ? `?${q}` : ''}`
  }
  const p = new URLSearchParams()
  if (r.q) p.set('q', r.q)
  if (r.topic) p.set('topic', r.topic)
  const q = p.toString()
  return `#/${r.unitId}/${r.name}${q ? `?${q}` : ''}`
}

export const navigate = (r: Route | string) => { window.location.hash = typeof r === 'string' ? r : href(r) }

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))
  useEffect(() => {
    const on = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
