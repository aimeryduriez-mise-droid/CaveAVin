// api/claude.js — Vercel Serverless Function
// Cette fonction s'exécute côté serveur : votre clé API n'est jamais exposée au navigateur.

export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
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

// Augmente la limite de taille du body à 10MB (pour les images base64)
export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};
