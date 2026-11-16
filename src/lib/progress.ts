import { useCallback, useEffect, useState } from 'react'

const KEY = 'moving-earth-science:ocean:v1'

function read(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter((n) => typeof n === 'number') : []
  } catch {
    return []
  }
}

function write(list: number[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 진도가 세션 동안만 유지됩니다. */
  }
}

/** 학습 완료 목록(브라우저 localStorage에 저장) */
export function useProgress() {
  const [completed, setCompleted] = useState<number[]>(read)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setCompleted(read()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const markDone = useCallback((id: number) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id].sort((a, b) => a - b)
      write(next)
      return next
    })
  }, [])

  const reset = useCallback(() => { write([]); setCompleted([]) }, [])

  return { completed, markDone, reset }
}
