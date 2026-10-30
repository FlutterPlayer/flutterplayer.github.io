import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
  head: [
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
