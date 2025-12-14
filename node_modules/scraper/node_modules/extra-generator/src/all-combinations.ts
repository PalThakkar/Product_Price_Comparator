import { allIndexCombinations } from './all-index-combinations.js'
import { map } from 'iterable-operator'

export function allCombinations<T>(arr: T[], k: number): IterableIterator<T[]> {
  return map(
    allIndexCombinations(arr, k)
  , indexes => (indexes as number[]).map(i => arr[i])
  )
}
