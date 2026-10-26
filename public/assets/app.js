/* 渲染逻辑：一般无需修改。文案请改 assets/config.js */
(function () {
  'use strict';
  var C = window.SITE_CONFIG;
  if (!C) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function t(s) {
    return esc(s).replace(/【([^】]*)】/g, function (_, x) { return tag(x || '待确认'); });
  }
  function tag(x) { return '<span class="tbc">' + esc(x || '待确认') + '</span>'; }
  function $(id) { return document.getElementById(id); }
  function head(o, extra) {
    return '<header class="sec-head"><p class="kicker">' + esc(o.kicker || '') + '</p>' +
      '<h2>' + t(o.title) + (extra || '') + '</h2>' +
      (o.intro ? '<p class="intro">' + t(o.intro) + '</p>' : '') + '</header>';
  }

  var P = {
    harmony: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/><path d="M2 9.5c1.6-1.6 1.6-3.4 0-5M22 9.5c-1.6-1.6-1.6-3.4 0-5"/>',
    cabin: '<path d="M5 20v-6a3 3 0 0 1 3-3h1l1-6h4l1 6h1a3 3 0 0 1 3 3v6"/><path d="M5 17h14"/><path d="M3 4.5l2 1.5M21 4.5l-2 1.5M12 1.8v1.8"/>',
    outfit: '<path d="M8.5 3 5 5 2.5 10l3 1.5V21h13v-9.5l3-1.5L19 5l-3.5-2"/><path d="M8.5 3c.6 1.7 1.9 2.6 3.5 2.6S14.9 4.7 15.5 3"/>',
    camera: '<path d="M3 8a2 2 0 0 1 2-2h2.2L9 3.5h6L16.8 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.8"/>',
    luggage: '<rect x="6" y="7" width="12" height="13" rx="2"/><path d="M10 7V3.5h4V7M10 11v5M14 11v5M8.5 20v1.5M15.5 20v1.5"/>',
    tent: '<path d="M2 20h20M12 4 3.5 20M12 4l8.5 16M12 4v16M9.5 20 12 14l2.5 6"/>',
    appliance: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 8h14M8 5.3h1.5"/><circle cx="12" cy="14.5" r="3.6"/>',
    carwash: '<path d="M4 17v-3.5l2-4.5h12l2 4.5V17z"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/><path d="M8 3.5c0 1.3-1 1.6-1 2.6a1 1 0 0 0 2 0c0-1-1-1.3-1-2.6zM16 3.5c0 1.3-1 1.6-1 2.6a1 1 0 0 0 2 0c0-1-1-1.3-1-2.6z"/>',
    gift: '<path d="M12 7v14M4 11h16v10H4zM3.5 7h17v4H3.5z"/><path d="M12 7c-2-3.5-5.5-3.5-5.5 0C6.5 9 9 9.5 12 7zM12 7c2-3.5 5.5-3.5 5.5 0C17.5 9 15 9.5 12 7z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    stamp: '<path d="M9 3.5h6v4l-1.5 4.5h-3L9 7.5z"/><path d="M4 15.5h16v3H4zM6 21h12"/>'
  };
  function icon(k, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (P[k] || P.gift) + '</svg>';
  }
  var LEAF = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 30V19C9 19 3 15 2.5 9 6 5 11 3 16 3s10 2 13.5 6C29 15 23 19 16 19"/><path d="M16 19c0-5-1-10-3-15M16 19c0-5 1-10 3-15M16 19c-2-4-5-8-9-11M16 19c2-4 5-8 9-11" stroke="rgba(0,0,0,.25)" stroke-width=".8" fill="none"/></svg>';

  /* ---------- 1. 首屏（仅 UCARS logo） ---------- */
  var H = C.hero;
  $('hero').innerHTML =
    '<div class="hero-bg" style="background-image:url(\'' + esc(H.image) + '\')" role="img" aria-label="' + esc(H.imageAlt) + '"></div>' +
    '<div class="leaf l1">' + LEAF + '</div><div class="leaf l2">' + LEAF + '</div><div class="leaf l3">' + LEAF + '</div>' +
    '<div class="wrap hero-in">' +
      '<div class="brand brand-lockup brand-ucars-only"><img class="ucars-logo" src="' + esc(H.logo) + '" alt="UCARS" width="438" height="156"></div>' +
      '<p class="station">' + esc(H.station) + '</p>' +
      '<h1 class="slogan">' + t(H.slogan) + '</h1>' +
      '<p class="sub-slogan">' + t(H.subSlogan) + '</p>' +
      '<p class="event-name">' + t(H.eventName) + (H.eventNameTbc ? tag('名称暂定') : '') + '</p>' +
      '<div class="status js-status" data-state="idle"><i></i><span>—</span></div>' +
      '<dl class="facts">' + H.facts.map(function (f) {
        return '<div><dt>' + esc(f.label) + '</dt><dd>' + t(f.value) + '</dd></div>';
      }).join('') + '</dl>' +
      '<a class="scroll-cue" href="#scenes">向下浏览 ↓</a>' +
    '</div>';

  /* ---------- 气氛海报（首屏下，不替换 hero） ---------- */
  var A = C.atmosphere;
  var atmEl = $('atmosphere');
  if (atmEl) {
    if (!A || A.enabled === false) { atmEl.hidden = true; }
    else {
      atmEl.innerHTML = '<div class="wrap">' +
        '<figure class="atmosphere-fig">' +
          '<img src="' + esc(A.image) + '" alt="' + esc(A.imageAlt || '') + '" loading="lazy" decoding="async">' +
          (A.caption ? '<figcaption>' + t(A.caption) + '</figcaption>' : '') +
        '</figure></div>';
    }
  }

  /* ---------- 导航 ---------- */
  $('nav').innerHTML = '<div class="nav-in">' + C.nav.filter(function (n) {
    if (n.id === 'benefits' && (!C.benefits || !C.benefits.enabled)) return false;
    if (n.id === 'interaction' && (!C.interaction || C.interaction.enabled === false)) return false;
    if (n.id === 'care' && (!C.care || C.care.enabled === false)) return false;
    if (n.id === 'lottery' && (!C.lottery || C.lottery.enabled === false)) return false;
    if (n.id === 'map' && (!C.map || C.map.enabled === false)) return false;
    return $(n.id);
  }).map(function (n) {
    return '<a href="#' + esc(n.id) + '">' + esc(n.label) + '</a>';
  }).join('') + '</div>';

  /* ---------- 2. 场景 ---------- */
  function sceneImageBlock(s, i) {
    var imgs = (s.images && s.images.length) ? s.images : (s.image ? [s.image] : []);
    if (!imgs.length) return '';
    var alts = s.imageAlts || [];
    function slideBtn(src, j) {
      var a = alts[j] || (s.name + (imgs.length > 1 ? ' · 图' + (j + 1) : ' · ' + s.cars));
      return '<button class="scene-image-trigger" type="button" data-vehicle-index="' + i + '" aria-label="查看' + esc(s.cars) + '车型亮点"><img src="' + esc(src) + '" alt="' + esc(a) + '" loading="lazy" decoding="async" width="640" height="386"><span>点图查看车型亮点</span></button>';
    }
    if (imgs.length === 1) return slideBtn(imgs[0], 0);
    var slides = imgs.map(function (src, j) {
      return '<div class="scene-slide">' + slideBtn(src, j) + '</div>';
    }).join('');
    var dots = imgs.map(function (_, j) {
      return '<button type="button" class="scene-dot' + (j === 0 ? ' is-active' : '') + '" data-scene-dot="' + i + '-' + j + '" aria-label="第' + (j + 1) + '张"></button>';
    }).join('');
    return '<div class="scene-carousel" role="region" aria-label="车型图片，左右滑动" data-scene-carousel="' + i + '">' +
      '<div class="scene-track">' + slides + '</div>' +
      '<div class="scene-dots" aria-hidden="true">' + dots + '</div>' +
    '</div>';
  }
  var S = C.scenes;
  $('scenes').innerHTML = '<div class="wrap">' + head(S) +
    '<div class="scenes">' + S.items.map(function (s, i) {
      return '<details class="scene c-' + esc(s.color) + '"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span class="no">' + esc(s.no) + '</span>' +
          '<span class="sm"><b>' + t(s.name) + '</b><small>' + t(s.cars) + '</small></span>' +
          '<span class="chev" aria-hidden="true"></span></summary>' +
        '<div class="scene-body">' +
          sceneImageBlock(s, i) +
          '<div class="moments">' + s.moments.map(function (m) { return '<span>' + t(m) + '</span>'; }).join('') + '</div>' +
          '<p>' + t(s.desc) + '</p>' +
        '</div></details>';
    }).join('') + '</div>' +
    '<p class="note">' + t(S.note) + '</p></div>';

  /* 多图轮播：dots 随滚动更新；点圆点跳转（场景 / 打卡礼共用） */
  function bindSceneCarousels(rootScope) {
    var scope = rootScope || document;
    var cars = scope.querySelectorAll('[data-scene-carousel]:not([data-carousel-bound])');
    for (var c = 0; c < cars.length; c++) {
      (function (root) {
        root.setAttribute('data-carousel-bound', '1');
        var track = root.querySelector('.scene-track');
        var dots = root.querySelectorAll('.scene-dot');
        if (!track || !dots.length) return;
        function setActive(idx) {
          for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('is-active', d === idx);
        }
        track.addEventListener('scroll', function () {
          var w = track.clientWidth || 1;
          setActive(Math.round(track.scrollLeft / w));
        }, { passive: true });
        root.addEventListener('click', function (e) {
          var dot = e.target.closest ? e.target.closest('.scene-dot') : null;
          if (!dot || !root.contains(dot)) return;
          e.preventDefault();
          e.stopPropagation();
          var parts = (dot.getAttribute('data-scene-dot') || '').split('-');
          var idx = Number(parts[parts.length - 1]);
          if (isNaN(idx)) return;
          track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
          setActive(idx);
        });
      })(cars[c]);
    }
  }
  bindSceneCarousels();

  /* ---------- 3. UCARS 秋日车生活互动（周末去哪儿；steps 为空则不渲染三步 ol） ---------- */
  var interEl = $('interaction');
  if (interEl) {
    var U = C.interaction;
    var UP = U && U.poster;
    if (!U || U.enabled === false) {
      interEl.hidden = true;
      interEl.innerHTML = '';
    } else {
      interEl.hidden = false;
      interEl.classList.remove('ucars-care-section');
      interEl.classList.add('ucars-play-section');
      var posterFig = (UP && UP.image)
        ? '<figure class="interaction-poster"><img src="' + esc(UP.image) + '" alt="' + esc(UP.imageAlt || ((UP.title || '') + (UP.titleAccent || ''))) + '" loading="lazy" decoding="async" width="1564" height="1246"></figure>'
        : '';
      var playSteps = (U.steps && U.steps.length)
        ? '<ol class="play-steps">' + U.steps.map(function (s) {
            return '<li><span class="play-no">' + esc(s.no) + '</span><div><b>' + t(s.title) + '</b><p>' + t(s.desc) + '</p></div></li>';
          }).join('') + '</ol>'
        : '';
      var destGrid = (U.destinations && U.destinations.length)
        ? '<div class="destination-grid">' + U.destinations.map(function (d, i) {
            return '<article class="destination-card"><span class="destination-no">0' + (i + 1) + '</span>' +
              '<h3>' + t(d.place) + '</h3><p>' + t(d.line) + '</p>' +
              '<div class="gear-list">' + (d.gear || []).map(function (g) { return '<span>' + t(g) + '</span>'; }).join('') + '</div></article>';
          }).join('') + '</div>'
        : '';
      interEl.innerHTML = '<div class="wrap"><article class="ucars-play card">' +
        '<div class="ucars-play-brand"><img src="' + esc(C.hero.logo) + '" alt="UCARS" width="1293" height="302"><span class="ucars-play-time">约 1 分钟</span></div>' +
        posterFig +
        head(U) +
        playSteps +
        (U.prompt ? '<p class="play-prompt">“' + t(U.prompt) + '”</p>' : '') +
        destGrid +
        (U.footnote ? '<p class="play-footnote">' + t(U.footnote) + '</p>' : '') +
        (U.connection ? '<p class="ucars-connection">' + t(U.connection) + '</p>' : '') +
      '</article></div>';
    }
  }

  /* ---------- 3b. 养车选UCARS（左右滑动海报，在周末板块下方） ---------- */
  var careEl = $('care');
  if (careEl) {
    var Care = C.care;
    if (!Care || Care.enabled === false) {
      careEl.hidden = true;
      careEl.innerHTML = '';
    } else {
      careEl.hidden = false;
      careEl.classList.add('ucars-care-section');
      var careImgs = (Care.images && Care.images.length) ? Care.images : [];
      var careAlts = Care.imageAlts || [];
      var careCarousel = '';
      if (careImgs.length === 1) {
        careCarousel = '<figure class="care-poster"><img src="' + esc(careImgs[0]) + '" alt="' + esc(careAlts[0] || Care.title) + '" loading="lazy" decoding="async"></figure>';
      } else if (careImgs.length > 1) {
        careCarousel = '<div class="care-carousel gift-carousel scene-carousel" role="region" aria-label="养车服务图片，左右滑动" data-scene-carousel="care">' +
          '<div class="scene-track">' + careImgs.map(function (src, j) {
            return '<div class="scene-slide"><figure class="care-poster gift-poster"><img src="' + esc(src) + '" alt="' + esc(careAlts[j] || (Care.title + ' · 图' + (j + 1))) + '" loading="lazy" decoding="async"></figure></div>';
          }).join('') + '</div>' +
          '<div class="scene-dots" aria-hidden="true">' + careImgs.map(function (_, j) {
            return '<button type="button" class="scene-dot' + (j === 0 ? ' is-active' : '') + '" data-scene-dot="care-' + j + '" aria-label="第' + (j + 1) + '张"></button>';
          }).join('') + '</div></div>';
      }
      careEl.innerHTML = '<div class="wrap">' + head(Care) +
        careCarousel +
        (Care.footnote ? '<p class="note care-footnote">' + t(Care.footnote) + '</p>' : '') +
      '</div>';
      bindSceneCarousels(careEl);
    }
  }

  /* ---------- 4. 现场体验 ---------- */
  var E = C.experience;
  if ($('experience') && E) {
    $('experience').innerHTML = '<div class="wrap">' + head(E) +
      '<div class="exp">' + E.items.map(function (x) {
        return '<article class="card"><div class="card-ic">' + icon(x.icon) + '</div>' +
          '<h3>' + t(x.name) + '</h3>' +
          '<div class="chips">' + x.tags.map(function (g) { return '<span>' + t(g) + '</span>'; }).join('') + '</div>' +
          '<p>' + t(x.desc) + '</p></article>';
      }).join('') + '</div></div>';
  }

  /* ---------- 5. 参与方式 ---------- */
  var J = C.join;
  $('join').innerHTML = '<div class="wrap">' + head(J) +
    '<ol class="steps">' + J.steps.map(function (s, i) {
      return '<li><span class="step-n">' + (i + 1) + '</span><div><h3>' + t(s.title) + '</h3><p>' + t(s.desc) + '</p>' +
        '</div></li>';
    }).join('') + '</ol>' +
    (J.privacy ? '<p class="privacy">' + icon('lock') + '<span>' + t(J.privacy) + (J.privacyTbc ? tag('授权文案待确认') : '') + '</span></p>' : '') +
    '</div>';

  /* ---------- 打卡领好礼 ---------- */
  var G = C.gift;
  var giftSplit = (G.split && G.split.length)
    ? '<div class="split">' + G.split.map(function (s) {
        return '<div><b>' + t(s.name) + '</b><span>' + t(s.time) + '</span><em>' + t(s.qty) + '</em></div>';
      }).join('') + '</div>'
    : '';
  var giftImgs = (G.images && G.images.length) ? G.images : (G.image ? [G.image] : []);
  var giftAlts = G.imageAlts || [];
  var giftImg = '';
  if (giftImgs.length === 1) {
    giftImg = '<figure class="gift-poster"><img src="' + esc(giftImgs[0]) + '" alt="' + esc(giftAlts[0] || G.imageAlt || G.title) + '" loading="lazy" decoding="async"></figure>';
  } else if (giftImgs.length > 1) {
    giftImg = '<div class="gift-carousel scene-carousel" role="region" aria-label="打卡领好礼图片，左右滑动" data-scene-carousel="gift">' +
      '<div class="scene-track">' + giftImgs.map(function (src, j) {
        return '<div class="scene-slide"><figure class="gift-poster"><img src="' + esc(src) + '" alt="' + esc(giftAlts[j] || (G.title + ' · 图' + (j + 1))) + '" loading="lazy" decoding="async"></figure></div>';
      }).join('') + '</div>' +
      '<div class="scene-dots" aria-hidden="true">' + giftImgs.map(function (_, j) {
        return '<button type="button" class="scene-dot' + (j === 0 ? ' is-active' : '') + '" data-scene-dot="gift-' + j + '" aria-label="第' + (j + 1) + '张"></button>';
      }).join('') + '</div></div>';
  }
  $('gift').innerHTML = '<div class="wrap">' + head(G, G.tbc ? tag('待确认') : '') +
    '<div class="gift">' +
      giftImg +
      '<div class="gift-top">' + icon('gift', 'big') + '<p class="gift-lead">' + t(G.lead) + '</p></div>' +
      '<div class="status js-status" data-state="idle"><i></i><span>—</span></div>' +
      giftSplit +
      '<ul class="rules">' + G.rules.map(function (r) { return '<li>' + t(r) + '</li>'; }).join('') + '</ul>' +
    '</div></div>';
  bindSceneCarousels($('gift'));

  /* ---------- 抽奖（已删除） ---------- */
  var lotEl = $('lottery');
  if (lotEl) {
    if (!C.lottery || C.lottery.enabled === false) {
      lotEl.hidden = true;
      lotEl.innerHTML = '';
    }
  }

  /* ---------- 购车礼遇 + 试驾承接门店 ---------- */
  var B = C.benefits, bEl = $('benefits');
  if (bEl) {
    if (!B || !B.enabled) { bEl.hidden = true; }
    else {
      var storesHtml = '';
      if (B.stores && B.stores.length) {
        storesHtml = '<div class="stores-box"><h3>' + t(B.storesTitle || '试驾承接门店') + '</h3><ul class="stores-list">' +
          B.stores.map(function (s) {
            return '<li><b>' + t(s.name) + '</b><a href="tel:' + esc(s.phone) + '">电话：' + esc(s.phone) + '</a></li>';
          }).join('') + '</ul></div>';
      }
      var brandLabel = B.brandText || '鸿蒙智行授权用户中心';
      bEl.innerHTML = '<div class="wrap"><article class="exclusive-benefit">' +
        '<div class="exclusive-brand"><div class="exclusive-logos exclusive-brand-text"><span class="exclusive-brand-text">' + t(brandLabel) + '</span></div><span class="exclusive-kicker">' + t(B.kicker) + '</span></div>' +
        (B.pending ? '<p class="exclusive-pending">' + t(B.pending) + '</p>' : '') +
        '<h2>' + t(B.title) + '</h2><p class="exclusive-lead">' + t(B.lead) + '</p>' +
        storesHtml +
        '<ul class="exclusive-categories">' + B.categories.map(function (x) { return '<li>' + t(x) + '</li>'; }).join('') + '</ul>' +
        '<p class="exclusive-note">' + t(B.note) + '</p>' +
      '</article></div>';
    }
  }

  /* ---------- 导览 ---------- */
  var M = C.map;
  var mapEl = $('map');
  if (mapEl && (!M || M.enabled === false)) {
    mapEl.hidden = true;
  } else if (M) {
    if (mapEl) mapEl.hidden = false;
    if ($('map-head')) $('map-head').innerHTML = head(M, tag(M.note));
    if ($('map-foot')) {
      $('map-foot').innerHTML =
        '<ol class="route">' + M.route.map(function (r) { return '<li>' + t(r) + '</li>'; }).join('') + '</ol>' +
        '<p class="open-note">' + t(M.openNote) + '</p>';
    }
    // 若 config 提供 map.image，替换 SVG
    var mapFig = document.querySelector('#map .map-fig');
    if (mapFig && M.image) {
      mapFig.innerHTML = '<img class="map-photo" src="' + esc(M.image) + '" alt="' + esc(M.imageAlt || M.title) + '" loading="lazy" decoding="async">';
    }
  }

  /* ---------- 温馨提示 ---------- */
  var T = C.tips;
  $('tips').innerHTML = '<div class="wrap">' + head(T) +
    '<ul class="tips">' + T.items.map(function (x) { return '<li>' + t(x) + '</li>'; }).join('') + '</ul></div>';

  /* ---------- 页脚（仅 UCARS） ---------- */
  var F = C.footer;
  $('footer').innerHTML = '<div class="wrap"><p class="f-brand f-brand-ucars"><img src="' + esc(F.logo || C.hero.logo) + '" alt="UCARS" width="438" height="156"><span class="f-brand-text">' + t(F.brand) + '</span></p>' +
    F.lines.map(function (l) { return '<p>' + t(l) + '</p>'; }).join('') + '</div>';

  /* ---------- 车型弹窗 ---------- */
  var vehicleDialog = $('vehicle-dialog'), vehicleContent = $('vehicle-dialog-content');
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-vehicle-index]') : null;
    if (trigger) {
      var item = C.scenes.items[Number(trigger.getAttribute('data-vehicle-index'))];
      if (!item || !vehicleDialog || !vehicleContent) return;
      vehicleContent.innerHTML = '<p class="vehicle-dialog-kicker">' + t(item.name) + ' · 车型亮点</p>' +
        '<h2 id="vehicle-dialog-title">' + t(item.cars) + '</h2>' +
        '<div class="vehicle-model-list">' + item.models.map(function (m) {
          return '<article class="vehicle-model"><p class="vehicle-model-name">' + t(m.name) + '</p>' +
            '<p class="vehicle-model-scene">' + t(m.scene) + '</p>' +
            '<ul>' + m.highlights.map(function (h) { return '<li>' + t(h) + '</li>'; }).join('') + '</ul></article>';
        }).join('') + '</div>' + (item.modelNote ? '<p class="vehicle-model-note">' + t(item.modelNote) + '</p>' : '');
      vehicleDialog.showModal();
      return;
    }
    if (e.target.closest && e.target.closest('[data-close-vehicle]') && vehicleDialog) vehicleDialog.close();
    if (e.target === vehicleDialog) vehicleDialog.close();
  });

  /* ---------- 占位链接 ---------- */
  var toastEl = $('toast'), toastTimer;
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-placeholder]') : null;
    if (!a) return;
    e.preventDefault();
    toastEl.textContent = C.placeholderToast;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  });

  /* ---------- 打卡状态（北京时间；无午间/下午场） ---------- */
  function bjNow() {
    var d = new Date(), m = /[?&]now=([^&]+)/.exec(location.search);
    if (m) {
      var x = new Date(decodeURIComponent(m[1]).replace(' ', 'T') + ':00+08:00');
      if (!isNaN(x)) d = x;
    }
    var b = new Date(d.getTime() + 8 * 3600 * 1000);
    return { date: b.toISOString().slice(0, 10), min: b.getUTCHours() * 60 + b.getUTCMinutes() };
  }
  function toMin(hm) { var p = String(hm || '12:00').split(':'); return +p[0] * 60 + (+p[1] || 0); }
  function computeStatus() {
    var n = bjNow(), ev = C.event, st = C.status;
    var checkStart = toMin(ev.checkInStart || '12:00');
    if (n.date < ev.startDate) return { state: 'before', text: st.before };
    if (n.date > ev.endDate) return { state: 'over', text: st.allOver };
    // 优先：旧 sessions（若仍配置）
    if (ev.sessions && ev.sessions.length) {
      var i, s;
      for (i = 0; i < ev.sessions.length; i++) {
        s = ev.sessions[i];
        if (n.min < toMin(s.start)) return { state: 'soon', text: st.upcoming.replace('{name}', s.name).replace('{start}', s.start) };
        if (n.min < toMin(s.end)) return { state: 'live', text: st.live.replace('{name}', s.name) };
      }
      if (n.date === ev.endDate) return { state: 'over', text: st.allOver };
      return { state: 'done', text: st.dayOver + ' · ' + st.dayOverTip };
    }
    // 打卡领好礼：每日 checkInStart 起视为 live，直到当日结束（无明确结束时刻）
    if (n.min < checkStart) return { state: 'soon', text: st.upcoming };
    // 晚间 21:00 后提示明日（活动末日则结束）
    if (n.min >= 21 * 60) {
      if (n.date === ev.endDate) return { state: 'over', text: st.allOver };
      return { state: 'done', text: st.dayOver + ' · ' + st.dayOverTip };
    }
    return { state: 'live', text: st.live };
  }
  function paint() {
    var r = computeStatus(), els = document.querySelectorAll('.js-status');
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute('data-state', r.state);
      els[i].lastChild.textContent = r.text;
    }
  }
  paint();
  setInterval(paint, 30000);
})();
