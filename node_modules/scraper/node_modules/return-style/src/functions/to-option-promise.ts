import { Option } from '@classes/option.js'

export async function toOptionPromise<T>(promise: PromiseLike<T>): Promise<Option<T>> {
  try {
    const result = await promise
    return Option.Some<T>(result)
  } catch {
    return Option.None<T>()
  }
}
