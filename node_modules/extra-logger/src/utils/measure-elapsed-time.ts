import { Awaitable } from '@blackglory/prelude'

export function measureElapsedTime<T>(
  fn: () => T
, callback: (elapsedTime: number) => void
): T {
  const startTime = Date.now()
  const result = fn()
  const endTime = Date.now()

  callback(endTime - startTime)

  return result
}

export async function measureElapsedTimeAsync<T>(
  fn: () => Awaitable<T>
, callback: (elapsedTime: number) => Awaitable<void>
): Promise<T> {
  const startTime = Date.now()
  const result = await fn()
  const endTime = Date.now()

  await callback(endTime - startTime)

  return result
}
