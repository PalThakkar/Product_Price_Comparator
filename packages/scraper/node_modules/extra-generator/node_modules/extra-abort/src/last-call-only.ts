import { Falsy } from 'justypes'
import { pass } from '@blackglory/pass'
import { go } from '@blackglory/go'
import { LinkedAbortController } from './linked-abort-controller.js'
import { AbortController } from './abort-controller.js'

export function lastCallOnly<T, Args extends unknown[]>(
  fn: (...args: [...args: Args, signal: AbortSignal]) => PromiseLike<T>
): (...args: [...args: Args, signal: AbortSignal | Falsy]) => Promise<T> {
  let lastController: AbortController | undefined
  let lastPromise: Promise<T> | undefined

  return (...args: [...args: Args, signal: AbortSignal | Falsy]): Promise<T> => {
    const realArgs = args.slice(0, -1) as Args
    const signal = args[args.length - 1] as AbortSignal | Falsy

    lastController?.abort()
    const controller = signal
      ? new LinkedAbortController(signal)
      : new AbortController()
    lastController = controller

    const promise = go(async () => {
      try {
        await lastPromise
      } catch {
        pass()
      }

      if (controller.signal.aborted) throw controller.signal.reason
      return await fn(...realArgs, controller.signal)
    })
    lastPromise = promise

    return promise
  }
}
