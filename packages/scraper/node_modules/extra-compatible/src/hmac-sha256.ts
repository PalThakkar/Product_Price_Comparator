import * as crypto from 'crypto'

export async function hmacSHA256(secret: string, text: string): Promise<string> {
  return crypto.createHmac('sha256', secret)
    .update(text)
    .digest()
    .toString('hex')
}
