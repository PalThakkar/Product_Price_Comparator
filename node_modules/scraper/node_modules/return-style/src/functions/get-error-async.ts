import { Awaitable } from '@blackglory/prelude'

export async function getErrorAsync<E = Error>(
  fn: () => Awaitable<unknown>
): Promise<E | undefined> {
  try {
    await fn()
  } catch (err: any) {
    return err
  }
  return
}
