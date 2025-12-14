export function* ngrams(text: string, n: number): IterableIterator<string> {
  for (let i = 0; i < text.length; i++) {
    const result = text.slice(i, i + n)
    if (result.length === n) {
      yield result
    }
  }
}
