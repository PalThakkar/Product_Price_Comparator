import { Option } from './option.js'

enum ResultType {
  Ok
, Err
}

export class Result<T, E> {
  private value?: T
  private error?: E

  private constructor(type: ResultType.Ok, value: T)
  private constructor(type: ResultType.Err, error: E)
  private constructor(private type: ResultType, valueOrError: T | E) {
    if (type === ResultType.Ok) {
      this.value = valueOrError as T
    } else {
      this.error = valueOrError as E
    }
  }

  static Ok<T, E>(value: T): Result<T, E> {
    return new Result(ResultType.Ok, value)
  }

  static Err<T, E>(error: E): Result<T, E> {
    return new Result(ResultType.Err, error)
  }

  isOk() {
    return this.type === ResultType.Ok
  }

  isErr() {
    return this.type === ResultType.Err
  }

  map<U>(mapper: (val: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.Ok(mapper(this.value!))
    } else {
      return Result.Err(this.error!)
    }
  }

  mapOr<U>(defaultValue: U, mapper: (val: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.Ok(mapper(this.value!))
    } else {
      return Result.Ok(defaultValue)
    }
  }

  mapOrElse<U>(createDefaultValue: (err: E) => U, mapper: (val: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.Ok(mapper(this.value!))
    } else {
      return Result.Ok(createDefaultValue(this.error!))
    }
  }

  mapErr<U>(mapper: (err: E) => U): Result<T, U> {
    if (this.isOk()) {
      return Result.Ok(this.value!)
    } else {
      return Result.Err(mapper(this.error!))
    }
  }

  /**
   * @throws {E}
   */
  unwrap(): T {
    if (this.isOk()) {
      return this.value!
    } else {
      throw this.error!
    }
  }

  unwrapOr<U>(defaultValue: U): T | U {
    if (this.isOk()) {
      return this.value!
    } else {
      return defaultValue
    }
  }

  unwrapOrElse<U>(createDefaultValue: (err: E) => U): T | U {
    if (this.isOk()) {
      return this.value!
    } else {
      return createDefaultValue(this.error!)
    }
  }

  /**
   * @throws {Error}
   */
  unwrapErr(): E {
    if (this.isErr()) {
      return this.error!
    } else {
      throw new Error('unwrapErr called on a Ok')
    }
  }

  /**
   * @throws {Error}
   */
  expect(message: string): T {
    if (this.isOk()) {
      return this.value!
    } else {
      throw new Error(message)
    }
  }

  /**
   * @throws {Error}
   */
  expectErr(message: string): E {
    if (this.isErr()) {
      return this.error!
    } else {
      throw new Error(message)
    }
  }

  ok(): Option<T> {
    if (this.isOk()) {
      return Option.Some(this.value!)
    } else {
      return Option.None()
    }
  }

  err(): Option<E> {
    if (this.isOk()) {
      return Option.None()
    } else {
      return Option.Some(this.error!)
    }
  }
}
