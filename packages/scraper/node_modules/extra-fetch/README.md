# extra-fetch
## Install
```sh
npm install --save extra-fetch
# or
yarn add extra-fetch
```

## API
- fetch
- Headers
- Request
- Response
- FormData
- AbortController
- Blob
- EventSource

## Logging
When using `fetch` in Node.js, logging can be enabled by setting the environment variable `EXTRA_FETCH_LOG`.

### Level
- `EXTRA_FETCH_LOG=none`: disable.
- `EXTRA_FETCH_LOG=error`: log ids, timestamps, elapsed time, errors on failure.
- `EXTRA_FETCH_LOG=info`: log all of the above, and the urls, methods, status codes of each request and response.
- `EXTRA_FETCH_LOG=trace`: log all of the above, and the headers of each request and response.

## HTTP/2
When using `fetch` in Node.js, HTTP/2 is enabled by default.
You can disable HTTP/2 by setting the environment variable `EXTRA_FETCH_HTTP2=false`.
