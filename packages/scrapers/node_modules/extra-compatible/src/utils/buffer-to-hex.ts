import { map, toArray } from 'iterable-operator'

export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return toArray(
    map(
      bytes
    , byte => byte.toString(16).padStart(2, '0')
    )
  ).join('')
}
