import { Level, ITransport, IMessage } from '@src/types.js'
import chalk from 'chalk'
import { isUndefined, isntUndefined } from '@blackglory/prelude'

export interface ITerminalTransportOptions {
  /**
   * 对于记录执行耗时的日志, 仅打印高于或等于此值的日志
   */
  logMinimumDuration?: number
}

export class TerminalTransport implements ITransport {
  private id: number = 0

  constructor(private options: ITerminalTransportOptions = {}) {}

  send(message: IMessage): void {
    if (isUndefined(message.elapsedTime)) {
      console.log(this.stringifyMessage(message))
    } else {
      if (isUndefined(this.options.logMinimumDuration)) {
        console.log(this.stringifyMessage(message))
      } else {
        if (message.elapsedTime >= this.options.logMinimumDuration) {
          console.log(this.stringifyMessage(message))
        }
      }
    }
  }

  private stringifyMessage(message: IMessage): string {
    const str: string[] = [
      `[${levelToString(message.level)}]`
    + `[${formatDate(message.timestamp)}]`
    , `#${this.createId()}`
    ]

    if (isntUndefined(message.namespace)) {
      str.push(`${formatNamespace(message.namespace)}`)
    }

    str.push(`${message.message}`)

    if (isntUndefined(message.elapsedTime)) {
      str.push(`${formatElapsedTime(message.elapsedTime)}`)
    }
    
    return str.join(' ')
  }

  private createId(): number {
    return ++this.id
  }
}

function levelToString(level: Level): string {
  switch (level) {
    case Level.Info: return 'INFO'
    case Level.Debug: return 'DEBUG'
    case Level.Warn: return 'WARN'
    case Level.Trace: return 'TRACE'
    case Level.Error: return 'ERROR'
    case Level.Fatal: return 'FATAL'
    default: return 'NONE'
  }
}

function formatNamespace(namespace: string): string {
  return chalk.cyan(namespace)
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

function formatElapsedTime(elapsed: number): string {
  if (elapsed <= 100) return chalk.green(`${elapsed}ms`)
  if (elapsed <= 300) return chalk.yellow(`${elapsed}ms`)
  return chalk.red(`${elapsed}ms`)
}
