import { Awaitable } from '@blackglory/prelude'

export async function getResultErrorAsync<E = Error, T = unknown>(
  fn: () => Awaitable<T>
): Promise<[result: T, error: undefined] | [result: undefined, error: E]> {
  try {
    const result = await fn()
    return [result, void 0]
  } catch (e: any) {
    return [void 0, e]
  }
}
