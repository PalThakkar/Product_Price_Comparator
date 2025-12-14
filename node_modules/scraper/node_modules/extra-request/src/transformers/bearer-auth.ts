import { header } from './header.js'
import { IRequestOptionsTransformer } from '@src/types.js'

export function bearerAuth(token: string): IRequestOptionsTransformer {
  return header('Authorization', `Bearer ${token}`)
}
