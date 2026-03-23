// Phase 3 — Fetch Price
// This function will be completed in Phase 3 after DevTools inspection of
// samsclub.com __NEXT_DATA__ paths (see NOTES.md Phase 3 action items).
//
// Endpoint: POST /api/fetch-price
// Body:     { url: "https://www.samsclub.com/p/..." }
// Returns:  { success: true, price: 18.98 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body || {}
  if (!url || !url.includes('samsclub.com')) {
    return res.status(400).json({ success: false, error: 'Invalid URL' })
  }

  // TODO Phase 3: implement __NEXT_DATA__ parsing with cheerio
  // See plan Section 9.2 for implementation sketch
  return res.status(200).json({
    success: false,
    error: 'Price fetch not yet implemented — complete Phase 3',
  })
}
