import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'

export function cache(cache: RequestCache): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , cache
    }
  }
}
