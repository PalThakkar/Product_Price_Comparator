export function* of<T>(val: T): IterableIterator<T> {
  yield val
}
