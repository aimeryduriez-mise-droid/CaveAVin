// api/barcode/[code].js — Vercel Serverless Function
// Proxy vers Open Food Facts pour éviter les erreurs CORS côté navigateur.

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${code}.json`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
