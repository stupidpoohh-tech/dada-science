import type { ComponentType } from 'react'
import type { SceneProps } from '../data/types'
import Scene01Pressure from './Scene01Pressure'
import Scene02Gradient from './Scene02Gradient'
import Scene03Geostrophic from './Scene03Geostrophic'
import Scene04Ekman from './Scene04Ekman'
import Scene05Upwelling from './Scene05Upwelling'
import Scene06Waves from './Scene06Waves'
import Scene07Shoaling from './Scene07Shoaling'
import Scene08Tsunami from './Scene08Tsunami'
import Scene09Tides from './Scene09Tides'
import Scene10TideDay from './Scene10TideDay'

/** 개념 번호 → 인터랙티브 그림 컴포넌트 */
export const SCENES: Record<number, ComponentType<SceneProps>> = {
  1: Scene01Pressure,
  2: Scene02Gradient,
  3: Scene03Geostrophic,
  4: Scene04Ekman,
  5: Scene05Upwelling,
  6: Scene06Waves,
  7: Scene07Shoaling,
  8: Scene08Tsunami,
  9: Scene09Tides,
  10: Scene10TideDay,
}
