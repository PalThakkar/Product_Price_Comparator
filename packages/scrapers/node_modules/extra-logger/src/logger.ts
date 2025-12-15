import { Awaitable, Getter } from '@blackglory/prelude'
import { ITransport, Level } from '@src/types.js'
import { getValue } from '@utils/get-value.js'
import { measureElapsedTime, measureElapsedTimeAsync } from '@utils/measure-elapsed-time.js'

export interface ILoggerOptions {
  level: Level
  transport: ITransport
  namespace?: string
}

export class Logger {
  constructor(private options: ILoggerOptions) {}

  trace(message: string | Getter<string>, elapsedTime?: number): void {
    return this.logByLevel(Level.Trace, message, elapsedTime)
  }

  traceAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.logByLevelAsync(Level.Trace, message, elapsedTime)
  }

  info(message: string | Getter<string>, elapsedTime?: number): void {
    return this.logByLevel(Level.Info, message, elapsedTime)
  }

  infoAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.logByLevelAsync(Level.Info, message, elapsedTime)
  }

  debug(message: string | Getter<string>, elapsedTime?: number): void {
    return this.logByLevel(Level.Debug, message, elapsedTime)
  }

  debugAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.logByLevelAsync(Level.Debug, message, elapsedTime)
  }

  warn(message: string | Getter<string>, elapsedTime?: number): void {
    return this.logByLevel(Level.Warn, message, elapsedTime)
  }

  warnAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.logByLevelAsync(Level.Warn, message, elapsedTime)
  }

  error(message: string | Getter<string>, elapsedTime?: number): void {
    this.logByLevel(Level.Error, message, elapsedTime)
  }

  errorAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.logByLevelAsync(Level.Error, message, elapsedTime)
  }

  fatal(message: string | Getter<string>, elapsedTime?: number): void {
    this.logByLevel(Level.Fatal, message, elapsedTime)
  }

  fatalAsync(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.logByLevelAsync(Level.Fatal, message, elapsedTime)
  }

  traceTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T {
    return this.logTimeByLevel(Level.Trace, message, expression)
  }

  traceTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    return this.logTimeByLevelAsync(Level.Trace, message, expression)
  }

  infoTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T {
    return this.logTimeByLevel(Level.Info, message, expression)
  }

  infoTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    return this.logTimeByLevelAsync(Level.Info, message, expression)
  }

  debugTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T {
    return this.logTimeByLevel(Level.Debug, message, expression)
  }

  debugTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    return this.logTimeByLevelAsync(Level.Debug, message, expression)
  }

  warnTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T {
    return this.logTimeByLevel(Level.Warn, message, expression)
  }

  warnTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    return this.logTimeByLevelAsync(Level.Warn, message, expression)
  }

  errorTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T {
    return this.logTimeByLevel(Level.Error, message, expression)
  }

  errorTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    return this.logTimeByLevelAsync(Level.Error, message, expression)
  }

  fatalTime<T>(
    message: string | Getter<string>
  , expression: () => T
  ): T {
    return this.logTimeByLevel(Level.Fatal, message, expression)
  }

  fatalTimeAsync<T>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    return this.logTimeByLevelAsync(Level.Fatal, message, expression)
  }

  traceTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    return this.logTimeFunctionByLevel(Level.Trace, message, fn)
  }

  traceTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    return this.logTimeAsyncFunctionByLevel(Level.Trace, message, fn)
  }

  infoTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    return this.logTimeFunctionByLevel(Level.Info, message, fn)
  }

  infoTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    return this.logTimeAsyncFunctionByLevel(Level.Info, message, fn)
  }

  debugTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    return this.logTimeFunctionByLevel(Level.Debug, message, fn)
  }

  debugTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    return this.logTimeAsyncFunctionByLevel(Level.Debug, message, fn)
  }

  warnTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    return this.logTimeFunctionByLevel(Level.Warn, message, fn)
  }

  warnTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    return this.logTimeAsyncFunctionByLevel(Level.Warn, message, fn)
  }

  errorTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    return this.logTimeFunctionByLevel(Level.Error, message, fn)
  }

  errorTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    return this.logTimeAsyncFunctionByLevel(Level.Error, message, fn)
  }

  fatalTimeFunction<Result, Args extends unknown[]>(
    message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    return this.logTimeFunctionByLevel(Level.Fatal, message, fn)
  }

  fatalTimeAsyncFunction<Result, Args extends unknown[]>(
    message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    return this.logTimeAsyncFunctionByLevel(Level.Fatal, message, fn)
  }

  private logByLevel(
    level: Level
  , message: string | Getter<string>
  , elapsedTime?: number
  ): void {
    if (this.options.level <= level) {
      this.send(level, message, elapsedTime)
    }
  }

  private async logByLevelAsync(
    level: Level
  , message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    if (this.options.level <= level) {
      await this.sendAsync(level, message, elapsedTime)
    }
  }

  private logTimeByLevel<T>(
    level: Level
  , message: string | Getter<string>
  , expression: () => T
  ): T {
    if (this.options.level <= level) {
      return measureElapsedTime<T>(
        expression
      , elapsedTime => this.send(level, message, elapsedTime)
      )
    } else {
      return expression()
    }
  }

  private async logTimeByLevelAsync<T>(
    level: Level
  , message: Awaitable<string> | Getter<Awaitable<string>>
  , expression: () => Awaitable<T>
  ): Promise<T> {
    if (this.options.level <= level) {
      return measureElapsedTimeAsync<T>(
        expression
      , elapsedTime => this.sendAsync(level, message, elapsedTime)
      )
    } else {
      return await expression()
    }
  }

  private logTimeFunctionByLevel<Result, Args extends unknown[]>(
    level: Level
  , message: string | Getter<string>
  , fn: (...args: Args) => Result
  ): (...args: Args) => Result {
    if (this.options.level <= level) {
      return (...args: Args) => {
        return measureElapsedTime(
          () => fn(...args)
        , elapsedTime => this.send(level, message, elapsedTime)
        )
      }
    } else {
      return fn
    }
  }

  private logTimeAsyncFunctionByLevel<Result, Args extends unknown[]>(
    level: Level
  , message: Awaitable<string> | Getter<Awaitable<string>>
  , fn: (...args: Args) => Awaitable<Result>
  ): (...args: Args) => Promise<Result> {
    if (this.options.level <= level) {
      return (...args: Args) => {
        return measureElapsedTimeAsync(
          () => fn(...args)
        , elapsedTime => this.sendAsync(level, message, elapsedTime)
        )
      }
    } else {
      return async (...args: Args) => await fn(...args)
    }
  }

  private send(
    level: Level
  , message: string | Getter<string>
  , elapsedTime?: number
  ): void {
    this.options.transport.send({
      level
    , message: getValue(message)
    , namespace: this.options.namespace
    , timestamp: Date.now()
    , elapsedTime
    })
  }

  private async sendAsync(
    level: Level
  , message: Awaitable<string> | Getter<Awaitable<string>>
  , elapsedTime?: number
  ): Promise<void> {
    return this.send(level, await getValue(message), elapsedTime)
  }
}
