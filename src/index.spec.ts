import { compose } from 'throwback'
import { finalhandler } from 'servie-finalhandler'
import { mount, mountPath, MountRequest, originalUrl } from './index'
import { Request, Response } from 'servie'

describe('servie-mount', () => {
  it('should rewrite the mounted path', () => {
    const urls: string[] = []
    const mountPaths: Array<string[]> = []
    const originalUrls: Array<string> = []

    function fn (req: Request, next: () => Promise<Response>): Promise<Response> {
      urls.push(req.url)
      return next()
    }

    function mountedFn (req: Request & MountRequest, next: () => Promise<Response>): Promise<Response> {
      urls.push(req.url)
      mountPaths.push(req[mountPath])
      originalUrls.push(req[originalUrl])
      return next()
    }

    const app = compose([
      fn,
      mount('/test', compose([
        mountedFn,
        mount('/path', mountedFn)
      ])),
      fn
    ])

    const req = new Request({ url: '/test/path?test=true' })

    return app(req, finalhandler(req)).then(() => {
      expect(urls).toEqual([
        '/test/path?test=true',
        '/path?test=true',
        '/?test=true',
        '/test/path?test=true'
      ])

      expect(mountPaths).toEqual([
        ['/test'],
        ['/path']
      ])

      expect(originalUrls).toEqual([
        '/test/path?test=true',
        '/test/path?test=true'
      ])
    })
  })

  it('should support paths using absolute urls', () => {
    const urls: string[] = []

    function fn (req: Request, next: () => Promise<Response>): Promise<Response> {
      urls.push(req.url)
      return next()
    }

    const app = compose<Request, Response>([
      fn,
      mount('/mount', fn),
      fn
    ])

    const req = new Request({ url: 'http://example.com/mount/path' })

    return app(req, finalhandler(req)).then(() => {
      expect(urls).toEqual([
        'http://example.com/mount/path',
        'http://example.com/path',
        'http://example.com/mount/path'
      ])
    })
  })

  it('should skip mounted paths with it does not match', () => {
    const urls: string[] = []

    function fn (req: Request, next: () => Promise<Response>): Promise<Response> {
      urls.push(req.url)
      return next()
    }

    const app = compose<Request, Response>([
      fn,
      mount('/mount', fn),
      fn
    ])

    const req = new Request({ url: '/pathname' })

    return app(req, finalhandler(req)).then(() => {
      expect(urls).toEqual([
        '/pathname',
        '/pathname'
      ])
    })
  })
})
