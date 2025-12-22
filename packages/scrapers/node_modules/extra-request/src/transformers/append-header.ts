import { Headers } from 'extra-fetch'
import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'

export function appendHeader(name: string, value: string): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    const headers = new Headers(options.headers)
    headers.append(name, value)

    return {
      ...options
    , headers
    }
  }
}
