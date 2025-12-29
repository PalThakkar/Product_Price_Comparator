import { assert } from '@blackglory/prelude'

/**
 * @throws {Error}
 */
export function range(
  start: number
, end: number
, step: number = 1
, inclusive: boolean = false
): IterableIterator<number> {
  assert(step > 0, 'step parameter must be greater than 0')

  return _range(start, end, step, inclusive)
}

function* _range(
  start: number
, end: number
, step: number
, inclusive: boolean
) {
  if (start < end) {
    if (inclusive) {
      for (let i = start; i <= end; i += step) {
        yield i
      }
    } else {
      for (let i = start; i < end; i += step) {
        yield i
      }
    }
  } else {
    if (inclusive) {
      for (let i = start; i >= end; i -= step) {
        yield i
      }
    } else {
      for (let i = start; i > end; i -= step) {
        yield i
      }
    }
  }
}
