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
      text: "基础",
      icon: "note",
      prefix: "basic/",
      children: "structure",
    },
    {
      text: "内核",
      icon: "note",
      prefix: "core/",
      children: "structure",
    }
  ],
});
