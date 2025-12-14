export async function getResultErrorPromise<E = Error, T = unknown>(
  promise: PromiseLike<T>
): Promise<[result: T, error: undefined] | [result: undefined, error: E]> {
  try {
    const result = await promise
    return [result, void 0]
  } catch (e: any) {
    return [void 0, e]
  }
}
