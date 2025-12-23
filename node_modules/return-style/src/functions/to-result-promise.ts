import { Result } from '@classes/result.js'

export async function toResultPromise<E = Error, T = unknown>(
  promise: PromiseLike<T>
): Promise<Result<T, E>> {
  try {
    const result = await promise
    return Result.Ok(result)
  } catch (err) {
    return Result.Err(err as E)
  }
}
