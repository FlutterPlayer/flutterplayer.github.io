import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
  head: [
    [
      "meta",
      {
        name: "theme-color",
        content: "#fafafa",
        media: "(prefers-color-scheme: light)",
      },
    ],
    [
      "script",
      {},
      `(() => { if (document.querySelector('meta[name="theme-color"][media*="dark"]')) return; const meta = document.createElement("meta"); meta.name = "theme-color"; meta.content = "#0d0d0f"; meta.media = "(prefers-color-scheme: dark)"; document.head.appendChild(meta); })();`,
    ],
    [
      "script",
      {
        "data-ad-client": "ca-pub-5039983089268679",
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      }
    ]
  ],

  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Fplayer",
      description: "Fplayer：一套 Dart API，五端原生播放的 Flutter 媒体播放器。",
    },
    "/en/": {
      lang: "en-US",
      title: "Fplayer",
      description: "Fplayer: one Dart API for five native Flutter media targets.",
    },
  },

  plugins: [
    searchProPlugin({
      indexContent: true,
    }),
  ],

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
