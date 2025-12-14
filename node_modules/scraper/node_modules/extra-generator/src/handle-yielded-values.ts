import { toResult } from 'return-style'

export function handleYieldedValues<T, Return, Next>(
  generator: Generator<T, Return, Next>
, fn: (value: T, index: number) => Next
): Return {
  let { value, done } = generator.next()

  let index = 0
  while (!done) {
    const result = toResult(() => fn(value as T, index++))
    if (result.isOk()) {
      ;({ value, done } = generator.next(result.unwrap()))
    } else {
      ;({ value, done } = generator.throw(result.unwrapErr()))
    }
  }

  return value as Return
}
