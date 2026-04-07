import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Cave à Vin",
        short_name: "Cave à Vin",
        description: "Gérez votre cave à vin avec l'aide de l'IA",
        theme_color: "#b8922e",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  // Pas de proxy : en production Vercel, /api est géré nativement.
  // En dev local, utilisez "npm run dev" (= vercel dev) qui lance aussi les fonctions.
});
