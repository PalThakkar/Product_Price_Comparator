import { Level, stringToLevel } from 'extra-logger'
import { ValueGetter } from 'value-getter'
import { Getter } from 'justypes'

const cache = new WeakMap()

export const LOG: Getter<Level> = new ValueGetter(env('EXTRA_FETCH_LOG'))
  .convert(val => stringToLevel(val ?? ''))
  .memoize(cache)
  .get()

export const HTTP2: Getter<boolean> = new ValueGetter(env('EXTRA_FETCH_HTTP2'))
  .convert(toBool)
  .default(true)
  .memoize(cache)
  .get()

function env(name: string): () => string | undefined {
  return () => process.env[name]
}

function toBool(val: string | undefined): boolean | undefined {
  if (val) return val === 'true'
}
