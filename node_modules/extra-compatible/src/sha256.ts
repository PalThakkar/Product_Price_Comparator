import { TypedArray } from '@blackglory/prelude'
import { hash } from '@utils/hash.js'

export function sha256(input: string | DataView | TypedArray): Promise<string> {
  return hash('SHA256', input)
}
