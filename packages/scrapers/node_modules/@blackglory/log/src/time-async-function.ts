import { performanceNow } from 'extra-compatible'
import { getElapsedTime } from '@utils/get-elapsed-time.js'

export function timeAsyncFunction<Result, Args extends any[]>(
  message: string
, fn: (...args: Args) => PromiseLike<Result>
): (...args: Args) => Promise<Result> {
  return async function (...args: Args): Promise<Result> {
    const startTime = performanceNow()
    const result = await fn(...args)
    const endTime = performanceNow()
    console.log(message, getElapsedTime(startTime, endTime))
    return result
  }
}
