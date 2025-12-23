import { performanceNow } from 'extra-compatible'
import { getElapsedTime } from '@utils/get-elapsed-time.js'
import { isPromiseLike } from 'extra-promise'

export function time<T>(message: string, fn: () => T): T
export function time<T>(message: string, fn: () => PromiseLike<T>): Promise<T>
export function time<T>(message: string, fn: () => T | PromiseLike<T>) {
  const startTime = performanceNow()
  const result = fn()
  if (isPromiseLike(result)) {
    return result.then(() => {
      const endTime = performanceNow()
      console.log(message, getElapsedTime(startTime, endTime))
      return result
    })
  } else {
    const endTime = performanceNow()
    console.log(message, getElapsedTime(startTime, endTime))
    return result
  }
}
