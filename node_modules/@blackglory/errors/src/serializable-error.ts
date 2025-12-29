import { isObject, isString, isArray, isNull } from 'extra-utils'

export interface SerializableError {
  name: string
  message: string
  stack: string | null
  ancestors: string[]
}

export function isSerializableError(val: unknown): val is SerializableError {
  return isObject(val)
      && isString(val.name)
      && isString(val.message)
      && (isString(val.stack) || isNull(val.stack))
      && (isArray(val.ancestors) && val.ancestors.every(isString))
}
