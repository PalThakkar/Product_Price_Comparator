import { performanceNow } from 'extra-compatible'
import { getElapsedTime } from '@utils/get-elapsed-time.js'

export function timeFunction<Result, Args extends any[]>(
  message: string
, fn: (...args: Args) => Result
): (...args: Args) => Result {
  return function (...args: Args): Result {
    const startTime = performanceNow()
    const result = fn(...args)
    const endTime = performanceNow()
    console.log(message, getElapsedTime(startTime, endTime))
    return result
  }
}
