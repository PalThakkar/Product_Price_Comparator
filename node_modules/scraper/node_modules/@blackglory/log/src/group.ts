import { go } from '@blackglory/go'
import { isUndefined } from 'extra-utils'

export function group<T>(label: string, fn: () => T): T
export function group<T>(fn: () => T): T
export function group<T>(...args:
| [label: string, fn: () => T]
| [fn: () => T]
): T {
  const [label, fn]: [string | undefined, () => T] = go(() => {
    if (args.length === 1) {
      const [fn] = args

      return [undefined, fn]
    } else {
      const [label, fn] = args

      return [label, fn]
    }
  })

  // 由于一些控制台会将undefined参数显示为'undefined', 在此确保在undefined时不传入参数.
  if (isUndefined(label)) {
    console.group()
  } else {
    console.group(label)
  }
  const result = fn()
  console.groupEnd()

  return result
}
