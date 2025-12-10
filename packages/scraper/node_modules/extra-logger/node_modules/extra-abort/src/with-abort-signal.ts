import { Falsy } from 'justypes'
import { AbortError } from './abort-error.js'

/**
 * @throws {AbortError}
 */
export async function withAbortSignal<T>(
  signal: AbortSignal | Falsy
, fn: () => PromiseLike<T>
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    if (signal) {
      if (signal.aborted) return rejectByAbortSignal()
      signal.addEventListener('abort', rejectByAbortSignal)
    }

    try {
      resolve(await fn())
    } catch (e) {
      reject(e)
    } finally {
      if (signal) {
        signal.removeEventListener('abort', rejectByAbortSignal)
      }
    }

    function rejectByAbortSignal() {
      reject(new AbortError())
    }
  })
}
