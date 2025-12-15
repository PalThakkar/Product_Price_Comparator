import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { setSearchParam } from 'url-operator'

export function searchParam(
  name: string
, value: string | number
): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: setSearchParam(options.url, name, value)
    }
  }
}
