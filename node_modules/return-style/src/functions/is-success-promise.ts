export async function isSuccessPromise(promise: PromiseLike<unknown>): Promise<boolean> {
  try {
    await promise
    return true
  } catch {
    return false
  }
}
