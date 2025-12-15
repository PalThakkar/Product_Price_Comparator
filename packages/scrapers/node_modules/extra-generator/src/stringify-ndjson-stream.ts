export function* stringifyNDJSONStream<T>(iterable: Iterable<T>): Iterable<string> {
  const iter = iterable[Symbol.iterator]()
  let done: boolean | undefined

  try {
    let value: T
    ;({ value, done } = iter.next())
    if (!done) yield JSON.stringify(value)
    while ({ value, done } = iter.next(), !done) {
      yield '\n' + JSON.stringify(value)
    }
  } finally {
    if (!done) iter.return?.()
  }
}
