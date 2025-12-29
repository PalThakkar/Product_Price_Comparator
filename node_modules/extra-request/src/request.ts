import { Headers, Request } from 'extra-fetch'
import { IRequestOptionsTransformer } from '@src/types.js'
import { pipeRequestOptionsTransformers } from '@src/pipe-request-options-transformers.js'
import { Falsy } from '@blackglory/prelude'

export function get(...transformers: Array<IRequestOptionsTransformer | Falsy>): Request {
  return request('GET', ...transformers)
}

export function head(...transformers: Array<IRequestOptionsTransformer | Falsy>): Request {
  return request('HEAD', ...transformers)
}

export function post(...transformers: Array<IRequestOptionsTransformer | Falsy>): Request {
  return request('POST', ...transformers)
}

export function put(...transformers: Array<IRequestOptionsTransformer | Falsy>): Request {
  return request('PUT', ...transformers)
}

export function patch(...transformers: Array<IRequestOptionsTransformer | Falsy>): Request {
  return request('PATCH', ...transformers)
}

export function del(...transformers: Array<IRequestOptionsTransformer | Falsy>): Request {
  return request('DELETE', ...transformers)
}

export function request(
  method: 'GET' | 'HEAD' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'
, ...transformers: Array<IRequestOptionsTransformer | Falsy>
): Request {
  const requestOptions = pipeRequestOptionsTransformers(...transformers)
  const headers = new Headers(requestOptions.headers)

  return new Request(requestOptions.url.href, {
    method
  , headers
  , signal: requestOptions.signal
  , body: requestOptions.payload
  , keepalive: requestOptions.keepalive
  , redirect: requestOptions.redirect
  })
}
