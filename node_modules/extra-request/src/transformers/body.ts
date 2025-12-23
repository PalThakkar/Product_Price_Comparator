import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'

export function body(body: BodyInit): IRequestOptionsTransformer {
  return (options: IRequestOptions) => {
    return {
      ...options
    , payload: body
    }
  }
}
