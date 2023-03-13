import{_ as o,W as i,X as c,Y as a,Z as n,$ as s,a0 as l,a2 as u,C as e}from"./framework-623c9e16.js";const d={},r=a("p",null,[n("这一节我们要使用 "),a("code",null,"fplayer"),n(" 库动手写一个最基础的 Flutter 视频播放器了。放心，一点也不难。")],-1),k=a("h2",{id:"验证-flutter-debug-环境",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#验证-flutter-debug-环境","aria-hidden":"true"},"#"),n(" 验证 Flutter Debug 环境")],-1),v=a("p",null,"首先我们验证一下之前新建的 Flutter 项目 playerapp 能够 debug 跑起来。",-1),m=a("h3",{id:"ios-debug",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#ios-debug","aria-hidden":"true"},"#"),n(" iOS debug")],-1),b=a("p",null,[n("新建的 Flutter 项目运行 iOS 时需要先在 ios 目录运行 "),a("code",null,"pod install --verbose"),n(" 安装依赖。")],-1),h={href:"https://github.com/flutter/flutter/issues/14647",target:"_blank",rel:"noopener noreferrer"},y=u(`<p>打开 ios/Runner.xcworkspace Xcode 工程，Runner -&gt; targtes -&gt; Runner -&gt; General -&gt; Signing 进行开发证书配置。</p><p>安装完依赖并且配置好证书之后，连接上 iOS 设备，在 Xcode 中直接运行项目，或者终端 <code>flutter run</code>，验证 Flutter App 可以顺利运行起来。</p><h3 id="android-debug" tabindex="-1"><a class="header-anchor" href="#android-debug" aria-hidden="true">#</a> Android debug</h3><p>Android 上没有开发证书问题，也不需要额外的依赖安装。<br> 打开 Android 模拟器，或者连接上 Android 设备，在终端运行 <code>flutter run</code>，验证 Flutter App 在 Android 设备上正确运行。</p><h2 id="创建-fplayer" tabindex="-1"><a class="header-anchor" href="#创建-fplayer" aria-hidden="true">#</a> 创建 FPlayer</h2><p>打开 <code>main.dart</code>，将其中的 class <code>_MyHomePageState</code> 修改如下。</p><div class="language-dart line-numbers-mode" data-ext="dart"><pre class="language-dart"><code><span class="token keyword">class</span> _MyHomePageState <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">MyHomePage</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>
  <span class="token keyword">final</span> <span class="token class-name">FPlayer</span> player <span class="token operator">=</span> <span class="token class-name">FPlayer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token metadata function">@override</span>
  <span class="token keyword">void</span> <span class="token function">initState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">initState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    player<span class="token punctuation">.</span><span class="token function">setDataSource</span><span class="token punctuation">(</span>
        <span class="token string-literal"><span class="token string">&quot;https://sample-videos.com/video123/flv/240/big_buck_bunny_240p_10mb.flv&quot;</span></span><span class="token punctuation">,</span>
        autoPlay<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token metadata function">@override</span>
  <span class="token keyword">void</span> <span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">dispose</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    player<span class="token punctuation">.</span><span class="token function">release</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>


  <span class="token metadata function">@override</span>
  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token class-name">Scaffold</span><span class="token punctuation">(</span>
      appBar<span class="token punctuation">:</span> <span class="token class-name">AppBar</span><span class="token punctuation">(</span>
        <span class="token comment">// Here we take the value from the MyHomePage object that was created by</span>
        <span class="token comment">// the App.build method, and use it to set our appbar title.</span>
        title<span class="token punctuation">:</span> <span class="token class-name">Text</span><span class="token punctuation">(</span>widget<span class="token punctuation">.</span>title<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">)</span><span class="token punctuation">,</span>
      body<span class="token punctuation">:</span> <span class="token class-name">Center</span><span class="token punctuation">(</span>
        <span class="token comment">// Center is a layout widget. It takes a single child and positions it</span>
        <span class="token comment">// in the middle of the parent.</span>
        child<span class="token punctuation">:</span> <span class="token class-name">FView</span><span class="token punctuation">(</span>
          player<span class="token punctuation">:</span> player<span class="token punctuation">,</span> 
          panelBuilder<span class="token punctuation">:</span> <span class="token function">fPanel2Builder</span><span class="token punctuation">(</span>snapShot<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要修改内容：</p><ol><li>在类 <code>_MyHomePageState</code> 中初始化了一个 <code>FPlayer</code> 实例 <code>player</code>。</li><li>在 <code>initState</code> 方法中调用 <code>player.setDataSource</code> 接口。</li><li>在 <code>dispose</code> 方法中调用 <code>player.release</code> 接口释放播放器占用的资源。</li><li>在 <code>build</code> 方法中将 <code>FView</code> 加入 UI Widgets Tree 中。</li></ol><h3 id="简要说明" tabindex="-1"><a class="header-anchor" href="#简要说明" aria-hidden="true">#</a> 简要说明</h3><p>一个 FPlayer 实例绑定一个 playback（native ijkplayer），构造 Fplayer 后，对应的 native ijkplayer 也随即初始化。<br> FPlayer 几乎具有所有 ijkplayer 的接口，FijkPlayer 就是对 native C 层 ijkplayer 的一个 dart 包装，接口都保持一致。 FPlayer 处理所有播放相关的工作，实际工作都是由 native C 层 ijkplayer 完成，包含检查 dataSource 中的媒体信息，打开解码器和解码线程、打开音频输出设备、将解码后数据输出给音频设备或显示设备。<br> FPlayer 占用较多的内存或资源，在不使用时应该主动调用接口 <code>release</code> 进行释放。</p><p>FView 只做一件事：显示 FPlayer 解码后的视频内容。FView 几乎没什么接口，后续如果增加的话也都是和 UI 显示相关。</p><h2 id="运行截图" tabindex="-1"><a class="header-anchor" href="#运行截图" aria-hidden="true">#</a> 运行截图</h2><table><thead><tr><th>Android</th><th>iOS</th></tr></thead><tbody><tr><td><img style="max-width:340px;" src="http://rr8xd5pn3.hn-bkt.clouddn.com/android-example.jpg" alt="Android demo 运行截图"></td><td><img style="max-width:340px;" src="http://rr8xd5pn3.hn-bkt.clouddn.com/ios-example.jpg" alt="iOS demo 运行截图"></td></tr></tbody></table>`,14);function f(g,_){const t=e("RouterLink"),p=e("ExternalLinkIcon");return i(),c("div",null,[r,a("p",null,[n("本节内容在 "),s(t,{to:"/guide/"},{default:l(()=>[n("安装")]),_:1}),n(" 一节中新建的 Flutter App 项目 playerapp 中进行修改更新。")]),k,v,m,b,a("p",null,[n("同时，由于一些尚未解决的问题 "),a("a",h,[n("flutter/issues/14647"),s(p)]),n("，暂时不能在 iOS 模拟器进行纹理的渲染，所需要 iOS 真机调试。那么就需要配置 Xcode 开发证书了。")]),y])}const F=o(d,[["render",f],["__file","quick.html.vue"]]);export{F as default};
