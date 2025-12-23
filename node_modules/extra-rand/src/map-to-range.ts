export function mapToRange(
  value: number
, oldMin: number, oldMax: number
, newMin: number, newMax: number
): number {
  return (value - oldMin) / (oldMax - oldMin)
       * (newMax - newMin)
       + newMin
}
