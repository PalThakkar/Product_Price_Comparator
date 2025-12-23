import { Awaitable } from '@blackglory/prelude'

export async function isSuccessAsync(fn: () => Awaitable<unknown>): Promise<boolean> {
  try {
    await fn()
    return true
  } catch {
    return false
  }
}
