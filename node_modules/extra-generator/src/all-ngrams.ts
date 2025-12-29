export function* allNgrams(text: string): IterableIterator<string> {
  for (let i = 0; i < text.length; i++) {
    for (let j = i; j < text.length; j++) {
      const result = text.slice(i, j + 1)
      yield result
    }
  }
}
