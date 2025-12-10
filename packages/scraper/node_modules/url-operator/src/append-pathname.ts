import { go } from '@blackglory/prelude'

export function appendPathname(url: URL, pathname: string): URL {
  const baseURL = go(() => {
    const baseURL = new URL(url)
    if (!baseURL.pathname.endsWith('/')) {
      baseURL.pathname = `${baseURL.pathname}/`
    }

    return baseURL
  })

  const newURL = new URL(
    pathname.replace(/^\/*/, '')
  , baseURL
  )
  newURL.search = baseURL.search
  newURL.hash = baseURL.hash

  return newURL
}
