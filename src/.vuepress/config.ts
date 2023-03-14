import { defineUserConfig } from "vuepress";
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
      title: "fplayer -- Flutter plugin for video player",
      description: "fplayer的官方文档",
    },
    // "/en/": {
    //   lang: "en-US",
    //   title: "fplayer--Flutter plugin for fijkplayer",
    //   description: "A docs demo for vuepress-theme-hope",
    // },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
