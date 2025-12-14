import { assert } from '@blackglory/prelude'

export function* positiveFactors(value: number): IterableIterator<number> {
  assert(Number.isInteger(value), 'The value must be an integer')

  for (let i = Math.abs(value) + 1; i--;) {
    if (value % i === 0) yield i
  }
}
