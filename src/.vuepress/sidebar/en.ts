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
      text: "Skin",
      icon: "style",
      prefix: "skin/",
      children: "structure",
    },
    {
      text: "Basics",
      icon: "module",
      prefix: "basic/",
      children: "structure",
    },
    {
      text: "Kernel",
      icon: "process",
      prefix: "core/",
      children: "structure",
    },
  ],
});
