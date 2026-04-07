// api/claude.js — Vercel Serverless Function
// Cette fonction s'exécute côté serveur : votre clé API n'est jamais exposée au navigateur.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY non configurée dans les variables d'environnement Vercel." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Erreur Anthropic API :", err);
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};
