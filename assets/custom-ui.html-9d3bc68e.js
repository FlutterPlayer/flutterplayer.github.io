import{a2 as n,P as s,Q as a,_ as t}from"./framework-8fdfdeae.js";const e={},p=t(`<p><code>FView</code> 的 <code>panelBuilder</code> 用来决定视频区域上层的控件。使用 <code>fplayer</code> 核心包时默认是最小面板；需要完整播放器 UI 时可以先参考<a href="/skin/immanent">内置 UI</a>，或者完全自己实现。</p><h2 id="fview-参数" tabindex="-1"><a class="header-anchor" href="#fview-参数" aria-hidden="true">#</a> FView 参数</h2><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token keyword">typedef</span> <span class="token class-name">FPanelWidgetBuilder</span> <span class="token operator">=</span> <span class="token class-name">Widget</span> <span class="token class-name">Function</span><span class="token punctuation">(</span>
  <span class="token class-name">FPlayer</span> player<span class="token punctuation">,</span>
  <span class="token class-name">FData</span> data<span class="token punctuation">,</span>
  <span class="token class-name">BuildContext</span> context<span class="token punctuation">,</span>
  <span class="token class-name">Size</span> viewSize<span class="token punctuation">,</span>
  <span class="token class-name">Rect</span> texturePos<span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token class-name">FView</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token class-name">Key</span><span class="token operator">?</span> key<span class="token punctuation">,</span>
  required <span class="token class-name">FPlayer</span> player<span class="token punctuation">,</span>
  double<span class="token operator">?</span> width<span class="token punctuation">,</span>
  double<span class="token operator">?</span> height<span class="token punctuation">,</span>
  <span class="token class-name">FFit</span> fit <span class="token operator">=</span> <span class="token class-name">FFit</span><span class="token punctuation">.</span>contain<span class="token punctuation">,</span>
  <span class="token class-name">FFit</span> fsFit <span class="token operator">=</span> <span class="token class-name">FFit</span><span class="token punctuation">.</span>contain<span class="token punctuation">,</span>
  <span class="token class-name">FPanelWidgetBuilder</span> panelBuilder <span class="token operator">=</span> minimalFPanelBuilder<span class="token punctuation">,</span>
  <span class="token class-name">Color</span> color <span class="token operator">=</span> <span class="token keyword">const</span> <span class="token class-name">Color</span><span class="token punctuation">(</span><span class="token number">0xFF607D8B</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token class-name">ImageProvider</span><span class="token operator">?</span> cover<span class="token punctuation">,</span>
  bool fs <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token keyword">void</span> <span class="token class-name">Function</span><span class="token punctuation">(</span><span class="token class-name">FData</span><span class="token punctuation">)</span><span class="token operator">?</span> onDispose<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>player</code>：当前 <code>FPlayer</code>，面板监听它的 <code>FValue</code> 变化。</li><li><code>data</code>：全屏和非全屏面板共享的数据容器；面板销毁后数据仍可保留。</li><li><code>viewSize</code>：<code>FView</code> 的实际显示尺寸。</li><li><code>texturePos</code>：视频纹理在 <code>FView</code> 中的位置，可能超出 <code>FView</code> 边界。</li><li><code>onDispose</code>：<code>FView</code> 销毁时恢复系统设置或清理面板状态。</li></ul><p><code>FFit.contain</code>、<code>FFit.fill</code>、<code>FFit.cover</code> 分别控制视频在目标区域内的填充方式；全屏使用 <code>fsFit</code>，普通模式使用 <code>fit</code>。</p><h2 id="自定义面板示例" tabindex="-1"><a class="header-anchor" href="#自定义面板示例" aria-hidden="true">#</a> 自定义面板示例</h2><p>下面的面板只在视频左下角显示一个播放/暂停按钮：</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token keyword">import</span> <span class="token string-literal"><span class="token string">&#39;dart:math&#39;</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string-literal"><span class="token string">&#39;package:fplayer/fplayer.dart&#39;</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string-literal"><span class="token string">&#39;package:flutter/material.dart&#39;</span></span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">CustomPanel</span> <span class="token keyword">extends</span> <span class="token class-name">StatefulWidget</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token class-name">CustomPanel</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span>key<span class="token punctuation">,</span>
    required <span class="token keyword">this</span><span class="token punctuation">.</span>player<span class="token punctuation">,</span>
    required <span class="token keyword">this</span><span class="token punctuation">.</span>viewSize<span class="token punctuation">,</span>
    required <span class="token keyword">this</span><span class="token punctuation">.</span>texturePos<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">final</span> <span class="token class-name">FPlayer</span> player<span class="token punctuation">;</span>
  <span class="token keyword">final</span> <span class="token class-name">Size</span> viewSize<span class="token punctuation">;</span>
  <span class="token keyword">final</span> <span class="token class-name">Rect</span> texturePos<span class="token punctuation">;</span>

  <span class="token metadata function">@override</span>
  <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomPanel</span><span class="token punctuation">&gt;</span></span> <span class="token function">createState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">&gt;</span> <span class="token function">_CustomPanelState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> _CustomPanelState <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomPanel</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>
  bool _playing <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

  <span class="token metadata function">@override</span>
  <span class="token keyword">void</span> <span class="token function">initState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">initState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">addListener</span><span class="token punctuation">(</span>_playerValueChanged<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">void</span> <span class="token function">_playerValueChanged</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">final</span> playing <span class="token operator">=</span> widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span>state <span class="token operator">==</span> <span class="token class-name">FState</span><span class="token punctuation">.</span>started<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>playing <span class="token operator">!=</span> _playing<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">&gt;</span> _playing <span class="token operator">=</span> playing<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token metadata function">@override</span>
  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">final</span> rect <span class="token operator">=</span> <span class="token class-name">Rect</span><span class="token punctuation">.</span><span class="token function">fromLTRB</span><span class="token punctuation">(</span>
      <span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0.0</span><span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0.0</span><span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>top<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">min</span><span class="token punctuation">(</span>widget<span class="token punctuation">.</span>viewSize<span class="token punctuation">.</span>width<span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">min</span><span class="token punctuation">(</span>widget<span class="token punctuation">.</span>viewSize<span class="token punctuation">.</span>height<span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>bottom<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token class-name">Positioned</span><span class="token punctuation">.</span><span class="token function">fromRect</span><span class="token punctuation">(</span>
      rect<span class="token punctuation">:</span> rect<span class="token punctuation">,</span>
      child<span class="token punctuation">:</span> <span class="token class-name">Align</span><span class="token punctuation">(</span>
        alignment<span class="token punctuation">:</span> <span class="token class-name">Alignment</span><span class="token punctuation">.</span>bottomLeft<span class="token punctuation">,</span>
        child<span class="token punctuation">:</span> <span class="token class-name">IconButton</span><span class="token punctuation">(</span>
          color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>white<span class="token punctuation">,</span>
          icon<span class="token punctuation">:</span> <span class="token class-name">Icon</span><span class="token punctuation">(</span>_playing <span class="token operator">?</span> <span class="token class-name">Icons</span><span class="token punctuation">.</span>pause <span class="token punctuation">:</span> <span class="token class-name">Icons</span><span class="token punctuation">.</span>play_arrow<span class="token punctuation">)</span><span class="token punctuation">,</span>
          onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            _playing <span class="token operator">?</span> widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">pause</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">:</span> widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token metadata function">@override</span>
  <span class="token keyword">void</span> <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">removeListener</span><span class="token punctuation">(</span>_playerValueChanged<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>传给 <code>FView</code>：</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token class-name">FView</span><span class="token punctuation">(</span>
  player<span class="token punctuation">:</span> player<span class="token punctuation">,</span>
  panelBuilder<span class="token punctuation">:</span> <span class="token punctuation">(</span>
    <span class="token class-name">FPlayer</span> player<span class="token punctuation">,</span>
    <span class="token class-name">FData</span> data<span class="token punctuation">,</span>
    <span class="token class-name">BuildContext</span> context<span class="token punctuation">,</span>
    <span class="token class-name">Size</span> viewSize<span class="token punctuation">,</span>
    <span class="token class-name">Rect</span> texturePos<span class="token punctuation">,</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token class-name">CustomPanel</span><span class="token punctuation">(</span>
      player<span class="token punctuation">:</span> player<span class="token punctuation">,</span>
      viewSize<span class="token punctuation">:</span> viewSize<span class="token punctuation">,</span>
      texturePos<span class="token punctuation">:</span> texturePos<span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项" aria-hidden="true">#</a> 注意事项</h2><ul><li>面板通过 <code>player.addListener</code> 监听状态，销毁时必须移除监听。</li><li>全屏切换会重建面板，需要跨全屏保留的数据放入 <code>FData</code>。</li><li>控制播放器时使用 <code>await</code>，避免在初始化或 <code>asyncPreparing</code> 状态调用 <code>start</code>、<code>pause</code>。</li><li>需要完整的手势和设置面板时，优先使用 <a href="/skin/immanent"><code>fplayer_ui</code></a>，不要重复实现播放器状态机。</li></ul>`,12),c=[p];function o(i,l){return s(),a("div",null,c)}const d=n(e,[["render",o],["__file","custom-ui.html.vue"]]);export{d as default};
