// api/search-items.js
// Fetches Sam's Club search results by parsing __NEXT_DATA__ from the search page.
//
// PATH CORRECTION: If results come back empty, set DEBUG=true below and re-test.
// The raw __NEXT_DATA__ structure will be returned so you can find the correct path.
// Then update SEARCH_PATHS below to match.

import * as cheerio from 'cheerio'

const DEBUG = false  // Set true temporarily to inspect raw __NEXT_DATA__ paths

// Known fallback paths for search result records — tries each in order
const SEARCH_PATHS = [
  d => d?.props?.pageProps?.initialData?.searchResults?.records,
  d => d?.props?.pageProps?.initialData?.searchPage?.records,
  d => d?.props?.pageProps?.searchData?.records,
  d => d?.props?.pageProps?.initialData?.records,
  d => d?.props?.pageProps?.products,
]

// Extract normalised product fields from any record shape
function extractProduct(record) {
  const info    = record?.productInfo || record?.product || record
  const pricing = record?.price || record?.pricing || info?.price

  return {
    id:          info?.productId      || info?.id          || record?.id,
    name:        info?.name           || info?.productName  || record?.name,
    price:       pricing?.finalPrice
                   ?? pricing?.listPrice
                   ?? pricing?.salePrice
                   ?? pricing?.price
                   ?? record?.price,
    thumbnail:   info?.thumbnailImage || info?.image        || record?.thumbnail,
    url:         info?.productUrl
                   ? `https://www.samsclub.com${info.productUrl}`
                   : (info?.url || record?.url),
    category:    info?.breadCrumbs?.[1]?.name
                   || info?.category
                   || record?.category_name
                   || null,
    description: info?.shortDescription || info?.description || null,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const { q } = req.query
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Query too short', results: [] })
  }

  const searchUrl = `https://www.samsclub.com/search?q=${encodeURIComponent(q.trim())}&xid=plp`

  try {
    const response = await fetch(searchUrl, {
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
        results: [],
      })
    }

    const html = await response.text()
    const $    = cheerio.load(html)
    const raw  = $('script#__NEXT_DATA__').html()

    if (!raw) {
      return res.status(200).json({
        success: false,
        error: '__NEXT_DATA__ not found. Sam\'s Club may be rendering client-side for this page.',
        results: [],
        debug: DEBUG ? { htmlSnippet: html.substring(0, 1000) } : undefined,
      })
    }

    let data
    try { data = JSON.parse(raw) }
    catch (e) {
      return res.status(200).json({ success: false, error: 'Failed to parse __NEXT_DATA__ JSON', results: [] })
    }

    // DEBUG mode — returns raw structure so you can find the correct path
    if (DEBUG) {
      return res.status(200).json({
        debug: true,
        topLevelKeys:    Object.keys(data),
        propsKeys:       Object.keys(data?.props || {}),
        pagePropsKeys:   Object.keys(data?.props?.pageProps || {}),
        initialDataKeys: Object.keys(data?.props?.pageProps?.initialData || {}),
        rawSnippet:      raw.substring(0, 3000),
      })
    }

    // Try each known path to locate the records array
    let records = null
    for (const pathFn of SEARCH_PATHS) {
      const candidate = pathFn(data)
      if (Array.isArray(candidate) && candidate.length > 0) {
        records = candidate
        break
      }
    }

    if (!records) {
      return res.status(200).json({
        success: false,
        error: 'Could not locate search records in __NEXT_DATA__.',
        hint:  'Set DEBUG=true in api/search-items.js and re-run to inspect the structure.',
        results: [],
      })
    }

    const results = records
      .slice(0, 6)
      .map(extractProduct)
      .filter(p => p.name && p.price != null)

    return res.status(200).json({ success: true, results, count: results.length })

  } catch (err) {
    console.error('[search-items]', err.message)
    return res.status(200).json({ success: false, error: err.message, results: [] })
  }
}
