import { IRequestOptionsTransformer, IRequestOptions } from '@src/types.js'

export function keepalive(keepalive: boolean = true): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , keepalive
    }
  }
}
