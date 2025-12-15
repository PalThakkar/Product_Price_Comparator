export function setProtocol(url: URL, protocol: string): URL {
  const oldURL = new URL(url)

  // WHATWG URL标准在更改协议时有一些怪癖, 故在此通过直接修改字符串来达到目的.
  const newURL = new URL(
    oldURL.href.replace(
      /^(\S+:)\/\//
    , protocol.endsWith(':')
      ? protocol
      : `${protocol}://`
    )
  )

  return newURL
}
