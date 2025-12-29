import { mapToIntRange } from './map-to-int-range'

export function randomIntInclusive(min: number, max: number): number {
  return mapToIntRange(
    Math.random()
  , 0, 1
  , Math.ceil(min), Math.floor(max) + 1
  )
}
