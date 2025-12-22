import { Falsy } from 'justypes'
import { SyncDestructor } from 'extra-defer'

/**
 * @throws {AbortError}
 */
export async function withAbortSignal<T>(
  signal: AbortSignal | Falsy
, fn: () => PromiseLike<T>
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    const destructor = new SyncDestructor()

    if (signal) {
      if (signal.aborted) {
        rejectByAbortSignal(signal)

        return
      }

      const handler = () => rejectByAbortSignal(signal)
      signal.addEventListener('abort', handler)
      destructor.defer(() => signal.removeEventListener('abort', handler))
    }

    try {
      resolve(await fn())
    } catch (e) {
      reject(e)
    } finally {
      destructor.execute()
    }

    function rejectByAbortSignal(signal: AbortSignal): void {
      reject(signal.reason)
    }
  })
}
