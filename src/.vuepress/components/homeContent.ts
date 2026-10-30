export type PlatformId = 'android' | 'ios' | 'macos' | 'windows' | 'ohos';
export type PlatformIcon = 'android' | 'apple' | 'windows' | 'ohos';
export type DeviceKind = 'phone' | 'desktop';

export interface Platform {
  id: PlatformId;
  name: string;
  detail: string;
  icon: PlatformIcon;
  kind: DeviceKind;
  color: string;
  headline: string;
  blurb: string;
  facts: string[];
  track: string;
  codec: string;
}

export const platformSets: Record<'zh' | 'en', Platform[]> = {
  zh: [
    {
      id: 'android',
      name: 'Android',
      detail: 'API 28+ · arm64',
      icon: 'android',
      kind: 'phone',
      color: '#1E7FFF',
      headline: '原生解码，纹理输出。',
      blurb: '同一个 FPlayer 调用落到 fplayercore 和 SurfaceTexture，Widget 树只负责状态。',
      facts: ['NDK 29 / 16 KB 对齐', 'SurfaceTexture 输出', '音轨切换'],
      track: '英语 · AAC',
      codec: '48 kHz · 立体声',
    },
    {
      id: 'ios',
      name: 'iOS',
      detail: 'iOS 13+ · arm64',
      icon: 'apple',
      kind: 'phone',
      color: '#2CC26E',
      headline: '一套 API，原生实现。',
      blurb: 'Swift Package Manager 拉取官方 xcframework，FPlayer 保持与 Android 相同的 Dart 接口。',
      facts: ['设备 / arm64 模拟器', 'VideoToolbox 解码', 'SwiftPM binaryTarget'],
      track: '日语 · AAC',
      codec: '48 kHz · 立体声',
    },
    {
      id: 'macos',
      name: 'macOS',
      detail: 'macOS 10.15+ · arm64',
      icon: 'apple',
      kind: 'desktop',
      color: '#F5C842',
      headline: '桌面窗口，也是舞台。',
      blurb: '窗口缩放、Metal 输出和全屏都复用 FPlayer 状态机与音轨 API。',
      facts: ['Metal / CoreVideo', '窗口 + 全屏', '同一套音轨 API'],
      track: '英语 · AAC',
      codec: '48 kHz · 立体声',
    },
    {
      id: 'windows',
      name: 'Windows',
      detail: 'Windows x64',
      icon: 'windows',
      kind: 'desktop',
      color: '#FF4545',
      headline: '原生 DLL，一次 Dart 调用。',
      blurb: 'fplayercore 通过 CMake 链接；播放、seek 和轨道选择都留在共享 API 中。',
      facts: ['CMake + fplayercore.dll', '纹理帧交接', '与 Dart API 对齐'],
      track: '英语 · AAC',
      codec: '48 kHz · 立体声',
    },
    {
      id: 'ohos',
      name: 'OpenHarmony',
      detail: 'API 12+ · arm64',
      icon: 'ohos',
      kind: 'phone',
      color: '#2ECAAD',
      headline: '新平台，不是新播放器。',
      blurb: 'NAPI 和 ArkTS 暴露 fplayercore；Dart 代码仍然只需要一个 FPlayer 对象。',
      facts: ['NAPI / ArkTS 桥接', 'OHOS HAR 分发', '音轨选择'],
      track: '中文 · AAC',
      codec: '48 kHz · 立体声',
    },
  ],
  en: [
    {
      id: 'android',
      name: 'Android',
      detail: 'API 28+ · arm64',
      icon: 'android',
      kind: 'phone',
      color: '#1E7FFF',
      headline: 'Native decode. Texture output.',
      blurb: 'The same FPlayer call lands on fplayercore and a SurfaceTexture. Your widget tree only sees state.',
      facts: ['NDK 29 / 16 KB alignment', 'SurfaceTexture output', 'Audio track switching'],
      track: 'English · AAC',
      codec: '48 kHz · stereo',
    },
    {
      id: 'ios',
      name: 'iOS',
      detail: 'iOS 13+ · arm64',
      icon: 'apple',
      kind: 'phone',
      color: '#2CC26E',
      headline: 'One API, on native rails.',
      blurb: 'Swift Package Manager pulls the official xcframework. FPlayer keeps the same Dart surface as Android.',
      facts: ['Device / arm64 simulator', 'VideoToolbox decode', 'SwiftPM binaryTarget'],
      track: 'Japanese · AAC',
      codec: '48 kHz · stereo',
    },
    {
      id: 'macos',
      name: 'macOS',
      detail: 'macOS 10.15+ · arm64',
      icon: 'apple',
      kind: 'desktop',
      color: '#F5C842',
      headline: 'A desktop window is still a stage.',
      blurb: 'Window resizing, Metal output and fullscreen all reuse the FPlayer state machine and audio API.',
      facts: ['Metal / CoreVideo', 'Window + fullscreen', 'Same audio track API'],
      track: 'English · AAC',
      codec: '48 kHz · stereo',
    },
    {
      id: 'windows',
      name: 'Windows',
      detail: 'Windows x64',
      icon: 'windows',
      kind: 'desktop',
      color: '#FF4545',
      headline: 'A native DLL. One Dart call.',
      blurb: 'fplayercore is linked through CMake; playback, seek and track selection stay in the shared API.',
      facts: ['CMake + fplayercore.dll', 'Texture frame handoff', 'Aligned with Dart API'],
      track: 'English · AAC',
      codec: '48 kHz · stereo',
    },
    {
      id: 'ohos',
      name: 'OpenHarmony',
      detail: 'API 12+ · arm64',
      icon: 'ohos',
      kind: 'phone',
      color: '#2ECAAD',
      headline: 'A new platform. Not a new player.',
      blurb: 'NAPI and ArkTS expose fplayercore; FPlayer remains the only player object your Dart code needs.',
      facts: ['NAPI / ArkTS bridge', 'OHOS HAR distribution', 'Audio track selection'],
      track: 'Chinese · AAC',
      codec: '48 kHz · stereo',
    },
  ],
};

export interface HomeCopy {
  eyebrow: string;
  version: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSub: string;
  start: string;
  api: string;
  platformsAria: string;
  heroFoot: string;
  scroll: string;
  platformEyebrow: string;
  platformTitleA: string;
  platformTitleB: string;
  platformSub: string;
  nativeBridge: string;
  hardwareToggleAria: string;
  hardwareOnTitle: string;
  hardwareOffTitle: string;
  hardwareOnBody: string;
  hardwareOffBody: string;
  selectPlatform: string;
  callChain: string;
  audioTracks: string;
  commentary: string;
  native: string;
  software: string;
  exampleLabel: string;
  hardwarePath: string;
  fallback: string;
  bentoEyebrow: string;
  bentoTitleA: string;
  bentoTitleB: string;
  bentoSub: string;
  oneObject: string;
  oneObjectTitleA: string;
  oneObjectTitleB: string;
  oneObjectBody: string;
  audioEyebrow: string;
  audioTitle: string;
  audioOn: string;
  audioBody: string;
  surfaceEyebrow: string;
  surfaceTitle: string;
  surfaceBody: string;
  distributionEyebrow: string;
  distributionTitle: string;
  distributionBody: string;
  codeEyebrow: string;
  codeTitleA: string;
  codeTitleEm: string;
  codeSub: string;
  step1: string;
  step2: string;
  step3: string;
  openApi: string;
  ctaEyebrow: string;
  ctaTitleA: string;
  ctaTitleEm: string;
  ctaSub: string;
  ctaStart: string;
  ctaApi: string;
}

export const copies: Record<'zh' | 'en', HomeCopy> = {
  zh: {
    eyebrow: '跨平台媒体引擎',
    version: '· fplayercore 1.2.12',
    heroTitleA: '一次播放。',
    heroTitleB: '处处运行。',
    heroSub:
      '一套 Dart API，连接 Android、iOS、macOS、Windows 和 OpenHarmony 的原生 fplayercore 内核。跨端复用接口，不牺牲平台体验。',
    start: '开始构建',
    api: '查看 API',
    platformsAria: '支持的平台',
    heroFoot: 'fplayer / 五个目标平台',
    scroll: '向下滚动探索 ↓',
    platformEyebrow: '一个运行时 · 五个目标',
    platformTitleA: '一个播放器对象。',
    platformTitleB: '五个原生表面。',
    platformSub: '选择一个平台。同一套 FPlayer 状态、纹理和音轨调用，落到该平台的原生层。',
    nativeBridge: '原生桥接',
    hardwareToggleAria: '切换硬件解码状态',
    hardwareOnTitle: '硬件解码已开启。',
    hardwareOffTitle: '硬件解码已关闭。',
    hardwareOnBody: '原生 fplayercore 链路已启用，这是 FPlayer 在所有支持平台上默认使用的状态。',
    hardwareOffBody: '当前预览展示纯软件回退路径。重新开启即可看到原生桥接接管。',
    selectPlatform: '选择平台',
    callChain: '调用链',
    audioTracks: '音轨',
    commentary: '评论音轨',
    native: '原生',
    software: '软件',
    exampleLabel: 'fplayer 示例 · 1080p',
    hardwarePath: '硬件链路',
    fallback: '回退路径',
    bentoEyebrow: '保持不变的能力',
    bentoTitleA: 'API 保持统一。',
    bentoTitleB: '细节各自精彩。',
    bentoSub: '平台团队维护各自的表面和分发包，产品团队只需要一套播放器模型。',
    oneObject: '一个对象',
    oneObjectTitleA: '同一个 FPlayer。',
    oneObjectTitleB: '五个原生内核。',
    oneObjectBody: '创建一次，就能从手机窗口迁移到桌面窗口，而不用重写播放状态机。',
    audioEyebrow: '音轨',
    audioTitle: '切换语言，不用重建。',
    audioOn: '开启',
    audioBody: '读取语言、编码和采样率，按流索引选择音轨。',
    surfaceEyebrow: '自适应表面',
    surfaceTitle: '一帧画面，适配每块屏幕。',
    surfaceBody: '旋转、缩放和全屏由 FView 与原生纹理共同处理。',
    distributionEyebrow: '分发',
    distributionTitle: '每个平台都有自己的官方包。',
    distributionBody:
      'Maven Central AAR、SwiftPM binaryTarget、Windows DLL 和 OpenHarmony HAR 都来自同一个 ijkplayer 发布版本。',
    codeEyebrow: '从第一帧到第一次切换',
    codeTitleA: '一套 API。',
    codeTitleEm: '无需分叉。',
    codeSub: '初始化、准备、读取轨道、选择轨道。平台细节不会泄漏到 Dart 调用点。',
    step1: '创建播放器并设置媒体源。',
    step2: '准备一次，读取媒体元数据。',
    step3: '按流索引选择任意音轨。',
    openApi: '打开完整 API →',
    ctaEyebrow: '为每一块屏幕而构建',
    ctaTitleA: '发布到',
    ctaTitleEm: '每一个平台。',
    ctaSub: '从一个 Flutter 应用开始，需要时再添加平台。FPlayer 与 fplayercore 始终保持契约。',
    ctaStart: '进入快速上手',
    ctaApi: '查看播放器 API',
  },
  en: {
    eyebrow: 'Cross-platform media engine',
    version: '· fplayercore 1.2.12',
    heroTitleA: 'Play once.',
    heroTitleB: 'Everywhere.',
    heroSub:
      'One Dart API for the native fplayercore kernels on Android, iOS, macOS, Windows and OpenHarmony. Reuse the interface across platforms without giving up the platform experience.',
    start: 'Start building',
    api: 'Explore the API',
    platformsAria: 'Supported platforms',
    heroFoot: 'fplayer / five targets',
    scroll: 'scroll to explore ↓',
    platformEyebrow: 'One runtime · five targets',
    platformTitleA: 'A single player object.',
    platformTitleB: 'Five native surfaces.',
    platformSub: "Pick a target. The same FPlayer state, texture and audio-track calls land on that platform's native layer.",
    nativeBridge: 'native bridge',
    hardwareToggleAria: 'Toggle hardware decoding',
    hardwareOnTitle: 'Hardware decode is on.',
    hardwareOffTitle: 'Hardware decode is off.',
    hardwareOnBody: 'The native fplayercore path is active. This is the state FPlayer ships with on every supported platform.',
    hardwareOffBody: 'The preview shows a software-only fallback. Switch it back to see the native bridge take over.',
    selectPlatform: 'Select platform',
    callChain: 'Call chain',
    audioTracks: 'Audio tracks',
    commentary: 'Commentary',
    native: 'native',
    software: 'software',
    exampleLabel: 'fplayer example · 1080p',
    hardwarePath: 'hardware path',
    fallback: 'fallback',
    bentoEyebrow: 'What stays constant',
    bentoTitleA: 'The API is shared.',
    bentoTitleB: 'The details are not.',
    bentoSub: 'Platform teams get their own surfaces and packages. Product teams get one player model.',
    oneObject: 'One object',
    oneObjectTitleA: 'Same FPlayer.',
    oneObjectTitleB: 'Five native cores.',
    oneObjectBody: 'Create once, then move from a phone to a desktop window without rewriting the playback state machine.',
    audioEyebrow: 'Audio tracks',
    audioTitle: 'Language is a switch, not a rebuild.',
    audioOn: 'on',
    audioBody: 'Read language, codec and sample rate. Select a stream by index.',
    surfaceEyebrow: 'Adaptive surface',
    surfaceTitle: 'One frame, every screen.',
    surfaceBody: 'Rotation, resize and fullscreen are handled by FView and the native texture.',
    distributionEyebrow: 'Distribution',
    distributionTitle: 'Each platform gets its own official package.',
    distributionBody:
      'Maven Central AAR, SwiftPM binaryTarget, Windows DLL and OpenHarmony HAR all come from the same ijkplayer release.',
    codeEyebrow: 'From first frame to first switch',
    codeTitleA: 'One API.',
    codeTitleEm: 'No forks.',
    codeSub: 'Initialize, prepare, inspect tracks, choose one. The platform never leaks into the Dart call site.',
    step1: 'Create the player and set a source.',
    step2: 'Prepare once and read the media metadata.',
    step3: 'Select any audio track by stream index.',
    openApi: 'Open the full API →',
    ctaEyebrow: 'Build for every screen',
    ctaTitleA: 'Ship it',
    ctaTitleEm: 'everywhere.',
    ctaSub: 'Start with one Flutter app. Add a platform when you need it. FPlayer and fplayercore keep the contract.',
    ctaStart: 'Start the quick guide',
    ctaApi: 'Explore the player API',
  },
};
