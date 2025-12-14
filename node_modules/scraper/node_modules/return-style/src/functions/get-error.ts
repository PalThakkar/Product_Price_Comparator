export function getError<E = Error>(fn: () => unknown): E | undefined {
  try {
    fn()
  } catch (syncError: any) {
    return syncError
  }
  return
}
