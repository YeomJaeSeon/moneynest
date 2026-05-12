// Vercel serverless function: proxy Naver Finance polling API for Korean stocks/ETFs
// Called as /api/prices?codes=105560,069500,...
// Naver polling API is used by Naver Finance itself — stable, real-time Korean market data.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Edge cache: fresh for 5 min, serve stale up to 1 min while revalidating
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const { codes } = req.query;
  if (!codes) return res.status(400).json({ error: 'codes param required' });

  const codeList = codes.split(',').filter(c => /^\d+$/.test(c)).slice(0, 60);
  if (!codeList.length) return res.status(400).json({ error: 'no valid codes' });

  const url = `https://polling.finance.naver.com/api/realtime/domestic/stock/${codeList.join(',')}`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MoneyNest/1.0)',
        'Referer': 'https://finance.naver.com/',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) {
      return res.status(502).json({ error: `upstream ${r.status}` });
    }

    const json = await r.json();
    const result = {};

    (json.datas || []).forEach(item => {
      const code  = item.itemCode;
      const price = parseInt(item.closePriceRaw, 10);
      if (code && !isNaN(price) && price > 0) result[code] = price;
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
