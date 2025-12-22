export function isSuccess(fn: () => unknown): boolean {
  try {
    fn()
    return true
  } catch {
    return false
  }
}
