import { AbortSignal } from './abort-signal.js'

export function isAbortSignal(val: unknown): val is AbortSignal {
  return val instanceof AbortSignal
}

export function isntAbortSignal<T>(val: T): val is Exclude<T, AbortSignal> {
  return !isAbortSignal(val)
}
