export function log<T>(...data: [...any[], T]): T {
  console.log(...data)
  return data[data.length - 1]
}
