import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { setPort } from 'url-operator'

export function port(port: number): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: setPort(options.url, port)
    }
  }
}
