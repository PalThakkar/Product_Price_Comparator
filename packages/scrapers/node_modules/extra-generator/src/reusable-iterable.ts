import { lazy } from '@blackglory/prelude'

interface IReusableIterable<T> extends Iterable<T> {
  close(): void
}

export class ReusableIterable<T> implements IReusableIterable<T> {
  private _done: boolean | undefined
  private getIterator: () => Iterator<T>

  get done(): boolean | undefined {
    return this._done
  }

  constructor(iterable: Iterable<T>) {
    this.getIterator = lazy(() => iterable[Symbol.iterator]())
  }

  close(): void {
    if (!this._done) {
      this._done = true
      this.getIterator().return?.()
    }
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this._done) return { done: true, value: undefined }

        const { value, done } = this.getIterator().next()
        if (done) {
          this._done = true
        }
        return { value, done }
      }
    }
  }
}
