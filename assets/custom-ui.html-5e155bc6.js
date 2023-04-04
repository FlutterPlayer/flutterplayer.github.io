import{_ as n,W as s,X as a,a1 as t}from"./framework-07d536f1.js";const e={},p=t(`<p>上一节我们讲了fplayer的内置UI，虽然说有大部分播放器有的功能，但是也很难满足一些需求，这样就需要自定义UI来满足这些需求，这节主要介绍如何自定义UI并使用</p><h2 id="替换皮肤" tabindex="-1"><a class="header-anchor" href="#替换皮肤" aria-hidden="true">#</a> 替换皮肤</h2><p>首先介绍下FView构造函数中的参数，替换皮肤就需要修改里面的panelBuilder函数。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token keyword">typedef</span> <span class="token class-name">FPanelWidgetBuilder</span> <span class="token operator">=</span> <span class="token class-name">Widget</span> <span class="token class-name">Function</span><span class="token punctuation">(</span>
  <span class="token class-name">FPlayer</span> player<span class="token punctuation">,</span>
  <span class="token class-name">FData</span> data<span class="token punctuation">,</span>
  <span class="token class-name">BuildContext</span> context<span class="token punctuation">,</span>
  <span class="token class-name">Size</span> viewSize<span class="token punctuation">,</span>
  <span class="token class-name">Rect</span> texturePos<span class="token punctuation">,</span> 
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token class-name">FView</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token metadata function">@required</span> <span class="token class-name">FPlayer</span> player<span class="token punctuation">,</span>
  double width<span class="token punctuation">,</span>
  double height<span class="token punctuation">,</span>
  <span class="token class-name">Color</span> color <span class="token operator">=</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>blueGrey<span class="token punctuation">,</span>
  <span class="token class-name">FFit</span> fsFit <span class="token operator">=</span> <span class="token class-name">FFit</span><span class="token punctuation">.</span>contain<span class="token punctuation">,</span>
  <span class="token class-name">FFit</span> fit <span class="token operator">=</span> <span class="token class-name">FFit</span><span class="token punctuation">.</span>contain<span class="token punctuation">,</span>
  <span class="token class-name">ImageProvider</span> cover<span class="token punctuation">,</span>
  <span class="token class-name">FPanelWidgetBuilder</span> panelBuilder<span class="token punctuation">,</span>
  <span class="token keyword">void</span> <span class="token class-name">Function</span><span class="token punctuation">(</span><span class="token class-name">FData</span><span class="token punctuation">)</span><span class="token operator">?</span> onDispose<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>player</code>： 播放器 FPlayer 对象，FView 所显示视频的数据来源，自定义UI所控制的播放器对象。<br> 监听此 player 的属性变化并在 UI 上作出相应的改变。</li><li><code>data</code>： 播放器在全屏模式和非全屏模式切换时，panel 会销毁并重新初始化，如果要在全屏模式和非全屏模式的 panel 中共享一些数据，可以把数据保存在 FData 中。</li><li><code>context</code>： build Widget 的上下文。</li><li><code>viewSize</code>： 对应 FView 的实际显示大小</li><li><code>texturePos</code>： FView 中实际视频显示的相对位置，这个相对位置可能超出 <code>FView</code> 的实际大小</li></ul><p>如果在 panel 控制中修改了一些系统参数，可以记录到 FData 中，等 FView 销毁时，在 FView 的 <code>onDispose</code> 回掉函数中恢复系统默认值。</p><ul><li><code>FFit.contain</code>：<code>texturePos</code> 是绝对不会超出 <code>viewSize</code> 的大小。</li><li><code>FFit.fill</code>：<code>texturePos</code> 的宽高肯定是和 <code>viewSize</code> 的宽高相等，<code>texturePos</code> 的相对偏移是 0。</li><li><code>FFit.cover</code>：且 FView 宽高比例和实际视频宽高比例不等的情况下，<code>texturePos</code> 宽高肯定超出 <code>viewSize</code> 的大小。</li></ul><h2 id="demo" tabindex="-1"><a class="header-anchor" href="#demo" aria-hidden="true">#</a> demo</h2><p>利用上面描述的自定义播放器控制 UI 的接口，我们实际编码实现一个非常简单的 UI。 UI 描述： 在视频显示区域的左下角根据实际播放器状态显示一个播放、暂停按钮。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token keyword">class</span> <span class="token class-name">CustomFPanel</span> <span class="token keyword">extends</span> <span class="token class-name">StatefulWidget</span> <span class="token punctuation">{</span>
  <span class="token keyword">final</span> <span class="token class-name">FPlayer</span> player<span class="token punctuation">;</span>
  <span class="token keyword">final</span> <span class="token class-name">BuildContext</span> buildContext<span class="token punctuation">;</span>
  <span class="token keyword">final</span> <span class="token class-name">Size</span> viewSize<span class="token punctuation">;</span>
  <span class="token keyword">final</span> <span class="token class-name">Rect</span> texturePos<span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token class-name">CustomFPanel</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token metadata function">@required</span> <span class="token keyword">this</span><span class="token punctuation">.</span>player<span class="token punctuation">,</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>buildContext<span class="token punctuation">,</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>viewSize<span class="token punctuation">,</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>texturePos<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token metadata function">@override</span>
  _CustomFPanelState <span class="token function">createState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">&gt;</span> <span class="token function">_CustomFPanelState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> _CustomFPanelState <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomFPanel</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

  <span class="token class-name">FPlayer</span> <span class="token keyword">get</span> player <span class="token operator">=</span><span class="token operator">&gt;</span> widget<span class="token punctuation">.</span>player<span class="token punctuation">;</span>
  bool _playing <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

  <span class="token metadata function">@override</span>
  <span class="token keyword">void</span> <span class="token function">initState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">initState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">addListener</span><span class="token punctuation">(</span>_playerValueChanged<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">void</span> <span class="token function">_playerValueChanged</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">FValue</span> value <span class="token operator">=</span> player<span class="token punctuation">.</span>value<span class="token punctuation">;</span>

    bool playing <span class="token operator">=</span> <span class="token punctuation">(</span>value<span class="token punctuation">.</span>state <span class="token operator">==</span> <span class="token class-name">FState</span><span class="token punctuation">.</span>started<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>playing <span class="token operator">!=</span> _playing<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        _playing <span class="token operator">=</span> playing<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token metadata function">@override</span>
  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Rect</span> rect <span class="token operator">=</span> <span class="token class-name">Rect</span><span class="token punctuation">.</span><span class="token function">fromLTRB</span><span class="token punctuation">(</span>
      <span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0.0</span><span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>left<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0.0</span><span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>top<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">min</span><span class="token punctuation">(</span>widget<span class="token punctuation">.</span>viewSize<span class="token punctuation">.</span>width<span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>right<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">min</span><span class="token punctuation">(</span>widget<span class="token punctuation">.</span>viewSize<span class="token punctuation">.</span>height<span class="token punctuation">,</span> widget<span class="token punctuation">.</span>texturePos<span class="token punctuation">.</span>bottom<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token class-name">Positioned</span><span class="token punctuation">.</span><span class="token function">fromRect</span><span class="token punctuation">(</span>
      rect<span class="token punctuation">:</span> rect<span class="token punctuation">,</span>
      child<span class="token punctuation">:</span> <span class="token class-name">Container</span><span class="token punctuation">(</span>
        alignment<span class="token punctuation">:</span> <span class="token class-name">Alignment</span><span class="token punctuation">.</span>bottomLeft<span class="token punctuation">,</span>
        child<span class="token punctuation">:</span> <span class="token class-name">IconButton</span><span class="token punctuation">(</span>
          icon<span class="token punctuation">:</span> <span class="token class-name">Icon</span><span class="token punctuation">(</span>
            _playing <span class="token operator">?</span> <span class="token class-name">Icons</span><span class="token punctuation">.</span>pause <span class="token punctuation">:</span> <span class="token class-name">Icons</span><span class="token punctuation">.</span>play_arrow<span class="token punctuation">,</span>
            color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>white<span class="token punctuation">,</span>
          <span class="token punctuation">)</span><span class="token punctuation">,</span>
          onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            _playing <span class="token operator">?</span> widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">pause</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">:</span> widget<span class="token punctuation">.</span>player<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token metadata function">@override</span>
  <span class="token keyword">void</span> <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    player<span class="token punctuation">.</span><span class="token function">removeListener</span><span class="token punctuation">(</span>_playerValueChanged<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后作为 panelBuilder 参数传递给 FView 的构造函数。这样一个简单的自定义皮肤就完成了。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token class-name">FView</span><span class="token punctuation">(</span>
  player<span class="token punctuation">:</span> player<span class="token punctuation">,</span>
  panelBuilder<span class="token punctuation">:</span> <span class="token punctuation">(</span>
    <span class="token class-name">FPlayer</span> player<span class="token punctuation">,</span>
    <span class="token class-name">FData</span> data<span class="token punctuation">,</span>
    <span class="token class-name">BuildContext</span> context<span class="token punctuation">,</span>
    <span class="token class-name">Size</span> viewSize<span class="token punctuation">,</span>
    <span class="token class-name">Rect</span> texturePos<span class="token punctuation">,</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token class-name">CustomFPanel</span><span class="token punctuation">(</span>
      player<span class="token punctuation">:</span> player<span class="token punctuation">,</span>
      buildContext<span class="token punctuation">:</span> context<span class="token punctuation">,</span>
      viewSize<span class="token punctuation">:</span> viewSize<span class="token punctuation">,</span>
      texturePos<span class="token punctuation">:</span> texturePos<span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),c=[p];function o(i,l){return s(),a("div",null,c)}const d=n(e,[["render",o],["__file","custom-ui.html.vue"]]);export{d as default};
