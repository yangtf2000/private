// 站点级脚本：顶部细导航 + 首页双区 + 板块文章列表（每行一个的富卡片）
// 含：SVG 图表（光感/动态）、装饰动效、点击音效（Web Audio + 静音开关）
(function () {
  'use strict';
  var S = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
  var E = '</svg>';
  var ICONS = {
    'ai-design':     S + '<circle cx="24" cy="24" r="3"/><circle cx="11" cy="12" r="2.4"/><circle cx="37" cy="14" r="2.4"/><circle cx="24" cy="40" r="2.4"/><path d="M11 12 L24 24"/><path d="M37 14 L24 24"/><path d="M24 40 L24 24"/><rect x="6" y="6" width="36" height="36" rx="4" stroke-dasharray="2 3" opacity=".5"/>' + E,
    'ai-agent':      S + '<path d="M24 8 L38 16 V32 L24 40 L10 32 V16 Z"/><path d="M24 32 V18"/><path d="M19 23 L24 18 L29 23"/><path d="M14 27 A14 14 0 0 0 34 27" opacity=".55"/>' + E,
    'planning-ai':   S + '<rect x="9" y="9" width="30" height="30" rx="2"/><path d="M21 39 V19 H27 V39"/><path d="M21 19 L24 16 L27 19"/><path d="M9 39 L39 9" opacity=".4" stroke-dasharray="2 3"/><circle cx="24" cy="6" r="2"/>' + E,
    'coding':        S + '<path d="M18 16 L10 24 L18 32"/><path d="M30 16 L38 24 L30 32"/><path d="M27 14 L21 34"/><rect x="7" y="10" width="34" height="28" rx="3" opacity=".4"/>' + E,
    'city-health':   S + '<rect x="8" y="8" width="32" height="32" rx="4"/><path d="M8 24 H16 L20 16 L26 32 L30 24 H40"/><circle cx="24" cy="24" r="2" opacity=".6"/>' + E,
    'special-plan':  S + '<path d="M14 9 H30 L36 15 V39 H14 Z"/><path d="M30 9 V15 H36"/><path d="M18 21 H32"/><path d="M18 27 H32"/><path d="M18 33 H27"/><circle cx="25" cy="6" r="2"/>' + E,
    'fund-apply':    S + '<circle cx="20" cy="19" r="7"/><path d="M25 24 L31 30"/><path d="M20 15 V23"/><path d="M16.5 18.5 H23.5"/><path d="M17.5 21 L16.5 22.5"/><path d="M22.5 21 L23.5 22.5"/><path d="M12 37 H36"/>' + E,
    'district-plan': S + '<rect x="10" y="10" width="28" height="28" rx="2"/><path d="M24 10 V38"/><path d="M10 24 H38"/><rect x="10" y="24" width="14" height="14" rx="1" fill="currentColor" fill-opacity=".14"/><path d="M10 38 L38 10" opacity=".4" stroke-dasharray="2 3"/>' + E,
    'freshman':      S + '<path d="M15 31 A9 9 0 0 1 33 31"/><path d="M24 13 V8"/><path d="M12 20 L8 16"/><path d="M36 20 L40 16"/><path d="M8 31 H40"/><path d="M24 31 V44"/><path d="M20 40 L24 44 L28 40"/>' + E,
    'yangziyu-summer': S + '<rect x="11" y="12" width="26" height="26" rx="3"/><path d="M17 12 V8"/><path d="M31 12 V8"/><path d="M11 22 H37"/><path d="M19 12 V38"/><path d="M29 12 V38"/><rect x="29" y="22" width="8" height="16" rx="1" fill="currentColor" fill-opacity=".14"/>' + E,
    'food-drug-env': S + '<path d="M24 8 L36 13 V24 C36 32 31 37 24 40 C17 37 12 32 12 24 V13 Z"/><path d="M17 24 C19 20 29 20 31 24 C29 28 19 28 17 24 Z"/><circle cx="24" cy="24" r="2.2"/>' + E,
    'birthday-card': S + '<path d="M10 16 H38 V36 H10 Z"/><path d="M10 16 L24 26 L38 16"/><path d="M24 29 C21.5 26 17 27.5 17 30.5 C17 33 24 36 24 36 C24 36 31 33 31 30.5 C31 27.5 26.5 26 24 29 Z"/>' + E,
    'birthday-game': S + '<rect x="12" y="28" width="12" height="12" rx="2"/><rect x="20" y="18" width="12" height="10" rx="2"/><rect x="16" y="10" width="10" height="9" rx="2"/><path d="M24 10 V18" opacity=".4"/>' + E,
    'shanxi-travel': S + '<path d="M8 34 L18 20 L26 30 L34 18 L42 34"/><circle cx="34" cy="14" r="3"/><path d="M10 40 C18 36 24 44 32 40 C38 37 40 42 42 40"/>' + E,
    'daily-todo':    S + '<rect x="12" y="14" width="9" height="9" rx="2"/><rect x="12" y="29" width="9" height="9" rx="2"/><path d="M14.5 18.5 L15.5 20 L17.5 16.5"/><path d="M26 18.5 H38"/><path d="M26 33.5 H36"/>' + E,
    'prime-hunter':  S + '<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="7"/><path d="M24 3 V11"/><path d="M24 37 V45"/><path d="M3 24 H11"/><path d="M37 24 H45"/><circle cx="24" cy="24" r="2.6" fill="currentColor" fill-opacity=".22"/>' + E,
    'policy':        S + '<path d="M12 8 H32 L38 14 V40 H12 Z"/><path d="M32 8 V14 H38"/><path d="M16 18 H30"/><path d="M16 24 H34"/><path d="M16 30 H34"/><path d="M16 36 H27"/>' + E,
    'summer-reading': S + '<path d="M24 12 C18 8 12 8 8 10 V38 C12 36 18 36 24 40 C30 36 36 36 40 38 V10 C36 8 30 8 24 12 Z"/><path d="M24 12 V40"/><path d="M12 16 H20"/><path d="M12 22 H20"/><path d="M28 16 H36"/><path d="M28 22 H36"/>' + E,
    'wechat':         S + '<rect x="9" y="10" width="22" height="16" rx="4"/><path d="M15 26 L15 32 L21 26"/><rect x="19" y="20" width="20" height="15" rx="4"/><path d="M25 35 L25 40 L30 35"/>' + E,
    'changxin':       S + '<path d="M10 34 L20 26 L28 30 L40 16"/><path d="M33 16 H40 V23"/><circle cx="20" cy="26" r="1.6" fill="currentColor"/><circle cx="28" cy="30" r="1.6" fill="currentColor"/>' + E,
    'yuanchai':       S + '<rect x="9" y="18" width="12" height="22" rx="1"/><path d="M9 18 L15 12 L21 18"/><rect x="27" y="20" width="12" height="20" rx="1" stroke-dasharray="2 3"/><path d="M27 20 L33 14 L39 20"/><path d="M24 8 A16 16 0 0 1 24 40" opacity=".5"/>' + E,
    'sanchang':       S + '<rect x="12" y="20" width="24" height="17" rx="2"/><path d="M12 28.5 H36"/><path d="M17 37 V42"/><path d="M31 37 V42"/><path d="M36 20 L40 15"/><path d="M8 43 C14 40 20 46 28 43 C34 41 38 44 42 42" opacity=".45"/>' + E,
    '_fallback':     S + '<circle cx="24" cy="24" r="6"/>' + E
  };

  var me = document.currentScript;
  var root = (me && me.dataset.root) ? me.dataset.root : '';
  var section = (me && me.dataset.section) ? me.dataset.section : '';

  function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function escAttr(s) { return escHtml(s).replace(/"/g, '&quot;'); }

  /* ===== 音效模块（Web Audio，无需音频文件） ===== */
  var Sound = (function () {
    var ctx = null, on = true;
    function ensure() {
      try {
        if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
        if (ctx && ctx.state === 'suspended') ctx.resume();
      } catch (e) {}
    }
    function blip(freq) {
      if (!on) return;
      ensure(); if (!ctx) return;
      try {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = freq || 480;
        var t = ctx.currentTime;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.10, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.20);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.22);
      } catch (e) {}
    }
    return { blip: blip, set: function (v) { on = v; }, get: function () { return on; }, ensure: ensure };
  })();

  /* ===== 图表：资金/规模条形图（SVG，带光感与生长动画） ===== */
  function barChart(data, idx) {
    if (!data || !data.bars || !data.bars.length) return '';
    var W = 240, H = 150, padTop = 24, padBottom = 28, padL = 12, padR = 12;
    var n = data.bars.length, gap = 10;
    var plotW = W - padL - padR, plotH = H - padTop - padBottom;
    var barW = (plotW - gap * (n - 1)) / n;
    var vals = data.bars.map(function (b) { return b.v; });
    var max = Math.max.apply(null, vals);
    var gid = 'g' + idx, fid = 'f' + idx;
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + escAttr(data.caption || 'chart') + '">';
    s += '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">'
       + '<stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0e7490"/></linearGradient>'
       + '<filter id="' + fid + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
    s += '<line x1="' + padL + '" y1="' + (padTop + plotH) + '" x2="' + (W - padR) + '" y2="' + (padTop + plotH) + '" stroke="rgba(125,211,252,.25)" stroke-width="1"/>';
    data.bars.forEach(function (b, i) {
      var h = (Math.sqrt(b.v) / Math.sqrt(max)) * plotH;
      if (h < 2) h = 2;
      var x = padL + i * (barW + gap);
      var y = padTop + (plotH - h);
      s += '<rect class="bv" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" fill="url(#' + gid + ')" filter="url(#' + fid + ')" style="transition-delay:' + (i * 90) + 'ms"/>';
      s += '<text class="cv" x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle">' + b.v + (b.u || '') + '</text>';
      s += '<text class="cl" x="' + (x + barW / 2).toFixed(1) + '" y="' + (H - 9) + '" text-anchor="middle">' + escHtml(b.l.slice(0, 4)) + '</text>';
    });
    s += '<text class="ccap" x="' + (W / 2) + '" y="15" text-anchor="middle">' + escHtml(data.caption || '') + '</text>';
    s += '</svg>';
    return s;
  }

  /* ===== 装饰动效：非政策卡片的“信号”图形 ===== */
  function motif() {
    return '<svg class="motif" viewBox="0 0 240 150" preserveAspectRatio="xMidYMid meet">'
      + '<g class="m-ring m-ring-1"><circle cx="120" cy="75" r="48"/></g>'
      + '<g class="m-ring m-ring-2"><circle cx="120" cy="75" r="31"/></g>'
      + '<circle class="m-dot" cx="120" cy="75" r="6"/>'
      + '<path class="m-wave" d="M6 100 Q 33 72 60 100 T 114 100 T 168 100 T 222 100 T 240 100" fill="none"/>'
      + '</svg>';
  }

  /* ===== 顶部细导航 + 音效开关 ===== */
  if (!document.querySelector('.site-top')) {
    var top = document.createElement('header');
    top.className = 'site-top';
    var crumb = '<span class="brand">YTF</span>';
    if (section) {
      var secObj = (window.SECTIONS || []).filter(function (s) { return s.id === section; })[0];
      var name = secObj ? secObj.title : section;
      crumb += '<span class="crumb"><a href="' + root + 'index.html">首页</a> &nbsp;/&nbsp; ' + escHtml(name) + '</span>';
    }
    top.innerHTML = crumb + '<span class="spacer"></span>'
      + '<button class="sound-btn" id="soundBtn" type="button" aria-label="音效开关">🔊 音效</button>'
      + '<a class="home" href="' + root + 'index.html">YTF 首页 ↗</a>';
    document.body.insertBefore(top, document.body.firstChild);
  }
  var sb = document.getElementById('soundBtn');
  if (sb) {
    sb.addEventListener('click', function (e) {
      e.preventDefault();
      var v = !Sound.get(); Sound.set(v);
      sb.textContent = v ? '🔊 音效' : '🔇 静音';
      if (v) Sound.blip(600);
    });
  }

  /* ===== 视觉初始化：入场动画 + 点击音效 ===== */
  function setupVisuals() {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
        });
      }, { threshold: 0.2 });
      document.querySelectorAll('.art-vis').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.art-vis').forEach(function (el) { el.classList.add('in-view'); });
    }
    document.querySelectorAll('.art-row, .sec-row').forEach(function (el) {
      el.addEventListener('click', function () {
        Sound.blip(parseInt(el.getAttribute('data-snd') || '480', 10));
      });
    });
  }

  /* ===== 首页：公共 / 私人 双区 ===== */
  var homeZones = document.getElementById('home-zones');
  if (homeZones && window.SECTIONS) {
    var pub = SECTIONS.filter(function (s) { return s.zone === 'public'; });
    var pri = SECTIONS.filter(function (s) { return s.zone !== 'public'; });
    function row(s) {
      var isPrivate = s.visibility === 'private';
      var pill = isPrivate
        ? '<span class="pill lock">🔒 ' + escHtml(s.tag || '仅直链') + '</span>'
        : '<span class="pill">' + escHtml(s.tag || '') + '</span>';
      return '<a class="sec-row" href="sections/' + s.id + '/" data-snd="440">'
        + '<div class="sec-ico">' + (ICONS[s.id] || ICONS._fallback) + '</div>'
        + '<div class="sec-main"><h3>' + escHtml(s.title) + '</h3><div class="desc">' + escHtml(s.subtitle || '') + '</div></div>'
        + pill + '<span class="sec-arrow">→</span></a>';
    }
    var h = '<div class="zone-label zone-pub">公共 · 工作与专业存档</div><div class="zone-list">' + pub.map(row).join('') + '</div>';
    h += '<div class="home-divider"></div>';
    h += '<div class="zone-label zone-pri">私人 · 生活与分享</div><div class="zone-list">' + pri.map(row).join('') + '</div>';
    homeZones.innerHTML = h;
    setupVisuals();
  }

  /* ===== 板块文章列表：每行一个的富卡片 ===== */
  var listEl = document.getElementById('section-list');
  if (listEl && section && window.SECTIONS) {
    var sec = (window.SECTIONS || []).filter(function (s) { return s.id === section; })[0];
    if (sec && sec.articles && sec.articles.length) {
      var html = '';
      sec.articles.forEach(function (a, i) {
        var href = root + 'sections/' + section + '/' + a.slug + '/';
        var icon = ICONS[a.icon || a.slug] || ICONS._fallback;
        var vis = a.chart ? barChart(a.chart, i) : motif();
        var badge = a.issue ? '<span class="issue-badge">' + escHtml(a.issue) + '</span>' : '';
        var kw = a.tag ? '<span class="kw">' + escHtml(a.tag) + '</span>' : '';
        var detail = a.detail ? escHtml(a.detail) : escHtml(a.desc || '');
        html += '<a class="art-row" href="' + href + '" data-snd="' + (300 + i * 60) + '">'
          + '<div class="art-vis">' + vis + '</div>'
          + '<div class="art-body">'
          + '<div class="art-top">' + badge + '<span class="art-ico">' + icon + '</span><h4>' + escHtml(a.title) + '</h4></div>'
          + '<div class="kw-row">' + kw + '</div>'
          + '<div class="art-detail">' + detail + '</div>'
          + '<div class="meta"><span class="m-label">提交</span> ' + escHtml(a.date || '') + '</div>'
          + '</div></a>';
      });
      listEl.innerHTML = html;
      setupVisuals();
    } else {
      listEl.innerHTML = '<div class="empty">该板块内容整理中…</div>';
    }
  }
})();
