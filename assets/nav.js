/* YTF 工具箱 · 全局右侧导航注入 nav.js
   用法：在页面 </body> 前引入
   <script src="ROOT/assets/nav.js" data-root="ROOT" data-theme="work|city|study|life|game|home" data-title="标题"></script>
   ROOT 为相对站点根（myweb）的前缀，如 ../ 或 ../../ 或 ./ */
(function () {
  var s = document.currentScript;
  var root = (s && s.getAttribute('data-root')) || '../';
  var theme = (s && s.getAttribute('data-theme')) || 'home';
  var title = (s && s.getAttribute('data-title')) || (document.title || '工具');
  var navOn = (s && s.getAttribute('data-nav')) !== 'false';

  // 避免重复注入
  if (document.querySelector('.site-nav')) return;

  document.body.classList.add('theme-' + theme);

  // 首页等「本身就是导航」的页面可传 data-nav="false" 关闭全局导航，仅保留页脚
  if (navOn) {
    var sections = [
      ['ai-cards', 'AI 工具', '🤖'],
      ['city-cards', '城市规划', '🏙️'],
      ['study-cards', '学习成长', '📚'],
      ['life-cards', '生活', '🏠'],
      ['game-cards', '小游戏', '🎮']
    ];
    var links = sections.map(function (x) {
      return '<a href="' + root + 'index.html#' + x[0] + '"><span class="nav-icon">' + x[2] + '</span><span class="nav-label">' + x[1] + '</span></a>';
    }).join('');

    var nav = document.createElement('aside');
    nav.className = 'site-nav';
    nav.innerHTML =
      '<a class="brand" href="' + root + 'index.html"><span class="logo">✦</span><span class="brand-text">YTF 工具箱</span></a>' +
      '<nav class="links">' + links + '</nav>';
    document.body.insertBefore(nav, document.body.firstChild);

    // 移动端抽屉触发按钮
    var toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', '菜单');
    toggle.innerHTML = '☰';
    document.body.appendChild(toggle);

    function closeNav() { nav.classList.remove('open'); toggle.innerHTML = '☰'; }
    function openNav() { nav.classList.add('open'); toggle.innerHTML = '✕'; }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (nav.classList.contains('open')) closeNav(); else openNav();
    });
    // 点击导航外部关闭抽屉
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) closeNav();
    });
    // 点击导航链接后关闭抽屉
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  // 页脚（若页面已有则不重复）
  if (!document.querySelector('.site-footer')) {
    var foot = document.createElement('footer');
    foot.className = 'site-footer';
    foot.textContent = '© 2026 · by ytf000@sina.com';
    document.body.appendChild(foot);
  }

  // 非 city 主题页面注入通用深色卡片修复（city 由 city-override.css 单独处理）
  if (theme !== 'city' && !document.querySelector('link[href*="global-card-dark.css"]')) {
    var fixLink = document.createElement('link');
    fixLink.rel = 'stylesheet';
    fixLink.href = root + 'assets/global-card-dark.css';
    document.head.appendChild(fixLink);
  }

  // 全站最终强制深色兜底：覆盖任何残留的内联浅色背景/灰色文字
  if (!document.querySelector('link[href*="force-dark.css"]')) {
    var forceLink = document.createElement('link');
    forceLink.rel = 'stylesheet';
    forceLink.href = root + 'assets/force-dark.css';
    document.head.appendChild(forceLink);
  }
})();
