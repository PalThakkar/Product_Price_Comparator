import { Headers } from 'extra-fetch'
import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'

export function headers<T extends Record<string, string>>(
  headers: T
): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    const newHeaders = new Headers(options.headers)
    for (const [name, value] of Object.entries(headers)) {
      newHeaders.set(name, value)
    }

    return {
      ...options
    , headers: newHeaders
    }
  }
}
