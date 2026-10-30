<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type PlatformId = 'android' | 'ios' | 'macos' | 'windows' | 'ohos';
type PlatformIcon = 'android' | 'apple' | 'windows' | 'ohos';
type DeviceKind = 'phone' | 'desktop';

interface Platform {
  id: PlatformId;
  name: string;
  detail: string;
  icon: PlatformIcon;
  kind: DeviceKind;
  headline: string;
  blurb: string;
  facts: string[];
  track: string;
  codec: string;
}

const platforms: Platform[] = [
  {
    id: 'android',
    name: 'Android',
    detail: 'API 28+ · arm64-v8a',
    icon: 'android',
    kind: 'phone',
    headline: '把硬解和纹理渲染交给原生。',
    blurb: '同一个 FPlayer，在 Android 上连接 fplayercore 的硬件解码器和 SurfaceTexture，UI 侧只关心状态与交互。',
    facts: ['NDK 29 与 16 KB 页对齐', 'Texture 纹理输出', '音轨查询与切换'],
    track: 'English · AAC',
    codec: '48 kHz · stereo',
  },
  {
    id: 'ios',
    name: 'iOS',
    detail: 'iOS 13+ · arm64',
    icon: 'apple',
    kind: 'phone',
    headline: '同一套 Dart，落在原生播放管线。',
    blurb: 'iOS 侧通过 Swift Package Manager 直接取得官方 xcframework，FPlayer 的 API 与 Android 保持一致。',
    facts: ['Device / arm64 simulator', 'VideoToolbox 硬解', 'SwiftPM binaryTarget'],
    track: 'Japanese · AAC',
    codec: '48 kHz · stereo',
  },
  {
    id: 'macos',
    name: 'macOS',
    detail: 'macOS 10.15+ · arm64',
    icon: 'apple',
    kind: 'desktop',
    headline: '桌面窗口，也能复用同一条链路。',
    blurb: '窗口、Metal 渲染、音轨选择与移动端共享同一套 FPlayer 状态机，桌面端不需要另写播放器。',
    facts: ['Metal / CoreVideo', '窗口与全屏适配', '同一套音轨 API'],
    track: 'English · AAC',
    codec: '48 kHz · stereo',
  },
  {
    id: 'windows',
    name: 'Windows',
    detail: 'Windows x64',
    icon: 'windows',
    kind: 'desktop',
    headline: 'Windows 原生 DLL，接口仍然只有一套。',
    blurb: 'fplayercore 的 C API 由 CMake 接入 Flutter Windows runner，播放、暂停、seek 与音轨控制无需分叉。',
    facts: ['CMake + fplayercore.dll', '纹理帧回传', '与 Dart API 对齐'],
    track: 'English · AAC',
    codec: '48 kHz · stereo',
  },
  {
    id: 'ohos',
    name: 'OpenHarmony',
    detail: 'API 12+ · arm64-v8a',
    icon: 'ohos',
    kind: 'phone',
    headline: '新平台，不是新的播放器。',
    blurb: 'OpenHarmony 通过 NAPI + ArkTS 暴露 fplayercore，FPlayer 继续使用同一组 Dart 方法。',
    facts: ['NAPI / ArkTS 桥接', 'OHOS HAR 分发', '音轨选择可用'],
    track: 'Chinese · AAC',
    codec: '48 kHz · stereo',
  },
];

const activeId = ref<PlatformId>('android');
const active = computed(
  () => platforms.find((platform) => platform.id === activeId.value) ?? platforms[0],
);

const root = ref<HTMLElement>();
const heroVisual = ref<HTMLElement>();
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
    { opacity: 0.45, y: 14, scale: 0.985 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: true },
  );
}

function onPointerMove(event: PointerEvent) {
  if (
    reduceMotion.value ||
    !gsapRef.value ||
    !heroVisual.value ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return;
  }
  const bounds = heroVisual.value.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  gsapRef.value.to(heroVisual.value, {
    rotateX: -y * 5,
    rotateY: x * 7,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: true,
  });
}

function resetTilt() {
  if (!reduceMotion.value && gsapRef.value && heroVisual.value) {
    gsapRef.value.to(heroVisual.value, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: true,
    });
  }
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
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 38,
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

      gsap.to('.fp-orbit-ring', {
        rotation: 360,
        duration: 44,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });

      gsap.to('.fp-glow-a', {
        xPercent: 7,
        yPercent: -5,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.fp-glow-b', {
        xPercent: -6,
        yPercent: 5,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
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
      <div class="fp-hero-grid" aria-hidden="true"></div>
      <div class="fp-glow fp-glow-a" aria-hidden="true"></div>
      <div class="fp-glow fp-glow-b" aria-hidden="true"></div>

      <div class="fp-shell fp-hero-inner">
        <div class="fp-hero-copy">
          <p class="fp-eyebrow" data-hero>
            <span class="fp-pulse" aria-hidden="true"></span>
            Flutter media engine · fplayercore 1.2.12
          </p>
          <h1 id="fp-hero-title" data-hero>
            <span class="fp-title-line">一套 Dart，</span>
            <span class="fp-title-line fp-title-accent">五端原生播放。</span>
          </h1>
          <p class="fp-lede" data-hero>
            FPlayer 把播放器能力收进一组可组合的 Dart API，再交给每个平台的原生
            fplayercore。跨端复用的是接口，不是体验。
          </p>
          <div class="fp-actions" data-hero>
            <a class="fp-button fp-button--primary" href="/guide/quick">
              开始构建
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path d="M4 10h11M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
            <a class="fp-text-link" href="/basic/api">浏览播放器 API</a>
          </div>
          <dl class="fp-proof" data-hero>
            <div>
              <dt>平台</dt>
              <dd>5</dd>
            </div>
            <div>
              <dt>Dart API</dt>
              <dd>1</dd>
            </div>
            <div>
              <dt>原生内核</dt>
              <dd>5</dd>
            </div>
          </dl>
        </div>

        <div
          ref="heroVisual"
          class="fp-hero-visual"
          data-hero
          @pointermove="onPointerMove"
          @pointerleave="resetTilt"
        >
          <div class="fp-orbit" aria-hidden="true">
            <div class="fp-orbit-ring fp-orbit-ring--outer"></div>
            <div class="fp-orbit-ring fp-orbit-ring--inner"></div>
            <div class="fp-orbit-axis"></div>
            <div class="fp-orbit-core">
              <PlatformGlyph name="flutter" />
              <span>FPlayer</span>
            </div>
            <div class="fp-orbit-node fp-node-android">
              <PlatformGlyph name="android" />
              <span>Android</span>
            </div>
            <div class="fp-orbit-node fp-node-ios">
              <PlatformGlyph name="apple" />
              <span>iOS</span>
            </div>
            <div class="fp-orbit-node fp-node-macos">
              <PlatformGlyph name="apple" />
              <span>macOS</span>
            </div>
            <div class="fp-orbit-node fp-node-windows">
              <PlatformGlyph name="windows" />
              <span>Windows</span>
            </div>
            <div class="fp-orbit-node fp-node-ohos">
              <PlatformGlyph name="ohos" />
              <span>OHOS</span>
            </div>
          </div>

          <div class="fp-signal-card">
            <div class="fp-signal-head">
              <span class="fp-signal-kicker">native bridge</span>
              <span class="fp-signal-live"><i></i> ready</span>
            </div>
            <div class="fp-signal-row">
              <span class="fp-signal-dot"></span>
              <span>fplayercore</span>
              <span class="fp-signal-version">1.2.12</span>
            </div>
            <code>FPlayer → MethodChannel → native</code>
          </div>
        </div>
      </div>

      <div class="fp-scroll-cue" aria-hidden="true">
        <span></span>
        scroll to explore
      </div>
    </section>

    <section class="fp-section fp-section--platforms" aria-labelledby="fp-platforms-title">
      <div class="fp-shell">
        <div class="fp-section-head" data-reveal>
          <p class="fp-eyebrow">One API · five targets</p>
          <h2 id="fp-platforms-title">跨平台，不等于同一个屏幕。</h2>
          <p>
            选择目标平台，看看同一组 FPlayer 调用如何落到不同的原生 surface、窗口系统和分发格式。
          </p>
        </div>

        <div class="fp-platform-layout">
          <div class="fp-platform-tabs" role="group" aria-label="选择目标平台" data-reveal>
            <button
              v-for="platform in platforms"
              :key="platform.id"
              type="button"
              class="fp-platform-tab"
              :class="{ 'is-active': activeId === platform.id }"
              :aria-pressed="activeId === platform.id"
              @click="selectPlatform(platform.id)"
            >
              <span class="fp-platform-icon">
                <PlatformGlyph :name="platform.icon" />
              </span>
              <span>
                <strong>{{ platform.name }}</strong>
                <small>{{ platform.detail }}</small>
              </span>
              <span class="fp-platform-check" aria-hidden="true">↗</span>
            </button>
          </div>

          <div ref="platformStage" class="fp-platform-stage" data-reveal>
            <div class="fp-device" :class="['fp-device--' + active.kind, 'fp-device--' + active.id]" aria-hidden="true">
              <div v-if="active.kind === 'desktop'" class="fp-device-bar">
                <span></span><span></span><span></span>
                <span class="fp-device-bar-title">{{ active.name }}</span>
              </div>
              <div v-else class="fp-device-notch"></div>
              <div class="fp-device-screen">
                <div class="fp-screen-meta">
                  <span>{{ active.detail }}</span>
                  <span>fplayercore</span>
                </div>
                <div class="fp-screen-video">
                  <div class="fp-screen-orbit" aria-hidden="true"></div>
                  <div class="fp-play" aria-hidden="true">
                    <svg viewBox="0 0 18 18" width="18" height="18">
                      <path d="m7 5 6 4-6 4z" fill="currentColor" />
                    </svg>
                  </div>
                  <span class="fp-screen-caption">fplayer example · 1080p</span>
                </div>
                <div class="fp-screen-progress"><span></span></div>
                <div class="fp-screen-tracks">
                  <div class="fp-screen-tracks-head">
                    <span>Audio tracks</span>
                    <span>2 available</span>
                  </div>
                  <div class="fp-screen-track is-selected">
                    <i></i>
                    <span>{{ active.track }}</span>
                    <small>{{ active.codec }}</small>
                    <b>selected</b>
                  </div>
                  <div class="fp-screen-track">
                    <i></i>
                    <span>Commentary</span>
                    <small>48 kHz · stereo</small>
                  </div>
                </div>
              </div>
              <div v-if="active.kind === 'phone'" class="fp-device-home"></div>
            </div>

            <div class="fp-platform-copy" aria-live="polite">
              <p class="fp-eyebrow">{{ active.name }} / {{ active.detail }}</p>
              <h3>{{ active.headline }}</h3>
              <p>{{ active.blurb }}</p>
              <ul>
                <li v-for="fact in active.facts" :key="fact">{{ fact }}</li>
              </ul>
              <a class="fp-text-link" href="/guide/">查看 {{ active.name }} 接入说明</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="fp-section fp-section--capabilities" aria-labelledby="fp-capabilities-title">
      <div class="fp-shell">
        <div class="fp-section-head" data-reveal>
          <p class="fp-eyebrow">What stays consistent</p>
          <h2 id="fp-capabilities-title">体验可以不同，能力不能缩水。</h2>
          <p>
            播放状态、音轨、纹理渲染和发布链路都收敛到同一层，平台差异只留在它该在的地方。
          </p>
        </div>

        <div class="fp-feature-grid">
          <article class="fp-feature fp-feature--wide" data-reveal>
            <div class="fp-feature-heading">
              <span class="fp-feature-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="m12 3 8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" />
                </svg>
              </span>
              <div>
                <p class="fp-feature-label">fplayercore</p>
                <h3>一个内核，五种原生表面</h3>
              </div>
            </div>
            <p>
              Android 的 SurfaceTexture、Apple 的 CVPixelBuffer、Windows 的纹理帧回传和
              OpenHarmony 的 NAPI surface，最终都接到同一个 <code>FView</code>。
            </p>
            <div class="fp-pipeline" aria-label="跨平台调用链">
              <span>Dart FPlayer</span>
              <i></i>
              <span>MethodChannel / NAPI</span>
              <i></i>
              <span>fplayercore</span>
              <i></i>
              <span>native surface</span>
            </div>
          </article>

          <article class="fp-feature" data-reveal>
            <div class="fp-feature-heading">
              <span class="fp-feature-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 14v-4M8 18V6M12 15V9M16 20V4M20 12V8" stroke-linecap="round" />
                </svg>
              </span>
              <div>
                <p class="fp-feature-label">Audio tracks</p>
                <h3>音轨可见，也能切换。</h3>
              </div>
            </div>
            <p>读取语言、编码和采样率，选中任意一条音轨，不需要碰平台原生代码。</p>
            <div class="fp-track-preview">
              <div><i></i><span>English · AAC</span><b>selected</b></div>
              <div><i></i><span>Commentary</span><b></b></div>
            </div>
          </article>

          <article class="fp-feature" data-reveal>
            <div class="fp-feature-heading">
              <span class="fp-feature-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M8 5V3M16 5V3M8 19v2M16 19v2" stroke-linecap="round" />
                </svg>
              </span>
              <div>
                <p class="fp-feature-label">Adaptive surface</p>
                <h3>同一帧，适配每块屏幕。</h3>
              </div>
            </div>
            <p>手机、桌面窗口和全屏切换共享状态机，旋转、尺寸变化与纹理重建由 FView 处理。</p>
          </article>

          <article class="fp-feature" data-reveal>
            <div class="fp-feature-heading">
              <span class="fp-feature-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="m4 7 8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10" />
                </svg>
              </span>
              <div>
                <p class="fp-feature-label">Distribution</p>
                <h3>每个平台，走它自己的官方包。</h3>
              </div>
            </div>
            <p>
              Maven Central 的 AAR、Apple 的 SwiftPM binaryTarget、Windows DLL 与 OHOS
              HAR，全部由 ijkplayer 的同一版 Release 产出。
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="fp-section fp-section--code" aria-labelledby="fp-code-title">
      <div class="fp-shell fp-code-layout">
        <div class="fp-code-copy" data-reveal>
          <p class="fp-eyebrow">From first frame to first switch</p>
          <h2 id="fp-code-title">播放器代码，应该只写一遍。</h2>
          <p>
            初始化、准备、读取音轨、切换音轨。平台、文件格式和解码器选择留在 fplayercore，
            业务侧只面对 FPlayer。
          </p>
          <ol class="fp-steps">
            <li><span>01</span><div><strong>创建播放器</strong><p>由 FPlayer 管理原生实例和纹理生命周期。</p></div></li>
            <li><span>02</span><div><strong>等待 prepare</strong><p>拿到媒体元数据后，音轨和时长才可用。</p></div></li>
            <li><span>03</span><div><strong>读取并切换音轨</strong><p>用同一个索引 API 跨五端选择音轨。</p></div></li>
          </ol>
        </div>

        <div class="fp-code-panel" data-reveal>
          <div class="fp-code-bar">
            <span><i></i><i></i><i></i></span>
            <span>video_page.dart</span>
            <span>Dart</span>
          </div>
          <pre><code><span class="fp-code-comment">// one player, every target</span>
<span class="fp-code-keyword">final</span> player = FPlayer();

<span class="fp-code-keyword">await</span> player.setDataSource(url);
<span class="fp-code-keyword">await</span> player.prepareAsync();

<span class="fp-code-keyword">final</span> tracks = <span class="fp-code-keyword">await</span> player.getAudioTracks();
<span class="fp-code-keyword">await</span> player.setAudioTrack(tracks.first);</code></pre>
          <div class="fp-code-foot">
            <span>Android · iOS · macOS · Windows · OpenHarmony</span>
            <span>fplayercore 1.2.12</span>
          </div>
        </div>
      </div>
    </section>

    <section class="fp-cta" aria-labelledby="fp-cta-title">
      <div class="fp-shell fp-cta-inner" data-reveal>
        <p class="fp-eyebrow">Build for every screen</p>
        <h2 id="fp-cta-title">把同一套播放器，放进每一个屏幕。</h2>
        <p>从 Flutter 项目开始，选择你的目标平台，剩下的交给 FPlayer 和 fplayercore。</p>
        <a class="fp-button fp-button--primary" href="/guide/quick">
          进入快速上手
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path d="M4 10h11M10.5 4.5 16 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <div class="fp-cta-platforms" aria-hidden="true">
          <span v-for="platform in platforms" :key="platform.id">
            <PlatformGlyph :name="platform.icon" />
            {{ platform.name }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fp-home {
  --fp-bg: #f4fbfc;
  --fp-surface: #ffffff;
  --fp-surface-raised: #e8f7f8;
  --fp-ink: #082126;
  --fp-muted: #547177;
  --fp-line: rgba(8, 33, 38, 0.14);
  --fp-accent: #12c9d6;
  --fp-mint: #087e89;
  --fp-cyan: #087e89;
  --fp-amber: #0b8f9a;
  --fp-grid-line: rgba(8, 33, 38, 0.075);
  --fp-hover-surface: rgba(18, 201, 214, 0.08);
  --fp-glass: rgba(255, 255, 255, 0.8);
  --fp-glass-strong: rgba(255, 255, 255, 0.94);
  --fp-glass-shadow: rgba(8, 33, 38, 0.12);
  --fp-cta-border: rgba(18, 201, 214, 0.3);
  --fp-cta-bg: linear-gradient(135deg, rgba(231, 249, 250, 0.96), rgba(213, 244, 246, 0.96));
  --fp-display: 'Space Grotesk Variable', 'Space Grotesk', 'Avenir Next', 'PingFang SC', sans-serif;
  --fp-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: var(--fp-ink);
  background: var(--fp-bg);
  font-family: var(--fp-display);
  text-align: left;
}

html[data-theme='dark'] .fp-home {
  --fp-bg: #061012;
  --fp-surface: #0b1a1d;
  --fp-surface-raised: #102528;
  --fp-ink: #effafb;
  --fp-muted: #9bb4b7;
  --fp-line: rgba(214, 244, 246, 0.14);
  --fp-accent: #12c9d6;
  --fp-mint: #12c9d6;
  --fp-cyan: #6fe4eb;
  --fp-amber: #36dbe6;
  --fp-grid-line: rgba(214, 244, 246, 0.055);
  --fp-hover-surface: rgba(18, 201, 214, 0.08);
  --fp-glass: rgba(12, 27, 23, 0.78);
  --fp-glass-strong: rgba(12, 27, 23, 0.9);
  --fp-glass-shadow: rgba(0, 0, 0, 0.24);
  --fp-cta-border: rgba(18, 201, 214, 0.22);
  --fp-cta-bg: linear-gradient(135deg, rgba(17, 37, 31, 0.9), rgba(12, 27, 23, 0.9));
}

.fp-home *,
.fp-home *::before,
.fp-home *::after {
  box-sizing: border-box;
}

.fp-home a {
  text-decoration: none;
}

.fp-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.fp-hero {
  position: relative;
  min-height: min(900px, 100svh);
  padding: clamp(7.5rem, 14vh, 10.5rem) 0 4rem;
  background:
    radial-gradient(ellipse 65% 55% at 76% 38%, rgba(18, 201, 214, 0.11), transparent 70%),
    radial-gradient(ellipse 50% 40% at 20% 10%, rgba(18, 201, 214, 0.08), transparent 72%),
    var(--fp-bg);
}

.fp-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--fp-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--fp-grid-line) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 36%, #000 12%, transparent 78%);
  pointer-events: none;
}

.fp-glow {
  position: absolute;
  width: 34rem;
  height: 34rem;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.38;
  pointer-events: none;
  will-change: transform;
}

.fp-glow-a {
  top: 10%;
  right: 6%;
  background: rgba(18, 201, 214, 0.16);
}

.fp-glow-b {
  bottom: -12%;
  left: 12%;
  background: rgba(18, 201, 214, 0.12);
}

.fp-hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(420px, 0.96fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.fp-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0 0 1.4rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.72rem;
  letter-spacing: 0.025em;
  line-height: 1.4;
}

.fp-pulse {
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 50%;
  background: var(--fp-accent);
  box-shadow: 0 0 0 0 rgba(18, 201, 214, 0.45);
  animation: fp-pulse 2.4s ease-out infinite;
}

.fp-hero h1 {
  max-width: 100%;
  margin: 0;
  color: var(--fp-ink);
  font-size: clamp(2.8rem, 5.25vw, 5.4rem);
  font-weight: 500;
  letter-spacing: -0.07em;
  line-height: 0.98;
}

.fp-title-line {
  display: block;
  white-space: nowrap;
}

.fp-title-accent {
  color: var(--fp-mint);
}

.fp-lede {
  max-width: 34rem;
  margin: 2rem 0 0;
  color: var(--fp-muted);
  font-size: clamp(1rem, 1.25vw, 1.14rem);
  line-height: 1.75;
}

.fp-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2rem;
  margin-top: 2.1rem;
}

.fp-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.7rem 1.1rem;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1;
  transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease;
}

.fp-button--primary {
  color: #041416;
  background: var(--fp-accent);
}

.fp-text-link {
  color: var(--fp-ink);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: rgba(239, 250, 251, 0.35);
  text-underline-offset: 0.3em;
  transition: color 160ms ease, text-decoration-color 160ms ease;
}

.fp-proof {
  display: flex;
  gap: clamp(1.6rem, 4vw, 3.8rem);
  margin: 3rem 0 0;
}

.fp-proof div {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.3rem;
}

.fp-proof dt {
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.68rem;
}

.fp-proof dd {
  margin: 0;
  color: var(--fp-ink);
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1;
}

.fp-hero-visual {
  position: relative;
  min-height: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.fp-orbit {
  position: relative;
  width: min(100%, 510px);
  aspect-ratio: 1;
  margin: 0 auto;
  transform-style: preserve-3d;
}

.fp-orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid var(--fp-line);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.fp-orbit-ring--outer {
  width: 88%;
  height: 88%;
  border-style: dashed;
  opacity: 0.8;
}

.fp-orbit-ring--inner {
  width: 55%;
  height: 55%;
  border-color: rgba(18, 201, 214, 0.24);
}

.fp-orbit-axis {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    linear-gradient(90deg, transparent 49.8%, var(--fp-grid-line) 50%, transparent 50.2%),
    linear-gradient(transparent 49.8%, var(--fp-grid-line) 50%, transparent 50.2%);
  pointer-events: none;
}

.fp-orbit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 7.2rem;
  height: 7.2rem;
  place-items: center;
  gap: 0.2rem;
  border: 1px solid rgba(18, 201, 214, 0.36);
  border-radius: 50%;
  color: var(--fp-mint);
  background: var(--fp-glass-strong);
  box-shadow: 0 0 60px rgba(18, 201, 214, 0.12);
  transform: translate(-50%, -50%);
}

.fp-orbit-core .platform-glyph {
  width: 2rem;
  height: 2rem;
}

.fp-orbit-core span {
  color: var(--fp-ink);
  font-family: var(--fp-mono);
  font-size: 0.62rem;
}

.fp-orbit-node {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--fp-line);
  border-radius: 999px;
  color: var(--fp-ink);
  background: var(--fp-glass);
  box-shadow: 0 10px 30px var(--fp-glass-shadow);
  font-family: var(--fp-mono);
  font-size: 0.64rem;
  white-space: nowrap;
}

.fp-orbit-node .platform-glyph {
  width: 0.95rem;
  height: 0.95rem;
  color: var(--fp-mint);
}

.fp-node-android {
  top: 6%;
  left: 35%;
}

.fp-node-ios {
  top: 31%;
  right: -2%;
}

.fp-node-macos {
  bottom: 19%;
  right: 2%;
}

.fp-node-windows {
  bottom: 3%;
  left: 31%;
}

.fp-node-ohos {
  top: 38%;
  left: -3%;
}

.fp-signal-card {
  position: relative;
  width: min(100%, 19rem);
  margin: 1.1rem auto 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--fp-line);
  border-radius: 14px;
  background: var(--fp-glass);
  box-shadow: 0 18px 45px var(--fp-glass-shadow);
  backdrop-filter: blur(14px);
}

.fp-signal-head,
.fp-signal-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.fp-signal-head {
  margin-bottom: 0.7rem;
}

.fp-signal-kicker,
.fp-signal-version,
.fp-signal-card code {
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.64rem;
}

.fp-signal-live {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--fp-mint);
  font-family: var(--fp-mono);
  font-size: 0.62rem;
}

.fp-signal-live i,
.fp-signal-dot {
  display: inline-block;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: var(--fp-mint);
}

.fp-signal-row {
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--fp-line);
  color: var(--fp-ink);
  font-size: 0.8rem;
}

.fp-signal-row .fp-signal-dot {
  margin-right: -0.2rem;
}

.fp-signal-version {
  margin-left: auto;
}

.fp-signal-card code {
  display: block;
  margin-top: 0.7rem;
  color: var(--fp-cyan);
  font-size: 0.62rem;
}

.fp-scroll-cue {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: min(1180px, calc(100% - 48px));
  margin: 2.4rem auto 0;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.64rem;
}

.fp-scroll-cue span {
  width: 2.4rem;
  height: 1px;
  background: var(--fp-line);
}

.fp-section {
  position: relative;
  padding: clamp(5rem, 10vw, 8.5rem) 0;
  border-top: 1px solid var(--fp-line);
}

.fp-section-head {
  max-width: 48rem;
  margin-bottom: clamp(2.6rem, 5vw, 4.5rem);
}

.fp-section-head .fp-eyebrow {
  margin-bottom: 1.1rem;
}

.fp-section h2 {
  max-width: 15ch;
  margin: 0;
  color: var(--fp-ink);
  font-size: clamp(2.35rem, 4.4vw, 4.25rem);
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 1.02;
}

.fp-section-head > p:last-child {
  max-width: 37rem;
  margin: 1.5rem 0 0;
  color: var(--fp-muted);
  font-size: 1rem;
  line-height: 1.75;
}

.fp-platform-layout {
  display: grid;
  grid-template-columns: minmax(190px, 0.33fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: start;
}

.fp-platform-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.fp-platform-tab {
  display: grid;
  grid-template-columns: 1.8rem minmax(0, 1fr) 1rem;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  min-height: 64px;
  padding: 0.7rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 11px;
  color: var(--fp-muted);
  background: transparent;
  font-family: var(--fp-display);
  text-align: left;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
}

.fp-platform-tab strong,
.fp-platform-tab small {
  display: block;
}

.fp-platform-tab strong {
  color: var(--fp-ink);
  font-size: 0.9rem;
  font-weight: 500;
}

.fp-platform-tab small {
  overflow: hidden;
  margin-top: 0.2rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fp-platform-icon {
  display: grid;
  width: 1.8rem;
  height: 1.8rem;
  place-items: center;
  border: 1px solid var(--fp-line);
  border-radius: 7px;
  color: var(--fp-mint);
}

.fp-platform-icon .platform-glyph {
  width: 1rem;
  height: 1rem;
}

.fp-platform-check {
  color: var(--fp-muted);
  font-size: 0.8rem;
  opacity: 0;
  transform: translate(-3px, 3px);
  transition: opacity 160ms ease, transform 160ms ease;
}

.fp-platform-tab.is-active {
  border-color: var(--fp-line);
  background: var(--fp-surface);
}

.fp-platform-tab.is-active .fp-platform-check {
  color: var(--fp-mint);
  opacity: 1;
  transform: translate(0, 0);
}

.fp-platform-stage {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}

.fp-device {
  --fp-ink: #effafb;
  --fp-muted: #9bb4b7;
  --fp-line: rgba(214, 244, 246, 0.14);
  --fp-cyan: #6fe4eb;
  --fp-mint: #12c9d6;
  --fp-accent: #12c9d6;
  position: relative;
  width: min(100%, 310px);
  aspect-ratio: 0.62;
  margin: 0 auto;
  padding: 0.55rem;
  border: 1px solid rgba(239, 250, 251, 0.22);
  border-radius: 32px;
  background: #081416;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(0, 0, 0, 0.4);
}

.fp-device--desktop {
  width: 100%;
  aspect-ratio: 1.42;
  padding: 0.55rem;
  border-radius: 16px;
}

.fp-device-notch {
  position: absolute;
  top: 0.7rem;
  left: 50%;
  z-index: 2;
  width: 4.2rem;
  height: 0.55rem;
  border-radius: 0 0 0.6rem 0.6rem;
  background: #081416;
  transform: translateX(-50%);
}

.fp-device-bar {
  display: flex;
  align-items: center;
  gap: 0.28rem;
  height: 1.5rem;
  padding: 0 0.55rem;
}

.fp-device-bar > span:not(.fp-device-bar-title) {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: rgba(239, 250, 251, 0.28);
}

.fp-device-bar-title {
  margin-left: 0.5rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.58rem;
}

.fp-device-screen {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 26px;
  background: #0e2023;
}

.fp-device--desktop .fp-device-screen {
  height: calc(100% - 1.5rem);
  border-radius: 10px;
}

.fp-device--phone .fp-device-screen {
  height: calc(100% - 0.2rem);
}

.fp-screen-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.8rem 0;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.55rem;
}

.fp-screen-video {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  margin: 0.7rem 0.7rem 0;
  overflow: hidden;
  border-radius: 9px;
  background:
    radial-gradient(circle at 70% 30%, rgba(255, 211, 138, 0.24), transparent 28%),
    linear-gradient(135deg, #16434a, #12262b 46%, #2b2130);
}

.fp-screen-video::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  content: '';
  transform: translateX(-100%);
  animation: fp-scan 4s ease-in-out infinite;
}

.fp-screen-orbit {
  position: absolute;
  width: 42%;
  aspect-ratio: 1;
  border: 1px solid rgba(239, 250, 251, 0.18);
  border-radius: 50%;
  transform: rotate(32deg) scaleY(0.42);
}

.fp-play {
  position: relative;
  z-index: 1;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid rgba(239, 250, 251, 0.36);
  border-radius: 50%;
  color: var(--fp-ink);
  background: rgba(6, 16, 18, 0.45);
}

.fp-screen-caption {
  position: absolute;
  right: 0.55rem;
  bottom: 0.45rem;
  color: rgba(239, 250, 251, 0.62);
  font-family: var(--fp-mono);
  font-size: 0.46rem;
}

.fp-screen-progress {
  height: 0.18rem;
  margin: 0.6rem 0.8rem 0;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(239, 250, 251, 0.12);
}

.fp-screen-progress span {
  display: block;
  width: 42%;
  height: 100%;
  border-radius: inherit;
  background: var(--fp-mint);
}

.fp-screen-tracks {
  margin: 0.8rem 0.7rem;
  padding: 0.65rem;
  border: 1px solid rgba(239, 250, 251, 0.08);
  border-radius: 8px;
  background: rgba(6, 16, 18, 0.28);
}

.fp-screen-tracks-head,
.fp-screen-track {
  display: flex;
  align-items: center;
  gap: 0.42rem;
}

.fp-screen-tracks-head {
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.48rem;
}

.fp-screen-track {
  min-height: 1.6rem;
  color: var(--fp-ink);
  font-size: 0.56rem;
}

.fp-screen-track > i {
  width: 0.34rem;
  height: 0.34rem;
  border: 1px solid rgba(239, 250, 251, 0.35);
  border-radius: 50%;
}

.fp-screen-track > small {
  margin-left: auto;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.45rem;
}

.fp-screen-track > b {
  display: none;
  color: var(--fp-mint);
  font-family: var(--fp-mono);
  font-size: 0.43rem;
  font-weight: 400;
}

.fp-screen-track.is-selected > i {
  border-color: var(--fp-mint);
  background: var(--fp-accent);
  box-shadow: 0 0 0 3px rgba(18, 201, 214, 0.12);
}

.fp-screen-track.is-selected > b {
  display: inline;
}

.fp-device-home {
  position: absolute;
  bottom: 0.65rem;
  left: 50%;
  width: 2.8rem;
  height: 0.18rem;
  border-radius: 999px;
  background: rgba(239, 250, 251, 0.35);
  transform: translateX(-50%);
}

.fp-platform-copy .fp-eyebrow {
  margin-bottom: 0.9rem;
}

.fp-platform-copy h3 {
  max-width: 14ch;
  margin: 0;
  color: var(--fp-ink);
  font-size: clamp(1.65rem, 2.7vw, 2.6rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.07;
}

.fp-platform-copy > p:not(.fp-eyebrow) {
  max-width: 26rem;
  margin: 1rem 0 0;
  color: var(--fp-muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.fp-platform-copy ul {
  display: grid;
  gap: 0.55rem;
  margin: 1.4rem 0 1.5rem;
  padding: 0;
  list-style: none;
}

.fp-platform-copy li {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  color: var(--fp-ink);
  font-size: 0.82rem;
}

.fp-platform-copy li::before {
  width: 0.32rem;
  height: 0.32rem;
  flex: none;
  border-radius: 50%;
  background: var(--fp-mint);
  content: '';
}

.fp-feature-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.9rem;
}

.fp-feature {
  display: flex;
  grid-column: span 4;
  flex-direction: column;
  min-height: 0;
  padding: 1.35rem;
  border: 1px solid var(--fp-line);
  border-radius: 18px;
  background: var(--fp-surface);
}

.fp-feature--wide {
  grid-column: span 8;
  min-height: 300px;
  background:
    radial-gradient(circle at 88% 16%, rgba(18, 201, 214, 0.09), transparent 34%),
    var(--fp-surface);
}

.fp-feature:nth-child(3) {
  grid-column: span 7;
}

.fp-feature:nth-child(4) {
  grid-column: span 5;
}

.fp-feature-heading {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.fp-feature-mark {
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  flex: none;
  place-items: center;
  border: 1px solid var(--fp-line);
  border-radius: 8px;
  color: var(--fp-mint);
}

.fp-feature-label {
  margin: 0 0 0.35rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.6rem;
}

.fp-feature h3 {
  margin: 0;
  color: var(--fp-ink);
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.fp-feature > p {
  max-width: 36rem;
  margin: 1rem 0 0;
  color: var(--fp-muted);
  font-size: 0.84rem;
  line-height: 1.72;
}

.fp-feature code {
  color: var(--fp-cyan);
  font-family: var(--fp-mono);
  font-size: 0.78em;
}

.fp-pipeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 1.6rem;
  color: var(--fp-ink);
  font-family: var(--fp-mono);
  font-size: 0.62rem;
}

.fp-pipeline span {
  padding: 0.42rem 0.5rem;
  border: 1px solid var(--fp-line);
  border-radius: 5px;
  background: rgba(6, 16, 18, 0.28);
}

.fp-pipeline i {
  width: 0.9rem;
  height: 1px;
  background: var(--fp-line);
}

.fp-track-preview {
  display: grid;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 1.3rem;
}

.fp-track-preview div {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid var(--fp-line);
  border-radius: 6px;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.58rem;
}

.fp-track-preview div:first-child {
  color: var(--fp-ink);
  background: rgba(18, 201, 214, 0.06);
}

.fp-track-preview i {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: var(--fp-muted);
}

.fp-track-preview div:first-child i {
  background: var(--fp-mint);
}

.fp-track-preview b {
  margin-left: auto;
  color: var(--fp-mint);
  font-size: 0.52rem;
  font-weight: 400;
}

.fp-code-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: center;
}

.fp-code-copy h2 {
  max-width: 12ch;
}

.fp-code-copy > p:not(.fp-eyebrow) {
  max-width: 32rem;
  margin: 1.5rem 0 0;
  color: var(--fp-muted);
  font-size: 0.98rem;
  line-height: 1.75;
}

.fp-steps {
  display: grid;
  gap: 1.1rem;
  margin: 2.2rem 0 0;
  padding: 0;
  list-style: none;
}

.fp-steps li {
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr);
  gap: 0.8rem;
}

.fp-steps li > span {
  color: var(--fp-mint);
  font-family: var(--fp-mono);
  font-size: 0.7rem;
}

.fp-steps strong {
  color: var(--fp-ink);
  font-size: 0.88rem;
  font-weight: 500;
}

.fp-steps p {
  margin: 0.25rem 0 0;
  color: var(--fp-muted);
  font-size: 0.8rem;
  line-height: 1.6;
}

.fp-code-panel {
  --fp-ink: #effafb;
  --fp-muted: #9bb4b7;
  --fp-line: rgba(214, 244, 246, 0.14);
  --fp-cyan: #6fe4eb;
  --fp-mint: #12c9d6;
  --fp-accent: #12c9d6;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--fp-line);
  border-radius: 16px;
  background: #081416;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}

.fp-code-bar,
.fp-code-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.6rem;
}

.fp-code-bar {
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid var(--fp-line);
}

.fp-code-bar > span:first-child {
  display: flex;
  gap: 0.3rem;
}

.fp-code-bar i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: rgba(239, 250, 251, 0.2);
}

.fp-code-bar > span:last-child {
  color: var(--fp-cyan);
}

.fp-code-panel pre {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
  color: #d9f0f1;
  font-family: var(--fp-mono);
  font-size: clamp(0.7rem, 1vw, 0.82rem);
  line-height: 1.9;
}

.fp-code-panel code {
  font-family: inherit;
}

.fp-code-comment {
  color: #66878c;
}

.fp-code-keyword {
  color: var(--fp-mint);
}

.fp-code-foot {
  padding: 0.75rem 0.9rem;
  border-top: 1px solid var(--fp-line);
}

.fp-cta {
  padding: clamp(5rem, 10vw, 9rem) 0;
  border-top: 1px solid var(--fp-line);
}

.fp-cta-inner {
  position: relative;
  overflow: hidden;
  padding: clamp(2rem, 5vw, 4.5rem);
  border: 1px solid var(--fp-cta-border);
  border-radius: 22px;
  background:
    radial-gradient(circle at 82% 18%, rgba(18, 201, 214, 0.13), transparent 30%),
    var(--fp-cta-bg);
}

.fp-cta h2 {
  max-width: 18ch;
}

.fp-cta-inner > p:not(.fp-eyebrow) {
  max-width: 35rem;
  margin: 1.3rem 0 1.8rem;
  color: var(--fp-muted);
  font-size: 0.98rem;
  line-height: 1.7;
}

.fp-cta-platforms {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
  max-width: 24rem;
  margin-top: 2rem;
}

.fp-cta-platforms span {
  display: flex;
  min-height: 2.15rem;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--fp-line);
  border-radius: 6px;
  color: var(--fp-muted);
  font-family: var(--fp-mono);
  font-size: 0.58rem;
}

.fp-cta-platforms .platform-glyph {
  width: 0.85rem;
  height: 0.85rem;
  color: var(--fp-mint);
}

.fp-cta-platforms span:last-child {
  grid-column: span 2;
}

@media (min-width: 1101px) {
  .fp-cta-platforms {
    position: absolute;
    top: 50%;
    right: clamp(2rem, 5vw, 4.5rem);
    width: 21rem;
    margin-top: 0;
    transform: translateY(-50%);
  }
}

.fp-home :focus-visible {
  outline: 2px solid var(--fp-accent);
  outline-offset: 4px;
}

.fp-home .platform-glyph {
  display: block;
}

@keyframes fp-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(18, 201, 214, 0.4); }
  50% { box-shadow: 0 0 0 0.42rem rgba(18, 201, 214, 0); }
}

@keyframes fp-scan {
  0%, 35% { transform: translateX(-120%); }
  65%, 100% { transform: translateX(120%); }
}

@media (hover: hover) and (pointer: fine) {
  .fp-button:hover {
    transform: translateY(-2px);
  }

  .fp-button--primary:hover {
    background: #3adde6;
  }

  .fp-text-link:hover {
    color: var(--fp-mint);
    text-decoration-color: var(--fp-mint);
  }

  .fp-platform-tab:hover {
    border-color: var(--fp-line);
    background: var(--fp-hover-surface);
  }
}

@media (max-width: 1024px) {
  .fp-hero-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .fp-hero-visual {
    min-height: 470px;
  }

  .fp-orbit {
    width: min(100%, 430px);
  }

  .fp-platform-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.8rem;
  }

  .fp-platform-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.45rem;
  }

  .fp-platform-tab {
    min-height: 58px;
  }

  .fp-platform-stage {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  }
}

@media (max-width: 980px) {
  .fp-feature,
  .fp-feature--wide,
  .fp-feature:nth-child(3),
  .fp-feature:nth-child(4) {
    grid-column: 1 / -1;
  }

  .fp-code-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 720px) {
  .fp-shell,
  .fp-scroll-cue {
    width: min(100% - 32px, 1180px);
  }

  .fp-hero {
    min-height: auto;
    padding-top: 7rem;
  }

  .fp-hero h1 {
    font-size: clamp(2.3rem, 10.5vw, 3.1rem);
  }

  .fp-hero-visual {
    min-height: 0;
    margin-top: 1.5rem;
  }

  .fp-orbit {
    width: min(100%, 350px);
  }

  .fp-orbit-node {
    padding: 0.42rem 0.5rem;
    font-size: 0.55rem;
  }

  .fp-orbit-node .platform-glyph {
    width: 0.8rem;
    height: 0.8rem;
  }

  .fp-node-ios {
    right: -1%;
  }

  .fp-node-ohos {
    left: -1%;
  }

  .fp-signal-card {
    width: min(100%, 19rem);
    margin-top: 1.1rem;
  }

  .fp-proof {
    gap: 1.6rem;
  }

  .fp-platform-tabs {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.3rem;
    scrollbar-width: thin;
  }

  .fp-platform-tab {
    min-width: 11rem;
    flex: 0 0 auto;
  }

  .fp-platform-stage {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .fp-device {
    width: min(100%, 290px);
  }

  .fp-device--desktop {
    width: 100%;
  }

  .fp-feature,
  .fp-feature--wide {
    grid-column: 1 / -1;
    min-height: 0;
  }

  .fp-feature:nth-child(3),
  .fp-feature:nth-child(4) {
    grid-column: 1 / -1;
  }

  .fp-code-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .fp-code-panel pre {
    padding: 1.1rem;
  }

  .fp-code-foot {
    align-items: flex-start;
    flex-direction: column;
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
