export function setSearch(url: URL, search: string): URL {
  const newURL = new URL(url)

  newURL.search = search

  return newURL
}
