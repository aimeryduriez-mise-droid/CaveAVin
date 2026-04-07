# 🍷 Cave à Vin — Déploiement Vercel (gratuit)

## Ce que vous allez obtenir

Une URL publique type `https://cave-a-vin-votreprenom.vercel.app`
accessible depuis votre iPhone, partout dans le monde, gratuitement.

---

## Étape 1 — Créez un compte GitHub (si vous n'en avez pas)

1. Allez sur [github.com](https://github.com) → **Sign up**
2. Choisissez un nom d'utilisateur et validez votre email

---

## Étape 2 — Mettez le code sur GitHub

### Option A — Interface web (recommandée, sans ligne de commande)

1. Sur GitHub, cliquez **"+"** en haut à droite → **"New repository"**
2. Nom : `cave-a-vin` · Visibilité : **Private** · Cliquez **"Create repository"**
3. Sur la page du repo, cliquez **"uploading an existing file"**
4. Glissez-déposez **tous les fichiers du dossier** `cave-a-vin-vercel/`
   ⚠️ Uploadez bien les dossiers `api/` et `src/` avec leur contenu
5. Cliquez **"Commit changes"**

### Option B — Terminal (si Node.js installé)

```bash
cd cave-a-vin-vercel
git init
git add .
git commit -m "Cave à vin initiale"
# Puis suivez les instructions GitHub pour connecter et pousser
```

---

## Étape 3 — Créez un compte Vercel

1. Allez sur [vercel.com](https://vercel.com) → **Sign Up**
2. Choisissez **"Continue with GitHub"** — c'est plus simple
3. Autorisez Vercel à accéder à votre GitHub

---

## Étape 4 — Importez votre projet

1. Sur le dashboard Vercel, cliquez **"Add New… → Project"**
2. Vous voyez vos repos GitHub — cliquez **"Import"** sur `cave-a-vin`
3. Vercel détecte automatiquement Vite ✅
4. Ne changez rien aux paramètres de build

---

## Étape 5 — Ajoutez votre clé API ← IMPORTANT

**Avant de cliquer Deploy**, faites défiler jusqu'à **"Environment Variables"** :

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-votre-clé-ici` |

Votre clé Anthropic : [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

---

## Étape 6 — Déployez !

Cliquez **"Deploy"**. Attendez ~2 minutes.

🎉 Vercel vous donne une URL comme :
```
https://cave-a-vin-abc123.vercel.app
```

---

## Étape 7 — Installez sur votre iPhone

1. Ouvrez l'URL dans **Safari** sur votre iPhone
2. Bouton **Partager** ↗ → **"Sur l'écran d'accueil"** → **Ajouter**
3. L'icône Cave à Vin apparaît sur votre écran d'accueil 🍷

---

## Mettre à jour l'application

Si vous modifiez des fichiers et les re-uploadez sur GitHub, Vercel redéploie **automatiquement** en 2 minutes. Votre URL reste la même.

---

## Développement local (optionnel)

Si vous voulez tester en local avec les fonctions Vercel actives :

```bash
npm install
npm run dev   # lance "vercel dev" → http://localhost:3000
```

Créez un fichier `.env.local` à la racine :
```
ANTHROPIC_API_KEY=sk-ant-votre-clé
```

---

## Données

Vos bouteilles sont sauvegardées dans le **localStorage** de votre navigateur iPhone.
Elles persistent entre les sessions. Pour exporter une sauvegarde, ouvrez la console
Safari et tapez : `copy(localStorage.getItem('cave-a-vin-v1'))`

---

## Tarifs

| Service | Coût |
|---------|------|
| Vercel Hobby | **Gratuit** |
| Fonctions serverless | **Gratuit** (100 000 invocations/mois) |
| API Anthropic | ~0.003$ par analyse d'étiquette ou conseil sommelier |

Pour un usage personnel de quelques analyses par semaine : **moins de 1€/mois** côté API.
