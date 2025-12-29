export function* countup(begin: number, end: number): IterableIterator<number> {
  if (begin > end) return
  for (let i = begin; i <= end; i++) {
    yield i
  }
}
