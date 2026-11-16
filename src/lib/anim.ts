import { useEffect, useRef, useState } from 'react'

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * target 값이 바뀌면 현재 값에서 target까지 부드럽게 변하는 값을 돌려줍니다.
 * initial을 주면 처음 마운트될 때 initial → target으로 움직입니다(다시 보기용).
 */
export function useTween(target: number, duration = 900, initial?: number): number {
  const [value, setValue] = useState(initial ?? target)
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    const from = valueRef.current
    if (from === target) return
    let raf = 0
    const start = performance.now()
    const d = Math.max(1, duration)
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / d)
      setValue(from + (target - from) * ease(p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

/** running이 true인 동안 경과 시간(초)을 누적해 돌려줍니다. */
export function useClock(running: boolean, speed = 1, initial = 0): [number, (t: number) => void] {
  const [t, setT] = useState(initial)
  useEffect(() => {
    if (!running) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      setT((v) => v + dt * speed)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, speed])
  return [t, setT]
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (t: number) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x) }
