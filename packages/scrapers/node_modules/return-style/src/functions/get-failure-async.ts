import { Awaitable } from '@blackglory/prelude'

export async function getFailureAsync<E = Error>(
  fn: () => Awaitable<unknown>
): Promise<[failed: true, error: E] | [failed: false, error: undefined]> {
  try {
    await fn()
    return [false, void 0]
  } catch (e: any) {
    return [true, e]
  }
}
