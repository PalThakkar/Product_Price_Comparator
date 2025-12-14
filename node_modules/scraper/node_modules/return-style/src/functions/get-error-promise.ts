export async function getErrorPromise<E = Error>(
  promise: PromiseLike<unknown>
): Promise<E | undefined> {
  try {
    await promise
  } catch (err: any) {
    return err
  }
  return
}
