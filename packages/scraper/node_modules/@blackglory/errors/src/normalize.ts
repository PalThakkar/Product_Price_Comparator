import { getErrorNames } from './get-error-names.js'
import { SerializableError } from './serializable-error.js'
import { toArray } from './utils.js'

export function normalize(err: Error): SerializableError {
  const [name, ...ancestors] = toArray(getErrorNames(err))
  return {
    name
  , ancestors
  , message: err.message
  , stack: err.stack ?? null
  }
}
