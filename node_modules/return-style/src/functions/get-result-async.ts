import { Awaitable } from '@blackglory/prelude'

export async function getResultAsync<T>(fn: () => Awaitable<T>): Promise<T | undefined> {
  try {
    return await fn()
  } catch {
    return undefined
  }
}
