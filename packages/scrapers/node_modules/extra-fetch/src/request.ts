import { Request as undiciRequest } from 'undici'

export const Request = undiciRequest as unknown as typeof globalThis.Request
