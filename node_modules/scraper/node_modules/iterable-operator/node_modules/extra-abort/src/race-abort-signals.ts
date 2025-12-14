import { Falsy } from 'justypes'
import { AbortController } from './abort-controller.js'

export function raceAbortSignals(signals: Array<AbortSignal | Falsy>): AbortSignal {
  const controller = new AbortController()
  const subscribedAbortSignals: AbortSignal[] = []
  for (const signal of signals) {
    if (signal) {
      if (signal.aborted) {
        controller.abort()
        break
      } else {
        signal.addEventListener('abort', abort)
        subscribedAbortSignals.push(signal)
      }
    }
  }
  return controller.signal

  function abort() {
    controller.abort()
    subscribedAbortSignals.forEach(x => x.removeEventListener('abort', abort))
  }
}
