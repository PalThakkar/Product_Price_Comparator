import { bufferToHex } from '@utils/buffer-to-hex.js'

export async function hmacSHA256(secret: string, text: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw'
  , encoder.encode(secret)
  , {
      name: 'HMAC'
    , hash: { name: 'SHA-256' }
    }
  , false
  , ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(text))
  return bufferToHex(signature)
}
