import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import * as URL from 'url-operator'

export function appendPathname(pathname: string): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: URL.appendPathname(options.url, pathname)
    }
  }
}
