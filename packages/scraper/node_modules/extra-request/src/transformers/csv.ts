import { Headers } from 'extra-fetch'
import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import papaparse from 'papaparse'
import { assert } from '@blackglory/prelude'

const { unparse } = papaparse

export function csv<T extends object>(payload: T[]): IRequestOptionsTransformer {
  assert(payload.length > 0, 'payload must be a non-empty array')

  return (options: IRequestOptions) => {
    const headers = new Headers(options.headers)
    headers.set('Content-Type', 'text/csv')

    return {
      ...options
    , headers
    , payload: stringify(payload)
    }
  }
}

function stringify<T extends object>(data: T[]): string {
  const fields = Object.keys(data[0])
  return unparse({ data, fields })
}
