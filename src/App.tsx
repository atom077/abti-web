import { useState, type CSSProperties } from "react";
import {
  ABTI_FAMILIES,
  QUESTIONS,
  analyzeAbti,
  type AbtiCode,
  type AbtiType,
  type AnalysisResult,
} from "./abti";

const emptyAnswers = Object.fromEntries(QUESTIONS.map((question) => [question.id, ""]));

type AvatarScene = {
  title: string;
  alias: string;
  badge: string;
  line: string;
  prop: "gavel" | "notes" | "scope" | "board" | "briefcase" | "mask" | "veil" | "spark" | "diver" | "crystal" | "lock" | "rocket" | "branch" | "pillow";
};

const AVATAR_SCENES: Record<AbtiCode, AvatarScene> = {
  CUSS: { title: "纠错裁判", alias: "ERROR REF", badge: "推进", line: "低质量答案的终结者。", prop: "gavel" },
  PILE: { title: "碎片炼金师", alias: "STACKER", badge: "推进", line: "把一堆乱线炼成路线图。", prop: "notes" },
  NERD: { title: "逻辑校准师", alias: "PROOF", badge: "校准", line: "没有证据的结论先别过审。", prop: "scope" },
  CTRL: { title: "流程导演", alias: "DIRECTOR", badge: "校准", line: "每一步都要站在正确机位。", prop: "board" },
  HIRE: { title: "外脑经理", alias: "ADVISOR", badge: "校准", line: "把 AI 调度成专家会议。", prop: "briefcase" },
  ROLE: { title: "剧场编导", alias: "STAGE", badge: "裂变", line: "换个角色，世界就换一套逻辑。", prop: "mask" },
  MASK: { title: "温和翻译官", alias: "VEIL", badge: "回声", line: "把没说出口的话翻译得体面。", prop: "veil" },
  IDOL: { title: "氛围养成师", alias: "BOOST", badge: "回声", line: "先把合作关系养亮。", prop: "spark" },
  SOUL: { title: "内在潜水员", alias: "DEEP", badge: "回声", line: "往情绪海底找真正的问题。", prop: "diver" },
  CULT: { title: "洞察追随者", alias: "ORACLE", badge: "回声", line: "那句说中的话，会发光。", prop: "crystal" },
  JAIL: { title: "边界测试员", alias: "BREACH", badge: "裂变", line: "规则边缘，是另一张地图。", prop: "lock" },
  WHIP: { title: "交付压缩机", alias: "SPRINT", badge: "推进", line: "先跑起来，再打磨优雅。", prop: "rocket" },
  FORK: { title: "多线探索者", alias: "BRANCH", badge: "裂变", line: "一个问题，至少三条宇宙线。", prop: "branch" },
  IDC: { title: "低耗委托人", alias: "AUTO", badge: "推进", line: "你看着办，我要低负担结果。", prop: "pillow" },
};

const AI_ERA_CARDS = [
  {
    id: "01",
    name: "灵感捕手",
    alias: "IDEA HUNTER",
    rarity: "史诗",
    accent: "#8b5cf6",
    image: "/ai-era-characters/01-idea-hunter.png",
    tags: ["创造型", "好奇心", "想象力", "探索型"],
    feature: "你擅长发现新的可能性，用 AI 捕捉灵感，把点子变成线索。",
    quote: "未来属于那些先看到可能性的人。",
  },
  {
    id: "02",
    name: "策略棋手",
    alias: "STRATEGIST",
    rarity: "传说",
    accent: "#f97316",
    image: "/ai-era-characters/02-strategist.png",
    tags: ["分析型", "全局观", "计划力", "掌控型"],
    feature: "你喜欢布局与规划，用 AI 预测趋势，掌控复杂局面。",
    quote: "每一步，都是通往未来的伏笔。",
  },
  {
    id: "03",
    name: "深度研究员",
    alias: "DEEP RESEARCHER",
    rarity: "稀有",
    accent: "#3b82f6",
    image: "/ai-era-characters/03-deep-researcher.png",
    tags: ["理性型", "专注力", "知识欲", "求真型"],
    feature: "你享受深入理解事物，用 AI 扩展认知边界，追求真正的理解。",
    quote: "理解世界，是为了更好地改变它。",
  },
  {
    id: "04",
    name: "连接者",
    alias: "CONNECTOR",
    rarity: "稀有",
    accent: "#22c55e",
    image: "/ai-era-characters/04-connector.png",
    tags: ["社交型", "共情力", "效率力", "结果明"],
    feature: "你专注结果与执行，用 AI 放大效率，把想法变成成果。",
    quote: "拉开差距的，不是想法，而是执行。",
  },
  {
    id: "05",
    name: "创作猛匠",
    alias: "CRAFTSMAN",
    rarity: "稀有",
    accent: "#16a34a",
    image: "/ai-era-characters/06-craftsman.png",
    tags: ["创造型", "审美力", "独特性", "表达型"],
    feature: "你追求独特与品质，用 AI 打磨细节，创造打动人心的作品。",
    quote: "细节，定义了作品的灵魂。",
  },
  {
    id: "06",
    name: "自由探索家",
    alias: "EXPLORER",
    rarity: "史诗",
    accent: "#7c3aed",
    image: "/ai-era-characters/07-explorer.png",
    tags: ["探索型", "独立性", "冒险精神", "开放性"],
    feature: "你渴望自由与未知，用 AI 开拓边界，体验更多人生可能。",
    quote: "世界很大，值得去探索。",
  },
  {
    id: "07",
    name: "数据洞察者",
    alias: "DATA INSIGHTER",
    rarity: "稀有",
    accent: "#0ea5e9",
    image: "/ai-era-characters/08-data-insighter.png",
    tags: ["分析型", "数据敏感", "逻辑力", "洞察力"],
    feature: "你擅长从数据中发现规律，用 AI 提炼洞察，驱动更好决策。",
    quote: "数据不会说谎，但洞察会。",
  },
  {
    id: "08",
    name: "价值守护者",
    alias: "GUARDIAN",
    rarity: "普通",
    accent: "#65a30d",
    image: "/ai-era-characters/09-guardian.png",
    tags: ["守护型", "责任感", "安全感", "价值观"],
    feature: "你重视稳定与责任，用 AI 守护重要的人与事。",
    quote: "真正的强大，是守护值得守护的。",
  },
  {
    id: "09",
    name: "学习成长者",
    alias: "GROWER",
    rarity: "普通",
    accent: "#84cc16",
    image: "/ai-era-characters/11-grower.png",
    tags: ["成长型", "正能量", "学习力", "氛围制造者"],
    feature: "你为他人带来动力与希望，用 AI 放大能量，让团队更闪耀。",
    quote: "情绪，是可以传递的超能力。",
  },
  {
    id: "10",
    name: "未来架构师",
    alias: "FUTURIST",
    rarity: "传说",
    accent: "#f97316",
    image: "/ai-era-characters/12-futurist.png",
    tags: ["前瞻型", "系统思维", "创新力", "愿景型"],
    feature: "你关注未来与可能性，用 AI 构建系统，创造长期价值。",
    quote: "未来不是等待的，而是设计的。",
  },
] as const;

type AIEraCard = (typeof AI_ERA_CARDS)[number];
type AIEraCardId = AIEraCard["id"];
type Screen = "home" | "test" | "result";

const ABTI_TO_AI_ERA_CARD: Record<AbtiCode, AIEraCardId> = {
  CUSS: "07",
  PILE: "02",
  NERD: "03",
  CTRL: "02",
  HIRE: "04",
  ROLE: "06",
  MASK: "04",
  IDOL: "09",
  SOUL: "08",
  CULT: "01",
  JAIL: "06",
  WHIP: "05",
  FORK: "01",
  IDC: "09",
};

function getAIEraCard(code: AbtiCode) {
  return AI_ERA_CARDS.find((card) => card.id === ABTI_TO_AI_ERA_CARD[code]) ?? AI_ERA_CARDS[0];
}

export default function App() {
  const [answers, setAnswers] = useState<Record<string, string>>(emptyAnswers);
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [currentStep, setCurrentStep] = useState(0);
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const isFreeTextStep = currentStep >= QUESTIONS.length;
  const currentQuestion = QUESTIONS[Math.min(currentStep, QUESTIONS.length - 1)];
  const currentAnswer = answers[currentQuestion.id];

  const canAnalyze = answeredCount >= 5;

  function updateAnswer(questionId: string, optionId: string) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    setResult(null);

    window.setTimeout(() => {
      setCurrentStep((step) => {
        const currentIndex = QUESTIONS.findIndex((question) => question.id === questionId);

        if (step !== currentIndex) return step;
        return Math.min(QUESTIONS.length, step + 1);
      });
    }, 220);
  }

  function startTest() {
    setScreen("test");
    setCurrentStep(0);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function runAnalysis() {
    if (!canAnalyze) return;
    setResult(analyzeAbti(answers, freeText));
    setScreen("result");
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function resetTest() {
    setAnswers(emptyAnswers);
    setFreeText("");
    setResult(null);
    setCurrentStep(0);
    setScreen("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  return (
    <main className={`app-shell app-shell--${screen}`}>
      {screen === "home" && (
        <section className="hero hero--home">
          <div id="top" className="hero__content">
            <p className="eyebrow">AI Behavior Type Indicator</p>
            <h1>识别你在 AI 时代的协作人格。</h1>
            <p className="hero__lead">
              这是一个通用 ABTI 测试原型：问卷建立稳定画像，自填话术补充个人证据，输出自我洞察和理解他人的沟通建议。
            </p>
            <div className="hero__meta" aria-label="产品信息">
              <span>12 道核心题</span>
              <span>10 种 AI 人物类型</span>
              <span>4 大行为阵营</span>
            </div>
            <div className="hero__actions">
              <button className="button button--primary" type="button" onClick={startTest}>
                开始测试
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === "test" && (
        <section id="test" className="test-grid">
          <aside className="progress-panel">
            <p className="eyebrow">{isFreeTextStep ? "补充画像" : "测试进度"}</p>
            <strong>{isFreeTextStep ? "补充" : String(currentStep + 1).padStart(2, "0")}</strong>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              已完成 {answeredCount}/{QUESTIONS.length} 题。
              {isFreeTextStep ? "补充常用提示词会让画像更像本人。" : "每页只回答一个问题，减少移动端滚动和回看成本。"}
            </p>
            <button className="button button--primary" type="button" disabled={!canAnalyze} onClick={runAnalysis}>
              生成 AI 人物卡
            </button>
            <button className="button button--flat" type="button" onClick={resetTest}>
              重置
            </button>
            <p className="progress-panel__hint">建议贴脱敏后的常用提示词，结果会更像你本人。</p>
          </aside>

          <div className="question-flow" aria-live="polite">
            {!isFreeTextStep ? (
              <fieldset className="question-card question-card--single" id={`question-${currentQuestion.id}`}>
                <legend className="sr-only">{currentQuestion.title}</legend>
                <div className="question-card__title" aria-hidden="true">
                  <span>{String(currentStep + 1).padStart(2, "0")}</span>
                  <strong>{currentQuestion.title}</strong>
                </div>
                <div className="option-grid">
                  {currentQuestion.options.map((option) => (
                    <label className={currentAnswer === option.id ? "option option--selected" : "option"} key={option.id}>
                      <input
                        name={currentQuestion.id}
                        type="radio"
                        checked={currentAnswer === option.id}
                        onChange={() => updateAnswer(currentQuestion.id, option.id)}
                      />
                      <strong>{option.label}</strong>
                      <span>{option.helper}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <label className="free-text" id="free-text">
                <span>可选：贴 3-8 句你常对 AI 说的话</span>
                <textarea
                  value={freeText}
                  onChange={(event) => {
                    setFreeText(event.target.value);
                    setResult(null);
                  }}
                  placeholder="示例：直接给我结论，不要解释太多。或者：请你像一位资深产品顾问一样，先判断我的真实问题是什么。请先脱敏，不要输入账号、姓名、联系方式或真实聊天记录中的敏感信息。"
                />
              </label>
            )}

            <div className={isFreeTextStep ? "step-controls step-controls--final" : "step-controls"}>
              <button className="button button--flat" type="button" disabled={currentStep === 0} onClick={goToPreviousStep}>
                上一题
              </button>
              <span>
                {Math.min(currentStep + 1, QUESTIONS.length)}/{QUESTIONS.length}
              </span>
              {isFreeTextStep ? (
                <button className="button button--primary" type="button" disabled={!canAnalyze} onClick={runAnalysis}>
                  生成 AI 人物卡
                </button>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {screen === "test" && (
        <div className="mobile-action-bar" aria-label="移动端测试操作">
          <div className="mobile-action-bar__status">
            <strong>
              {answeredCount}/{QUESTIONS.length}
            </strong>
            <span>已完成</span>
          </div>
          <button className="mobile-action-bar__back" type="button" disabled={currentStep === 0} onClick={goToPreviousStep}>
            上一题
          </button>
          {isFreeTextStep && (
            <button className="button button--primary mobile-action-bar__submit" type="button" disabled={!canAnalyze} onClick={runAnalysis}>
              生成 AI 人物卡
            </button>
          )}
        </div>
      )}

      {screen === "result" && result && <ResultView result={result} />}
    </main>
  );
}

function ResultView({ result }: { result: AnalysisResult }) {
  const family = ABTI_FAMILIES[result.primary.family];
  const primaryCard = getAIEraCard(result.primary.code);
  const secondaryCard = getAIEraCard(result.secondary.code);
  const cardScoreMap = result.scores.reduce((map, item) => {
    const card = getAIEraCard(item.code);
    const current = map.get(card.id) ?? { card, score: 0, labels: [] as string[] };

    current.score += Math.max(0, item.score);
    current.labels.push(`${item.code} / ${item.name}`);
    map.set(card.id, current);
    return map;
  }, new Map<AIEraCardId, { card: AIEraCard; score: number; labels: string[] }>());
  const scoreTotal = Array.from(cardScoreMap.values()).reduce((sum, item) => sum + item.score, 0) || 1;
  const typeMatches = Array.from(cardScoreMap.values()).sort((a, b) => b.score - a.score).map((item) => {
    return {
      ...item,
      percent: item.score > 0 ? Math.round((item.score / scoreTotal) * 100) : 0,
    };
  });
  const [shareStatus, setShareStatus] = useState("分享测试结果，或直接截图下方卡片。");

  async function shareResult() {
    const shareText = `我的 ABTI AI 时代人物卡是「${primaryCard.name}」(${primaryCard.alias})，ABTI 主型 ${result.primary.code} / ${result.primary.name}，副卡 ${secondaryCard.name}。`;
    const shareData = {
      title: `我的 ABTI 人物卡：${primaryCard.name}`,
      text: shareText,
      url: `${window.location.origin}${window.location.pathname}#top`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("已打开系统分享面板。");
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${shareData.url}`);
      setShareStatus("分享文案已复制。也可以直接截图卡片发给朋友。");
    } catch {
      setShareStatus("如果分享面板被取消，可直接长按或截图保存下方卡片。");
    }
  }

  return (
    <section id="result" className="result" style={{ "--accent": result.primary.accent } as CSSProperties}>
      <div className="result__header">
        <p className="eyebrow">你的 AI 时代人物卡</p>
        <h2>
          {primaryCard.name}
          <span>{primaryCard.alias}</span>
        </h2>
        <p>
          {result.primary.code} / {result.primary.name}：{result.primary.persona} / {result.primary.angle}
        </p>
      </div>

      <div className="result__body">
        <article className="result-card portrait-card ai-result-card">
          <AIEraCharacterCard card={primaryCard} type={result.primary} featured match={result.confidence} />
          <div className="portrait-card__summary">
            <div className="match-meter" aria-label={`匹配度 ${result.confidence}%`}>
              <span>匹配度</span>
              <strong>{result.confidence}%</strong>
              <b aria-hidden="true">
                <i style={{ width: `${result.confidence}%` }} />
              </b>
            </div>
            <h3>{primaryCard.name}：{result.primary.motto}</h3>
            <p>{result.primary.summary}</p>
            <p className="muted">
              副卡：{secondaryCard.name} / {secondaryCard.alias} · 副型：{result.secondary.code} / {result.secondary.name}
            </p>
          </div>
          <div className="tag-list">
            {result.primary.traits.map((trait) => (
              <span key={trait}>{trait}</span>
            ))}
          </div>
          <dl>
            <div>
              <dt>优势模式</dt>
              <dd>{result.primary.strengths.join(" / ")}</dd>
            </div>
            <div>
              <dt>压力反应</dt>
              <dd>{result.primary.stressMode}</dd>
            </div>
          </dl>
        </article>

        <article className="result-card family-result-card" style={{ "--family": family.color } as CSSProperties}>
          <span>{family.label}</span>
          <h3>{family.name}</h3>
          <strong>{family.slogan}</strong>
          <p>{family.description}</p>
        </article>

        <article className="result-card type-match-card">
          <h3>人物卡匹配度</h3>
          <div className="type-match-list">
            {typeMatches.map((item, index) => (
              <div className="type-match-row" key={item.card.id}>
                <div>
                  <strong>{item.card.name}</strong>
                  <span>{item.labels.slice(0, 2).join(" · ")}</span>
                </div>
                <b>{item.percent}%</b>
                <i aria-hidden="true">
                  <em style={{ width: `${Math.max(3, item.percent)}%`, opacity: index === 0 ? 1 : 0.72 }} />
                </i>
              </div>
            ))}
          </div>
        </article>

        <article className="result-card">
          <h3>判断依据</h3>
          <ul>
            {result.evidence.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="result-card">
          <h3>使用建议</h3>
          <ul>
            {[...result.insights.slice(0, 2), result.relationshipNotes[0]].filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="share-section" aria-labelledby="share-card-title">
        <div className="share-section__intro">
          <p className="eyebrow">Share Card</p>
          <h3 id="share-card-title">生成你的 ABTI 测试结果卡片</h3>
          <p>{shareStatus}</p>
          <button className="button button--primary" type="button" onClick={shareResult}>
            分享结果
          </button>
        </div>
      </section>
    </section>
  );
}

function AIEraCharacterCard({
  card,
  type,
  featured = false,
  match,
}: {
  card: AIEraCard;
  type?: AbtiType;
  featured?: boolean;
  match?: number;
}) {
  return (
    <article
      className={featured ? "ai-character-card ai-character-card--featured" : "ai-character-card"}
      style={{ "--card-accent": card.accent } as CSSProperties}
      aria-label={`${card.id} ${card.name} ${card.alias} AI 时代人物卡`}
    >
      <div className="ai-character-card__top">
        <span>{card.id}</span>
        <b>{typeof match === "number" ? `${match}% 匹配` : card.rarity}</b>
      </div>
      <div className="ai-character-card__stage">
        <img src={card.image} width="308" height="380" alt={`${card.name} ${card.alias} 角色插画`} loading={featured ? "eager" : "lazy"} />
      </div>
      <div className="ai-character-card__body">
        <p>{type ? `${type.code} / ${type.name}` : "AI ERA PERSONA"}</p>
        <h3>{card.name}</h3>
        <strong>{card.alias}</strong>
        <div className="ai-character-card__tags">
          {card.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="ai-character-card__feature">{card.feature}</p>
        <q>{card.quote}</q>
      </div>
    </article>
  );
}

function AnimeAvatar({ type, size = "card" }: { type: AbtiType; size?: "card" | "wide" }) {
  const scene = AVATAR_SCENES[type.code];

  return (
    <div
      className={`anime-avatar anime-avatar--${size}`}
      style={{ "--accent": type.accent, "--family": ABTI_FAMILIES[type.family].color } as CSSProperties}
      aria-label={`${scene.title}动漫画像`}
    >
      <div className="anime-avatar__caption">
        <span>你的人格类型是</span>
        <strong>{scene.title}</strong>
        <b>{scene.alias}</b>
      </div>
      <span className="anime-avatar__badge">{scene.badge}</span>
      <svg className="anime-avatar__art" viewBox="0 0 300 230" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`cape-${type.code}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.92" />
            <stop offset="100%" stopColor="var(--family)" stopOpacity="0.74" />
          </linearGradient>
        </defs>
        {renderAvatarScene(type.code)}
      </svg>
    </div>
  );
}

function renderAvatarScene(code: AbtiCode) {
  switch (code) {
    case "NERD":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="202" rx="92" ry="11" />
          <path className="scene-spark" d="M54 48 64 67 85 69 69 82 74 104 54 92 35 104 40 82 24 69 45 67Z" />
          <Character x={150} y={74} variant="lab" hair="spike" />
          <g className="scene-prop scene-prop--large">
            <circle cx="73" cy="138" r="28" />
            <path d="M91 158 119 188M47 138H99M73 112V164" />
            <path d="M201 111 260 111M211 132 248 132M221 153 237 153" />
          </g>
        </>
      );
    case "CTRL":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="202" rx="96" ry="11" />
          <path className="scene-panel" d="M32 88H106V158H32Z" />
          <path className="scene-line" d="M49 108H89M49 128H82M49 146H94M216 88V173M190 111H263M198 140H250" />
          <Character x={150} y={72} variant="director" hair="side" pose="point" />
          <path className="scene-spark scene-spark--cool" d="M236 44 245 64 267 66 250 80 255 102 236 90 216 102 222 80 205 66 227 64Z" />
        </>
      );
    case "HIRE":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="202" rx="94" ry="11" />
          <path className="scene-panel" d="M40 103H111V164H40Z" />
          <path className="scene-line" d="M59 103V89H93V103M40 128H111M210 82 258 106 239 153 191 129Z" />
          <Character x={150} y={72} variant="suit" hair="part" pose="brief" />
          <path className="scene-spark" d="M70 52 81 72 104 74 86 89 92 111 70 98 50 111 56 89 38 74 61 72Z" />
        </>
      );
    case "SOUL":
      return (
        <>
          <path className="scene-wave" d="M22 171 C55 151 83 188 116 167 C151 145 183 188 216 166 C240 151 259 154 278 169 L278 213 L22 213Z" />
          <ellipse className="scene-shadow" cx="150" cy="204" rx="90" ry="10" />
          <g className="scene-prop scene-prop--large">
            <circle cx="91" cy="134" r="38" />
            <path d="M55 170 C78 148 108 149 131 170M63 130H121M74 116 C88 105 106 105 120 116" />
            <path d="M210 128 C233 113 261 119 278 139 C260 158 233 164 210 148Z" />
            <circle cx="262" cy="138" r="3" />
          </g>
          <Character x={151} y={76} variant="diver" hair="soft" />
        </>
      );
    case "MASK":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="202" rx="92" ry="11" />
          <path className="scene-veil" d="M70 69 C118 46 183 50 227 76 C208 123 211 169 236 197 C181 177 116 180 64 197 C90 166 92 116 70 69Z" />
          <g className="scene-prop scene-prop--large">
            <path d="M34 121 C61 89 95 96 111 124 C96 159 55 160 34 121Z" />
            <path d="M190 111 C221 85 255 98 265 130 C242 160 203 150 190 111Z" />
            <circle cx="72" cy="123" r="4" />
            <circle cx="94" cy="123" r="4" />
            <path d="M215 126H219M242 126H246" />
          </g>
          <Character x={150} y={76} variant="soft" hair="long" />
        </>
      );
    case "IDOL":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="202" rx="95" ry="11" />
          <path className="scene-spotlight" d="M34 188 91 43 131 188Z" />
          <path className="scene-spotlight scene-spotlight--right" d="M169 188 213 43 269 188Z" />
          <path className="scene-spark" d="M76 75 87 98 112 99 92 114 99 139 76 126 54 139 61 114 41 99 66 98Z" />
          <path className="scene-spark scene-spark--cool" d="M217 72 226 91 247 93 231 106 236 127 217 116 198 127 203 106 187 93 208 91Z" />
          <Character x={150} y={72} variant="idol" hair="crown" pose="open" />
        </>
      );
    case "CULT":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="204" rx="92" ry="11" />
          <g className="scene-prop scene-prop--large">
            <path d="M62 74 109 119 84 184 31 140Z" />
            <path d="M62 74 70 140 84 184M109 119 70 140 31 140" />
            <path d="M206 68 260 121 232 190 174 139Z" />
            <path d="M206 68 218 139 232 190M260 121 218 139 174 139" />
          </g>
          <Character x={150} y={74} variant="oracle" hair="hood" />
          <path className="scene-spark" d="M145 35 153 50 170 51 157 62 161 79 145 70 130 79 134 62 121 51 138 50Z" />
        </>
      );
    case "WHIP":
      return (
        <>
          <path className="scene-speed" d="M26 93H98M38 123H88M21 154H111" />
          <ellipse className="scene-shadow" cx="156" cy="204" rx="86" ry="10" />
          <path className="scene-rocket" d="M70 61 C111 76 131 112 126 165 C84 156 59 116 70 61Z" />
          <path className="scene-line" d="M88 157 62 197M116 161 125 207M88 91 117 120" />
          <Character x={171} y={82} variant="sprinter" hair="wind" pose="run" />
        </>
      );
    case "CUSS":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="203" rx="92" ry="11" />
          <path className="scene-card-red" d="M48 88H94V146H48Z" />
          <path className="scene-line" d="M202 93 262 68M205 125H275M200 158 263 184" />
          <g className="scene-prop scene-prop--large">
            <rect x="83" y="121" width="58" height="15" rx="5" transform="rotate(-18 112 128)" />
            <rect x="127" y="129" width="13" height="60" rx="5" transform="rotate(-18 133 159)" />
            <rect x="63" y="179" width="66" height="10" rx="5" />
          </g>
          <Character x={154} y={72} variant="referee" hair="sharp" pose="judge" />
        </>
      );
    case "PILE":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="204" rx="98" ry="11" />
          <path className="scene-paper" d="M43 148 96 139 101 180 49 188Z" />
          <path className="scene-paper scene-paper--two" d="M184 138 246 151 239 191 177 181Z" />
          <path className="scene-paper scene-paper--three" d="M83 98 128 90 136 127 91 137Z" />
          <path className="scene-line" d="M55 166H88M195 162H231M94 113H124" />
          <Character x={150} y={76} variant="apron" hair="messy" pose="hold" />
          <path className="scene-cauldron" d="M105 157 C113 194 187 194 195 157Z" />
        </>
      );
    case "IDC":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="204" rx="93" ry="11" />
          <rect className="scene-pillow" x="53" y="143" width="88" height="46" rx="18" />
          <path className="scene-cloud" d="M176 91 C195 64 237 77 240 110 C266 116 262 154 232 157 H179 C150 152 149 108 176 91Z" />
          <path className="scene-line" d="M195 124H226M205 139H236" />
          <Character x={142} y={78} variant="casual" hair="sleep" pose="relax" />
        </>
      );
    case "ROLE":
      return (
        <>
          <path className="scene-curtain" d="M26 43 C63 76 55 141 34 192 H96 C78 130 88 80 118 43Z" />
          <path className="scene-curtain scene-curtain--right" d="M274 43 C237 76 245 141 266 192 H204 C222 130 212 80 182 43Z" />
          <ellipse className="scene-shadow" cx="150" cy="203" rx="91" ry="10" />
          <g className="scene-prop scene-prop--large">
            <path d="M45 118 C75 88 111 99 124 130 C104 165 63 157 45 118Z" />
            <path d="M176 111 C208 86 244 98 257 130 C235 164 193 154 176 111Z" />
            <circle cx="82" cy="122" r="4" />
            <circle cx="106" cy="122" r="4" />
            <path d="M204 126H208M232 126H236" />
          </g>
          <Character x={150} y={72} variant="actor" hair="dramatic" pose="stage" />
        </>
      );
    case "FORK":
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="204" rx="92" ry="11" />
          <path className="scene-road" d="M146 204 C143 168 132 142 93 102M151 204 C151 166 151 130 151 84M156 204 C163 166 180 137 221 102" />
          <path className="scene-sign" d="M73 85H121V111H73ZM128 62H176V88H128ZM197 85H245V111H197Z" />
          <path className="scene-line" d="M84 98H111M139 75H166M208 98H235" />
          <Character x={150} y={80} variant="traveler" hair="cap" pose="choose" />
        </>
      );
    case "JAIL":
      return (
        <>
          <rect className="scene-screen" x="40" y="75" width="220" height="124" rx="12" />
          <path className="scene-code" d="M62 99H108M62 119H94M62 139H118M192 98 222 128 192 158M164 98 134 128 164 158" />
          <ellipse className="scene-shadow" cx="150" cy="204" rx="86" ry="10" />
          <Character x={150} y={76} variant="hoodie" hair="hood" pose="type" />
          <path className="scene-lock" d="M218 55H259V91H218ZM228 55V42C228 31 249 31 249 42V55M239 67V80" />
        </>
      );
    default:
      return (
        <>
          <ellipse className="scene-shadow" cx="150" cy="202" rx="92" ry="11" />
          <Character x={150} y={74} variant="suit" hair="part" />
        </>
      );
  }
}

function Character({
  x,
  y,
  variant,
  hair,
  pose = "stand",
}: {
  x: number;
  y: number;
  variant:
    | "lab"
    | "director"
    | "suit"
    | "diver"
    | "soft"
    | "idol"
    | "oracle"
    | "sprinter"
    | "referee"
    | "apron"
    | "casual"
    | "actor"
    | "traveler"
    | "hoodie";
  hair: "spike" | "side" | "part" | "soft" | "long" | "crown" | "hood" | "wind" | "sharp" | "messy" | "sleep" | "dramatic" | "cap";
  pose?: "stand" | "point" | "brief" | "open" | "run" | "judge" | "hold" | "relax" | "stage" | "choose" | "type";
}) {
  return (
    <g className={`scene-person scene-person--${variant}`} transform={`translate(${x - 150} ${y - 72})`}>
      {renderHairBack(hair)}
      <path className="person-leg" d="M133 146 122 194 139 194 149 148Z" />
      <path className="person-leg" d="M163 146 177 194 159 194 149 148Z" />
      <path className="person-body" d="M112 95 C116 78 130 68 150 68 C170 68 184 78 188 95 L179 155 L121 155Z" />
      <path className="person-shirt" d="M137 100 150 84 163 100 157 153 143 153Z" />
      <path className="person-arm" d={getArmPath(pose, "left")} />
      <path className="person-arm person-arm--right" d={getArmPath(pose, "right")} />
      <circle className="person-head" cx="150" cy="54" r="27" />
      {renderHair(hair)}
      <circle className="person-eye" cx="140" cy="58" r="3" />
      <circle className="person-eye" cx="160" cy="58" r="3" />
      <path className="person-mouth" d={variant === "referee" ? "M140 70 C147 66 154 66 161 70" : "M140 69 C146 75 155 75 161 69"} />
      {variant === "lab" ? (
        <path className="person-glasses" d="M130 57H147M153 57H170M147 57H153M130 57C130 66 145 66 145 57M155 57C155 66 170 66 170 57" />
      ) : null}
    </g>
  );
}

function getArmPath(pose: string, side: "left" | "right") {
  const paths: Record<string, [string, string]> = {
    stand: ["M118 103 C99 117 94 136 96 151 L110 151 C110 137 116 125 128 116Z", "M182 103 C201 117 206 136 204 151 L190 151 C190 137 184 125 172 116Z"],
    point: ["M118 103 C96 105 82 110 70 121 L78 133 C94 126 106 122 128 116Z", "M182 103 C207 105 222 112 236 126 L227 137 C210 128 196 123 172 116Z"],
    brief: ["M118 103 C101 119 93 137 92 153 L106 155 C109 139 116 126 128 116Z", "M182 103 C199 111 215 120 230 130 L222 143 C203 134 190 125 172 116Z"],
    open: ["M118 103 C95 99 77 93 59 82 L53 96 C75 111 96 119 128 116Z", "M182 103 C205 99 223 93 241 82 L247 96 C225 111 204 119 172 116Z"],
    run: ["M118 103 C94 120 82 139 73 158 L88 163 C99 144 111 129 128 116Z", "M182 103 C205 96 222 94 243 98 L242 113 C217 113 199 116 172 116Z"],
    judge: ["M118 103 C99 113 91 124 84 140 L98 147 C105 132 115 123 128 116Z", "M182 103 C202 93 218 81 235 65 L244 77 C224 99 206 112 172 116Z"],
    hold: ["M118 103 C100 120 94 134 92 151 L107 153 C110 137 117 126 128 116Z", "M182 103 C200 120 206 134 208 151 L193 153 C190 137 183 126 172 116Z"],
    relax: ["M118 103 C100 128 94 145 91 164 L107 165 C111 145 118 129 128 116Z", "M182 103 C204 112 218 121 235 138 L226 151 C205 135 190 124 172 116Z"],
    stage: ["M118 103 C98 92 84 78 73 58 L60 66 C73 94 94 111 128 116Z", "M182 103 C202 92 216 78 227 58 L240 66 C227 94 206 111 172 116Z"],
    choose: ["M118 103 C98 112 84 124 71 139 L82 151 C96 136 110 125 128 116Z", "M182 103 C202 112 216 124 229 139 L218 151 C204 136 190 125 172 116Z"],
    type: ["M118 103 C103 119 100 134 104 145 L118 143 C116 132 119 123 128 116Z", "M182 103 C197 119 200 134 196 145 L182 143 C184 132 181 123 172 116Z"],
  };
  return paths[pose]?.[side === "left" ? 0 : 1] ?? paths.stand[side === "left" ? 0 : 1];
}

function renderHairBack(hair: string) {
  if (hair === "long") {
    return <path className="person-hair person-hair--back" d="M121 51 C116 79 121 103 137 114 H164 C179 98 183 76 177 51Z" />;
  }
  if (hair === "hood") {
    return <path className="person-hood" d="M116 57 C118 22 150 8 181 34 C192 52 187 82 169 96 H132 C116 85 111 70 116 57Z" />;
  }
  return null;
}

function renderHair(hair: string) {
  switch (hair) {
    case "spike":
      return <path className="person-hair" d="M123 52 136 27 149 47 164 29 177 56 C163 45 142 43 123 52Z" />;
    case "side":
      return <path className="person-hair" d="M121 52 C126 28 151 24 174 39 C163 40 148 46 128 62Z" />;
    case "part":
      return <path className="person-hair" d="M122 48 C132 28 156 25 176 43 L151 53 134 42Z" />;
    case "soft":
      return <path className="person-hair" d="M123 50 C130 28 164 26 176 52 C157 43 140 44 123 50Z" />;
    case "long":
      return <path className="person-hair" d="M121 50 C129 27 164 26 178 52 C160 45 139 44 121 50Z" />;
    case "crown":
      return (
        <>
          <path className="person-hair" d="M123 50 C130 30 165 29 176 52 C156 44 139 44 123 50Z" />
          <path className="person-crown" d="M128 28 139 15 150 28 162 15 173 28 168 39H133Z" />
        </>
      );
    case "hood":
      return <path className="person-hair person-hair--hood" d="M124 55 C134 39 162 38 176 55 C159 49 141 49 124 55Z" />;
    case "wind":
      return <path className="person-hair" d="M119 54 C125 29 153 25 186 40 C169 48 147 53 123 66Z" />;
    case "sharp":
      return <path className="person-hair" d="M119 53 134 25 147 50 161 24 180 53 C160 45 139 45 119 53Z" />;
    case "messy":
      return <path className="person-hair" d="M120 52 129 31 140 45 151 28 160 46 174 34 180 57 C159 45 139 45 120 52Z" />;
    case "sleep":
      return <path className="person-hair" d="M122 53 C130 31 159 28 176 48 C159 45 143 47 122 53Z" />;
    case "dramatic":
      return <path className="person-hair" d="M119 51 C123 25 151 20 181 36 C169 43 151 55 129 67Z" />;
    case "cap":
      return (
        <>
          <path className="person-cap" d="M119 47 C132 27 169 27 181 47Z" />
          <path className="person-cap-brim" d="M151 47H196" />
        </>
      );
    default:
      return <path className="person-hair" d="M122 50 C130 28 164 26 176 52 C157 43 140 44 122 50Z" />;
  }
}
