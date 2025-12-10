import { go, assert } from '@blackglory/prelude'

export function spawn<T>(
  create: (num: number) => T
, times: number = Infinity
): IterableIterator<T> {
  assert(
    times === Infinity || Number.isInteger(times)
  , 'The parameter times must be an integer'
  )

  return go(function* () {
    for (let num = 1; num <= times; num++) {
      yield create(num)
    }
  })
}
