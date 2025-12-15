import * as crypto from 'crypto'
import { TypedArray } from '@blackglory/prelude'

export async function hash(
  algorithm: string
, input: string | DataView | TypedArray
): Promise<string> {
  return crypto.createHash(algorithm)
    .update(input)
    .digest('hex')
}
