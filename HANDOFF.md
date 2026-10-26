# 交接说明 HANDOFF · 鸿蒙智行 × UCARS 城市生活体验站活动页

> 本文件写给后续接手修改本页面的 Codex（以及 Abigail 本人）。动手前请完整读一遍，尤其是「3. 硬性约束」和「4. 合规红线」。
> 交接时间：2026-10-10（北京时间）；文档日期与线上状态于 2026-10-26 核对。
> **当前状态**：已上线 https://popup.abigaillab.com （Worker：`hima-ucars-popup`）。活动日期 **2026-10-27 — 2026-11-01**（前海鸿蒙×UCARS / 秋日车生活）。页面含「周末去哪儿」「养车选 UCARS」；抽奖板块已下线。
> **部署方案**：Cloudflare Workers（静态资源）+ 自有域名 `popup.abigaillab.com`（zone：abigaillab.com）。腾讯云 COS 方案已取消，GitHub Pages 暂停。若大陆拨测效果差，备用方案是腾讯云**香港**轻量应用服务器（锐驰型，约 40 元/月，Nginx + Let's Encrypt）。**二维码永远只指向自有域名**，切换后端只需改 DNS，不用重印。

---

## 1. 项目背景

| 项 | 内容 |
|---|---|
| 活动 | 前海鸿蒙 × UCARS · 前海人寿金融中心秋日车生活嘉年华 |
| 主题语 | 「下楼，去生活」/「下楼逛逛，把好礼和生活体验带回去」 |
| 地点 | 前海人寿金融中心前广场（T1、T2 栋之间） |
| 日期 | 2026-10-27（周二）～ 2026-11-01（周日） |
| 场次 | 已取消午间/晚间分场；**打卡领好礼每日 12:00 开始**（先到先得，余量以现场为准） |
| 形式 | 6 台静态展车 + 4 个生活场景 + 鸿蒙生态/座舱体验 +「周末去哪儿」+「养车选 UCARS」+ 现场打卡领好礼（**抽奖已下线**） |
| 受众 | 楼内业主、员工及到访人群：在楼宇海报或现场桌牌上扫二维码，用手机打开（多数在微信内） |
| 页面定位 | 只做活动信息展示和入口导流，不收集任何数据 |

**信息优先级（有冲突时按此顺序）：**
1. 《城市生活体验站方案 PDF》（正式沟通版）：场景、车型、购车礼遇、奖品等具体内容以它为准；
2. 《执行方案_修订版.docx》：时段、板栗礼份数、动线、人员、物业约束等执行细节；
3. 案头研究（`docs/research.md`，在交接包中）：合规风险提示，不作为事实来源。

已知冲突（历史）：场景 02 车型 PDF 曾写「问界车型」、Word 写「享界 V8」。**当前页面已按「智界 V9、享界 V8」展示**。

---

## 2. 文件结构

```
site/                       ← 项目根（wrangler 在这里运行）
├── wrangler.jsonc          Cloudflare Workers 部署配置（只上传 ./public）
├── .gitignore              忽略密钥 / .env / .wrangler / node_modules / 截图 / zip
├── HANDOFF.md              本文件（不部署）
├── AGENTS.md               给编码代理的硬规则，Codex 会自动读取（不部署）
├── README.md               结构与部署简介（不部署）
└── public/                 ★ 唯一对外发布的目录（网站根目录）
    ├── index.html          页面骨架：各 <section> 空壳 + 现场导览 SVG（地图文字直接写在这里）
    ├── _headers            Cloudflare 响应头规则（缓存、安全头）；本文件本身不会被对外提供
    ├── .assetsignore       部署时忽略的文件（.DS_Store、*.md 等），格式同 .gitignore
    └── assets/
        ├── config.js       ★ 全部对外文案（window.SITE_CONFIG），日常只改这个
        ├── app.js          渲染逻辑：把 config 渲染进各 section、场次状态、占位链接 toast
        ├── style.css       样式；颜色变量在顶部 :root（--amber/--rust/--blue/--green/--violet/--orange）
        └── img/            hero / 场景与车型 / weekend-gear-poster / ucars-care 轮播 / 打卡礼 / site-guide 等
```

交接包（zip）中另有 `docs/research.md`（合规研究）和 `docs/hosting.md`（托管方案核查），仅供参考，**不要放进 `public/`**。

> 下文提到的 `index.html`、`assets/...`、`config.js` 都指 `site/public/` 里的文件。页面内全部使用相对路径，`public/` 目录直接用任何静态服务器打开即可。

**关键机制：**

- **文案位置**：`assets/config.js` 中的 `SITE_CONFIG`，按区块分为 `event / status / hero / atmosphere / nav / scenes / interaction / care / experience / join / gift / lottery / benefits / map / tips / footer / placeholderToast`（`lottery`、`map` 当前 `enabled: false`）。`index.html` 里只有骨架，`<title>` 与 `<meta name="description">`（微信分享读取）需在 `index.html` 里改。
- **【待确认】标签**：任何文案字符串中写 `【待确认】`，会渲染为虚线小标签 `<span class="tbc">待确认</span>`；写 `【任意文字】` 会以该文字为标签。另外有几个布尔开关会追加标签：`hero.eventNameTbc`、`join.entries[].tbc`（配合 `tbcText`）、`join.privacyTbc`、`gift.tbc`。内容确认后删除标记或把开关改为 `false`。
- **转义**：`app.js` 的 `t()` 会转义所有文案，config 中不能写 HTML。如需新格式，扩展 `t()`，不要改成 `innerHTML` 直接拼接未转义的内容。
- **购车礼遇开关**：`benefits.enabled`。设为 `false` 后整个 section 加 `hidden`，导航中的「购车礼遇」也会消失。要彻底删除，可删掉 `index.html` 中 `BEGIN 购车礼遇` 与 `END 购车礼遇` 注释之间的代码（该 section 带 `data-removable="true"` 和 `data-status="pending-brand-approval"`）。默认是折叠状态（`<details>`），上方有常驻横幅「内容待鸿蒙智行确认后发布」。
- **打卡/活动状态**：`app.js` 中的 `computeStatus()` 按北京时间（UTC+8，与访客手机时区无关）计算，数据来自 `event.startDate/endDate`（`sessions` 已为空）与 `checkInStart`，文案来自 `status`。用于提示「将开始 / 今日 12:00 起打卡 / 进行中 / 今日已结束 / 全部结束」。每 30 秒刷新一次。**不显示实时库存**（没有后端），只写「余量以现场公示为准」。
- **时间模拟参数**：在网址后加 `?now=YYYY-MM-DDTHH:MM`（按北京时间理解），例如 `http://localhost:8000/?now=2026-10-28T12:30`。
- **图片懒加载**：场景图使用 `loading="lazy"`，放在 `<details>` 里，卡片展开时才加载（默认只展开 01）。首屏图 `hero-plaza.jpg` 在 `<head>` 中 `preload`，作为 CSS 背景显示。
- **占位链接**：`href: '#'` 的按钮带 `data-placeholder`，点击后不跳转，弹出 toast（`placeholderToast`）。
- **咨询入口**：`footer.help` 显示在页脚醒目位置（「现场咨询：登记/领礼点工作人员」+ 待确认的联系方式），删掉该字段即不显示。
- **无 JS 兜底**：`index.html` 中的 `<noscript>` 只显示主题、日期、地点和场次。

---

## 3. 硬性约束（必须保持）

1. **纯静态**：HTML + CSS + 原生 JS。不引入框架（React/Vue 等）、打包器或构建步骤；确有必要，须先与 Abigail 确认。
2. **零外部依赖**：不引用任何外部 CDN、Google Fonts / 外部字体、统计或追踪脚本（百度统计、GA、像素等）、外部图标库。所有资源同源，原因是大陆弱网环境，并且 Google、GitHub 系资源可能无法加载。字体只用系统字体栈（见 `style.css` 的 `--font`）。
3. **页面体积 ≤ 1 MB**（当前约 206 KB，其中图片约 162 KB）。新增图片要压缩：宽度 ≤ 800px，JPEG 质量 60–70，单张最好 ≤ 80 KB。
4. **不收集数据**：页面上不放表单、不放输入框、不调用接口、不写 cookie/localStorage。会员注册和试驾登记只做外链，分别跳转到「UCARS 有赞小程序」和「品牌试驾入口」（链接由品牌/UCARS 提供）。
5. **移动优先**：以 390px 宽为基准，任何区块都不能出现横向滚动或溢出（`document.documentElement.scrollWidth` 必须等于视口宽度）。导航条在自身容器内横向滚动，这是允许的。
6. **可编辑性**：新增文案一律放进 `config.js`，不要硬编码在 `app.js` 里。
7. **只发布 `public/`**：对外文件只能放在 `public/`。交接文档、研究资料、密钥、截图一律不放进去。
8. **不提交、不上传任何密钥**：API Token、SSH 私钥、`.env`、certbot 的 Cloudflare 凭据文件都不能进仓库、zip 或 `public/`（见 §9 和 `.gitignore`）。
9. **二维码只指向自有域名**（线上为 `https://popup.abigaillab.com/`），绝不用 `*.workers.dev` 或任何平台默认域名。

---

## 4. 合规红线（依据 `docs/research.md`，不构成法律意见，最终以鸿蒙智行法务审定为准）

| # | 红线 | 一句话原因 |
|---|---|---|
| 1 | 不把「至高80000元」作为标题或大字展示（当前页面已完全不出现） | 金额须能由具体车型和条件实际叠加达到，PDF 中各项分属不同车型，有引人误解的风险（《广告法》第二十八条，《汽车行业价格行为合规指南》第十九条）。 |
| 2 | 「专属」慎用，除非品牌书面确认是本楼宇独有的权益 | 如果和全国公开政策相同，「专属」可能被认定为引人误解的宣传。 |
| 3 | 「100%中奖」只能在完整公示奖项名称、价值、数量或概率之后使用 | 「人人有奖」仍属于抽奖式有奖销售，信息不明确或不真实违反《反不正当竞争法》第十一条，有被处罚的先例。 |
| 4 | 抽奖最高奖 ≤ 50,000 元（含尾款减免等折算价），抽奖前公示奖品清单和数量 | 《反不正当竞争法》第十一条（四）及《规范促销行为暂行规定》第十七条设有上限，并要求信息明确。 |
| 5 | 礼品和抽奖不能以留手机号为前提，必须保留「不留手机号也能参与」路径（`join.noPhone`） | 《个人信息保护法》第十六条不允许以不同意处理个人信息为由拒绝提供产品或服务，执行方案也已明确不得设隐性强制条件。 |
| 6 | 个人信息从 UCARS（有赞）流转给鸿蒙智行时，需要单独的告知和同意文案 | 《个人信息保护法》第二十三条：向其他处理者提供个人信息，须告知接收方，并取得个人的单独同意。 |
| 7 | 不做「分享/转发/集赞领奖」或「分享增加抽奖机会」 | 《微信外部链接内容管理规范》明确禁止利诱分享和集赞。 |
| 8 | 不使用「应用上车」，改用「超级桌面」「一碰流转」「小艺语音」 | 「应用上车」不是官方功能名，可能误导，研究建议换成官方用词；只写现场实际能演示的功能。 |
| 9 | 避免「最终解释权」「最高解释权」之类的表述 | 小红书企业号抽奖规范明确禁止，同时可能被认定为免除自身责任的格式条款。 |
| 10 | 不使用「最」「第一」「销冠」等无法验证的用语，不写「华为汽车」 | 《广告法》第九条（三）、第二十八条；研究同时建议物料不出现「华为汽车」。 |

---

## 5. 待确认清单（页面上带「待确认」标签的 12 项）

| # | 内容 | 位置 | 确认方 |
|---|---|---|---|
| 1 | 活动名称（现为「前海人寿金融中心秋日车生活嘉年华」，`eventNameTbc: false`） | `config.js` → `hero.eventName` | 已基本定稿；若品牌再改名需同步 |
| 2 | 场景 02 车型（页面已用「智界 V9、享界 V8」；展车台数以现场为准） | `config.js` → `scenes.items[1].cars` | 鸿蒙智行 / 现场 |
| 3 | 鸿蒙生态实际演示的功能（超级桌面需要鸿蒙手机）、设备和账号 | `config.js` → `experience.items[0]` | 鸿蒙智行 |
| 4 | 秋日穿搭角的内容（杂志、灵感卡、图片），以及公开展示授权 | `config.js` → `experience.items[2]` | 鸿蒙智行 / UCARS |
| 5 | 不留手机号的参与路径（现场集章 / 工作人员协助） | `config.js` → `join.noPhone` | 鸿蒙智行 + UCARS |
| 6 | 两个入口链接：UCARS 会员注册（有赞小程序）、登记试驾意向 | `config.js` → `join.entries[0]`（UCARS）、`join.entries[1]`（鸿蒙智行），改 `href`，并把 `tbc` 设为 `false` | UCARS / 鸿蒙智行 |
| 7 | 个人信息授权文案和用途说明 | `config.js` → `join.privacy`、`join.privacyTbc` | 鸿蒙智行 + UCARS |
| 8 | ~~板栗礼~~ 已取消；现为「打卡领好礼」每日 12:00 起（礼品以现场公示为准） | `config.js` → `gift`（`gift.tbc: false`） | 现场执行 |
| 9 | 购车礼遇整块内容（4 组权益原文） | `config.js` → `benefits`（`enabled`、`groups`、`disclaimer`） | 鸿蒙智行（书面细则） |
| 10 | 现场导览（旧 SVG map 已隐藏；现用 `site-guide` 导览图） | `assets/img/site-guide.png`；`map.enabled: false` | 物业 / 现场 |
| 11 | 图片使用授权（首屏实景、四场景车图，均取自方案 PDF） | `assets/img/*`；`config.js` → `hero.image`、`scenes.items[].image` | 鸿蒙智行 / UCARS（Abigail 确认） |
| 12 | 页脚咨询入口的联系方式（现场咨询点电话或工作人员联系方式） | `config.js` → `footer.help`（把 `【待确认：联系方式】` 换成实际内容） | UCARS / 鸿蒙智行（Abigail 汇总） |

另外：抽奖板块已下线（`lottery.enabled: false`）。若以后重新开启，须按红线 #3、#4 完整公示奖项名称、价值、数量或概率。

---

## 6. 待办 / 已知问题

- [ ] **页脚措辞**：`footer.lines[0]` 现为「活动最终解释及细则以品牌发布为准」，与红线 #9 接近。建议改为「活动细则以品牌发布为准」，由 Abigail 决定。
- [ ] **小程序口径统一**：页面写的是「UCARS 有赞小程序」（PDF 口径），执行方案写的是「鸿蒙智行指定小程序」。需要和品牌确认用哪个、还是两个都用，再同步修改 `join.steps[1]` 和 `join.entries`。
- [x] **域名**：已上线 `https://popup.abigaillab.com`（Worker `hima-ucars-popup`，见 §8）。
- [ ] **大陆拨测和真机测试**：线上已可用；活动前/期间继续按 §10 做三网与微信真机抽测，效果差再启用香港备用服务器。
- [x] **二维码**：指向 `https://popup.abigaillab.com/`；打样稿请实际扫码复核。
- [ ] **图片授权**：见待确认 #11。若无法授权，替换为品牌提供的图片，或改成纯色/图形方案。
- [ ] **额外添加的提示**（不在原需求里，可删）：温馨提示与页脚声明等；以当前 `gift.rules` / `tips.items` / `footer.lines` 为准。
- [ ] **视觉调整**：Abigail 计划进一步修改视觉，具体需求见下方。

### 本轮修改需求（Abigail 填写）

> 在这里写下本轮要改的内容，Codex 按此执行：
>
> 1.
> 2.
> 3.

---

## 7. 本地预览与自测

**方式 A：Python（最简单）**

```bash
cd site/public
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

**方式 B：wrangler dev（最接近线上，会应用 `_headers` 和 `.assetsignore`）**，需要 Node.js ≥ 22：

```bash
cd site
npx wrangler@latest dev        # 打开 http://localhost:8787/
```

**390×844 检查**：在 Chrome DevTools 中打开设备模拟（Ctrl/Cmd+Shift+M），尺寸设为 390×844，从上滑到底；展开所有场景卡片和「查看礼遇说明」再看一遍。可在 Console 里运行：

```js
document.documentElement.scrollWidth === innerWidth   // 必须为 true（无横向溢出）
```

如果装了 Playwright，也可以用 headless Chromium 截图：viewport 390×844，`device_scale_factor=2`，`is_mobile=True`，截整页图。

**场次状态测试用例**（打开对应网址，看首屏和「秋日好礼」里的状态胶囊）：

| `?now=` | 期望（以 `config.js` → `status` 文案为准） |
|---|---|
| `2026-10-20T13:47` | 活动将于10月27日开始 |
| `2026-10-27T09:00` | 今日 12:00 起打卡领好礼 |
| `2026-10-27T12:30` | 打卡领好礼进行中 |
| `2026-10-28T20:00` | 今日打卡领好礼已结束（提示明天 12:00） |
| `2026-11-01T12:30` | 打卡领好礼进行中（末日） |
| `2026-11-01T20:00` | 本次活动已圆满结束，感谢参与 |
| `2026-11-02T10:00` | 本次活动已圆满结束，感谢参与 |

**体积、外部依赖与密钥检查**（在 `site/` 下运行）：

```bash
du -cb public/index.html public/assets/*.js public/assets/*.css public/assets/img/* | tail -1   # 需 ≤ 1048576
# macOS 没有 du -b，可改用：find public -type f -not -name '_headers' -not -name '.assetsignore' -exec stat -f%z {} + | paste -sd+ - | bc
grep -rnE "https?://" public/index.html public/assets/ || echo "OK: 无外部引用"
grep -rn "应用上车\|80000\|最终解释权" public/ || echo "OK: 无禁用词"
grep -rniE "api[_-]?token|BEGIN (OPENSSH|RSA) PRIVATE|CLOUDFLARE_API" . --exclude=HANDOFF.md --exclude=AGENTS.md --exclude=README.md || echo "OK: 未发现密钥"
npx wrangler@latest deploy --dry-run    # 校验 wrangler.jsonc，不会真正上传
```

---

## 8. 部署到 Cloudflare Workers（主方案）

> 以下内容依据 Cloudflare 官方文档整理（2026-10-10 查阅，链接见本节末尾）。本项目已用 wrangler 在本地验证过 `wrangler deploy --dry-run` 和 `wrangler dev`，并已部署到线上：https://popup.abigaillab.com （Worker `hima-ucars-popup`）。`/_headers`、`/.assetsignore`、`*.md` 均不对外提供；`_headers` 中的缓存头和安全头生效。

**为什么用 Workers 而不是 Pages**：Cloudflare Pages 文档首页现在写的是 Workers「is Cloudflare's primary platform for building applications. Start new projects with Workers.」，静态资源请求在 Workers 上同样免费。Pages 仍然可用，但新项目按官方建议走 Workers。本项目是纯静态，用 **assets-only Worker**，不需要 Worker 脚本（`wrangler.jsonc` 里没有 `main`）。

**前置条件**
- Node.js **≥ 22**（当前版本的 wrangler 要求，旧版 Node 会直接报错）。wrangler 用 `npx wrangler@latest ...` 临时运行即可，不必加进项目依赖。
- 一个 Cloudflare 账号（邮箱已验证）。

**步骤**

1. **买域名**：Cloudflare 控制台 → Domain Registration → Register Domains。Registrar 购买的域名会**自动使用 Cloudflare 的 nameserver**，zone 直接是 Active 状态，不需要另外改 NS。注意：需要按 ICANN 要求验证注册邮箱，否则域名会被暂停解析。境外注册商的域名不需要中国大陆实名或 ICP 备案（这是本方案的前提；**本页面不做大陆 ICP 备案**，所以不能用大陆节点，见 §10）。
2. **登录**：`npx wrangler@latest login`（见 §9），然后用 `npx wrangler@latest whoami` 确认账号无误。
3. **检查 `wrangler.jsonc`**（已在 `site/` 中准备好）：
   - `name: "hima-ucars-popup"`；`compatibility_date` 填部署当天的日期即可。
   - `assets.directory: "./public"`：**只有 `public/` 会被上传**。HANDOFF/AGENTS/README/docs 都不在里面。
   - `workers_dev: false`、`preview_urls: false`：关闭 `*.workers.dev` 和预览链接，防止有人误用这些地址做二维码。
   - `routes` 已配置为 `{ "pattern": "popup.abigaillab.com", "custom_domain": true }`（见 `wrangler.jsonc`）。
4. **先 dry-run，再部署**：
   ```bash
   cd site
   npx wrangler@latest deploy --dry-run
   npx wrangler@latest deploy
   ```
   部署时 wrangler 会创建 Custom Domain：Cloudflare 自动添加 DNS 记录，并**自动签发 HTTPS 证书**，不需要手动配置证书。如果该主机名已经有 CNAME 记录，会创建失败，需要先删掉那条记录。也可以在控制台操作：Workers & Pages → 选择 Worker → Settings → Domains & Routes → Add → Custom Domain。
5. **验证**：`curl -I https://popup.abigaillab.com/` 应返回 200，并带有 `x-content-type-options: nosniff`；图片返回 `Cache-Control: public, max-age=86400`。用手机打开一次。
6. **缓存头**（`public/_headers`，已配置）：HTML/JS/CSS 保持 Cloudflare 默认的 `public, max-age=0, must-revalidate` + ETag，改文案重新部署后访客刷新即可看到新内容；图片缓存 1 天。最多 100 条规则。
7. **更新内容**：改 `public/` 里的文件 → 本地自测 → `npx wrangler@latest deploy`。不需要手动刷新 CDN。如需回滚，在控制台的 Deployments 里选择之前的版本（**需对照官方文档确认具体入口**）。
8. **不要用** `wrangler deploy --temporary`：它会部署到一个临时账号。也**不要用** `wrangler pages deploy`。

**官方文档（已核对）**
- Workers 静态资源：https://developers.cloudflare.com/workers/static-assets/
- assets 配置 / `.assetsignore`：https://developers.cloudflare.com/workers/static-assets/binding/
- `_headers` 自定义响应头：https://developers.cloudflare.com/workers/static-assets/headers/
- Wrangler 配置（`workers_dev`、`preview_urls`、`routes`、assets-only 无需 `main`）：https://developers.cloudflare.com/workers/wrangler/configuration/
- Custom Domains（自动 DNS 与证书）：https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- Wrangler 命令（login / whoami / deploy --dry-run）：https://developers.cloudflare.com/workers/wrangler/commands/general/ 、https://developers.cloudflare.com/workers/wrangler/commands/workers/
- Pages → Workers 官方说明：https://developers.cloudflare.com/pages/ 、https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- Registrar 注册域名 / 必须使用 Cloudflare NS：https://developers.cloudflare.com/registrar/get-started/register-domain/ 、https://developers.cloudflare.com/registrar/faq/
- workers.dev 说明：https://developers.cloudflare.com/workers/configuration/routing/workers-dev/

---

## 9. 凭据与安全（给 Codex）

- **首选 `npx wrangler@latest login`**（浏览器 OAuth）：Codex 运行命令后，请 Abigail 在弹出的浏览器里登录 Cloudflare 并点「Allow」。如果浏览器无法自动打开，用 `--browser=false` 打印链接给她。可加 `--use-keyring`，把凭据存进系统钥匙串，而不是明文文件。用完可以 `npx wrangler@latest logout`。
- **备选：作用域受限的 API Token**：控制台 → Manage Account → Account API Tokens → Create Token → 选「Edit Cloudflare Workers」模板，**只授权这一个账号和这一个域名（zone）**，并设置过期时间。使用时只放进当前终端的环境变量：
  ```bash
  export CLOUDFLARE_API_TOKEN=...   # 只在当前会话设置，不写进任何文件
  export CLOUDFLARE_ACCOUNT_ID=...
  ```
- **Codex 必须遵守**：
  - 不要让 Abigail 把 Token、密码、验证码贴进聊天或写进文件；需要时让她自己在终端里 `export`。
  - 绝不把 Token 写进 `wrangler.jsonc`、`.env`、HANDOFF、提交记录或 zip。`.gitignore` 已忽略 `.env*`、`.dev.vars*`、`.wrangler/`、私钥、`cloudflare*.ini`。
  - 绝不使用 Global API Key。
  - 每次提交或打包前运行 §7 的密钥检查。
  - 香港服务器的 SSH 私钥**不在交接包里**，由 Abigail 单独保管，不要放进项目目录。

---

## 10. 中国大陆访问注意事项与香港备用方案

**必须知道的事实**
- Cloudflare 在中国大陆的节点（China Network，与京东云合作）**只对 Enterprise 客户开放，并且要求 ICP 备案**。免费套餐的大陆访客会走香港、新加坡等境外节点，速度和稳定性**没有保证**，晚高峰可能变慢。来源：https://developers.cloudflare.com/china-network/
- `*.workers.dev` 在中国大陆**被屏蔽**：GreatFire 2026-10-09 的测试显示全部被屏蔽，存在 DNS 污染和丢包；官方也建议生产环境使用自定义域名。**绝不能把 workers.dev 地址放进二维码**，配置里已关闭。来源：https://en.greatfire.org/domain/workers.dev 、https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
- 自有域名 + Cloudflare 在大陆能否稳定打开**无法事先保证，只能实测**（参见 `docs/hosting.md` 第 4.3 节）。

**大陆拨测与真机测试（活动前/期间持续）**
1. 拨测：用 itdog.cn（https://www.itdog.cn/ ）和 boce.com（https://www.boce.com/ ）对最终 HTTPS 网址做 **HTTP 测速**，覆盖电信、联通、移动三网，重点看广东/深圳节点。记录可用率、首字节时间和总耗时，在午间（12:00 左右）和晚间（18:00 左右）各测一次。工具的具体入口和指标名称以网站实际页面为准。
2. 真机：**Android 微信**和 **iOS 微信**各扫一次码，最好用不同运营商的 4G/5G，并关闭 Wi-Fi。确认没有出现「非微信官方网页」或下载提示，首屏 3 秒内显示。
3. 建议的切换标准（经验值，由 Abigail 决定）：深圳或广东三网中任意一网的可用率明显偏低，或总耗时经常超过 3–5 秒，就启用香港备用方案。

**香港备用方案（腾讯云轻量应用服务器·中国香港，锐驰型约 40 元/月）**

思路：同一套 `public/` 文件放到香港服务器的 Nginx 上，**只改 DNS** 把 `popup.abigaillab.com` 指过去，二维码不用变。

1. 购买服务器（Ubuntu/Debian），安装 `nginx` 和 `certbot`；把 `site/public/` 的内容上传到 `/var/www/hima-ucars-popup/`（`rsync`/`scp`，SSH 私钥由 Abigail 自己保管）。
2. Nginx 配置示例（`/etc/nginx/sites-available/hima-ucars-popup`，再软链到 `sites-enabled`）：
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name popup.abigaillab.com;
       root /var/www/hima-ucars-popup;
       index index.html;

       location / { try_files $uri $uri/ =404; }
       location ~ /\.(?!well-known) { deny all; }      # 不对外提供 .assetsignore 等隐藏文件
       location = /_headers { deny all; }               # Cloudflare 专用文件，Nginx 不需要
       location /assets/img/ { expires 1d; }
       location ~* \.(html|js|css)$ { add_header Cache-Control "no-cache"; }

       add_header X-Content-Type-Options nosniff always;
       gzip on;
       gzip_types text/css application/javascript image/svg+xml;
   }
   ```
3. HTTPS 证书（Let's Encrypt）：
   - **提前准备（推荐）**：在切换 DNS 之前，用 DNS-01 验证签发证书，不依赖域名当前指向哪里：安装 `python3-certbot-dns-cloudflare`，创建一个**只有该 zone `DNS:Edit` 权限**的 Cloudflare API Token，写进服务器上的 `/root/.secrets/cloudflare.ini`（`chmod 600`，绝不进仓库），然后运行 `certbot certonly --dns-cloudflare --dns-cloudflare-credentials /root/.secrets/cloudflare.ini -d popup.abigaillab.com`，再在 Nginx 里加上 443 配置。
   - **或者切换后再签**：DNS 指向服务器之后运行 `certbot --nginx -d popup.abigaillab.com`（HTTP-01 验证）。切换后的几分钟里 HTTPS 不可用。
   - certbot 插件名和参数**需对照 certbot 官方文档确认**：https://eff-certbot.readthedocs.io/
4. **切换 DNS**（Cloudflare 控制台）：
   1. Worker → Settings → Domains & Routes，删除该 Custom Domain（同时从 `wrangler.jsonc` 的 `routes` 中删除，避免下次 deploy 又加回来）；
   2. DNS → Records：为 `popup` 添加 **A 记录 → 香港服务器 IP**，**Proxy status 选 DNS only（灰云）**。如果选橙云，流量仍会经过 Cloudflare 的境外节点，失去切换的意义；TTL 设为较短的值。
   3. 用 `dig popup.abigaillab.com` 确认解析，然后重复 §10 的拨测和真机测试。DNS 缓存生效时间**无法精确保证**，预留至少 1 小时。
5. 切回 Cloudflare：删除 A 记录，重新添加 Custom Domain（或恢复 `routes` 后 `deploy`）。

> 依据：`docs/hosting.md` §4.4（价格页 2026-09-24：锐驰型 2核1G、200Mbps 峰值、不限流量，40 元/月；官方不承诺跨境质量）。

---

## 11. 上线前检查清单

- [ ] **线上核心流程可用**：在 **https://popup.abigaillab.com/** 上，从首屏到四场景、「周末去哪儿」「养车选 UCARS」、打卡领好礼、购车权益、页脚，逐一点一遍；`?now=` 用例也测几条。
- [ ] **真机移动端检查**：至少 1 台 Android 和 1 台 iPhone，在微信内和系统浏览器中打开；字体可读，无横向滚动，图片正常加载。
- [ ] **大陆拨测**：itdog / boce 三网对 `https://popup.abigaillab.com/` 测试通过（§10），结果已记录；活动期间可复测。
- [ ] **没有提交任何密钥**：运行 §7 的密钥检查；`git status` 里看不到 `.env`、`.wrangler/`、私钥；交接包和 `public/` 里也没有。
- [ ] **页面上有可见的咨询/求助入口**：页脚「现场咨询：登记/领礼点工作人员」+ 联系方式（待确认 #12 已填写）。
- [ ] **待确认标签已处理**：页面上剩下的每个「待确认」都已确认或删除；购车礼遇在没有书面细则时 `benefits.enabled: false`。
- [ ] **找 3 位真实用户走完全程**：从楼宇海报扫码 → 浏览页面 → 现场打卡领好礼 / 了解「周末去哪儿」与「养车选 UCARS」。记录卡住的地方并修正。
- [x] **二维码**：用 `https://popup.abigaillab.com/`（不带 `?now=`、不用 workers.dev）；**打样稿打印出来后请再实际扫码复核**（不同手机、不同距离和光线）。
- [ ] **切换预案就绪**：如需香港备用，服务器、证书和操作步骤都已提前准备好，知道谁在什么时间可以改 DNS。
