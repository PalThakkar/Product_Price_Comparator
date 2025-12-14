import { go, assert } from '@blackglory/prelude'

export function repeat<T>(val: T, times: number = Infinity): IterableIterator<T> {
  assert(
    times === Infinity || Number.isInteger(times)
  , 'The parameter times must be an integer'
  )

  return go(function* () {
    while (times-- > 0) {
      yield val
    }
  })
}
