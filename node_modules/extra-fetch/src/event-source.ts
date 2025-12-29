import { EventSource as nodeEventSource } from 'eventsource'

export const EventSource = nodeEventSource as typeof globalThis.EventSource
