import { mapToRange } from './map-to-range'

export function mapToIntRange(
  value: number
, oldMin: number, oldMax: number
, newMin: number, newMax: number
): number {
  return Math.floor(mapToRange(value, oldMin, oldMax, newMin, newMax))
}
