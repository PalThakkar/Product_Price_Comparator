import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'

export function signal(signal: AbortSignal): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , signal
    }
  }
}
