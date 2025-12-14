import { FixedLengthArray } from './fixed-length-array'

export type Matrix<T, M extends number, N extends number> = FixedLengthArray<
  FixedLengthArray<T, N>
, M
>
