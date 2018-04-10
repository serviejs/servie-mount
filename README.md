# Servie Mount

[![NPM version](https://img.shields.io/npm/v/servie-mount.svg?style=flat)](https://npmjs.org/package/servie-mount)
[![NPM downloads](https://img.shields.io/npm/dm/servie-mount.svg?style=flat)](https://npmjs.org/package/servie-mount)
[![Build status](https://img.shields.io/travis/serviejs/servie-mount.svg?style=flat)](https://travis-ci.org/serviejs/servie-mount)
[![Test coverage](https://img.shields.io/coveralls/serviejs/servie-mount.svg?style=flat)](https://coveralls.io/r/serviejs/servie-mount?branch=master)

> Mount Servie middleware on a path prefix.

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

Apache 2.0
