export function* timestampBasedId(): Iterator<[timestamp: number, num: number]> {
  const num = 0
  const timestamp = Date.now()
  yield [timestamp, num]

  let lastTimestamp = timestamp
  let lastNum = num
  while (true) {
    const timestamp = Date.now()
    if (timestamp === lastTimestamp) {
      yield [lastTimestamp, ++lastNum]
    } else {
      lastNum = 0
      lastTimestamp = timestamp
      yield [lastTimestamp, lastNum]
    }
  }
}
