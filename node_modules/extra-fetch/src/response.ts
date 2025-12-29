import { Response as undiciResponse } from 'undici'

export const Response = undiciResponse as unknown as typeof globalThis.Response
