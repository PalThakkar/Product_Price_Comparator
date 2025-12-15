import { Awaitable } from '@blackglory/prelude'

export async function isFailureAsync(fn: () => Awaitable<unknown>): Promise<boolean> {
  try {
    await fn()
    return false
  } catch {
    return true
  }
}
