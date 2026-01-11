import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { setSearchParams } from 'url-operator'

export function searchParams<T extends Record<string, string | number>>(
  searchParams: T
): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: setSearchParams(options.url, searchParams)
    }
  }
}
