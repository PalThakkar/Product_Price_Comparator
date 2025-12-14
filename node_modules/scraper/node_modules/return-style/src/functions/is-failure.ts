export function isFailure(fn: () => unknown): boolean {
  try {
    fn()
    return false
  } catch {
    return true
  }
}
