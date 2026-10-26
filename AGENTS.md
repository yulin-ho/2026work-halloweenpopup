# AGENTS.md — rules for coding agents / 编码代理规则

**Read `HANDOFF.md` first.** It is the full handoff (in Chinese): background, file map, placeholders, compliance, Cloudflare deployment, credentials, mainland-China caveats, launch checklist.
**先读 `HANDOFF.md`。** 本项目是「鸿蒙智行 × UCARS 城市生活体验站」活动的扫码落地页（2026-10-19～23，前海人寿金融中心前广场）。

## Layout / 结构
- `public/` is the ONLY deployed folder (website root). Copy lives in `public/assets/config.js`.
  只有 `public/` 会被部署；文案在 `public/assets/config.js`。
- `wrangler.jsonc` deploys `./public` as an assets-only Cloudflare Worker (no `main`). Docs, research and secrets never go into `public/`.

## Hard constraints / 硬性约束
1. Pure static HTML/CSS/vanilla JS. No frameworks, bundlers or build step unless Abigail agrees. 纯静态，不引入框架或构建。
2. No external requests: no CDNs, web fonts, analytics/trackers, external icons. All assets same-origin (mainland China networks). 不引用任何外部资源。
3. Total page weight ≤ 1 MB (now ~206 KB). Compress images (≤800px wide, JPEG q60–70). 页面体积不超过 1 MB。
4. No data collection: no forms/inputs/API calls/cookies/localStorage. Sign-up and test-drive entries are outbound links only. 不收集任何数据。
5. Mobile-first at 390×844; no horizontal overflow (`scrollWidth === innerWidth`). 移动优先，不允许横向溢出。
6. All user-facing copy in `config.js` (`SITE_CONFIG`), escaped by `t()` in `app.js`. Mark unconfirmed copy with `【待确认】`. 文案统一放在 config.js。

## Deployment & secrets / 部署与凭据（HANDOFF §8–§10）
- Deploy: `cd site && npx wrangler@latest deploy --dry-run && npx wrangler@latest deploy` (Node.js ≥ 22). Never `wrangler pages deploy`, never `--temporary`.
- Auth: `npx wrangler@latest login` (browser OAuth, Abigail clicks Allow), or a scoped "Edit Cloudflare Workers" API token set via `export` in the terminal only.
- NEVER write tokens, passwords, SSH keys or `.env` into any file, commit, zip or `public/`. Never ask Abigail to paste secrets into chat. Never use the Global API Key.
- Keep `workers_dev: false` and `preview_urls: false`. The QR code must point ONLY to her own custom domain — never `*.workers.dev` (blocked in mainland China) or any platform domain. 二维码只指向自有域名。
- Fallback = Tencent Cloud Hong Kong server + Nginx; switch by DNS only (DNS-only/grey-cloud A record). 备用方案只改 DNS。

## Compliance red lines / 合规红线（HANDOFF §4）
- No "至高80000元" headline; avoid "专属" unless confirmed; "100%中奖" only with full prize rules posted; top prize ≤ 50,000 元.
- Never tie gifts or the lottery to leaving a phone number; keep `join.noPhone`. Separate consent when data passes from UCARS to 鸿蒙智行.
- No reward for sharing or 集赞. Don't write "应用上车" (use 超级桌面 / 一碰流转 / 小艺语音). Avoid "最终解释权", "最/第一", "华为汽车".
- Keep the benefits section (`benefits.enabled`) behind its "待鸿蒙智行确认" banner until brand sign-off.

## Before finishing a change / 改完自检（HANDOFF §7）
Preview (`cd public && python3 -m http.server`, or `npx wrangler@latest dev`) → check at 390×844 → test `?now=` cases → size check → no `http(s)://` in `public/` → secret scan → `wrangler deploy --dry-run`.
