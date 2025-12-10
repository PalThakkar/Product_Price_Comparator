import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { NonEmptyArray } from 'justypes'

export function url(...urls: NonEmptyArray<string | URL>): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    const newURL = new URL(
      [options.url, ...urls].reduce((acc, cur) => new URL(cur, acc))
    )

    return {
      ...options
    , url: newURL
    }
  }
}
