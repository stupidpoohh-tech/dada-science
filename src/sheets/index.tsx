import type { ReactNode } from 'react'
import { OCEAN_ROWS } from './ocean'
import { ATMOSPHERE_ROWS } from './atmosphere'
import { Row } from './primitives'

/** 학습지 행 레지스트리: 원문 파일의 `@sheet id=<행 ID>`가 여기의 행을 그립니다. */
export const SHEET_ROWS: Record<string, { h: number; label: string; render: () => ReactNode }> = { ...OCEAN_ROWS, ...ATMOSPHERE_ROWS }

export function SheetRow({ id }: { id: string }) {
  const r = SHEET_ROWS[id]
  if (!r) return <p className="text-coriolis">[학습지 행 없음: {id}]</p>
  return <Row id={id} h={r.h} label={r.label}>{r.render()}</Row>
}
