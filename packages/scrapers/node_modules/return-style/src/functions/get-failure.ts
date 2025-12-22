export function getFailure<E = Error>(
  fn: () => unknown
): [failed: true, error: E] | [faled: false, error: undefined] {
  try {
    fn()
    return [false, void 0]
  } catch (e: any) {
    return [true, e]
  }
}
