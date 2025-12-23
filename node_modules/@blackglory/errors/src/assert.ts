import { AssertionError } from './assertion-error.js'

/**
 * @throws {AssertionError}
 */
export function assert(
  condition: unknown
, message: string = 'Assertion failed'
): asserts condition {
  if (!condition) throw new AssertionError(message)
}
