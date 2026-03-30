import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock cheerio
vi.mock('cheerio', () => ({
  load: vi.fn(),
}))

import handler from '../../api/fetch-price.js'
import * as cheerio from 'cheerio'

function mockReqRes(body = {}, method = 'POST') {
  const req = { method, body }
  const res = {
    _status: 200,
    _json: null,
    _headers: {},
    _ended: false,
    setHeader(k, v) { this._headers[k] = v },
    status(code) { this._status = code; return this },
    json(data) { this._json = data; return this },
    end() { this._ended = true },
  }
  return { req, res }
}

describe('api/fetch-price', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects non-POST requests', async () => {
    const { req, res } = mockReqRes({}, 'GET')
    await handler(req, res)
    expect(res._status).toBe(405)
  })

  it('rejects missing URL', async () => {
    const { req, res } = mockReqRes({})
    await handler(req, res)
    expect(res._status).toBe(400)
    expect(res._json.success).toBe(false)
  })

  it('rejects non-samsclub URLs', async () => {
    const { req, res } = mockReqRes({ url: 'https://www.walmart.com/p/123' })
    await handler(req, res)
    expect(res._status).toBe(400)
  })

  it('returns price when found in __NEXT_DATA__', async () => {
    const nextData = JSON.stringify({
      props: {
        pageProps: {
          initialData: {
            productDetails: {
              payload: {
                price: { finalPrice: 12.98, listPrice: 14.98 },
                productInfo: { name: 'Test Product', thumbnailImage: 'https://img.com/test.jpg' },
              },
            },
          },
        },
      },
    })

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(`<html><script id="__NEXT_DATA__">${nextData}</script></html>`),
    })

    const $ = vi.fn((sel) => ({
      html: () => nextData,
    }))
    cheerio.load.mockReturnValue($)

    const { req, res } = mockReqRes({ url: 'https://www.samsclub.com/p/test/123' })
    await handler(req, res)

    expect(res._json.success).toBe(true)
    expect(res._json.price).toBe(12.98)
    expect(res._json.name).toBe('Test Product')
  })

  it('returns error when __NEXT_DATA__ is missing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<html><body>No data</body></html>'),
    })
    cheerio.load.mockReturnValue((sel) => ({
      html: () => null,
    }))

    const { req, res } = mockReqRes({ url: 'https://www.samsclub.com/p/test/123' })
    await handler(req, res)
    expect(res._json.success).toBe(false)
  })

  it('handles upstream errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    const { req, res } = mockReqRes({ url: 'https://www.samsclub.com/p/test/123' })
    await handler(req, res)
    expect(res._json.success).toBe(false)
    expect(res._json.error).toMatch(/500/)
  })

  it('handles network errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'))
    const { req, res } = mockReqRes({ url: 'https://www.samsclub.com/p/test/123' })
    await handler(req, res)
    expect(res._json.success).toBe(false)
    expect(res._json.error).toMatch(/refused/i)
  })
})
