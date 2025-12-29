export function setHost(url: URL, host: string): URL {
  const newURL = new URL(url)

  newURL.host = host

  return newURL
}
