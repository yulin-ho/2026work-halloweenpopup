# 前海鸿蒙 × UCARS · 秋日车生活 · 活动落地页

前海人寿金融中心秋日车生活嘉年华 — 扫码进入的移动端静态落地页（简体中文）。

> **接手修改或部署前，请先读 [`HANDOFF.md`](HANDOFF.md)**：项目背景、硬性约束、合规红线、待确认清单、本地自测、Cloudflare 部署与上线检查都在里面。编码代理的规则见 [`AGENTS.md`](AGENTS.md)。

- **线上地址**：https://popup.abigaillab.com （Cloudflare Worker：`hima-ucars-popup`）
- **活动日期**：2026-10-27（周二）— 2026-11-01（周日）· 前海人寿金融中心前广场
- **玩法要点**：打卡领好礼每日 12:00 开始（先到先得）；页面含「周末去哪儿」与「养车选 UCARS」；**抽奖板块已下线**（`lottery.enabled: false`）
- 纯静态：HTML + CSS + 少量原生 JS，无框架、无 CDN、无外部字体、无统计追踪、无表单
- 所有资源同源加载（适合中国大陆弱网）；不收集任何个人信息；会员注册/试驾登记仅跳转品牌入口（未就绪时可为 `#` 占位）

## 目录结构

```
site/
├── wrangler.jsonc        Cloudflare Workers 部署配置（只上传 ./public；已绑 popup.abigaillab.com）
├── .gitignore
├── HANDOFF.md            ★ 交接说明（先读）
├── AGENTS.md             编码代理规则
├── README.md
├── deploy-direct-upload.mjs   可选：直传部署辅助脚本
└── public/               ★ 网站根目录（唯一对外发布的目录）
    ├── index.html        页面骨架（各 section 空壳；导览图已改用 site-guide 图）
    ├── _headers          Cloudflare 响应头（缓存 / 安全头）
    ├── .assetsignore
    └── assets/
        ├── config.js     ★ 全部文案配置（日常只改这个）
        ├── app.js        渲染逻辑 + 打卡状态 + 占位链接提示
        ├── style.css     样式（颜色变量在 :root）
        └── img/          hero、场景/车型、周末海报、养车轮播、打卡礼、导览图等
```

主要板块（与 `config.js` / `index.html` 对应）：

| 区块 | id | 说明 |
|---|---|---|
| 首屏 | `hero` | 口号、日期、地点、打卡时间 |
| 专属购车权益 | `benefits` | 楼宇专属礼遇 + 试驾承接门店 |
| 四大场景 | `scenes` | 6 台展车 / 4 场景 |
| 周末去哪儿 | `interaction` | 目的地灵感 + 装备海报（旧抽卡三步文案已下线） |
| 养车选 UCARS | `care` | 五图左右滑动轮播 |
| 现场体验 | `experience` | 鸿蒙生态 / 座舱 / 打卡 |
| 参与方式 | `join` | 逛场节奏说明 |
| 打卡领好礼 | `gift` | 每日 12:00 起 |
| 抽奖 | `lottery` | **已隐藏** |
| 现场导览 SVG | `map` | **已隐藏**（现用首屏附近导览图） |
| 温馨提示 | `tips` | |

## 如何修改内容

1. 打开 `public/assets/config.js`，按注释找到对应板块（`event` / `hero` / `scenes` / `interaction` / `care` / `experience` / `join` / `gift` / `benefits` / `tips` / `footer` 等），直接改引号里的文字。
2. **活动时间**：改 `event.startDate` / `event.endDate`（以及 `hero.facts` 等展示文案）。打卡状态按北京时间计算；调试可用 `/?now=2026-10-28T12:30`。
3. **待确认标签**：文案中写 `【待确认】` 会显示为虚线小标签；写 `【任意文字】` 会显示为该文字的标签。确认后删掉即可。
4. **周末去哪儿 / 养车选 UCARS**：分别改 `interaction`、`care`；换图时保持 `assets/img/` 下文件名或同步改路径。
5. **抽奖**：保持 `lottery.enabled: false`；勿在导航或参与路径里重新强调抽奖。
6. **购车礼遇**：`benefits.enabled: false` 可整体隐藏。
7. **页面标题 / 微信分享描述**：`public/index.html` 顶部的 `<title>` 与 `<meta name="description">`。
8. **替换图片**：覆盖同名文件即可；尽量压缩（宽度与体积按弱网友好控制）。

本地预览：

```bash
cd site/public && python3 -m http.server 8000     # http://localhost:8000
# 或（更接近线上，需要 Node.js ≥ 22）：
cd site && npx wrangler@latest dev                 # http://localhost:8787
```

## 部署

**线上已运行**：Worker `hima-ucars-popup` → https://popup.abigaillab.com  
完整步骤、凭据规则、大陆访问注意事项和香港备用服务器方案见 **HANDOFF.md §8–§11**。日常更新：

```bash
cd site
npx wrangler@latest whoami
npx wrangler@latest deploy --dry-run
npx wrangler@latest deploy
```

- 二维码**只能**指向自有域名 `https://popup.abigaillab.com/`，不要用 `*.workers.dev`（中国大陆被屏蔽，配置里已关闭）。
- 大陆三网与微信真机访问请持续抽测；效果不好可按 HANDOFF §10 切到腾讯云香港服务器，只改 DNS，二维码不变。
- 腾讯云 COS 方案已取消；GitHub Pages 暂停。公开源码仓库：`yulin-ho/2026work-halloweenpopup`（以 GitHub 实际仓库为准）。

## 上线 / 改版检查

见 HANDOFF.md §11（线上流程、真机、拨测、无密钥、咨询入口、实测、二维码实扫）。
