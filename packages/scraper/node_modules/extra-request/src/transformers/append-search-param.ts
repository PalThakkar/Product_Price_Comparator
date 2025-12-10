import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import * as URL from 'url-operator'

export function appendSearchParam(
  name: string
, value: string | number
): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: URL.appendSearchParam(options.url, name, value)
    }
  }
}
