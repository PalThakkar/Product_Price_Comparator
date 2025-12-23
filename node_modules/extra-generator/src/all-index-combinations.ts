import { assert } from '@blackglory/prelude'

export function allIndexCombinations(
  arr: unknown[]
, k: number
): IterableIterator<number[]> {
  assert(k > 0, 'k must be greater than zero')
  assert(Number.isInteger(k), 'k must be an integer')

  return allCombinationIndexes(arr, k)

  function* allCombinationIndexes<T>(
    arr: T[]
  , k: number
  ): IterableIterator<number[]> {
    for (let i = 0; i < arr.length; i++) {
      if (k == 1) {
        yield [i]
      } else {
        const rest = arr.slice(i + 1)
        for (const subCombination of allCombinationIndexes(rest, k - 1)) {
          yield [i, ...subCombination.map(x => i + 1 + x)]
        }
      }
    }
  }
}
