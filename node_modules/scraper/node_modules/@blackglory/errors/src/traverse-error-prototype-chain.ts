export function* traverseErrorPrototypeChain(err: Error): Iterable<Error> {
  let current = err
  while ((current = Object.getPrototypeOf(current))) {
    yield current
    if (current === Error.prototype) break
  }
}
