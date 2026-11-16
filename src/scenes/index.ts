import type { ComponentType } from 'react'
import type { SceneProps } from '../data/types'
import Scene01Pressure from './Scene01Pressure'
import Scene02Gradient from './Scene02Gradient'
import Scene03Geostrophic, { Scene03Air } from './Scene03Geostrophic'
import Scene04Ekman from './Scene04Ekman'
import Scene05Upwelling from './Scene05Upwelling'
import Scene06Waves from './Scene06Waves'
import Scene07Shoaling from './Scene07Shoaling'
import Scene08Tsunami from './Scene08Tsunami'
import Scene09Tides from './Scene09Tides'
import Scene10TideDay from './Scene10TideDay'
import Scene11StormSurge from './Scene11StormSurge'
import Scene12Adiabatic from './Scene12Adiabatic'
import Scene13Stability from './Scene13Stability'
import Scene14GradientWind from './Scene14GradientWind'

/** 팝업 그림 키 → 인터랙티브 그림 컴포넌트. 새 팝업 그림은 여기에 등록합니다. */
export const SCENES: Record<string, ComponentType<SceneProps>> = {
  pressure: Scene01Pressure,
  pgf: Scene02Gradient,
  geostrophic: Scene03Geostrophic,
  ekman: Scene04Ekman,
  upwelling: Scene05Upwelling,
  waves: Scene06Waves,
  shoaling: Scene07Shoaling,
  tsunami: Scene08Tsunami,
  'storm-surge': Scene11StormSurge,
  tides: Scene09Tides,
  'tide-day': Scene10TideDay,
  adiabatic: Scene12Adiabatic,
  stability: Scene13Stability,
  'geo-wind': Scene03Air,
  'gradient-wind': Scene14GradientWind,
}
