// api/fetch-price.js
// Fetches the current price for a single Sam's Club product page via __NEXT_DATA__.
//
// PATH CORRECTION: If price comes back null, set DEBUG=true and re-run.
// The raw structure will be returned so you can find the correct price path.

import * as cheerio from 'cheerio'

const DEBUG = false  // Set true temporarily to inspect raw __NEXT_DATA__ paths

// Known fallback paths for product price — tries each in order
const PRICE_PATHS = [
  d => d?.props?.pageProps?.initialData?.productDetails?.payload?.price?.finalPrice,
  d => d?.props?.pageProps?.initialData?.productDetails?.payload?.price?.listPrice,
  d => d?.props?.pageProps?.initialData?.productDetails?.payload?.price?.salePrice,
  d => d?.props?.pageProps?.initialData?.product?.price?.finalPrice,
  d => d?.props?.pageProps?.initialData?.product?.price?.listPrice,
  d => d?.props?.pageProps?.product?.price?.finalPrice,
  d => d?.props?.pageProps?.product?.price?.listPrice,
]

// Known fallback paths for product name
const NAME_PATHS = [
  d => d?.props?.pageProps?.initialData?.productDetails?.payload?.productInfo?.name,
  d => d?.props?.pageProps?.initialData?.product?.name,
  d => d?.props?.pageProps?.product?.name,
]

// Known fallback paths for product image
const IMAGE_PATHS = [
  d => d?.props?.pageProps?.initialData?.productDetails?.payload?.productInfo?.thumbnailImage,
  d => d?.props?.pageProps?.initialData?.product?.images?.[0],
  d => d?.props?.pageProps?.product?.images?.[0],
]

function tryPaths(data, paths) {
  for (const fn of paths) {
    try {
      const val = fn(data)
      if (val != null && val !== '') return val
    } catch (_) {}
  }
  return null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')

  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body || {}
  if (!url || !url.includes('samsclub.com')) {
    return res.status(400).json({ success: false, error: 'A valid samsclub.com URL is required' })
  }

  // Strip query params for a clean product page fetch
  const cleanUrl = url.split('?')[0]

  try {
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control':   'no-cache',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return res.status(200).json({
        success: false,
        error: `Upstream returned ${response.status}`,
      })
    }

    const html  = await response.text()
    const $     = cheerio.load(html)
    const raw   = $('script#__NEXT_DATA__').html()

    if (!raw) {
      return res.status(200).json({
        success: false,
        error: '__NEXT_DATA__ not found on product page.',
      })
    }

    let data
    try { data = JSON.parse(raw) }
    catch (e) {
      return res.status(200).json({ success: false, error: 'Failed to parse __NEXT_DATA__ JSON' })
    }

    // DEBUG mode — returns raw structure for path inspection
    if (DEBUG) {
      const payload = data?.props?.pageProps?.initialData?.productDetails?.payload
      return res.status(200).json({
        debug: true,
        topLevelKeys:     Object.keys(data),
        pagePropsKeys:    Object.keys(data?.props?.pageProps || {}),
        initialDataKeys:  Object.keys(data?.props?.pageProps?.initialData || {}),
        payloadKeys:      Object.keys(payload || {}),
        priceObject:      payload?.price,
        rawSnippet:       raw.substring(0, 3000),
      })
    }

    const price = tryPaths(data, PRICE_PATHS)
    const name  = tryPaths(data, NAME_PATHS)
    const image = tryPaths(data, IMAGE_PATHS)

    if (price == null) {
      return res.status(200).json({
        success: false,
        error: 'Price not found in __NEXT_DATA__.',
        hint:  'Set DEBUG=true in api/fetch-price.js and re-run to inspect the structure.',
      })
    }

    return res.status(200).json({
      success: true,
      price:   Number(price),
      name:    name || null,
      image:   image || null,
    })

  } catch (err) {
    console.error('[fetch-price]', err.message)
    return res.status(200).json({ success: false, error: err.message })
  }
}
