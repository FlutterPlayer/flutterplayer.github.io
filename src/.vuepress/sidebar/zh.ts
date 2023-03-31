import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "入门指南",
      icon: "note",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "皮肤",
      icon: "style",
      prefix: "skin/",
      children: "structure",
    },
    {
      text: "基础",
      icon: "module",
      prefix: "basic/",
      children: "structure",
    },
    {
      text: "内核",
      icon: "process",
      prefix: "core/",
      children: "structure",
    }
  ],
});
