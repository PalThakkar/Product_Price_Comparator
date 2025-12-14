import { Getter, isFunction } from '@blackglory/prelude'

export function getValue<T>(val: T | Getter<T>): T {
  if (isFunction(val)) {
    return val()
  } else {
    return val
  }
}
