import debug = require('debug')
import pathToRegexp = require('path-to-regexp')
import { Request, Response } from 'servie'
import { format } from 'url'

const log = debug('servie-mount')

export interface RequestMounted {
  mountPath: string
  mountParams: string[]
}

export interface Options {
  sensitive?: boolean
}

export function mount <T extends Request> (
  prefix: pathToRegexp.Path,
  fn: (req: T & RequestMounted, done: () => Promise<Response>) => Promise<Response>,
  options?: Options
) {
  const re = pathToRegexp(prefix, { end: false, sensitive: !!(options && options.sensitive) })

  log(`mount ${prefix} -> ${re}`)

  return function (req: T, next: () => Promise<Response>) {
    const pathname = req.Url.pathname
    const m = pathname && re.exec(pathname)

    if (m) {
      const prevUrl = req.url

      const url = format(Object.assign({}, req.Url, { path: undefined, pathname: pathname.substr(m[0].length) || '/' }))
      const [mountPath, ...mountParams] = m

      // Set mounted parameters on request.
      const mountedReq = Object.assign(req, { url, mountPath, mountParams })

      debug(`enter ${prevUrl} -> ${req.url}`)

      return fn(mountedReq, function () {
        debug(`leave ${prevUrl} -> ${req.url}`)
        req.url = prevUrl
        return next()
      })
    }

    return next()
  }
}
