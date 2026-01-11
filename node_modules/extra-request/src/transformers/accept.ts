import { appendHeader } from './append-header.js'
import { IRequestOptionsTransformer } from '@src/types.js'

export function accept(accept: string): IRequestOptionsTransformer {
  return appendHeader('Accept', accept)
}
