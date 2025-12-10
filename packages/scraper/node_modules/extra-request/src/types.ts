export type IRequestOptionsTransformer = (options: IRequestOptions) => IRequestOptions

/**
 * Q: Why not use `RequestInit` interface?
 * A: Because `RequestInit` has no `url` property,
 *    and its optional properties are not suitable for our cases.
 */
export interface IRequestOptions {
  url: URL
  headers: Headers
  payload?: BodyInit
  signal?: AbortSignal
  keepalive?: boolean
  redirect?: RequestRedirect
  cache?: RequestCache
}
