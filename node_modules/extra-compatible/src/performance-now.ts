import { performance } from 'perf_hooks'

export function performanceNow(): number {
  return performance.now()
}
