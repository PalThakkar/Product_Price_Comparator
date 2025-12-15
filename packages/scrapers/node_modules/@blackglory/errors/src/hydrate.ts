import { SerializableError } from './serializable-error.js'
import { pass } from '@blackglory/pass'

export function hydrate(err: SerializableError): Error {
  const errorNames = [err.name, ...err.ancestors]
    .slice(0, -1)
    .reverse()

  let errorConstructor = Error
  for (const name of errorNames) {
    errorConstructor = createChildErrorConstructor(errorConstructor, name)
  }
  const result = new errorConstructor()
  result.name = err.name
  result.message = err.message
  result.stack = err.stack ?? undefined
  return result
}

function createChildErrorConstructor(
  parentErrorConstructor: ErrorConstructor
, name: string
): ErrorConstructor {
  const constructor = function () { pass() }
  constructor.prototype = Object.create(parentErrorConstructor.prototype)
  constructor.prototype.constructor = constructor

  // 函数的name属性是只读的, 所以必须这样修改
  Object.defineProperty(constructor, 'name', { value: name })

  return constructor as ErrorConstructor
}
