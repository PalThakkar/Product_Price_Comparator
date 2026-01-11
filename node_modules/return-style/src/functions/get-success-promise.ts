export async function getSuccessPromise<T>(
  promise: PromiseLike<T>
): Promise<[succeeded: true, result: T] | [succeeded: false, result: undefined]> {
  try {
    const result = await promise
    return [true, result]
  } catch {
    return [false, void 0]
  }
}
