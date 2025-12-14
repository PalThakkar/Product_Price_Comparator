export async function* stringifyNDJSONStreamAsync<T>(
  asyncIterable: AsyncIterable<T>
): AsyncIterable<string> {
  const iter = asyncIterable[Symbol.asyncIterator]()
  let done: boolean | undefined

  try {
    let value: T
    ;({ value, done } = await iter.next())
    if (!done) yield JSON.stringify(value)
    while ({ value, done } = await iter.next(), !done) {
      yield '\n' + JSON.stringify(value)
    }
  } finally {
    if (!done) await iter.return?.()
  }
}
