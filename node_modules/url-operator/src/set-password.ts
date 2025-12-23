export function setPassword(url: URL, password: string): URL {
  const newURL = new URL(url)

  newURL.password = password

  return newURL
}
