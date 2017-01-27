import { compose } from 'throwback'
import { mount } from './index'
import { Request, Response } from 'servie'

describe('servie-mount', () => {
  it('should rewrite the mounted path', () => {
    const fn = jest.fn()

    const app = compose<Request, Response>([
      function (req, next) {
        fn(req.url)

        return next()
      },
      mount('/test', compose<Request, Response>([
        function (req, next) {
          fn(req.url)

          return next()
        },
        mount('/path', function (req, next) {
          fn(req.url)

          return next()
        })
      ])),
      function (req, next) {
        fn(req.url)

        return next()
      }
    ])

    const req = new Request({ url: '/test/path?test=true' })

    return app(req, finalhandler(req)).then(() => {
      expect(fn.mock.calls).toEqual([
        ['/test/path?test=true'],
        ['/path?test=true'],
        ['/?test=true'],
        ['/test/path?test=true']
      ])
    })
  })

  it('should support paths using absolute urls', () => {
    const fn = jest.fn()

    const app = compose<Request, Response>([
      function (req, next) {
        fn(req.url)

        return next()
      },
      mount('/mount', function (req, next) {
        fn(req.url)

        return next()
      }),
      function (req, next) {
        fn(req.url)

        return next()
      }
    ])

    const req = new Request({ url: 'http://example.com/mount/path' })

    return app(req, finalhandler(req)).then(() => {
      expect(fn.mock.calls).toEqual([
        ['http://example.com/mount/path'],
        ['http://example.com/path'],
        ['http://example.com/mount/path']
      ])
    })
  })

  it('should skip mounted paths with it does not match', () => {
    const fn = jest.fn()

    const app = compose<Request, Response>([
      function (req, next) {
        fn(req.url)

        return next()
      },
      mount('/mount', function (req, next) {
        fn(req.url)

        return next()
      }),
      function (req, next) {
        fn(req.url)

        return next()
      }
    ])

    const req = new Request({ url: '/pathname' })

    return app(req, finalhandler(req)).then(() => {
      expect(fn.mock.calls).toEqual([
        ['/pathname'],
        ['/pathname']
      ])
    })
  })
})

/**
 * Final 404 handler.
 */
function finalhandler (req: Request) {
  return function () {
    return Promise.resolve(new Response({
      status: 404,
      body: `Cannot ${req.method} ${req.url}`
    }))
  }
}
