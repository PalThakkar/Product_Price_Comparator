export function* reverse<T>(arr: ArrayLike<T>): IterableIterator<T> {
  for (let i = arr.length; i--;) {
    yield arr[i]
  }
}
