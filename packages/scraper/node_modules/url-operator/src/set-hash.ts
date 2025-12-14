export function setHash(url: URL, hash: string): URL {
  const newURL = new URL(url)

  newURL.hash = hash

  return newURL
}
