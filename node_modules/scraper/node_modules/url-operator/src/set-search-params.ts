export function setSearchParams(
  url: URL
, searchParams: Record<string, string | number>
): URL {
  const newURL = new URL(url)

  const newSearchParams = new URLSearchParams(newURL.searchParams)
  for (const [name, value] of Object.entries(searchParams)) {
    newSearchParams.set(name, value.toString())
  }
  newURL.search = newSearchParams.toString()

  return newURL
}
