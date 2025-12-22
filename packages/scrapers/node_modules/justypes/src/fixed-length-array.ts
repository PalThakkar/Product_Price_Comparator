export type FixedLengthArray<T, Length extends number> = _FixedLengthArray<T, Length>

type _FixedLengthArray<T, Length extends number, Result extends T[] = []> =
  // 对于元组来说, length属性的值是固定的数字, 随着Result长度的增长, 它最终会等于Length.
  Result['length'] extends Length
  ? Result // 返回Result作为运算的结果
  : _FixedLengthArray<T, Length, [...Result, T]>
