export function getSuccess<T>(
  fn: () => T
): [succeeded: true, result: T] | [succeeded: false, result: undefined] {
  try {
    const result = fn()
    return [true, result]
  } catch {
    return [false, void 0]
  }
}
