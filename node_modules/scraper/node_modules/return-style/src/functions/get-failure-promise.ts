export async function getFailurePromise<E = Error>(
  promise: PromiseLike<unknown>
): Promise<[failed: true, error: E] | [failed: false, error: undefined]> {
  try {
    await promise
    return [false, void 0]
  } catch (e: any) {
    return [true, e]
  }
}
