# url-operator
The library constrains URLs by types of the function parameters:
- A `URL` parameter only accepts an absolute URL.
- A `string` parameter accepts either an absolute URL or a relative URL.

## Install
```sh
npm install --save url-operator
# or
yarn add url-operator
```

## API
### setProtocol
```ts
function setProtocol(url: URL, protocol: string): URL
```

### setUsername
```ts
function setUsername(url: URL, username: string): URL
```

### setPassword
```ts
function setPassword(url: URL, password: string): URL
```

### setHost
```ts
function setHost(url: URL, host: string): URL
```

### setPort
```ts
function setPort(url: URL, port: number): URL
```

### setPathname
```ts
function setPathname(url: URL, pathname: string): URL
```

### appendPathname
```ts
function appendPathname(url: URL, pathname: string): URL
```

### setSearch
```ts
function setSearch(url: URL, search: string): URL
```

### setSearchParam
```ts
function setSearchParam(url: URL, name: string, value: string | number): URL
```

### setSearchParams
```ts
function setSearchParams(url: URL, searchParams: Record<string, string | number>): URL
```

### appendSearchParam
```ts
function appendSearchParam(url: URL, name: string, value: string | number): URL
```

### setHash
```ts
function setHash(url: URL, hash: string): URL
```

### encode
```ts
function encode(url: string): string
```

### decode
```ts
function decode(url: string): string
```
