export async function getErrorResultPromise<E = Error, T = unknown>(
  promise: PromiseLike<T>
): Promise<[error: undefined, result: T] | [error: E, result: undefined]> {
  try {
    const result = await promise
    return [void 0, result]
  } catch (e: any) {
    return [e, void 0]
  }
}
