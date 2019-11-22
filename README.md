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
import { mount, path, params, originalUrl } from "servie-mount";
import { compose } from "throwback";
import { Response } from "servie";

const fn = req => {
  console.log(req[path]); // Get mounted path.
  console.log(req[params]); // Get mounted params.
  console.log(req[originalUrl]); // Get original URL string.

  return new Response("hello world");
};

const app = compose([mount("/hello", fn)]);
```

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
