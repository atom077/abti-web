import QRCode from "qrcode";
import { useMemo, useState, type CSSProperties } from "react";
import {
  ABTI_FAMILIES,
  ABTI_TYPES,
  FUN_ABTI_QUESTIONS,
  QUESTIONS,
  analyzeAbti,
  analyzeFunAbti,
  getFunTypeList,
  type AbtiCode,
  type AbtiType,
  type AnalysisResult,
  type FunAbtiCode,
  type FunAbtiType,
  type FunAnalysisResult,
} from "./abti";

type ProductMode = "fun" | "serious";
type ToneMode = "roast" | "normal";
type Screen = "home" | "test" | "result";
type QuestionLike = {
  id: string;
  title: string;
  setup?: string;
  options: Array<{ id: string; label: string; helper: string }>;
};

const SERIOUS_TYPES = Object.values(ABTI_TYPES);
const FUN_TYPES = getFunTypeList();
const FUN_SHARE_URL = "https://abti.atomclaw.tech/";

const SERIOUS_IMAGE_BY_CODE: Record<AbtiCode, string> = {
  CUSS: "/ai-era-characters/09-guardian.png",
  PILE: "/ai-era-characters/11-grower.png",
  NERD: "/ai-era-characters/03-deep-researcher.png",
  CTRL: "/ai-era-characters/02-strategist.png",
  HIRE: "/ai-era-characters/08-data-insighter.png",
  ROLE: "/ai-era-characters/04-connector.png",
  MASK: "/ai-era-characters/09-guardian.png",
  IDOL: "/ai-era-characters/11-grower.png",
  SOUL: "/ai-era-characters/03-deep-researcher.png",
  CULT: "/ai-era-characters/01-idea-hunter.png",
  JAIL: "/ai-era-characters/07-explorer.png",
  WHIP: "/ai-era-characters/06-craftsman.png",
  FORK: "/ai-era-characters/12-futurist.png",
  IDC: "/ai-era-characters/01-idea-hunter.png",
};

const FUN_IMAGE_BY_CODE: Record<FunAbtiCode, string> = {
  DSCP: "/ai-era-characters/02-strategist.png",
  DSCM: "/ai-era-characters/12-futurist.png",
  DSLP: "/ai-era-characters/08-data-insighter.png",
  DSLM: "/ai-era-characters/06-craftsman.png",
  DICP: "/ai-era-characters/07-explorer.png",
  DICM: "/ai-era-characters/01-idea-hunter.png",
  DILP: "/ai-era-characters/11-grower.png",
  DILM: "/ai-era-characters/06-craftsman.png",
  RSCP: "/ai-era-characters/04-connector.png",
  RSCM: "/ai-era-characters/09-guardian.png",
  RSLP: "/ai-era-characters/11-grower.png",
  RSLM: "/ai-era-characters/03-deep-researcher.png",
  RICP: "/ai-era-characters/01-idea-hunter.png",
  RICM: "/ai-era-characters/03-deep-researcher.png",
  RILP: "/ai-era-characters/09-guardian.png",
  RILM: "/ai-era-characters/12-futurist.png",
};

function makeEmptyAnswers(questions: Array<{ id: string }>) {
  return Object.fromEntries(questions.map((question) => [question.id, ""]));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Cannot load image: ${src}`));
    image.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 3) {
  let line = "";
  let lineCount = 0;

  for (const char of text) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = char;
      lineCount += 1;
      if (lineCount >= maxLines) return;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, y + lineCount * lineHeight);
  }
}

function drawImageContain(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const targetWidth = image.naturalWidth * scale;
  const targetHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x + (width - targetWidth) / 2, y + (height - targetHeight) / 2, targetWidth, targetHeight);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function createFunResultCardImage({
  type,
  result,
  partnerNames,
  imageSrc,
}: {
  type: FunAbtiType;
  result: FunAnalysisResult;
  partnerNames: string[];
  imageSrc: string;
}) {
  const exportScale = 2;
  const logicalWidth = 1080;
  const logicalHeight = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = logicalWidth * exportScale;
  canvas.height = logicalHeight * exportScale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  ctx.scale(exportScale, exportScale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const [characterImage, qrImage] = await Promise.all([
    loadImage(new URL(imageSrc, window.location.origin).toString()),
    QRCode.toDataURL(FUN_SHARE_URL, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 536,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    }).then(loadImage),
  ]);

  const bg = ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
  bg.addColorStop(0, "#eef4ff");
  bg.addColorStop(0.48, "#f8fbff");
  bg.addColorStop(1, "#e9eff8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  ctx.fillStyle = "rgba(116, 99, 240, 0.10)";
  ctx.beginPath();
  ctx.arc(120, 120, 360, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(232, 93, 54, 0.10)";
  ctx.beginPath();
  ctx.arc(960, 1420, 420, 0, Math.PI * 2);
  ctx.fill();

  roundRect(ctx, 86, 70, 908, 1360, 54);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fill();
  ctx.strokeStyle = "rgba(45, 74, 122, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();

  roundRect(ctx, 124, 112, 832, 1276, 44);
  ctx.fillStyle = "#111426";
  ctx.fill();
  ctx.strokeStyle = type.accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  roundRect(ctx, 170, 156, 740, 694, 24);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  drawImageContain(ctx, characterImage, 192, 178, 696, 650);

  roundRect(ctx, 170, 156, 92, 72, 22);
  ctx.fillStyle = "#eaf2ff";
  ctx.fill();
  ctx.fillStyle = "#111426";
  ctx.font = '950 30px "Avenir Next", "PingFang SC", sans-serif';
  ctx.fillText(type.code, 194, 204);

  roundRect(ctx, 720, 156, 190, 72, 22);
  ctx.fillStyle = type.accent;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = '950 32px "Avenir Next", "PingFang SC", sans-serif';
  ctx.fillText(`${result.confidence}% 匹配`, 748, 204);

  const panel = ctx.createLinearGradient(124, 760, 956, 1300);
  panel.addColorStop(0, "#111426");
  panel.addColorStop(1, "#1b3362");
  ctx.fillStyle = panel;
  ctx.fillRect(124, 760, 832, 628);

  ctx.fillStyle = "#b7ccff";
  ctx.font = '950 30px "Avenir Next", "PingFang SC", sans-serif';
  ctx.letterSpacing = "2px";
  ctx.fillText(`ABTI / ${type.nickname}`, 170, 856);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "#ffffff";
  ctx.font = '900 78px "Iowan Old Style", "Songti SC", serif';
  ctx.fillText(type.name, 170, 950);

  ctx.fillStyle = "#b7ccff";
  ctx.font = '950 34px "Avenir Next", "PingFang SC", sans-serif';
  ctx.fillText(type.shareTitle.toUpperCase(), 170, 1024);

  let tagX = 170;
  ctx.font = '900 28px "Avenir Next", "PingFang SC", sans-serif';
  type.tags.slice(0, 3).forEach((tag) => {
    const tagWidth = ctx.measureText(tag).width + 52;
    roundRect(ctx, tagX, 1062, tagWidth, 56, 28);
    ctx.fillStyle = "rgba(255, 255, 255, 0.11)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(tag, tagX + 26, 1099);
    tagX += tagWidth + 16;
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = '700 34px "Avenir Next", "PingFang SC", sans-serif';
  drawWrappedText(ctx, type.shareSubtitle, 170, 1170, 500, 48, 2);

  roundRect(ctx, 738, 1110, 170, 170, 24);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.drawImage(qrImage, 756, 1128, 134, 134);

  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = '700 22px "Avenir Next", "PingFang SC", sans-serif';
  drawWrappedText(ctx, `适配队友：${partnerNames.slice(0, 2).join(" / ")}`, 170, 1282, 520, 34, 2);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create image"));
    }, "image/png");
  });
}

export default function App() {
  const [productMode, setProductMode] = useState<ProductMode>("fun");
  const [toneMode, setToneMode] = useState<ToneMode>("roast");
  const [seriousAnswers, setSeriousAnswers] = useState<Record<string, string>>(() => makeEmptyAnswers(QUESTIONS));
  const [funAnswers, setFunAnswers] = useState<Record<string, string>>(() => makeEmptyAnswers(FUN_ABTI_QUESTIONS));
  const [freeText, setFreeText] = useState("");
  const [seriousResult, setSeriousResult] = useState<AnalysisResult | null>(null);
  const [funResult, setFunResult] = useState<FunAnalysisResult | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [currentStep, setCurrentStep] = useState(0);

  const activeQuestions = (productMode === "fun" ? FUN_ABTI_QUESTIONS : QUESTIONS) as QuestionLike[];
  const activeAnswers = productMode === "fun" ? funAnswers : seriousAnswers;
  const answeredCount = Object.values(activeAnswers).filter(Boolean).length;
  const progress = Math.round((answeredCount / activeQuestions.length) * 100);
  const isFreeTextStep = currentStep >= activeQuestions.length;
  const currentQuestion = activeQuestions[Math.min(currentStep, activeQuestions.length - 1)];
  const currentAnswer = activeAnswers[currentQuestion.id];
  const canAnalyze = answeredCount >= (productMode === "fun" ? 8 : 5);

  const hero = productMode === "fun"
    ? {
        eyebrow: "AI Behavior Type Indicator",
        title: "ABTI：AI 时代打工人精神状态测试",
        lead: "不是 MBTI 测你是谁，是 ABTI 测你在 AI、需求、协作、DDL 面前怎么发疯。",
        meta: ["12 道职场场景题", "16 种迷惑行为类型", "默认毒舌版"],
        cta: "开始鉴定我的精神状态",
      }
    : {
        eyebrow: "Classic ABTI",
        title: "识别你在 AI 时代的协作人格。",
        lead: "保留原有正经版 ABTI：问卷建立稳定画像，自填话术补充个人证据，输出自我洞察和沟通建议。",
        meta: ["12 道核心题", "14 种 AI 人物类型", "4 大行为阵营"],
        cta: "开始正经测试",
      };

  function switchMode(nextMode: ProductMode) {
    if (nextMode === productMode) return;
    setProductMode(nextMode);
    setCurrentStep(0);
    setScreen("home");
    setSeriousResult(null);
    setFunResult(null);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function updateAnswer(questionId: string, optionId: string) {
    if (productMode === "fun") {
      setFunAnswers((current) => ({ ...current, [questionId]: optionId }));
      setFunResult(null);
    } else {
      setSeriousAnswers((current) => ({ ...current, [questionId]: optionId }));
      setSeriousResult(null);
    }

    window.setTimeout(() => {
      setCurrentStep((step) => {
        const currentIndex = activeQuestions.findIndex((question) => question.id === questionId);
        if (step !== currentIndex) return step;
        return Math.min(activeQuestions.length, step + 1);
      });
    }, 180);
  }

  function startTest() {
    setScreen("test");
    setCurrentStep(0);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function runAnalysis() {
    if (!canAnalyze) return;

    if (productMode === "fun") {
      setFunResult(analyzeFunAbti(funAnswers, freeText));
    } else {
      setSeriousResult(analyzeAbti(seriousAnswers, freeText));
    }
    setScreen("result");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function resetTest() {
    if (productMode === "fun") {
      setFunAnswers(makeEmptyAnswers(FUN_ABTI_QUESTIONS));
      setFunResult(null);
    } else {
      setSeriousAnswers(makeEmptyAnswers(QUESTIONS));
      setSeriousResult(null);
    }
    setFreeText("");
    setCurrentStep(0);
    setScreen("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  return (
    <main className={`app-shell app-shell--${screen}`}>
      <ModeSwitch productMode={productMode} onChange={switchMode} />

      {screen === "home" && (
        <>
          <section className={productMode === "fun" ? "hero hero--home hero--fun" : "hero hero--home"}>
            <div id="top" className="hero__content">
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1>{hero.title}</h1>
              <p className="hero__lead">{hero.lead}</p>
              <div className="hero__meta" aria-label="产品信息">
                {hero.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="hero__actions">
                <button className="button button--primary" type="button" onClick={startTest}>
                  {hero.cta}
                </button>
              </div>
            </div>
          </section>
          {productMode === "fun" ? <FunTypePreview /> : <SeriousTypePreview />}
        </>
      )}

      {screen === "test" && (
        <section id="test" className="test-grid">
          <aside className="progress-panel">
            <p className="eyebrow">{isFreeTextStep ? "补充证据" : productMode === "fun" ? "迷惑进度" : "测试进度"}</p>
            <strong>{isFreeTextStep ? "补充" : String(currentStep + 1).padStart(2, "0")}</strong>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              已完成 {answeredCount}/{activeQuestions.length} 题。
              {isFreeTextStep ? "补充几句你常对 AI 说的话，结果会更像本人。" : "每页只回答一个场景，别想太久，第一反应更准。"}
            </p>
            <button className="button button--primary" type="button" disabled={!canAnalyze} onClick={runAnalysis}>
              {productMode === "fun" ? "生成迷惑行为图鉴" : "生成 AI 人物卡"}
            </button>
            <button className="button button--flat" type="button" onClick={resetTest}>
              重置
            </button>
            <p className="progress-panel__hint">
              {productMode === "fun" ? "默认给你温柔毒舌版，结果页可切正常版。" : "建议贴脱敏后的常用提示词，结果会更像你本人。"}
            </p>
          </aside>

          <div className="question-flow" aria-live="polite">
            {!isFreeTextStep ? (
              <fieldset className="question-card question-card--single" id={`question-${currentQuestion.id}`}>
                <legend className="sr-only">{currentQuestion.title}</legend>
                <div className="question-card__title" aria-hidden="true">
                  <span>{String(currentStep + 1).padStart(2, "0")}</span>
                  <strong>{currentQuestion.title}</strong>
                </div>
                {currentQuestion.setup ? <p className="question-card__setup">{currentQuestion.setup}</p> : null}
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
                <span>{productMode === "fun" ? "可选：贴几句你常对 AI 或同事说的话" : "可选：贴 3-8 句你常对 AI 说的话"}</span>
                <textarea
                  value={freeText}
                  onChange={(event) => {
                    setFreeText(event.target.value);
                    setSeriousResult(null);
                    setFunResult(null);
                  }}
                  placeholder={
                    productMode === "fun"
                      ? "示例：先给我三个方向。这个 vibe 不对。老板说很简单但我不信。请先脱敏，不要输入账号、姓名、联系方式或真实聊天记录中的敏感信息。"
                      : "示例：直接给我结论，不要解释太多。请你像一位资深产品顾问一样，先判断我的真实问题是什么。请先脱敏，不要输入敏感信息。"
                  }
                />
              </label>
            )}

            <div className={isFreeTextStep ? "step-controls step-controls--final" : "step-controls"}>
              <button className="button button--flat" type="button" disabled={currentStep === 0} onClick={goToPreviousStep}>
                上一题
              </button>
              <span>
                {Math.min(currentStep + 1, activeQuestions.length)}/{activeQuestions.length}
              </span>
              {isFreeTextStep ? (
                <button className="button button--primary" type="button" disabled={!canAnalyze} onClick={runAnalysis}>
                  {productMode === "fun" ? "生成迷惑行为图鉴" : "生成 AI 人物卡"}
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
              {answeredCount}/{activeQuestions.length}
            </strong>
            <span>已完成</span>
          </div>
          <button className="mobile-action-bar__back" type="button" disabled={currentStep === 0} onClick={goToPreviousStep}>
            上一题
          </button>
          {isFreeTextStep && (
            <button className="button button--primary mobile-action-bar__submit" type="button" disabled={!canAnalyze} onClick={runAnalysis}>
              生成结果
            </button>
          )}
        </div>
      )}

      {screen === "result" && productMode === "fun" && funResult ? (
        <FunResultView result={funResult} toneMode={toneMode} onToneChange={setToneMode} onReset={resetTest} />
      ) : null}
      {screen === "result" && productMode === "serious" && seriousResult ? (
        <SeriousResultView result={seriousResult} onReset={resetTest} />
      ) : null}
    </main>
  );
}

function ModeSwitch({ productMode, onChange }: { productMode: ProductMode; onChange: (mode: ProductMode) => void }) {
  return (
    <div className="mode-switch" aria-label="ABTI 版本切换">
      <button className={productMode === "fun" ? "mode-switch__item mode-switch__item--active" : "mode-switch__item"} type="button" onClick={() => onChange("fun")}>
        迷惑行为版
      </button>
      <button className={productMode === "serious" ? "mode-switch__item mode-switch__item--active" : "mode-switch__item"} type="button" onClick={() => onChange("serious")}>
        正经版
      </button>
    </div>
  );
}

function FunTypePreview() {
  return (
    <section className="type-preview" aria-labelledby="fun-types-title">
      <div className="section-heading">
        <p className="eyebrow">AI 时代人类迷惑行为图鉴</p>
        <h2 id="fun-types-title">16 种协作发疯方式</h2>
      </div>
      <div className="type-preview__grid">
        {FUN_TYPES.map((type) => (
          <article className="mini-type-card" style={{ "--accent": type.accent } as CSSProperties} key={type.code}>
            <span>{type.code}</span>
            <h3>{type.name}</h3>
            <p>{type.oneLiner}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeriousTypePreview() {
  return (
    <section className="type-preview" aria-labelledby="serious-types-title">
      <div className="section-heading">
        <p className="eyebrow">Classic ABTI</p>
        <h2 id="serious-types-title">保留原有正经人格画像</h2>
      </div>
      <div className="type-preview__grid">
        {SERIOUS_TYPES.slice(0, 8).map((type) => (
          <article className="mini-type-card" style={{ "--accent": type.accent } as CSSProperties} key={type.code}>
            <span>{type.code}</span>
            <h3>{type.persona}</h3>
            <p>{type.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FunResultView({
  result,
  toneMode,
  onToneChange,
  onReset,
}: {
  result: FunAnalysisResult;
  toneMode: ToneMode;
  onToneChange: (mode: ToneMode) => void;
  onReset: () => void;
}) {
  const type = result.primary;
  const summary = toneMode === "roast" ? type.roastSummary : type.normalSummary;
  const partnerNames = useMemo(() => type.bestPartners.map((code) => FUN_TYPES.find((item) => item.code === code)?.name ?? code), [type.bestPartners]);
  const nemesisNames = useMemo(() => type.nemesis.map((code) => FUN_TYPES.find((item) => item.code === code)?.name ?? code), [type.nemesis]);

  async function shareResult() {
    const shareText = `我的 ABTI 迷惑行为图鉴是「${type.name}」(${type.code})：${type.shareSubtitle}`;

    try {
      const blob = await createFunResultCardImage({
        type,
        result,
        partnerNames,
        imageSrc: FUN_IMAGE_BY_CODE[type.code],
      });
      const file = new File([blob], `ABTI-${type.code}-${type.name}.png`, { type: "image/png" });

      downloadBlob(file, `ABTI-${type.code}-${type.name}.png`);
      await navigator.clipboard?.writeText(`${shareText}\n${FUN_SHARE_URL}`).catch(() => undefined);
    } catch (error) {
      console.error("Failed to generate ABTI share card", error);
    }
  }

  return (
    <section id="result" className="result fun-result" style={{ "--accent": type.accent } as CSSProperties}>
      <div className="result__header">
        <p className="eyebrow">你的 AI 时代人类迷惑行为图鉴</p>
        <h2>
          {type.name}
          <span>{type.code}</span>
        </h2>
        <p>{summary}</p>
      </div>

      <div className="tone-switch" aria-label="结果文案模式">
        <button className={toneMode === "roast" ? "tone-switch__item tone-switch__item--active" : "tone-switch__item"} type="button" onClick={() => onToneChange("roast")}>
          毒舌版
        </button>
        <button className={toneMode === "normal" ? "tone-switch__item tone-switch__item--active" : "tone-switch__item"} type="button" onClick={() => onToneChange("normal")}>
          正常版
        </button>
      </div>

      <div className="result__body fun-result__body">
        <article className="result-card fun-hero-card">
          <figure className="fun-hero-card__figure">
            <span className="fun-hero-card__code">{type.code}</span>
            <span className="fun-hero-card__match">{result.confidence}% 匹配</span>
            <img src={FUN_IMAGE_BY_CODE[type.code]} width="260" height="320" alt={`${type.name} 角色插画`} />
          </figure>
          <div className="fun-hero-card__body">
            <span className="fun-hero-card__label">AI 时代精神状态：{type.nickname}</span>
            <h3>{type.name}</h3>
            <strong>{type.shareTitle.toUpperCase()}</strong>
            <div className="tag-list">
              {type.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className="fun-hero-card__summary">{summary}</p>
          </div>
        </article>

        <ResultListCard title="你的典型症状" items={type.symptoms} />
        <ResultListCard title="你的隐藏优势" items={type.strengths} />
        <ResultListCard title="你的职场副作用" items={type.sideEffects} />
        <ResultListCard title="适合用 AI 做" items={type.aiUsage} />
        <ResultListCard title="不适合用 AI 做" items={type.aiAvoid} />

        <article className="result-card catchphrase-card">
          <h3>你的灵魂台词</h3>
          <p>{type.catchphrase}</p>
        </article>

        <article className="result-card relationship-card">
          <h3>你的协作关系</h3>
          <dl>
            <div>
              <dt>最佳队友</dt>
              <dd>{partnerNames.join(" / ")}</dd>
            </div>
            <div>
              <dt>协作天敌</dt>
              <dd>{nemesisNames.join(" / ")}</dd>
            </div>
            <div>
              <dt>危险组合</dt>
              <dd>{type.dangerousCombo}</dd>
            </div>
          </dl>
        </article>

        <article className="result-card score-card">
          <h3>行为维度</h3>
          <DimensionRow left="D 驾驭型" right="R 依赖型" leftScore={result.dimensionScores.D} rightScore={result.dimensionScores.R} />
          <DimensionRow left="S 结构型" right="I 灵感型" leftScore={result.dimensionScores.S} rightScore={result.dimensionScores.I} />
          <DimensionRow left="C 同步型" right="L 单刷型" leftScore={result.dimensionScores.C} rightScore={result.dimensionScores.L} />
          <DimensionRow left="P 交付型" right="M 打磨型" leftScore={result.dimensionScores.P} rightScore={result.dimensionScores.M} />
        </article>

        <article className="result-card">
          <h3>判断依据</h3>
          <ul>
            {result.evidence.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="result-actions result-actions--bottom">
        <button className="button button--primary" type="button" onClick={shareResult}>
          分享结果
        </button>
        <button className="button button--flat" type="button" onClick={onReset}>
          重新测试
        </button>
      </div>

    </section>
  );
}

function SeriousResultView({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const family = ABTI_FAMILIES[result.primary.family];
  const [shareStatus, setShareStatus] = useState("分享测试结果，或直接截图结果页。");
  const imageSrc = SERIOUS_IMAGE_BY_CODE[result.primary.code];

  async function shareResult() {
    const shareText = `我的正经版 ABTI 是「${result.primary.persona}」(${result.primary.code} / ${result.primary.name})：${result.primary.summary}`;
    const shareData = {
      title: `我的正经版 ABTI：${result.primary.persona}`,
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
      setShareStatus("分享文案已复制。");
    } catch {
      setShareStatus("如果分享面板被取消，可直接截图结果页。");
    }
  }

  return (
    <section id="result" className="result serious-result" style={{ "--accent": result.primary.accent, "--family": family.color } as CSSProperties}>
      <div className="result__header">
        <p className="eyebrow">你的正经版 AI 时代人物卡</p>
        <h2>
          {result.primary.persona}
          <span>{result.primary.code}</span>
        </h2>
        <p>
          {result.primary.name}：{result.primary.angle}
        </p>
      </div>

      <div className="result__body serious-result__body">
        <article className="result-card fun-hero-card">
          <figure className="fun-hero-card__figure">
            <span className="fun-hero-card__code">{result.primary.code}</span>
            <span className="fun-hero-card__match">{result.confidence}% 匹配</span>
            <img src={imageSrc} width="260" height="320" alt={`${result.primary.persona} 角色插画`} />
          </figure>
          <div className="fun-hero-card__body">
            <span className="fun-hero-card__label">AI 时代人物卡：{family.name}</span>
            <h3>{result.primary.persona}</h3>
            <strong>{result.primary.name}</strong>
            <div className="tag-list">
              {result.primary.traits.map((trait) => (
                <span key={trait}>{trait}</span>
              ))}
            </div>
            <p className="fun-hero-card__summary">{result.primary.summary}</p>
          </div>
        </article>

        <ResultListCard title="人格特质" items={result.primary.traits} />
        <ResultListCard title="优势模式" items={result.primary.strengths} />
        <ResultListCard title="正经使用建议" items={[...result.insights.slice(0, 2), result.relationshipNotes[0]].filter(Boolean)} />

        <article className="result-card catchphrase-card">
          <h3>你的核心信条</h3>
          <p>{result.primary.motto}</p>
        </article>

        <article className="result-card relationship-card">
          <h3>你的协作画像</h3>
          <dl>
            <div>
              <dt>所属阵营</dt>
              <dd>
                {family.name} / {family.slogan}
              </dd>
            </div>
            <div>
              <dt>压力模式</dt>
              <dd>{result.primary.stressMode}</dd>
            </div>
            <div>
              <dt>协作提示</dt>
              <dd>{result.primary.interactionTip}</dd>
            </div>
          </dl>
        </article>

        <ResultListCard title="判断依据" items={result.evidence.slice(0, 4)} />

        <article className="result-card type-match-card">
          <h3>类型分数</h3>
          <div className="type-match-list">
            {result.scores.slice(0, 6).map((item) => (
              <div className="type-match-row" key={item.code}>
                <div>
                  <strong>{item.code} / {item.name}</strong>
                  <span>{ABTI_TYPES[item.code].persona}</span>
                </div>
                <b>{item.score}</b>
                <i aria-hidden="true">
                  <em style={{ width: `${Math.max(4, Math.min(100, item.score * 8))}%` }} />
                </i>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="result-actions result-actions--bottom">
        <button className="button button--primary" type="button" onClick={shareResult}>
          分享结果
        </button>
        <button className="button button--flat" type="button" onClick={onReset}>
          重新测试
        </button>
        <p>{shareStatus}</p>
      </div>
    </section>
  );
}

function ResultListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="result-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function DimensionRow({ left, right, leftScore, rightScore }: { left: string; right: string; leftScore: number; rightScore: number }) {
  const total = Math.max(1, leftScore + rightScore);
  const leftPercent = Math.round((leftScore / total) * 100);

  return (
    <div className="dimension-row">
      <span>{left}</span>
      <b aria-label={`${left} ${leftPercent}%，${right} ${100 - leftPercent}%`}>
        <i style={{ width: `${leftPercent}%` }} />
      </b>
      <span>{right}</span>
    </div>
  );
}
