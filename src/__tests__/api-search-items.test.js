import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock cheerio
vi.mock('cheerio', () => ({
  load: vi.fn(),
}))

// We test the handler by importing it directly
import handler from '../../api/search-items.js'
import * as cheerio from 'cheerio'

function mockReqRes(query = {}) {
  const req = { query }
  const res = {
    _status: 200,
    _json: null,
    _headers: {},
    setHeader(k, v) { this._headers[k] = v },
    status(code) { this._status = code; return this },
    json(data) { this._json = data; return this },
  }
  return { req, res }
}

describe('api/search-items', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when query is too short', async () => {
    const { req, res } = mockReqRes({ q: 'a' })
    await handler(req, res)
    expect(res._status).toBe(400)
    expect(res._json.success).toBe(false)
    expect(res._json.error).toMatch(/too short/i)
  })

  it('returns 400 when query is missing', async () => {
    const { req, res } = mockReqRes({})
    await handler(req, res)
    expect(res._status).toBe(400)
  })

  it('returns error when upstream fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 })
    const { req, res } = mockReqRes({ q: 'chicken' })
    await handler(req, res)
    expect(res._json.success).toBe(false)
    expect(res._json.error).toMatch(/503/)
  })

  it('returns error when __NEXT_DATA__ is missing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<html><body>No data</body></html>'),
    })
    cheerio.load.mockReturnValue((sel) => ({
      html: () => null,
    }))
    const { req, res } = mockReqRes({ q: 'chicken' })
    await handler(req, res)
    expect(res._json.success).toBe(false)
    expect(res._json.error).toMatch(/__NEXT_DATA__/)
  })

  it('returns products when valid data is found', async () => {
    const nextData = JSON.stringify({
      props: {
        pageProps: {
          initialData: {
            searchResults: {
              records: [
                {
                  productInfo: {
                    productId: 'p1',
                    name: 'Rotisserie Chicken',
                    thumbnailImage: 'https://img.com/chicken.jpg',
                    productUrl: '/p/rotisserie-chicken/123',
                    breadCrumbs: [{ name: 'Home' }, { name: 'Deli' }],
                  },
                  price: { finalPrice: 4.98 },
                },
              ],
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

    const { req, res } = mockReqRes({ q: 'chicken' })
    await handler(req, res)

    expect(res._json.success).toBe(true)
    expect(res._json.results).toHaveLength(1)
    expect(res._json.results[0].name).toBe('Rotisserie Chicken')
    expect(res._json.results[0].price).toBe(4.98)
  })

  it('handles network errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network timeout'))
    const { req, res } = mockReqRes({ q: 'chicken' })
    await handler(req, res)
    expect(res._json.success).toBe(false)
    expect(res._json.error).toMatch(/timeout/i)
  })
})
