import { pass } from '@blackglory/prelude'

export async function getErrorAsyncIterable<E = Error>(
  iterable: AsyncIterable<unknown>
): Promise<E | undefined> {
  try {
    for await (const _ of iterable) {
      pass()
    }
  } catch (promiseError: any) {
    return promiseError
  }
  return
}
