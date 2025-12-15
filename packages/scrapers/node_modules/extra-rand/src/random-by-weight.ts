import { mapToIndexByWeight } from './map-to-index-by-weight'

export function randomByWeight(weights: number[]): number {
  return mapToIndexByWeight(
    Math.random()
  , 0, 1
  , weights
  )
}
