import { defineClientConfig } from '@vuepress/client';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import HomePage from './components/HomePage.vue';
import PlatformGlyph from './components/PlatformGlyph.vue';

export default defineClientConfig({
  enhance({ app }) {
    app.component('HomePage', HomePage);
    app.component('PlatformGlyph', PlatformGlyph);
  },
});
