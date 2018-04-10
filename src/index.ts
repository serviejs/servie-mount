import debug = require('debug')
import pathToRegexp = require('path-to-regexp')
import { Request, Response } from 'servie'
import { format } from 'url'

const log = debug('servie-mount')

export const mountPath = Symbol('servie-mount')

export interface MountRequest {
  [mountPath]: string[]
}

export interface Options {
  sensitive?: boolean
}

export function mount <T extends Request, U extends Response> (
  prefix: pathToRegexp.Path,
  fn: (req: T & MountRequest, done: () => Promise<U>) => Promise<U>,
  options: Options = {}
) {
  const keys: pathToRegexp.Key[] = []
  const re = pathToRegexp(prefix, keys, { end: false, sensitive: options.sensitive })

  log(`mount ${prefix} -> ${re}`)

  return function (req: T & { [mountPath]?: string[] }, next: () => Promise<U>) {
    const pathname = req.Url.pathname
    if (!pathname) return next()

    const match = re.exec(pathname)
    if (!match) return next()

    const prevUrl = req.url
    const prevMountPath = req[mountPath]

    req.url = format({
      ...req.Url,
      path: undefined,
      pathname: pathname.substr(match[0].length) || '/'
    })

    // Set mounted parameters on request.
    const mountReq = Object.assign(req, { [mountPath]: Array.from(match) })

    debug(`enter ${prevUrl} -> ${req.url}`)

    return fn(mountReq, function () {
      debug(`leave ${prevUrl} -> ${req.url}`)
      req.url = prevUrl
      req[mountPath] = prevMountPath
      return next()
    })
  }
}
