import { Result } from './result.js'

enum OptionType {
  Some
, None
}

export class Option<T> {
  private constructor(type: OptionType.Some, value: T)
  private constructor(type: OptionType.None)
  private constructor(private type: OptionType, private value?: T) {}

  static Some<T>(value: T): Option<T> {
    return new Option(OptionType.Some, value)
  }

  static None<T>(): Option<T> {
    return new Option(OptionType.None)
  }

  isSome() {
    return this.type === OptionType.Some
  }

  isNone() {
    return this.type === OptionType.None
  }

  map<U>(mapper: (val: T) => U): Option<U> {
    if (this.isSome()) {
      return Option.Some(mapper(this.value!))
    } else {
      return Option.None()
    }
  }

  mapOr<U>(defaultValue: U, mapper: (val: T) => U): Option<U> {
    if (this.isSome()) {
      return Option.Some(mapper(this.value!))
    } else {
      return Option.Some(defaultValue)
    }
  }

  mapOrElse<U>(createDefaultValue: () => U, mapper: (val: T) => U): Option<U> {
    if (this.isSome()) {
      return Option.Some(mapper(this.value!))
    } else {
      return Option.Some(createDefaultValue())
    }
  }

  filter<U extends T = T>(predicate: (val: T) => boolean): Option<U> {
    if (this.isSome()) {
      if (predicate(this.value!)) {
        return Option.Some(this.value as U)
      } else {
        return Option.None()
      }
    } else {
      return Option.None()
    }
  }

  /**
   * @throws {Error}
   */
  unwrap(): T {
    if (this.isSome()) {
      return this.value!
    } else {
      throw new Error('unwrap called on a None')
    }
  }

  unwrapOr<U>(defaultValue: U): T | U {
    if (this.isSome()) {
      return this.value!
    } else {
      return defaultValue
    }
  }

  unwrapOrElse<U>(createDefaultValue: () => U): T | U {
    if (this.isSome()) {
      return this.value!
    } else {
      return createDefaultValue()
    }
  }

  /**
   * @throws {Error}
   */
  expect(message: string): T {
    if (this.isSome()) {
      return this.value!
    } else {
      throw new Error(message)
    }
  }

  okOr<E>(err: E): Result<T, E> {
    if (this.isSome()) {
      return Result.Ok(this.value!)
    } else {
      return Result.Err(err)
    }
  }

  okOrElse<E>(createErr: () => E): Result<T, E> {
    if (this.isSome()) {
      return Result.Ok(this.value!)
    } else {
      return Result.Err(createErr())
    }
  }
}
