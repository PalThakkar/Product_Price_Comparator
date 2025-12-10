export function encode(url: string): string {
  return encodeURI(decodeURI(url))
}
