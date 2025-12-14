# pass
The dead simple `pass` statement from Python.

## Install
```sh
npm install --save @blackglory/pass
# or
yarn add @blackglory/pass
```

## Usage
```ts
import { pass } from '@blackglory/pass'

try {
  // ...
} catch {
  pass()
}
```

## Why?
Sometimes you just want to write an empty statement or empty block,
but the linter does not allow you to do this.

You don't want to write comments to bypass the linter,
because that looks terrible.

## API
### pass
```ts
function pass(): void
```

### passAsync
```ts
function passAsync(): Promise<void>
```
