export async function isFailurePromise(promise: PromiseLike<unknown>): Promise<boolean> {
  try {
    await promise
    return false
  } catch {
    return true
  }
}
