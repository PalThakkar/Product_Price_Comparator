# justypes
Dumb types for TypeScript in the real world.

`justypes` contains these types:
- A new type is a collection of types.
- A new type is a type that extracts the internal type from another type.
- A new type is a mapping of type A to type B.

## Install
```sh
npm install --save justypes
# or
yarn add justypes
```

## Types
- Arrayable
- Awaitable
- Cons
- Constructor
- ReturnTypeOfConstructor
- Dictionary
- Falsy
- Getter
- Json
- NonEmptyArray
- Nullish
- UnpackedArrayLike
- UnpackedArray
- UnpackedAsyncIterable
- UnpackedIterable
- UnpackedPromiseLike
- UnpackedPromise
- TypedArrayConstructor
- TypedArray
- TypedArrayOfConstructor
- ConstructorOfTypedArray
- SignedTypedArrayConsturctor
- UnsignedTypedArrayConstructor
- SignedTypedArray
- UnsignedTypedArray

*The naming convention of `Unpacked` comes from [this official article].*

[this official article]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
