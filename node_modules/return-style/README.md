# return-style
Non-intrusively convert the result of any function or promise to the user's desired style.

## Install
```sh
npm install --save return-style
# or
yarn add return-style
```

## API
All functions whose names are suffixed with `Async` can handle synchronous errors.
If you only need to catch asynchronous errors, use functions with the suffix `Promise`.

### isSuccess
```ts
function isSuccess(fn: () => unknown): boolean
function isSuccessAsync(fn: () => Awaitable<unknown>): Promise<boolean>
function isSuccessPromise(promise: PromiseLike<unknown>): Promise<boolean>
```

Return true when returning, false when throwing.

```ts
if (isSuccess(() => fn())) {
  ...
}

if (await isSuccessAsync(() => asyncFn())) {
  ...
}

if (await isSuccessPromise(promise)) {
  ...
}
```

### isFailure
```ts
function isFailure(fn: () => unknown): boolean
function isFailureAsync(fn: () => Awaitable<unknown>): Promise<boolean>
function isFailurePromise(promise: PromiseLike<unknown>): Promise<boolean>
```

Return true when throwing, true when returning.

```ts
if (isFailure(() => fn())) {
  ...
}

if (await isFailureAsync(() => asyncFn())) {
  ...
}

if (await isFailurePromise(promise)) {
  ...
}
```

### getResult
```ts
function getResult<T>(fn: () => T): T | undefined
function getResultAsync<T>(fn: () => Awaitable<T>): Promise<T | undefined>
function getResultPromise<T>(promise: PromiseLike<T>): Promise<T | undefined>
```

```js
const result = getResult(() => fn())
if (result) {
  ...
}

const result = await getResultAsync(() => asyncFn())
if (result) {
  ...
}

const result = await getResultPromise(promise)
if (result) {
  ...
}
```

### getError
```ts
function getError<E>(fn: () => unknown): E | undefined
function getErrorAsync<E>(fn: () => Awaitable<unknown>): Promise<E | undefined>
function getErrorPromise<E>(promise: PromiseLike<unknown>): Promise<E | undefined>
function getErrorAsyncIterable<E>(iterable: AsyncIterable<unknown>): Promise<E | undefined>
```

Designed for testing, helping to achieve Arrange-Act-Assert pattern.

```js
// BAD: try...catch
test('divided by zero', () => {
  expect.hasAssertions()

  const calc = createCalculator()

  try {
    calc.eval('1 / 0')
  } catch (err) {
    expect(err).toInstanceOf(Error)
  }
})

// BAD: toThrow
test('divided by zero', () => {
  const calc = createCalculator()

  expect(() => calc.eval('1 / 0')).toThrow(Error)
})

// GOOD: Arrange, Act, Assert
test('divided by zero', () => {
  const calc = createCalculator()

  const err = getError(() => calc.eval('1 / 0'))

  expect(err).toInstanceOf(Error)
})
```

### Tuple / Go-like
Since modern JavaScript does not advocate repeated declarations of variables (`var`), this style can sometimes be difficult to use.

#### [Error, Result]
```ts
function getErrorResult<E = Error, T = unknown>(fn: () => T): [undefined, T] | [E, undefined]
function getErrorResultAsync<E = Error, T = unknown>(fn: () => Awaitable<T>): Promise<[undefined, T] | [E, undefined]>
function getErrorResultPromise<E = Error, T = unknown>(promise: PromiseLike<T>): Promise<[undefined, T] | [E, undefined]>

```

Return tuple (Error, Result).

```ts
const [err, ret] = getErrorResult(() => fn())
const [err] = getErrorResult(() => fn())

const [err, ret] = await getErrorResultAsync(() => fnAsync())
const [err] = await getErrorResultAsync(() => fnAsync())

const [err, ret] = await getErrorResultAsync(promise)
const [err] = await getErrorResultAsync(promise)
```

#### [Result, Error]
```ts
function getResultError<E = Error, T = unknown>(fn: () => T): [T, undefined] | [undefined, E]
function getResultErrorAsync<E = Error, T = unknown>(fn: () => Awaitable<T>): Promise<[T, undefined] | [undefined, E]>
function getResultErrorPromise<E = Error, T = unknown>(promise: PromiseLike<T>): Promise<[T, undefined] | [undefined, E]>
```

Return tuple (Result, Error).

```ts
const [ret, err] = getResultError(() => fn())
const [ret] = getResultError(() => fn())

const [ret, err] = await getResultErrorAsync(() => fn())
const [ret] = await getResultErrorAsync(() => fn())

const [ret, err] = await getResultErrorPromise(promise)
const [ret] = await getResultErrorPromise(promise)
```

#### [isSuccess, Result | undefined]
```ts
function getSuccess<T>(fn: () => T): [true, T] | [false, undefined]
function getSuccessAsync<T>(fn: () => Awaitable<T>): Promise<[true, T] | [false, undefined]>
function getSuccessPromise<T>(promise: PromiseLike<T>): Promise<[true, T] | [false, undefined]>
```

Return tuple (isSuccess, Result | undefined)

```ts
const [succ, ret] = getSuccess(() => fn())

const [succ, ret] = await getSuccessAsync(() => asyncFn())

const [succ, ret] = await getSuccessPromise(promise)
```

#### [isFailure, Error | undefined]
```ts
function getFailure<E = Error>(fn: () => unknown): [true, E] | [false, undefined]
function getFailureAsync<E = Error>(fn: () => Awaitable<unknown>): Promise<[true, E] | [false, undefined]>
function getFailurePromise<E = Error>(promise: PromiseLike<unknown>): Promise<[true, E] | [false, undefined]>
```

Return tuple (isFailure, Error | undefined)

```ts
const [fail, ret] = getFailure(() => fn())

const [fail, ret] = await getFailureAsync(() => asyncFn())

const [fail, ret] = await getFailurePromise(promise)
```

### ADT / Rust-like / Haskell-like
#### Result<T, E> = Ok<T> | Err<E>
```ts
function toResult<E = Error, T = unknown>(fn: () => T): Result<T, E>
function toResultAsync<E = Error, T = unknown>(fn: () => Awaitable<T>): Promise<Result<T, E>>
function toResultPromise<E = Error, T = unknown>(promise: PromiseLike<T>): Promise<Result<T, E>>
```

`Result` is designed according to Rust's enumeration of the same name,
please refer to the relevant documentation.

```ts
class Result<T, E> {
  static Ok(val: T) => Result<T, E>
  static Err(err: E) => Result<never, E>

  isOk(): boolean
  isErr(): boolean

  map<U>(mapper: (val: T) => U): Result<U, E>
  mapOr<U>(defaultValue: U, mapper: (val: T) => U): Result<U, E>
  mapOrElse<U>(createDefaultValue: (err: E) => U, mapper: (val: T) => U): Result<U, E>
  mapErr<U>(mapper: (err: E) => U): Result<T, U>

  /**
   * @throws {E}
   */
  unwrap(): T

  unwrapOr<U>(defaultValue: U): T | U
  unwrapOrElse<U>(createDefaultValue: (err: E) => U): T | U

  /**
   * @throws {Error}
   */
  unwrapErr(): E

  /**
   * @throws {Error}
   */
  expect(message: string): T

  /**
   * @throws {Error}
   */
  expectErr(message: string): E

  ok(): Option<T>
  err(): Option<E>
}
```

#### Option<T> = Some<T> | None
```ts
function toOption<T>(fn: () => T): Option<T>
function toOptionAsync<T>(fn: () => Awaitable<T>): Promise<Option<T>>
function toOptionPromise<T>(promise: PromiseLike<T>): Promise<Option<T>>
```

`Option` is designed according to Rust's enumeration of the same name,
please refer to the relevant documentation.

```ts
class Option<T> {
  static Some<T>(val: T) => Option<T>
  static None<T>() => Option<T>

  isSome(): boolean
  isNone(): boolean

  map<U>(mapper: (val: T) => U): Option<U>
  mapOr<U>(defaultValue: U, mapper: (val: T) => U): Option<U>
  mapOrElse<U>(createDefaultValue: () => U, mapper: (val: T) => U): Option<U>

  filter<U extends T = T>(predicate: (val: T) => boolean): Option<U>

  /**
   * @throws {Error}
   */
  unwrap(): T

  unwrapOr<U>(defaultValue: U): T | U
  unwrapOrElse<U>(createDefaultValue: () => U): T | U

  /**
   * @throws {Error}
   */
  expect(message: string): T

  okOr<E>(err: E): Result<T, E>
  okOrElse<E>(createErr: () => E): Result<T, E>
}
```
