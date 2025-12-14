// The return type of `JSON.parse`
export type JSONValue =
| string
| number
| boolean
| null
| JSONObject
| JSONValue[]

export interface JSONObject {
  [property: string]: JSONValue
}

/**
 * 可以序列化为JSON的非JSONValue对象
 */
export interface JSONSerializable<T extends
| JSONValue
| Record<string, JSONValue | JSONSerializable<any>>
| Array<JSONValue | JSONSerializable<any>>
> {
  toJSON(key: string): T
}
