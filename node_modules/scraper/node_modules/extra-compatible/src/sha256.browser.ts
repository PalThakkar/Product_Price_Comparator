import { TypedArray } from '@blackglory/prelude'
import { hash } from '@utils/hash.browser.js'

export function sha256(input: string | DataView | TypedArray): Promise<string> {
  return hash('SHA-256', input)
}
