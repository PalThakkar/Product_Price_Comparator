import { TypedArray } from '@blackglory/prelude'
import { hash } from '@utils/hash.browser.js'

export function sha1(input: string | DataView | TypedArray): Promise<string> {
  return hash('SHA-1', input)
}
