# errors
Common errors.

## Install
```sh
npm install --save @blackglory/errors
# or
yarn add @blackglory/errors
```

## API
```ts
type CustomErrorConstructor<T extends CustomError = CustomError> =
  new (message?: string) => T

interface SerializableError {
  name: string
  message: string
  stack: string | null
  ancestors: string[]
}
```

### CustomError
```ts
class CustomError extends Error {}
```

`CustomError` has better default behaviors than `Error`:
- `console.error` prints the correct exception name, not `Error`.
- `instanceof` operator matches based on names rather than inheritance relationships, which helps `SerializableError instanceof CustomError`.

### AssertionError
```ts
class AssertionError extends CustomError {}
```

### isError
```ts
function isError(val: unknown): val is Error
function isntError<T>(val: T): val is Exclude<T, Error>
```

### normalize
```ts
function normalize(err: Error): SerializableError
```

### hydrate
```ts
function hydrate(err: SerializableError): Error
```

### isSerializableError
```ts
function isSerializableError(val: unknown): val is SerializableError
```

### assert
```ts
/**
 * @throws {AssertionError}
 */
function assert(condition: unknown, message?: string): asserts condition
```

### getErrorNames
```ts
function getErrorNames(err: Error | SerializableError): Iterable<string>
```

### traverseErrorPrototypeChain
```ts
function traverseErrorPrototypeChain(err: Error): Iterable<Error>
```
