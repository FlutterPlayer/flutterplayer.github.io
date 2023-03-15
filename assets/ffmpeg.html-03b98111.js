import{_ as n,W as a,X as s,a1 as e}from"./framework-07d536f1.js";const t={},p=e(`<h2 id="设置播放器属性" tabindex="-1"><a class="header-anchor" href="#设置播放器属性" aria-hidden="true">#</a> 设置播放器属性</h2><p>设置播放器的属性属于高级用法。<br> 这里介绍设置属性的方法，以及和播放器相关的主要属性。</p><p>设置属性方法同时可用于设置 ffmpeg 属性， 比如 avcodec avformat avresmple 相关属性等，这里的文档无法提供全部内容。更多关于 ffmpeg 的属性请去阅读 ffmpeg 文档，或者去搜索引擎查找资料。</p><p>设置播放器属性需要在调用 <code>prepareAsync()</code> 之前，否则设置仅被保存下来，但不会应用到相应使用此属性值的执行逻辑中。 调用 <code>reset()</code> 之后，已经设置的 option 不会被重置，依然有效。</p><p>如果在 <code>prepareAsync()</code> 之后设置了 option 的值，那么这些值会在此播放器下次调用 <code>prepareAsync()</code> 的时候生效。</p><h2 id="单次属性设置" tabindex="-1"><a class="header-anchor" href="#单次属性设置" aria-hidden="true">#</a> 单次属性设置</h2><p>单次属性设置使用 <code>FijkPlayer</code> class 的方法。<br> 参数 <code>category</code> 使用 <code>FijkOption</code> class 中的静态常量 <code>formatCategory</code>, <code>codecCategory</code>，<code>swsCategory</code>, <code>playerCategory</code>, <code>swrCategory</code>。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token class-name">Future</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token keyword">void</span><span class="token punctuation">&gt;</span></span> <span class="token function">setOption</span><span class="token punctuation">(</span>int category<span class="token punctuation">,</span> <span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">dynamic</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>value 可以是 String 或者 int 类型，分别用于设置字符串类型和整型的播放器属性。</p><h2 id="批量属性设置" tabindex="-1"><a class="header-anchor" href="#批量属性设置" aria-hidden="true">#</a> 批量属性设置</h2><p>批量设置播放器属性使用 <code>applyOptions</code> 方法。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token class-name">Future</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token keyword">void</span><span class="token punctuation">&gt;</span></span> <span class="token function">applyOptions</span><span class="token punctuation">(</span><span class="token class-name">FijkOption</span> fijkOption<span class="token punctuation">)</span> <span class="token keyword">async</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>先将所有的播放器属性设置在 dart 对象 fijkOption 中，然后在一次性传递给 native 层。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token keyword">class</span> <span class="token class-name">FijkOption</span> <span class="token punctuation">{</span>
    <span class="token keyword">void</span> <span class="token function">setPlayerOption</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">dynamic</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">void</span> <span class="token function">setFormatOption</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">dynamic</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">void</span> <span class="token function">setCodecOption</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">dynamic</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">void</span> <span class="token function">setSwsOption</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">dynamic</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">void</span> <span class="token function">setSwrOption</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token keyword">dynamic</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>dynamic 类型的参数 value 实际上只接受 <code>String</code> 和 <code>int</code> 类型，否则会 throw <code>ArgumentError</code>。</p>`,15),o=[p];function c(i,l){return a(),s("div",null,o)}const r=n(t,[["render",c],["__file","ffmpeg.html.vue"]]);export{r as default};