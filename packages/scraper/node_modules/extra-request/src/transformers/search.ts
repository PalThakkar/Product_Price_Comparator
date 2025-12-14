import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { setSearch } from 'url-operator'

export function search(search: string): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , url: setSearch(options.url, search)
    }
  }
}
