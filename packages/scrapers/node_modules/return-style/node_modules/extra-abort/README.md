# extra-abort
## Install
```sh
npm install --save extra-abort
# or
yarn add extra-abort
```

## API
### AbortController, AbortSignal
The WHATWG `AbortController` and `AbortSignal`.

### AbortError
```ts
class AbortError extends CustomError {}
```

It is not the real `AbortError` of `fetch`,
but you can do `err instance AbortError` like it is,
because it can recognizes other errors that match the pattern of `AbortError`.

### LinkedAbortController
```ts
class LinkedAbortController extends AbortController {
  constructor(signal: AbortSignal)
}
```

It is a special `AbortController` that takes an `AbortSignal` as a parameter.
It will abort itself when its parameter signal aborts,
you can make it abort by calling its `abort` method too.

### timeoutSignal
```ts
function timeoutSignal(ms: number): AbortSignal
```

It will abort after `ms` milliseconds.

```ts
await fetch('http://example.com', { signal: timeoutSignal(5000) })
```

### withAbortSignal
```ts
/**
 * @throws {AbortError}
 */
function withAbortSignal<T>(signal: AbortSignal | Falsy, fn: () => PromiseLike<T>): Promise<T>
```

If `AbortSignal` is aborted, the promise will be rejected with `AbortError`.

### raceAbortSignals
```ts
function raceAbortSignals(signals: Array<AbortSignal | Falsy>): AbortSignal
```

The `Promise.race` function for `AbortSignal`.

### isAbortSignal
```ts
function isAbortSignal(val: unknown): val is AbortSignal
```

### lastCallOnly
```ts
function lastCallOnly<T, Args extends unknown[]>(
  fn: (...args: [...args: Args, signal: AbortSignal]) => PromiseLike<T>
): (...args: [...args: Args, signal: AbortSignal | Falsy]) => Promise<T>
```
