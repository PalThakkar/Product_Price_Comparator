import { Awaitable } from '@blackglory/prelude'

export async function getErrorResultAsync<E = Error, T = unknown>(
  fn: () => Awaitable<T>
): Promise<[error: undefined, result: T] | [error: E, result: undefined]> {
  try {
    const result = await fn()
    return [void 0, result]
  } catch (e: any) {
    return [e, void 0]
  }
}
