import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { setPathname } from 'url-operator'

export function pathname(pathname: string): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: setPathname(options.url, pathname)
    }
  }
}
