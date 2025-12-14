import { Level } from './types.js'

export function stringToLevel(
  text: string
, fallback: Level = Level.None
): Level {
  switch (text.trim().toLowerCase()) {
    case 'trace': return Level.Trace
    case 'debug': return Level.Debug
    case 'info': return Level.Info
    case 'warn': return Level.Warn
    case 'error': return Level.Error
    case 'fatal': return Level.Fatal
    case 'none': return Level.None
    default: return fallback
  }
}
