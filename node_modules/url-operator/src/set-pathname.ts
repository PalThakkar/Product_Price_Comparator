export function setPathname(url: URL, pathname: string): URL {
  const newURL = new URL(url)

  newURL.pathname = pathname

  return newURL
}
