import { bufferToHex } from '@utils/buffer-to-hex.js'
import { TypedArray, isString } from '@blackglory/prelude'

export async function hash(
  algorithm: AlgorithmIdentifier
, input: string | DataView | TypedArray
): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, toArrayBufferView(input))
  return bufferToHex(hashBuffer)
}

function toArrayBufferView(input: string | DataView | TypedArray): ArrayBufferView {
  if (isString(input)) {
    const encoder = new TextEncoder()
    return encoder.encode(input)
  } else if (input instanceof DataView) {
    return input
  } else {
    return new DataView(input.buffer)
  }
}
