export async function* stringifyJSONStreamAsync<T>(
  asyncIterable: AsyncIterable<T>
): AsyncIterable<string> {
  const iter = asyncIterable[Symbol.asyncIterator]()
  let done: boolean | undefined

  try {
    let value: T
    ;({ value, done } = await iter.next())
    yield '['
    if (!done) yield JSON.stringify(value)
    while ({ value, done } = await iter.next(), !done) {
      yield ',' + JSON.stringify(value)
    }
    yield ']'
  } finally {
    if (!done) await iter.return?.()
  }
}
