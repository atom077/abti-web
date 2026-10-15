# ABTI - AI 时代人物图鉴

ABTI 是一个面向 AI 时代的人格测试网页原型。它通过显式问卷和用户主动填写的提示词样本，分析用户和 AI 互动时的行为倾向，并生成一张「AI 时代人物卡」。

项目重点不是复刻传统 MBTI，而是把用户使用 AI 时的习惯、偏好、风险和协作方式转化为更具象的人格洞察。

## 功能特性

- 12 道核心题：覆盖需求表达、纠错方式、目标期待、角色设定、效率偏好、AI Agent 和 vibe coding 等 AI 协作行为。
- 本地规则分析：当前版本在浏览器本地完成评分，不上传用户输入。
- 自由文本补充：用户可选择填写 3-8 句常用 AI 提示词，让画像更贴近本人。
- AI 时代人物卡：将结果映射为灵感捕手、策略棋手、深度研究员等具象角色。
- 移动端分享卡：测试完成后生成适合手机截图转发的 ABTI 结果卡片。
- 可解释输出：展示主卡、副卡、置信度、判断依据和使用建议。
- 非公开图鉴：当前不开放浏览全部人物类型，只在测试完成后展示用户自己的结果卡。

## 技术栈

- React 19
- TypeScript
- Vite
- 原生 CSS
- 浏览器本地规则引擎

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
├── src/
│   ├── abti.ts              # 问题、类型、阵营和分析规则
│   ├── App.tsx              # 页面结构、交互和人物卡渲染
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

当前人物图鉴匹配不是 LLM 语义匹配，而是浏览器本地规则评分。完整规则见 [AI 时代人物图鉴匹配规则](docs/persona-matching-rules.md)。

## AI 时代人物类型

图鉴当前包含 10 种人物卡：

- 01 灵感捕手 / IDEA HUNTER
- 02 策略棋手 / STRATEGIST
- 03 深度研究员 / DEEP RESEARCHER
- 04 连接者 / CONNECTOR
- 05 创作猛匠 / CRAFTSMAN
- 06 自由探索家 / EXPLORER
- 07 数据洞察者 / DATA INSIGHTER
- 08 价值守护者 / GUARDIAN
- 09 学习成长者 / GROWER
- 10 未来架构师 / FUTURIST

ABTI 内部仍保留更细的行为类型，用于评分和解释；最终结果会映射到更适合用户理解和分享的人物卡。

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
