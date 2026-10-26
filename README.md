# 鸿蒙智行 × UCARS 城市生活体验站 · 活动落地页

前海人寿金融中心秋日生活嘉年华 — 扫码进入的移动端静态落地页（简体中文）。

> **接手修改或部署前，请先读 [`HANDOFF.md`](HANDOFF.md)**：项目背景、硬性约束、合规红线、待确认清单、本地自测、Cloudflare 部署与上线检查都在里面。编码代理的规则见 [`AGENTS.md`](AGENTS.md)。当前部署方案：Cloudflare Workers + 自有域名（备用：腾讯云香港服务器）。

- 纯静态：HTML + CSS + 少量原生 JS，无框架、无 CDN、无外部字体、无统计追踪、无表单
- 所有资源同源加载（适合中国大陆弱网），页面总重约 0.2 MB（约 206 KB）
- 不收集任何个人信息；会员注册/试驾登记仅跳转到品牌提供的入口（目前为 `#` 占位）

## 目录结构

```
site/
├── wrangler.jsonc        Cloudflare Workers 部署配置（只上传 ./public）
├── .gitignore            忽略密钥 / .env / .wrangler / node_modules / 截图 / zip
├── HANDOFF.md            ★ 交接说明（先读）
├── AGENTS.md             编码代理规则（Codex 自动读取）
├── README.md
└── public/               ★ 网站根目录（唯一对外发布的目录）
    ├── index.html        页面骨架 + 现场导览 SVG 示意图（地图文字直接在此修改）
    ├── _headers          Cloudflare 响应头（缓存 / 安全头），本身不会被对外提供
    ├── .assetsignore     部署时忽略的文件
    └── assets/
        ├── config.js     ★ 所有文案配置（日常只改这个文件）
        ├── app.js        渲染逻辑 + 场次状态 + 占位链接提示（一般不用改）
        ├── style.css     样式（颜色变量在文件顶部 :root）
        └── img/          hero-plaza.jpg（首屏实景）、scene-1~4.jpg（四场景图），均取自方案 PDF
```

## 如何修改内容

1. 打开 `public/assets/config.js`，按注释找到对应板块（hero / scenes / experience / join / gift / lottery / benefits / map / tips / footer），直接改引号里的文字。
2. **待确认标签**：在任意文字中写 `【待确认】` 会显示为虚线小标签；写 `【任意文字】` 会显示为该文字的标签。内容确认后删掉即可。
3. **正式入口**：`join.entries` 里把 `href: '#'` 换成品牌提供的链接，并把 `tbc` 改为 `false`。
4. **咨询入口**：`footer.help`，把 `【待确认：联系方式】` 换成现场咨询的联系方式。
5. **活动时间**：`event` 中的日期与场次会同时驱动「场次状态」提示（按北京时间计算）。调试时访问 `/?now=2026-10-19T12:30` 可模拟任意北京时间。
6. **购车礼遇**（待鸿蒙智行确认）：`benefits.enabled: false` 即可隐藏；要彻底删除，删掉 `public/index.html` 中 `BEGIN 购车礼遇` / `END 购车礼遇` 注释之间的代码。
7. **现场导览图**：`public/index.html` 中 `<svg class="map">` 内的 `<text>`；路线列表在 `config.js → map.route`。
8. **页面标题 / 微信分享描述**：`public/index.html` 顶部的 `<title>` 与 `<meta name="description">`。
9. **替换图片**：保持文件名覆盖即可；建议宽度 ≤ 800px、JPEG 质量 60–70、单张 ≤ 80 KB。

本地预览：

```bash
cd site/public && python3 -m http.server 8000     # http://localhost:8000
# 或（更接近线上，需要 Node.js ≥ 22）：
cd site && npx wrangler@latest dev                 # http://localhost:8787
```

## 部署

**主方案：Cloudflare Workers（静态资源）+ Cloudflare Registrar 购买的自有域名。** 完整步骤、凭据规则、大陆访问注意事项和香港备用服务器方案见 **HANDOFF.md §8–§11**。简要流程：

```bash
cd site
npx wrangler@latest login            # 浏览器授权；不要把任何 token 写进文件
# 编辑 wrangler.jsonc：取消 routes 注释，填入最终自定义域名
npx wrangler@latest deploy --dry-run
npx wrangler@latest deploy
```

- 二维码**只能**指向自有域名（如 `https://event.你的域名.com/`），不要用 `*.workers.dev`（中国大陆被屏蔽，配置里已关闭）。
- 10 月 15 日前完成大陆三网拨测和 Android / iOS 微信真机扫码；效果不好就按 HANDOFF §10 切换到腾讯云香港服务器，只改 DNS，二维码不变。
- 腾讯云 COS 方案已取消；GitHub Pages 暂停。

## 上线前检查清单

见 HANDOFF.md §11（线上流程、真机、拨测、无密钥、咨询入口、3 人实测、二维码打样实扫）。
