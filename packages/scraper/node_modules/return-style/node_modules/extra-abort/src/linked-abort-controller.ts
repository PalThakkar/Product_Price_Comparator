import { AbortController } from './abort-controller.js'

export class LinkedAbortController extends AbortController {
  constructor(signal: AbortSignal) {
    super()

    if (signal.aborted) {
      this.abort(signal.reason)
    } else {
      signal.addEventListener('abort', () => {
        this.abort(signal.reason)
      }, { once: true })
    }
  }
}
