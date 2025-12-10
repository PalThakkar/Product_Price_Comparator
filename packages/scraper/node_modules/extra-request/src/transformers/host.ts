import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { setHost } from 'url-operator'

export function host(host: string): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: setHost(options.url, host)
    }
  }
}
