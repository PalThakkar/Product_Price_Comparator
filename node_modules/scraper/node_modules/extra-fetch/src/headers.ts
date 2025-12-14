import { Headers as undiciHeaders } from 'undici'

export const Headers = undiciHeaders as typeof globalThis.Headers
