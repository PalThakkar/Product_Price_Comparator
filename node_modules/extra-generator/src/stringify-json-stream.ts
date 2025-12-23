export function* stringifyJSONStream<T>(iterable: Iterable<T>): Iterable<string> {
  const iter = iterable[Symbol.iterator]()
  let done: boolean | undefined

  try {
    let value: T
    ;({ value, done } = iter.next())
    yield '['
    if (!done) yield JSON.stringify(value)
    while ({ value, done } = iter.next(), !done) {
      yield ',' + JSON.stringify(value)
    }
    yield ']'
  } finally {
    if (!done) iter.return?.()
  }
}
