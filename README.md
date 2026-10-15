# ABTI - AI 时代人物图鉴

ABTI 是一个面向 AI 时代的人格测试网页原型。它通过显式问卷和用户主动填写的提示词样本，分析用户和 AI 互动、处理需求、协作推进时的行为倾向，并生成一张「AI 时代人物卡」。

项目保留原有正经版 ABTI，同时新增「迷惑行为版」：不再只定义“你是谁”，而是吐槽“你怎么用 AI / 怎么跟人协作”。

## 功能特性

- 双模式切换：默认进入「迷惑行为版」，也可切回原有「正经版」。
- 12 道核心题：覆盖需求表达、AI 纠错、会议协作、DDL、AI Agent 和交付习惯等行为场景。
- 本地规则分析：当前版本在浏览器本地完成评分，不上传用户输入。
- 自由文本补充：用户可选择填写几句常用 AI 或协作文案，让画像更贴近本人。
- 迷惑行为图鉴：将结果映射为提示词炼丹师、方案 PPT 仙人、DDL 灵感型选手、全栈背锅侠等 16 种趣味人格。
- 毒舌版/正常版切换：结果页文案可在吐槽语气和正经解释之间切换。
- 高清分享图：点击分享结果会在浏览器本地生成 `2160 x 3000` PNG 结果卡，并带有指向 `https://abti.atomclaw.xyz:8177/` 的二维码。
- 可解释输出：展示主卡、副卡、置信度、判断依据和使用建议。

## 技术栈

- React 19
- TypeScript
- Vite
- 原生 CSS
- 浏览器本地规则引擎
- Canvas + QRCode 本地生成分享图

## 快速开始

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览生产包：

```bash
npm run preview
```

局域网调试时，Vite 已配置监听 `0.0.0.0`，启动后可使用终端输出的 `Network` 地址在手机浏览器访问。

## 线上部署（pm2）

推荐将 Vite 构建后的 `dist/` 作为静态站点部署，并用 pm2 托管静态服务进程。

服务器首次部署：

```bash
git clone git@github.com:atom077/abti-web.git
cd abti-web
npm ci
npm run build

# 以 SPA 模式托管 dist，端口可按服务器环境调整
pm2 serve dist 4173 --spa --name abti-web
pm2 save
```

配置开机自启：

```bash
pm2 startup
# 按 pm2 输出的命令执行一次
pm2 save
```

后续更新发布：

```bash
cd abti-web
git pull
npm ci
npm run build
pm2 restart abti-web
```

如果前面接 Nginx/Caddy，建议将外部域名反向代理到 `127.0.0.1:4173`，并开启 HTTPS。ABTI 是前端静态应用，当前版本没有后端服务和数据库依赖。

## 项目结构

```text
.
├── public/
│   ├── ai-era-cards/        # 早期整卡图资产
│   └── ai-era-characters/   # 当前网页使用的人物角色切图
├── docs/
│   └── PLAN.md              # 迷惑行为版产品改版计划
├── src/
│   ├── abti.ts              # 正经版/迷惑行为版问题、类型和分析规则
│   ├── App.tsx              # 页面结构、模式切换、结果卡和分享图生成
│   ├── main.tsx             # React 入口
│   └── styles.css           # 全局视觉系统和组件样式
├── index.html
├── package.json
└── vite.config.ts
```

## ABTI 分析设计

当前原型采用显式授权输入，而不是读取聊天历史或用户记忆：

- 用户主动选择什么，就只分析什么。
- 自由文本区域提示用户先脱敏。
- 结果展示证据线索，避免黑箱式贴标签。
- 规则引擎保留可解释性，便于未来接入 LLM 后做兜底。

当前人物图鉴匹配不是 LLM 语义匹配，而是浏览器本地规则评分。完整规则见 [AI 时代人物图鉴匹配规则](docs/persona-matching-rules.md)，迷惑行为版产品计划见 [PLAN.md](docs/PLAN.md)。

## AI 时代迷惑行为类型

迷惑行为版包含 16 种 ABTI 类型：

- DSCP 提示词炼丹师
- DSCM 方案 PPT 仙人
- DSLP 自动化幻想家
- DSLM 细节地狱守门员
- DICP 新工具小白鼠
- DICM 感觉不对鉴定师
- DILP DDL 灵感型选手
- DILM 赛博手艺人
- RSCP 需求翻译官
- RSCM 会议精神捕手
- RSLP 收到马上改战士
- RSLM 不确定性焦虑师
- RICP AI 依赖型打工人
- RICM 复盘诸葛亮 Pro
- RILP 线上火灾消防员
- RILM 全栈背锅侠

正经版仍保留原有 AI 人物图鉴和阵营分析，用于更稳定的自我洞察与沟通建议。

## 分享图

趣味版结果页的「分享结果」按钮会在浏览器本地生成 PNG，不依赖后端接口：

- 画布尺寸：`2160 x 3000`
- 二维码链接：`https://abti.atomclaw.xyz:8177/`
- 文件名：`ABTI-{code}-{人格名}.png`
- 内容：人格 code、匹配度、人物插画、标签、吐槽/描述文案、适配队友和二维码

## 隐私与安全边界

当前网页原型不连接后端，不调用远程模型，不保存用户输入。生产版如果接入真实 AI 分析，应避免在前端暴露模型 API Key，并增加后端代理。

建议的后端接口：

```ts
POST /api/analyze-abti
{
  answers: Record<string, string>;
  freeText: string;
}
```

后端职责建议：

- 输入脱敏和长度限制。
- 调用 LLM 生成更自然的个性化洞察。
- 保留当前规则引擎作为可解释评分基线。
- 明确告知用户数据是否保存、保存多久、如何删除。

## 开发说明

常用命令：

```bash
npm run dev      # 启动开发服务器
npm run build    # TypeScript 检查并生成生产包
npm run preview  # 预览生产包
```

提交前建议至少运行：

```bash
npm run build
```

## 当前状态

这是一个产品原型，适合继续扩展为：

- 可分享的人物卡结果页。
- 结果卡图片导出。
- LLM 增强版人格分析。
- 多语言版本。
- 更完整的数据授权和隐私设置。
- 用户画像统计和人群分布图表。

## 许可证与素材

项目源代码采用 [MIT 许可证](LICENSE)。人物插画允许随本项目公开再分发，其独立使用授权见 [素材说明](ASSETS.md)。
