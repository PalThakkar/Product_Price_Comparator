import { Headers } from 'extra-fetch'
import { IRequestOptions, IRequestOptionsTransformer } from '@src/types.js'
import { isntFalsy } from '@blackglory/prelude'
import { Falsy } from '@blackglory/prelude'
import { pipe } from 'extra-utils'

export function pipeRequestOptionsTransformers(
  ...transformers: Array<IRequestOptionsTransformer | Falsy>
): IRequestOptions {
  const base: IRequestOptions = {
    url: new URL(
      typeof document !== 'undefined'
    ? document.baseURI
    : 'http://localhost'
    )
  , headers: new Headers()
  }

  return pipe(
    base
  , ...transformers.filter<IRequestOptionsTransformer>(isntFalsy)
  )
}
