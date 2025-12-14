import { Headers } from 'extra-fetch'
import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { JSONValue, JSONSerializable } from 'justypes'

export function json<T extends JSONValue | JSONSerializable<any>>(
  payload: T
): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    const headers = new Headers(options.headers)
    headers.set('Content-Type', 'application/json')

    return {
      ...options
    , headers
    , payload: JSON.stringify(payload)
    }
  }
}
