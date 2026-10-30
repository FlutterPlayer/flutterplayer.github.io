import { defineClientConfig } from '@vuepress/client';
import '@fontsource-variable/space-grotesk';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import HomePage from './components/HomePage.vue';
import PlatformGlyph from './components/PlatformGlyph.vue';

export default defineClientConfig({
  enhance({ app }) {
    app.component('HomePage', HomePage);
    app.component('PlatformGlyph', PlatformGlyph);
  },
});
