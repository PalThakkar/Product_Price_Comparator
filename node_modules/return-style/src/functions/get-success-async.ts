import { Awaitable } from '@blackglory/prelude'

export async function getSuccessAsync<T>(
  fn: () => Awaitable<T>
): Promise<[succeeded: true, result: T] | [succeeded: false, result: undefined]> {
  try {
    const result = await fn()
    return [true, result]
  } catch {
    return [false, void 0]
  }
}
