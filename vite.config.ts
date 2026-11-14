import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [
    react(),
    VitePWA({
      registerType: "prompt",
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
      },
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        id: "./",
        name: "BioCity - komórkowe miasto",
        short_name: "BioCity",
        description:
          "Poznaj struktury komórki i rozwiązuj zagadki w trzech biologicznych miastach.",
        lang: "pl",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#f7f8f2",
        theme_color: "#173b35",
        categories: ["education", "games"],
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        cleanupOutdatedCaches: true,
        navigateFallback: "index.html",
      },
    }),
  ]),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
