import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/en/": [
    "",
    {
      text: "Getting Started",
      icon: "note",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "Basic",
      icon: "note",
      prefix: "basic/",
      children: "structure",
    },
  ],
});
