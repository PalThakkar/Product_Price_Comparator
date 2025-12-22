# extra-compatible
## Install
```sh
npm install --save extra-compatible
# or
yarn add extra-compatible
```

## API
### performanceNow
```ts
function performanceNow(): number
```

### hmacSHA256
```ts
function hmacSHA256(secret: string, text: string): Promise<string>
```

### sha256
```ts
function sha256(input: string | DataView | TypedArray): Promise<string>
```

### sha1
```ts
function sha1(input: string | DataView | TypedArray): Promise<string>
```
