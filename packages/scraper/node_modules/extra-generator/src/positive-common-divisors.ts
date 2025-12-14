import { positiveFactors } from './positive-factors.js'

export function* positiveCommonDivisors(a: number, b: number): IterableIterator<number> {
  if (a !== 0 && b !== 0) {
    yield* positiveFactors(gcd(a, b))
  }
}

// Euclidean algorithm
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}
