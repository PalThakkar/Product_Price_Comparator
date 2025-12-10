# extra-logger
## Install
```sh
npm install --save extra-logger
# or
yarn add extra-logger
```

## API
```ts
enum Level {
  Trace
, Debug
, Info
, Warn
, Error
, Fatal
, None
}

interface ITransport {
  send(message: IMessage): void
}

interface IMessage {
  level: Level
  timestamp: number
  message: string
  namespace?: string
  elapsedTime?: number
}
```

### Logger
```ts
interface ILoggerOptions {
  level: Level
  transport: ITransport
  namespace?: string
}

class Logger {
  constructor(options: ILoggerOptions)

  trace(message: string | Getter<string>, elapsedTime?: number): void
  traceAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void>

  info(message: string | Getter<string>, elapsedTime?: number): void
  infoAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void>

  debug(message: string | Getter<string>, elapsedTime?: number): void
  debugAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void>

  warn(message: string | Getter<string>, elapsedTime?: number): void
  warnAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void>

  error(message: string | Getter<string>, elapsedTime?: number): void
  errorAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void>

  fatal(message: string | Getter<string>, elapsedTime?: number): void
  fatalAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void>

  traceTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T
  traceTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T>

  infoTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T
  infoTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T>

  debugTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T
  debugTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T>

  warnTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T
  warnTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T>

  errorTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T
  errorTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T>

  fatalTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T
  fatalTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T>

  traceTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result
  traceTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result>

  infoTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result
  infoTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result>

  debugTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result
  debugTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result>

  warnTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result
  warnTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result>

  errorTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result
  errorTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result>

  fatalTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result
  fatalTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result>
}
```

### TerminalTransport
```ts
interface ITerminalTransportOptions {
  logMinimumDuration?: number
}

class TerminalTransport implements ITransport {
  constructor(options?: ITerminalTransportOptions)
}
```

### stringToLevel
```ts
function stringToLevel(text: string, fallback: Level = Level.None): Level
```
