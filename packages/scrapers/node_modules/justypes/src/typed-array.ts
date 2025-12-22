export type TypedArrayConstructor =
| SignedTypedArrayConsturctor
| UnsignedTypedArrayConstructor

export type SignedTypedArrayConsturctor =
| Int8ArrayConstructor
| Int16ArrayConstructor
| Int32ArrayConstructor
| Float32ArrayConstructor
| Float64ArrayConstructor

export type UnsignedTypedArrayConstructor =
| Uint8ArrayConstructor
| Uint8ClampedArrayConstructor
| Uint16ArrayConstructor
| Uint32ArrayConstructor

export type TypedArray =
| SignedTypedArray
| UnsignedTypedArray

export type SignedTypedArray =
| Int8Array
| Int16Array
| Int32Array
| Float32Array
| Float64Array

export type UnsignedTypedArray =
| Uint8Array
| Uint8ClampedArray
| Uint16Array
| Uint32Array

export type TypedArrayOfConstructor<T extends TypedArrayConstructor> =
  T extends Int8ArrayConstructor ? Int8Array
: T extends Uint8ArrayConstructor ? Uint8Array
: T extends Uint8ClampedArrayConstructor ? Uint8ClampedArray
: T extends Int16ArrayConstructor ? Int16Array
: T extends Uint16ArrayConstructor ? Uint16Array
: T extends Int32ArrayConstructor ? Int32Array
: T extends Uint32ArrayConstructor ? Uint32Array
: T extends Float32ArrayConstructor ? Float32Array
: T extends Float64ArrayConstructor ? Float64Array
: never

export type ConstructorOfTypedArray<T extends TypedArray> =
  T extends Int8Array ? Int8ArrayConstructor
: T extends Uint8Array ? Uint8ArrayConstructor
: T extends Uint8ClampedArray ? Uint8ClampedArrayConstructor
: T extends Int16Array ? Int16ArrayConstructor
: T extends Uint16Array ? Uint16ArrayConstructor
: T extends Int32Array ? Int32ArrayConstructor
: T extends Uint32Array ? Uint32ArrayConstructor
: T extends Float32Array ? Float32ArrayConstructor
: T extends Float64Array ? Float64ArrayConstructor
: never
