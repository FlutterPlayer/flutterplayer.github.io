import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar } from "./navbar/index.js";
import { zhNavbar } from "./navbar/index.js";
import { enSidebar } from "./sidebar/index.js";
import { zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://flutterplayer.github.io/",

  author: {
    name: "fplayer",
    url: "https://flutterplayer.github.io/",
  },

  iconAssets: "iconfont",

  logo: "/logo.png",

  repo: "https://github.com/FlutterPlayer/fplayer",

  docsDir: "demo/theme-docs/src",

  locales: {
    "/en/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "Built with <a href=\"https://theme-hope.vuejs.press/\" target=\"_blank\">VuePress Theme Hope</a>",

      displayFooter: true,

      editLink: false,

      pageInfo: false,

      contributors: false,

      lastUpdated: false,

      home: "/en/",

      navbarLocales: {
        langName: "English",
        selectLangAriaLabel: "Select language",
      },
    },

    /**
     * Chinese locale config
     */
    "/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebar,

      footer: "使用 <a href=\"https://theme-hope.vuejs.press/\" target=\"_blank\">VuePress Theme Hope</a> 主题",

      displayFooter: true,

      editLink: false,

      pageInfo: false,

      contributors: false,

      lastUpdated: false,

      home: "/",

      navbarLocales: {
        langName: "简体中文",
        selectLangAriaLabel: "选择语言",
      },
    },
  },

  plugins: {
    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
  },
});
