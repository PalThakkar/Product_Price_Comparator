import {
  fetch as undiciFetch
, RequestInfo as UndiciRequestInfo
, RequestInit as UndiciRequestInit
, Request as UndiciRequest
, Agent
} from 'undici'
import { LOG, HTTP2 } from '@utils/env.js'
import { getErrorResultPromise } from 'return-style'
import { Logger, TerminalTransport } from 'extra-logger'
import { fromPairs } from 'lodash-es'
import chalk from 'chalk'
import { lazy } from 'extra-lazy'
import { toArray } from '@blackglory/prelude'

const getLogger = lazy(() => new Logger({
  level: LOG()
, transport: new TerminalTransport({})
}))
const getAgent = lazy(() => new Agent({
  allowH2: HTTP2()
}))

export async function fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const logger = getLogger()

  const undiciRequestInput: UndiciRequestInfo = input as UndiciRequestInfo
  const undiciRequestInit: UndiciRequestInit = {
    ...(init as UndiciRequestInit | undefined ?? {})
  , dispatcher: getAgent()
  }

  const req = new UndiciRequest(undiciRequestInput, undiciRequestInit)
  const startTime = Date.now()

  logger.info(`${formatMethod(req.method)} ${req.url}`)
  logger.trace(getRequestHeaders)

  const [err, res] = await getErrorResultPromise(undiciFetch(req))
  if (err) {
    logger.error(`${err}`)
    throw err
  }
  logger.info(`${formatStatusCode(res.statusText, res.status)}`, getElapsed(startTime))
  logger.trace(getResponseHeaders)

  return res as unknown as Response

  function getRequestHeaders() {
    const headers = fromPairs(toArray(req.headers.entries()))
    const messages = Object.entries(headers)
      .map(([name, value]) => `${chalk.cyan(name)}: ${value}`)
    return messages.join('\n')
  }

  function getResponseHeaders() {
    const headers = fromPairs(toArray(res!.headers.entries()))
    const messages = Object.entries(headers)
      .map(([name, value]) => `${chalk.cyan(name)}: ${value}`)
    return messages.join('\n')
  }
}

function formatMethod(method: string): string {
  return chalk.blue(method)
}

function getElapsed(startTime: number): number {
  return Date.now() - startTime
}

function formatStatusCode(status: string, code: number): string {
  const text = `${code} ${status}`
  if (code >= 200 && code < 300) return chalk.green(text)
  if (code >= 400 && code < 500) return chalk.red(text)
  if (code >= 500) return chalk.yellow(text)
  return text
}
