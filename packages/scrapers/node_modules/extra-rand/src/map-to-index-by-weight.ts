import { mapToRange } from './map-to-range'
import { mapToIntRange } from './map-to-int-range'

export function mapToIndexByWeight(
  value: number
, oldMin: number, oldMax: number
, weights: number[]
): number {
  const newMin = 0
  const newMax = weights.reduce((acc, cur) => acc + Math.max(cur, 0))
  if (newMax === 0) {
    // 只有在所有权重都小于等于0的情况下会进入此路径, 这时将所有权重都视为1.
    const index = mapToIntRange(value, oldMin, oldMax, newMin, weights.length)

    return index === weights.length
         ? weights.length - 1
         : index
  } else {
    const newValue = mapToRange(value, oldMin, oldMax, newMin, newMax)

    let remains = newMax
    for (let i = weights.length; i--;) {
      const weight = weights[i]
      if (weight <= 0) {
        continue
      } else {
        remains -= weight
        if (newValue >= remains) {
          return i
        }
      }
    }

    throw new Error('Impossible route')
  }
}
