import { getErrorNames } from './get-error-names.js'
import { isError } from './is-error.js'
import { isSerializableError } from './serializable-error.js'
import { first, toArray } from './utils.js'

export type CustomErrorConstructor<T extends CustomError = CustomError> =
  new (message?: string) => T

export class CustomError extends Error {
  get name(): string {
    return first(getErrorNames(this))
        ?? CustomError.name
        ?? 'CustomError'
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    if (isError(instance) || isSerializableError(instance)) {
      const reversedClassNames: string[] = [
        this.prototype.constructor.name ?? this.name
      , ...getErrorNames(this.prototype) 
      ].reverse()
      const reversedInstanceNames = toArray(getErrorNames(instance)).reverse()

      return reversedClassNames.every((x, i) => x === reversedInstanceNames[i])
    } else {
      return false
    }
  }
}
