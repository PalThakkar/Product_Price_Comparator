import { Awaitable } from '@blackglory/prelude'
import { toResultAsync } from 'return-style'

export async function handleYieldedValuesAsync<T, Return, Next>(
  generator: Generator<T, Return, Next> | AsyncGenerator<T, Return, Next>
, fn: (value: T, index: number) => Awaitable<Next>
): Promise<Return> {
  let { value, done } = await generator.next()

  let index = 0
  while (!done) {
    const result = await toResultAsync(() => fn(value as T, index++))
    if (result.isOk()) {
      ;({ value, done } = await generator.next(result.unwrap()))
    } else {
      ;({ value, done } = await generator.throw(result.unwrapErr()))
    }
  }

  return value as Return
}
