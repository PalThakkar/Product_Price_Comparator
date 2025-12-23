import { Result } from '@classes/result.js'
import { Awaitable } from '@blackglory/prelude'

export async function toResultAsync<E = Error, T = unknown>(
  fn: () => Awaitable<T>
): Promise<Result<T, E>> {
  try {
    const result = await fn()
    return Result.Ok(result)
  } catch (err) {
    return Result.Err(err as E)
  }
}
