import { header } from './header.js'
import { IRequestOptionsTransformer } from '@src/types.js'
import { encode } from 'js-base64'

export function basicAuth(
  username: string
, password: string
): IRequestOptionsTransformer {
  return header('Authorization', 'Basic ' + encode(`${username}:${password}`))
}
