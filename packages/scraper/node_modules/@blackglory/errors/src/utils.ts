// 由于可能出现循环引用, 禁止在本项目导入iterable-operator

export function first<T>(iterable: Iterable<T>): T | undefined {
  for (const element of iterable) {
    return element
  }
}

export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable)
}
