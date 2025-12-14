export function setUsername(url: URL, username: string): URL {
  const newURL = new URL(url)

  newURL.username = username

  return newURL
}
