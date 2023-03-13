import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "fplayer -- Flutter plugin for video player",
      description: "vuepress-theme-hope 的文档演示",
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
