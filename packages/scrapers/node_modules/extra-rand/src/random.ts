import { mapToRange } from './map-to-range'

export function random(min: number, max: number): number {
  return mapToRange(
    Math.random()
  , 0, 1
  , min, max
  )
}
