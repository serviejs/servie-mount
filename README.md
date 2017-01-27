# Servie mount

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Mount Servie middleware on a prefix.

## Installation

```
npm install servie-mount --save
```

## Usage

```ts
import { mount } from 'servie-mount'
import { compose } from 'throwback'
import { Response } from 'servie'

const subapp = compose([
  function () {
    return new Response({
      body: 'hello world'
    })
  }
])

const app = compose([
  mount('/hello', subapp)
])
```

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/servie-mount.svg?style=flat
[npm-url]: https://npmjs.org/package/servie-mount
[downloads-image]: https://img.shields.io/npm/dm/servie-mount.svg?style=flat
[downloads-url]: https://npmjs.org/package/servie-mount
[travis-image]: https://img.shields.io/travis/blakeembrey/node-servie-mount.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/node-servie-mount
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/node-servie-mount.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/node-servie-mount?branch=master
