<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouteLocale } from '@vuepress/client';
import { copies, platformSets, type PlatformId } from './homeContent';

const routeLocale = useRouteLocale();
const isEnglish = computed(() => routeLocale.value.startsWith('/en'));
const copy = computed(() => copies[isEnglish.value ? 'en' : 'zh']);
const platforms = computed(() => platformSets[isEnglish.value ? 'en' : 'zh']);

const activeId = ref<PlatformId>('android');
const active = computed(() => platforms.value.find((platform) => platform.id === activeId.value) ?? platforms.value[0]);
const hardwareOn = ref(true);
const root = ref<HTMLElement>();
const platformStage = ref<HTMLElement>();
const reduceMotion = ref(false);
const gsapRef = ref<any>(null);

let context: any;
let motionQuery: MediaQueryList | undefined;

function onMotionChange(event: MediaQueryListEvent) {
  reduceMotion.value = event.matches;
}

async function selectPlatform(id: PlatformId) {
  activeId.value = id;
  await nextTick();
  if (reduceMotion.value || !gsapRef.value || !platformStage.value) return;
  gsapRef.value.fromTo(
    platformStage.value,
    { opacity: 0.35, y: 12 },
    { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', overwrite: true },
  );
}

onMounted(async () => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduceMotion.value = motionQuery.matches;
  motionQuery.addEventListener?.('change', onMotionChange);

  if (reduceMotion.value || !root.value) return;

  try {
    const [{ gsap }, scrollTriggerModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    const ScrollTrigger = scrollTriggerModule.ScrollTrigger ?? scrollTriggerModule.default;
    gsap.registerPlugin(ScrollTrigger);
    gsapRef.value = gsap;

    context = gsap.context(() => {
      gsap.from('[data-hero]', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-shape]').forEach((shape, index) => {
        gsap.to(shape, {
          x: index % 2 === 0 ? 18 : -16,
          y: index % 3 === 0 ? -22 : 18,
          duration: 8 + index * 1.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.35,
        });
      });
    }, root.value);
  } catch (error) {
    console.warn('[fplayer] GSAP animations unavailable', error);
  }
});

onBeforeUnmount(() => {
  motionQuery?.removeEventListener?.('change', onMotionChange);
  context?.revert();
  gsapRef.value = null;
});
</script>

<template>
  <div ref="root" class="fp-home">
    <section class="fp-hero" aria-labelledby="fp-hero-title">
      <div class="fp-shapes" aria-hidden="true">
        <span data-shape class="fp-shape fp-shape-blue"></span>
        <span data-shape class="fp-shape fp-shape-red"></span>
        <span data-shape class="fp-shape fp-shape-yellow"></span>
        <span data-shape class="fp-shape fp-shape-teal"></span>
        <span data-shape class="fp-shape fp-shape-green"></span>
        <span class="fp-glow fp-glow-blue"></span>
        <span class="fp-glow fp-glow-teal"></span>
      </div>

      <div class="fp-container fp-hero-inner">
        <p class="fp-eyebrow fp-eyebrow--dark" data-hero>
          <span class="fp-live-dot"></span>
          <span>{{ copy.eyebrow }}</span>
          <span class="fp-eyebrow-version">{{ copy.version }}</span>
        </p>
        <h1 id="fp-hero-title" data-hero>
          <span>{{ copy.heroTitleA }}</span>
          <span>{{ copy.heroTitleB }}</span>
        </h1>
        <p class="fp-hero-sub" data-hero>
          {{ copy.heroSub }}
        </p>
        <div class="fp-actions" data-hero>
          <a class="fp-button fp-button--blue" :href="isEnglish ? '/en/guide/quick' : '/guide/quick'">{{ copy.start }} <span aria-hidden="true">→</span></a>
          <a class="fp-button fp-button--ghost-dark" :href="isEnglish ? '/en/basic/api' : '/basic/api'">{{ copy.api }}</a>
        </div>
        <div class="fp-hero-chips" data-hero role="group" :aria-label="copy.platformsAria">
          <span v-for="platform in platforms" :key="platform.id">
            <i :style="{ background: platform.color }"></i>
            {{ platform.name }}
          </span>
        </div>
      </div>

      <div class="fp-hero-foot" aria-hidden="true">
        <span>{{ copy.heroFoot }}</span>
        <span class="fp-scroll-hint">{{ copy.scroll }}</span>
      </div>
    </section>

    <section class="fp-section fp-platform-section" aria-labelledby="fp-platform-title">
      <div class="fp-container">
        <div class="fp-section-head" data-reveal>
          <p class="fp-eyebrow">{{ copy.platformEyebrow }}</p>
          <h2 id="fp-platform-title">{{ copy.platformTitleA }}<br />{{ copy.platformTitleB }}</h2>
          <p>{{ copy.platformSub }}</p>
        </div>

        <div class="fp-flag-card" data-reveal>
          <div class="fp-flag-copy">
            <div class="fp-flag-top">
              <span class="fp-live"><i></i> {{ copy.nativeBridge }}</span>
              <button
                type="button"
                class="fp-switch"
                :class="{ 'is-on': hardwareOn }"
                role="switch"
                :aria-checked="hardwareOn"
                :aria-label="copy.hardwareToggleAria"
                @click="hardwareOn = !hardwareOn"
              >
                <span class="fp-switch-knob"></span>
              </button>
            </div>
            <h3>{{ hardwareOn ? copy.hardwareOnTitle : copy.hardwareOffTitle }}</h3>
            <p>
              {{ hardwareOn ? copy.hardwareOnBody : copy.hardwareOffBody }}
            </p>

            <div class="fp-platform-list" role="group" :aria-label="copy.selectPlatform">
              <button
                v-for="platform in platforms"
                :key="platform.id"
                type="button"
                class="fp-platform-option"
                :class="{ 'is-active': activeId === platform.id }"
                :aria-pressed="activeId === platform.id"
                @click="selectPlatform(platform.id)"
              >
                <i class="fp-platform-dot" :style="{ background: platform.color }"></i>
                <span class="fp-platform-glyph"><PlatformGlyph :name="platform.icon" /></span>
                <span class="fp-platform-name">
                  <strong>{{ platform.name }}</strong>
                  <small>{{ platform.detail }}</small>
                </span>
                <span class="fp-check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path d="m3.5 8.3 2.8 2.8 6.2-6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            <div class="fp-chip-row" role="group" :aria-label="copy.callChain">
              <span>Dart FPlayer</span>
              <b>→</b>
              <span>MethodChannel / NAPI</span>
              <b>→</b>
              <span>fplayercore</span>
            </div>
          </div>

          <div ref="platformStage" class="fp-preview-wrap">
            <div
              class="fp-preview"
              aria-hidden="true"
              :class="['fp-preview--' + active.kind, { 'is-software': !hardwareOn }]"
              :style="{ '--platform-color': active.color }"
            >
              <div class="fp-preview-bar">
                <span></span><span></span><span></span>
                <small>{{ active.name }}</small>
              </div>
              <div class="fp-preview-screen">
                <div class="fp-preview-meta">
                  <span>{{ active.detail }}</span>
                  <span class="fp-preview-status"><i></i>{{ hardwareOn ? copy.native : copy.software }}</span>
                </div>
                <div class="fp-preview-video">
                  <span class="fp-preview-ring"></span>
                  <span class="fp-preview-play">▶</span>
                  <span class="fp-preview-label">{{ copy.exampleLabel }}</span>
                </div>
                <div class="fp-preview-progress"><i></i></div>
                <div class="fp-preview-tracks">
                  <div class="fp-preview-track-head"><span>{{ copy.audioTracks }}</span><span>02</span></div>
                  <div class="fp-preview-track is-selected">
                    <i></i><span>{{ active.track }}</span><small>{{ active.codec }}</small>
                  </div>
                  <div class="fp-preview-track">
                    <i></i><span>{{ copy.commentary }}</span><small>{{ active.codec }}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="fp-preview-caption">
              <span>{{ active.headline }}</span>
              <span>{{ hardwareOn ? copy.hardwarePath : copy.fallback }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="fp-section fp-bento-section" aria-labelledby="fp-bento-title">
      <div class="fp-container">
        <div class="fp-section-head" data-reveal>
          <p class="fp-eyebrow">{{ copy.bentoEyebrow }}</p>
          <h2 id="fp-bento-title">{{ copy.bentoTitleA }}<br />{{ copy.bentoTitleB }}</h2>
          <p>{{ copy.bentoSub }}</p>
        </div>

        <div class="fp-bento">
          <article class="fp-bento-card fp-bento-intro" data-reveal>
            <p class="fp-card-eyebrow">{{ copy.oneObject }}</p>
            <h3>{{ copy.oneObjectTitleA }}<br />{{ copy.oneObjectTitleB }}</h3>
            <p class="fp-card-copy">
              {{ copy.oneObjectBody }}
            </p>
            <div class="fp-chip-grid">
              <span v-for="platform in platforms" :key="platform.id">
                <i :style="{ background: platform.color }"></i>{{ platform.name }}
              </span>
            </div>
          </article>

          <article class="fp-bento-card fp-bento-audio" data-reveal>
            <p class="fp-card-eyebrow">{{ copy.audioEyebrow }}</p>
            <h3>{{ copy.audioTitle }}</h3>
            <div class="fp-track-widget">
              <div class="fp-track-widget-bar"><span></span><span></span><span></span></div>
              <div class="fp-track-widget-row is-selected">
                <i></i><span>{{ isEnglish ? 'English · AAC' : '英语 · AAC' }}</span><b>{{ copy.audioOn }}</b>
              </div>
              <div class="fp-track-widget-row">
                <i></i><span>{{ copy.commentary }}</span><b></b>
              </div>
              <div class="fp-track-widget-row">
                <i></i><span>{{ isEnglish ? 'Japanese · AAC' : '日语 · AAC' }}</span><b></b>
              </div>
            </div>
            <p class="fp-card-copy">{{ copy.audioBody }}</p>
          </article>

          <article class="fp-bento-card fp-bento-surface" data-reveal>
            <p class="fp-card-eyebrow">{{ copy.surfaceEyebrow }}</p>
            <h3>{{ copy.surfaceTitle }}</h3>
            <div class="fp-surface-widget" aria-hidden="true">
              <span class="fp-surface-phone"></span>
              <span class="fp-surface-window"></span>
              <span class="fp-surface-wide"></span>
            </div>
            <p class="fp-card-copy">{{ copy.surfaceBody }}</p>
          </article>

          <article class="fp-bento-card fp-bento-distribution" data-reveal>
            <div>
              <p class="fp-card-eyebrow">{{ copy.distributionEyebrow }}</p>
              <h3>{{ copy.distributionTitle }}</h3>
              <p class="fp-card-copy">
                {{ copy.distributionBody }}
              </p>
            </div>
            <div class="fp-package-stack">
              <span><b>Maven</b><small>Android AAR</small></span>
              <span><b>SPM</b><small>Apple binaryTarget</small></span>
              <span><b>DLL</b><small>Windows x64</small></span>
              <span><b>HAR</b><small>OpenHarmony</small></span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="fp-code-section" aria-labelledby="fp-code-title">
      <div class="fp-container fp-code-layout">
        <div class="fp-code-copy" data-reveal>
          <p class="fp-eyebrow fp-eyebrow--blue">{{ copy.codeEyebrow }}</p>
          <h2 id="fp-code-title">{{ copy.codeTitleA }}<br /><em>{{ copy.codeTitleEm }}</em></h2>
          <p>{{ copy.codeSub }}</p>
          <ol class="fp-steps">
            <li><span>01</span><p>{{ copy.step1 }}</p></li>
            <li><span>02</span><p>{{ copy.step2 }}</p></li>
            <li><span>03</span><p>{{ copy.step3 }}</p></li>
          </ol>
          <a class="fp-text-link fp-text-link--dark" :href="isEnglish ? '/en/basic/api' : '/basic/api'">{{ copy.openApi }}</a>
        </div>

        <div class="fp-code-card" data-reveal>
          <div class="fp-code-bar">
            <span class="fp-code-dots"><i></i><i></i><i></i></span>
            <span>video_page.dart</span>
            <span>Dart</span>
          </div>
          <pre><code><span class="fp-c-comment">// one player, every target</span>
<span class="fp-c-keyword">final</span> player = FPlayer();

<span class="fp-c-keyword">await</span> player.setDataSource(url);
<span class="fp-c-keyword">await</span> player.prepareAsync();

<span class="fp-c-keyword">final</span> tracks = <span class="fp-c-keyword">await</span> player.getAudioTracks();
<span class="fp-c-keyword">await</span> player.setAudioTrack(tracks.first);</code></pre>
          <div class="fp-code-foot">
            <span>Android · iOS · macOS · Windows · OpenHarmony</span>
            <span>fplayercore 1.2.12</span>
          </div>
        </div>
      </div>
    </section>

    <section class="fp-cta-section" aria-labelledby="fp-cta-title">
      <div class="fp-cta-shapes" aria-hidden="true">
        <span data-shape class="fp-shape fp-shape-blue fp-shape--small"></span>
        <span data-shape class="fp-shape fp-shape-red fp-shape--small"></span>
        <span data-shape class="fp-shape fp-shape-yellow fp-shape--small"></span>
        <span data-shape class="fp-shape fp-shape-teal fp-shape--small"></span>
      </div>
      <div class="fp-container fp-cta" data-reveal>
        <p class="fp-eyebrow">{{ copy.ctaEyebrow }}</p>
        <h2 id="fp-cta-title">{{ copy.ctaTitleA }} <em>{{ copy.ctaTitleEm }}</em></h2>
        <p>{{ copy.ctaSub }}</p>
        <div class="fp-actions">
          <a class="fp-button fp-button--dark" :href="isEnglish ? '/en/guide/quick' : '/guide/quick'">{{ copy.ctaStart }} <span aria-hidden="true">→</span></a>
          <a class="fp-button fp-button--ghost" :href="isEnglish ? '/en/basic/api' : '/basic/api'">{{ copy.ctaApi }}</a>
        </div>
        <div class="fp-cta-platforms">
          <span v-for="platform in platforms" :key="platform.id">
            <i :style="{ background: platform.color }"></i>{{ platform.name }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fp-home {
  --fp-blue: #1e7fff;
  /* Normal-size brand text and white-on-blue fills use --fp-blue-text /
     --fp-blue-fill, and status text uses --fp-green-text; all three are
     declared in styles/index.scss. */
  --fp-yellow: #f5c842;
  --fp-red: #ff4545;
  --fp-teal: #2ecaad;
  --fp-green: #2cc26e;
  --fp-surface: #0d0d0f;
  --fp-surface-2: #141417;
  --fp-page: #fafafa;
  --fp-card: #ffffff;
  --fp-ink: #1a1a1a;
  --fp-muted: #666666;
  --fp-faint: #6f6f6f;
  --fp-border: rgba(0, 0, 0, 0.08);
  --fp-border-strong: rgba(0, 0, 0, 0.15);
  --fp-serif: 'Instrument Serif', Georgia, serif;
  --fp-sans: 'Geist Variable', 'Geist', system-ui, sans-serif;
  --fp-mono: 'Geist Mono Variable', 'Geist Mono', 'Fira Code', monospace;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: var(--fp-ink);
  background: var(--fp-page);
  font-family: var(--fp-sans);
  font-size: 18px;
  line-height: 1.6;
  text-align: left;
}

html[data-theme='dark'] .fp-home {
  --fp-page: #0d0d0f;
  --fp-card: #141417;
  --fp-ink: #ffffff;
  --fp-muted: rgba(255, 255, 255, 0.65);
  --fp-faint: rgba(255, 255, 255, 0.5);
  --fp-border: rgba(255, 255, 255, 0.07);
  --fp-border-strong: rgba(255, 255, 255, 0.16);
}

html[data-theme='dark'] .fp-home .fp-button--dark {
  color: #1a1a1a;
  background: #ffffff;
}

.fp-home *,
.fp-home *::before,
.fp-home *::after {
  box-sizing: border-box;
}

.fp-home a {
  color: inherit;
  text-decoration: none;
}

.fp-container {
  width: min(1200px, calc(100% - 80px));
  margin: 0 auto;
}

.fp-hero {
  position: relative;
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: 9rem 0 5rem;
  color: #ffffff;
  background: var(--fp-surface);
}

.fp-shapes,
.fp-cta-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.fp-shape {
  position: absolute;
  display: block;
  will-change: transform;
}

.fp-shape-blue {
  top: 11%;
  left: -7%;
  width: clamp(16rem, 34vw, 32rem);
  height: clamp(13rem, 27vw, 25rem);
  border-radius: 38% 62% 47% 53% / 48% 42% 58% 52%;
  background: var(--fp-blue);
  opacity: 0.94;
}

.fp-shape-red {
  top: 17%;
  right: 8%;
  width: clamp(5rem, 11vw, 10rem);
  height: clamp(5rem, 11vw, 10rem);
  border-radius: 50%;
  background: var(--fp-red);
}

.fp-shape-yellow {
  right: -6%;
  bottom: 11%;
  width: clamp(10rem, 22vw, 20rem);
  height: clamp(7rem, 15vw, 14rem);
  border-radius: 32px;
  background: var(--fp-yellow);
  transform: rotate(18deg);
}

.fp-shape-teal {
  bottom: -8%;
  left: 16%;
  width: clamp(4rem, 8vw, 7rem);
  height: clamp(11rem, 21vw, 19rem);
  border-radius: 999px;
  background: var(--fp-teal);
  transform: rotate(-24deg);
}

.fp-shape-green {
  top: 44%;
  left: 7%;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--fp-green);
}

.fp-glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(105px);
  opacity: 0.24;
}

.fp-glow-blue {
  top: 24%;
  left: 24%;
  background: var(--fp-blue);
}

.fp-glow-teal {
  right: 8%;
  bottom: 4%;
  background: var(--fp-teal);
}

.fp-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 960px;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.fp-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 1.5rem;
  color: var(--fp-blue-text);
  font-family: var(--fp-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  line-height: 1.6;
  text-transform: uppercase;
}

.fp-eyebrow--dark {
  flex-wrap: wrap;
  justify-content: center;
  color: rgba(255, 255, 255, 0.62);
}

.fp-eyebrow-version {
  white-space: nowrap;
}

/* Sits on the dark code section, where the brand blue already clears 4.5:1. */
.fp-eyebrow--blue {
  color: var(--fp-blue);
}

.fp-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--fp-green);
  box-shadow: 0 0 0 0 rgba(44, 194, 110, 0.42);
  animation: fp-pulse 2s ease infinite;
}

.fp-hero h1 {
  max-width: 1000px;
  margin: 0;
  color: #ffffff;
  font-family: var(--fp-serif);
  font-size: clamp(5.5rem, 12vw, 10rem);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.82;
  text-wrap: wrap;
  text-wrap: balance;
}

.fp-hero h1 span {
  display: block;
}

.fp-hero h1 span:last-child {
  color: var(--fp-blue);
}

.fp-hero-sub {
  max-width: 660px;
  margin: 2rem 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: clamp(1rem, 1.5vw, 1.18rem);
  line-height: 1.65;
}

.fp-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 2rem;
}

.fp-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-family: var(--fp-sans);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
  touch-action: manipulation;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.fp-home .fp-button--blue {
  color: #ffffff;
  background: var(--fp-blue-fill);
}

.fp-home .fp-button--dark {
  color: #ffffff;
  background: var(--fp-surface);
}

.fp-home .fp-button--ghost-dark {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
  background: transparent;
}

.fp-home .fp-button--ghost {
  color: var(--fp-ink);
  border-color: var(--fp-border-strong);
  background: transparent;
}

.fp-hero-chips,
.fp-cta-platforms {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem;
}

.fp-hero-chips {
  margin-top: 2.8rem;
}

.fp-hero-chips span,
.fp-cta-platforms span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--fp-mono);
  font-size: 0.72rem;
  line-height: 1;
}

.fp-hero-chips i,
.fp-cta-platforms i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.fp-hero-foot {
  position: absolute;
  right: 0;
  bottom: 1.5rem;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: min(1200px, calc(100% - 80px));
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--fp-mono);
  font-size: 0.68rem;
}

.fp-scroll-hint {
  color: rgba(255, 255, 255, 0.52);
}

.fp-section {
  padding: 120px 0;
}

.fp-section-head {
  max-width: 760px;
  margin-bottom: 3.5rem;
}

.fp-section-head h2,
.fp-code-copy h2,
.fp-cta h2 {
  margin: 0;
  color: var(--fp-ink);
  font-family: var(--fp-sans);
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-wrap: wrap;
  text-wrap: balance;
}

.fp-section-head > p:last-child,
.fp-code-copy > p:not(.fp-eyebrow),
.fp-cta > p:not(.fp-eyebrow) {
  max-width: 580px;
  margin: 1.25rem 0 0;
  color: var(--fp-muted);
  font-size: 1.04rem;
  line-height: 1.7;
}

.fp-flag-card {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid var(--fp-border);
  border-radius: 16px;
  background: var(--fp-card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.025);
}

.fp-flag-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.fp-live {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--fp-green-text);
  font-family: var(--fp-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.fp-live i,
.fp-preview-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--fp-green);
  animation: fp-pulse 2s ease infinite;
}

.fp-switch {
  position: relative;
  width: 80px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 99px;
  /* 3.9:1 against a white card, so the off state keeps a visible boundary. */
  background: #808080;
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color 0.3s ease;
}

.fp-switch.is-on {
  background: var(--fp-blue);
}

.fp-switch-knob {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fp-switch.is-on .fp-switch-knob {
  transform: translateX(36px);
}

.fp-flag-copy h3 {
  max-width: 480px;
  margin: 1.6rem 0 0;
  color: var(--fp-ink);
  font-size: clamp(1.5rem, 2.5vw, 2.15rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.fp-flag-copy > p {
  max-width: 460px;
  margin: 0.85rem 0 0;
  color: var(--fp-muted);
  font-size: 0.98rem;
  line-height: 1.65;
}

.fp-platform-list {
  display: grid;
  gap: 0.35rem;
  margin-top: 1.8rem;
}

.fp-platform-option {
  display: flex;
  width: 100%;
  min-height: 56px;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--fp-ink);
  background: transparent;
  font-family: var(--fp-sans);
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.fp-platform-option.is-active {
  border-color: var(--fp-border);
  background: color-mix(in srgb, var(--fp-blue) 6%, var(--fp-card));
}

.fp-platform-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
}

.fp-platform-glyph {
  display: grid;
  width: 1.65rem;
  height: 1.65rem;
  place-items: center;
  color: var(--fp-ink);
}

.fp-platform-glyph .platform-glyph {
  width: 1rem;
  height: 1rem;
}

.fp-platform-name {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 0.55rem;
  min-width: 0;
}

.fp-platform-name strong {
  font-size: 0.86rem;
  font-weight: 600;
}

.fp-platform-name small {
  overflow: hidden;
  color: var(--fp-faint);
  font-family: var(--fp-mono);
  font-size: 0.62rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fp-check {
  display: grid;
  width: 1.2rem;
  height: 1.2rem;
  flex: none;
  place-items: center;
  border: 1px solid var(--fp-border-strong);
  border-radius: 50%;
  color: transparent;
}

.fp-platform-option.is-active .fp-check {
  border-color: var(--fp-blue);
  color: var(--fp-blue);
}

.fp-chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.4rem;
  color: var(--fp-faint);
  font-family: var(--fp-mono);
  font-size: 0.65rem;
}

.fp-chip-row span {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--fp-border);
  border-radius: 4px;
}

.fp-chip-row b {
  color: var(--fp-blue-text);
  font-weight: 400;
}

.fp-preview-wrap {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 0;
  background: radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--platform-color) 12%, transparent), transparent 68%);
}

.fp-preview {
  width: min(100%, 370px);
  margin: 0 auto;
  padding: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 28px;
  background: #0d0d0f;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.18);
  transition: opacity 0.4s ease;
}

.fp-preview--desktop {
  width: min(100%, 520px);
  padding: 0.45rem;
  border-radius: 12px;
}

.fp-preview.is-software {
  filter: grayscale(0.85);
  opacity: 0.7;
}

.fp-preview-bar {
  display: flex;
  align-items: center;
  gap: 0.28rem;
  height: 1.4rem;
  padding: 0 0.5rem;
}

.fp-preview-bar > span {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
}

.fp-preview-bar small {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--fp-mono);
  font-size: 0.55rem;
}

.fp-preview-screen {
  overflow: hidden;
  min-height: 0;
  border-radius: 22px;
  background: #141417;
}

.fp-preview--desktop .fp-preview-screen {
  border-radius: 8px;
}

.fp-preview-meta {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 0.75rem 0;
  color: rgba(255, 255, 255, 0.42);
  font-family: var(--fp-mono);
  font-size: 0.55rem;
}

.fp-preview-status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--platform-color);
}

.fp-preview-status i {
  background: var(--platform-color);
}

.fp-preview-video {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  margin: 0.7rem 0.7rem 0;
  overflow: hidden;
  border-radius: 8px;
  background:
    radial-gradient(circle at 72% 28%, color-mix(in srgb, var(--platform-color) 52%, transparent), transparent 26%),
    linear-gradient(135deg, #1b3040, #111e2a 48%, #341f27);
}

.fp-preview-ring {
  position: absolute;
  width: 48%;
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: rotate(30deg) scaleY(0.42);
}

.fp-preview-play {
  display: grid;
  width: 2.2rem;
  height: 2.2rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 50%;
  color: #ffffff;
  font-size: 0.65rem;
  padding-left: 0.15rem;
}

.fp-preview-label {
  position: absolute;
  right: 0.55rem;
  bottom: 0.45rem;
  color: rgba(255, 255, 255, 0.55);
  font-family: var(--fp-mono);
  font-size: 0.46rem;
}

.fp-preview-progress {
  height: 3px;
  margin: 0.55rem 0.75rem 0;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.13);
}

.fp-preview-progress i {
  display: block;
  width: 42%;
  height: 100%;
  border-radius: inherit;
  background: var(--platform-color);
}

.fp-preview-tracks {
  margin: 0.7rem;
  padding: 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  background: #0d0d0f;
}

.fp-preview-track-head,
.fp-preview-track {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.fp-preview-track-head {
  justify-content: space-between;
  margin-bottom: 0.45rem;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--fp-mono);
  font-size: 0.48rem;
}

.fp-preview-track {
  min-height: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--fp-mono);
  font-size: 0.56rem;
}

.fp-preview-track > i {
  width: 0.32rem;
  height: 0.32rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.fp-preview-track > small {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.38);
  font-size: 0.45rem;
}

.fp-preview-track.is-selected > i {
  border-color: var(--platform-color);
  background: var(--platform-color);
}

.fp-preview-caption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: min(100%, 520px);
  margin: 1rem auto 0;
  color: var(--fp-faint);
  font-family: var(--fp-mono);
  font-size: 0.62rem;
}

.fp-bento {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
}

.fp-bento-card {
  padding: 2rem;
  border: 1px solid var(--fp-border);
  border-radius: 16px;
  background: var(--fp-card);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.fp-bento-intro {
  grid-column: span 6;
}

.fp-bento-audio {
  grid-column: span 3;
  background:
    radial-gradient(circle at 90% 8%, rgba(30, 127, 255, 0.08), transparent 34%),
    var(--fp-card);
}

.fp-bento-surface {
  grid-column: span 3;
}

.fp-bento-distribution {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 3rem;
  align-items: center;
}

.fp-card-eyebrow {
  margin: 0 0 0.75rem;
  color: var(--fp-blue-text);
  font-family: var(--fp-mono);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fp-bento-card h3 {
  margin: 0;
  color: var(--fp-ink);
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
  text-wrap: wrap;
  text-wrap: balance;
}

.fp-card-copy {
  margin: 0.9rem 0 0;
  color: var(--fp-muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

.fp-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1.5rem;
}

.fp-chip-grid span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.55rem;
  border: 1px solid var(--fp-border);
  border-radius: 5px;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.65rem;
}

.fp-chip-grid i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.fp-track-widget {
  margin-top: 1.5rem;
  padding: 0.7rem;
  border: 1px solid var(--fp-border);
  border-radius: 8px;
  background: var(--fp-page);
}

.fp-track-widget-bar {
  display: flex;
  gap: 0.25rem;
  padding-bottom: 0.55rem;
}

.fp-track-widget-bar span {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: var(--fp-border-strong);
}

.fp-track-widget-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 1.8rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.58rem;
}

.fp-track-widget-row i {
  width: 0.4rem;
  height: 0.4rem;
  border: 1px solid var(--fp-border-strong);
  border-radius: 50%;
}

.fp-track-widget-row b {
  margin-left: auto;
  color: var(--fp-blue-text);
  font-size: 0.55rem;
  font-weight: 500;
}

.fp-track-widget-row.is-selected {
  color: var(--fp-ink);
}

.fp-track-widget-row.is-selected i {
  border-color: var(--fp-blue);
  background: var(--fp-blue);
}

.fp-surface-widget {
  display: flex;
  align-items: end;
  gap: 0.45rem;
  height: 7rem;
  margin-top: 1.35rem;
  padding: 0.7rem;
  border: 1px solid var(--fp-border);
  border-radius: 8px;
  background: var(--fp-page);
}

.fp-surface-widget span {
  display: block;
  border: 1px solid var(--fp-border-strong);
  border-radius: 4px;
  background: var(--fp-card);
}

.fp-surface-phone {
  width: 24%;
  height: 72%;
}

.fp-surface-window {
  width: 38%;
  height: 82%;
}

.fp-surface-wide {
  width: 38%;
  height: 94%;
  border-color: var(--fp-blue);
}

.fp-package-stack {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.fp-package-stack span {
  display: flex;
  min-height: 4rem;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--fp-border);
  border-radius: 6px;
  background: var(--fp-page);
}

.fp-package-stack b {
  color: var(--fp-blue-text);
  font-family: var(--fp-mono);
  font-size: 0.68rem;
  font-weight: 500;
}

.fp-package-stack small {
  color: var(--fp-faint);
  font-family: var(--fp-mono);
  font-size: 0.55rem;
}

.fp-code-section {
  padding: 120px 0;
  color: #ffffff;
  background: var(--fp-surface);
}

.fp-code-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(2.5rem, 7vw, 7rem);
  align-items: center;
}

.fp-code-copy h2 {
  color: #ffffff;
}

.fp-code-copy h2 em {
  color: var(--fp-blue);
  font-family: var(--fp-serif);
  font-size: 1.12em;
  font-style: italic;
  font-weight: 400;
}

.fp-code-copy > p:not(.fp-eyebrow) {
  color: rgba(255, 255, 255, 0.6);
}

.fp-steps {
  display: grid;
  gap: 0.9rem;
  margin: 2rem 0;
  padding: 0;
  list-style: none;
}

.fp-steps li {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.8rem;
  align-items: start;
}

.fp-steps span {
  color: var(--fp-blue);
  font-family: var(--fp-mono);
  font-size: 0.68rem;
}

.fp-steps p {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.9rem;
}

.fp-text-link {
  color: var(--fp-blue-text);
  font-family: var(--fp-sans);
  font-size: 0.9rem;
  font-weight: 600;
}

.fp-text-link--dark {
  color: #ffffff;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.3);
  text-underline-offset: 0.3em;
}

.fp-code-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  background: var(--fp-surface-2);
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.2);
}

.fp-code-bar,
.fp-code-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.55);
  font-family: var(--fp-mono);
  font-size: 0.62rem;
}

.fp-code-bar {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.fp-code-dots {
  display: flex;
  gap: 0.3rem;
}

.fp-code-dots i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
}

.fp-code-bar > span:last-child {
  color: var(--fp-blue);
}

.fp-code-card pre {
  margin: 0;
  padding: 1.6rem;
  overflow-x: auto;
  color: #d8dee9;
  font-family: var(--fp-mono);
  font-size: clamp(0.72rem, 1vw, 0.86rem);
  line-height: 1.9;
}

.fp-code-card code {
  font-family: inherit;
}

.fp-c-comment {
  color: #848b98;
}

.fp-c-keyword {
  color: #c792ea;
}

.fp-c-string {
  color: #c3e88d;
}

.fp-c-function {
  color: #82aaff;
}

.fp-code-foot {
  padding: 0.8rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.fp-cta-section {
  position: relative;
  overflow: hidden;
  padding: 120px 0;
  background: var(--fp-page);
}

.fp-cta-shapes {
  opacity: 0.5;
}

.fp-shape--small {
  opacity: 0.7;
}

.fp-cta-shapes .fp-shape-blue {
  top: 12%;
  left: 6%;
  width: 14rem;
  height: 10rem;
}

.fp-cta-shapes .fp-shape-red {
  top: 8%;
  right: 12%;
  width: 4.5rem;
  height: 4.5rem;
}

.fp-cta-shapes .fp-shape-yellow {
  right: 3%;
  bottom: 8%;
  width: 9rem;
  height: 7rem;
}

.fp-cta-shapes .fp-shape-teal {
  bottom: -4%;
  left: 22%;
  width: 3rem;
  height: 9rem;
}

.fp-cta {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
}

.fp-cta h2 {
  font-family: var(--fp-serif);
  font-size: clamp(4.5rem, 10vw, 9rem);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.86;
}

.fp-cta h2 em {
  color: var(--fp-blue);
  font-style: italic;
}

.fp-cta > p:not(.fp-eyebrow) {
  max-width: 580px;
  margin-right: auto;
  margin-left: auto;
}

.fp-cta .fp-eyebrow {
  justify-content: center;
}

.fp-cta-platforms {
  margin-top: 2rem;
}

.fp-cta-platforms span {
  border-color: var(--fp-border);
  color: var(--fp-muted);
}

.fp-home :focus-visible {
  outline: 2px solid var(--fp-blue);
  outline-offset: 4px;
}

.fp-home .platform-glyph {
  display: block;
}

@keyframes fp-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@media (hover: hover) and (pointer: fine) {
  .fp-button:hover {
    transform: translateY(-1px);
  }

  .fp-button--blue:hover {
    background: #0a4bb8;
  }

  .fp-button--dark:hover {
    background: #2a2a30;
  }

  .fp-button--ghost:hover,
  .fp-button--ghost-dark:hover {
    border-color: var(--fp-blue);
    color: var(--fp-blue);
  }

  .fp-platform-option:hover {
    background: color-mix(in srgb, var(--fp-blue) 5%, var(--fp-card));
  }

  .fp-bento-card:hover {
    border-color: color-mix(in srgb, var(--fp-blue) 30%, var(--fp-border));
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  }
}

@media (max-width: 1024px) {
  .fp-flag-card {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .fp-preview-wrap {
    padding-top: 0;
  }

  .fp-bento-intro,
  .fp-bento-audio,
  .fp-bento-surface {
    grid-column: span 12;
  }

  .fp-bento-distribution {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }

  .fp-package-stack {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fp-code-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 720px) {
  .fp-container {
    width: min(100% - 48px, 1200px);
  }

  .fp-hero {
    min-height: 780px;
    padding-top: 7rem;
  }

  .fp-eyebrow--dark {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .fp-eyebrow-version {
    display: none;
  }

  .fp-hero h1 {
    font-size: clamp(3.4rem, 13vw, 5.2rem);
  }

  .fp-hero-sub {
    max-width: 30rem;
  }

  .fp-hero-foot {
    display: none;
  }

  .fp-scroll-hint {
    display: none;
  }

  .fp-shape-blue {
    top: 8%;
    left: -70%;
    width: 18rem;
    height: 13rem;
    opacity: 0.8;
  }

  .fp-shape-yellow {
    right: -28%;
    bottom: 7%;
  }

  .fp-shape-teal {
    bottom: -12%;
    left: 8%;
  }

  .fp-shape-red {
    top: 4%;
    right: 4%;
    width: 4rem;
    height: 4rem;
  }

  .fp-shape-green {
    display: none;
  }

  .fp-section,
  .fp-code-section,
  .fp-cta-section {
    padding: 80px 0;
  }

  .fp-section-head {
    margin-bottom: 2.25rem;
  }

  .fp-section-head h2,
  .fp-code-copy h2 {
    font-size: clamp(2rem, 9vw, 2.8rem);
  }

  .fp-flag-card {
    padding: 1.25rem;
  }

  .fp-platform-name {
    display: block;
  }

  .fp-platform-name small {
    display: block;
    margin-top: 0.12rem;
  }

  .fp-preview {
    width: min(100%, 310px);
  }

  .fp-preview--desktop {
    width: 100%;
  }

  .fp-bento-card {
    padding: 1.4rem;
  }

  .fp-bento-distribution {
    padding: 1.4rem;
  }

  .fp-code-card pre {
    padding: 1.1rem;
  }

  .fp-code-foot {
    align-items: flex-start;
    flex-direction: column;
  }

  .fp-cta h2 {
    font-size: clamp(4rem, 18vw, 6rem);
  }

  .fp-cta-platforms span {
    font-size: 0.62rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fp-home *,
  .fp-home *::before,
  .fp-home *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
