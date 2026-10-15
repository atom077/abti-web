export type AbtiCode =
  | "CUSS"
  | "PILE"
  | "NERD"
  | "CTRL"
  | "HIRE"
  | "ROLE"
  | "MASK"
  | "IDOL"
  | "SOUL"
  | "CULT"
  | "JAIL"
  | "WHIP"
  | "FORK"
  | "IDC";

export type AbtiFamilyCode = "CALIBRATION" | "RESONANCE" | "MOMENTUM" | "FISSION";

export type AbtiFamily = {
  code: AbtiFamilyCode;
  name: string;
  label: string;
  slogan: string;
  description: string;
  motive: string;
  risk: string;
  color: string;
  members: AbtiCode[];
};

export type QuestionOption = {
  id: string;
  label: string;
  helper: string;
  weights: Partial<Record<AbtiCode, number>>;
};

export type Question = {
  id: string;
  title: string;
  options: QuestionOption[];
};

export type AbtiType = {
  code: AbtiCode;
  family: AbtiFamilyCode;
  name: string;
  persona: string;
  archetype: string;
  motto: string;
  angle: string;
  summary: string;
  traits: string[];
  strengths: string[];
  dailyScene: string;
  stressMode: string;
  blindSpot: string;
  growth: string;
  interactionTip: string;
  accent: string;
};

export type AnalysisResult = {
  primary: AbtiType;
  secondary: AbtiType;
  scores: Array<{ code: AbtiCode; name: string; score: number }>;
  confidence: number;
  evidence: string[];
  insights: string[];
  relationshipNotes: string[];
};

export const ABTI_FAMILY_ORDER: AbtiFamilyCode[] = ["CALIBRATION", "RESONANCE", "MOMENTUM", "FISSION"];

export const ABTI_FAMILIES: Record<AbtiFamilyCode, AbtiFamily> = {
  CALIBRATION: {
    code: "CALIBRATION",
    name: "校准局",
    label: "Calibration Bureau",
    slogan: "把 AI 调成一台可靠仪器",
    description: "这类人关心答案是否准确、结构是否稳、判断是否有依据。他们不是单纯追求聪明，而是追求可验证、可复用、可交付的智能。",
    motive: "获得清晰判断、稳定流程和专业外脑。",
    risk: "过度校准会让探索空间变窄，把每次对话都变成审稿会。",
    color: "#5667c9",
    members: ["NERD", "CTRL", "HIRE"],
  },
  RESONANCE: {
    code: "RESONANCE",
    name: "回声群岛",
    label: "Resonance Isles",
    slogan: "把 AI 变成情绪、关系与意义的回声壁",
    description: "这类人用 AI 听见自己、翻译关系、修复表达，也会被强烈的“被说中感”吸引。他们追求的不是答案本身，而是答案背后的理解。",
    motive: "获得共鸣、安放情绪、理解人与人的潜台词。",
    risk: "太沉浸于解释和共鸣时，现实行动可能被推迟。",
    color: "#b85d91",
    members: ["SOUL", "MASK", "IDOL", "CULT"],
  },
  MOMENTUM: {
    code: "MOMENTUM",
    name: "推进工坊",
    label: "Momentum Workshop",
    slogan: "把 AI 当作产出引擎、整理车间和救火队",
    description: "这类人最在意事情能不能动起来。无论是快速交付、纠错返工、碎片整理，还是低负担委托，他们都希望 AI 把阻力变成进度。",
    motive: "降低启动成本，加快产出，把混乱材料变成可用结果。",
    risk: "如果只压速度、不补上下文，产出会变快，但返工也会变快。",
    color: "#c2702f",
    members: ["WHIP", "CUSS", "PILE", "IDC"],
  },
  FISSION: {
    code: "FISSION",
    name: "裂变游民",
    label: "Fission Nomads",
    slogan: "把 AI 当模拟器、剧场和边界实验场",
    description: "这类人不满足于单一答案。他们喜欢让 AI 扮演、分叉、推演和测试边界，从多个宇宙里寻找新可能。",
    motive: "制造分支、模拟角色、发现限制之外的路径。",
    risk: "分支太多会稀释决策，边界测试也可能偏离原始目标。",
    color: "#1f8aa5",
    members: ["ROLE", "FORK", "JAIL"],
  },
};

export const ABTI_TYPES: Record<AbtiCode, AbtiType> = {
  CUSS: {
    code: "CUSS",
    family: "MOMENTUM",
    name: "暴躁老哥型",
    persona: "纠错裁判",
    archetype: "像 MBTI 里的高压执行者：不是为了吵架，而是对低质量结果零耐心。",
    motto: "别解释你为什么错，先把错改掉。",
    angle: "直觉强、耐心低、需要快速命中问题",
    summary: "你最在意效率和准确性。AI 一旦绕弯、装懂或给废话，你会迅速纠偏，甚至用强烈语气把边界划清。",
    traits: ["反应快", "标准明确", "讨厌废话", "敢于直接否定"],
    strengths: ["能快速识别伪答案", "适合做验收、评审和危机纠偏", "不容易被漂亮话带偏"],
    dailyScene: "你常在 AI 输出不对时立刻打断：指出错误、要求重来、压缩解释空间。",
    stressMode: "压力上来时会把“结果不行”表达成“对方不行”，协作对象容易进入防御状态。",
    blindSpot: "高压表达会让协作者只关注语气，而忽略你真正要解决的问题。",
    growth: "把怒气翻译成判定标准：哪里错、期望格式、验收方式。你会更快拿到结果。",
    interactionTip: "和你沟通时，应先给结论，再给证据，不要用泛泛的安抚替代修复。",
    accent: "#d94b2b",
  },
  PILE: {
    code: "PILE",
    family: "MOMENTUM",
    name: "废料堆积型",
    persona: "碎片炼金师",
    archetype: "像 MBTI 里的发散型创作者：脑内素材丰富，真正需要的是结构化容器。",
    motto: "我不是没想法，我是想法太多。",
    angle: "想法多、材料杂、靠 AI 帮你重组秩序",
    summary: "你通常不是没有想法，而是想法同时涌出。AI 对你最有价值的地方，是把碎片变成路径。",
    traits: ["材料敏感", "联想丰富", "容易多线程", "先囤积再整理"],
    strengths: ["能提供大量上下文", "适合创意策划和资料整合", "容易从杂乱中挖出新连接"],
    dailyScene: "你会把笔记、想法、截图文字和半成品一起交给 AI，让它先帮你分层。",
    stressMode: "压力大时继续加材料，反而让目标越来越模糊，最后不知道该从哪里开始。",
    blindSpot: "输入越堆越多时，真正的目标会被材料淹没。",
    growth: "每轮只给 AI 一个主问题，并声明哪些信息是背景、哪些是必须使用的约束。",
    interactionTip: "和你协作时，应先分类和归纳，再推进执行，不宜马上细抠局部。",
    accent: "#b07028",
  },
  NERD: {
    code: "NERD",
    family: "CALIBRATION",
    name: "技术洁癖型",
    persona: "逻辑校准师",
    archetype: "像 MBTI 里的分析家：需要定义、证据、边界和可复现路径。",
    motto: "结论可以晚一点，但逻辑不能糊。",
    angle: "重视严谨、结构和可验证性",
    summary: "你习惯检查逻辑链条、定义边界和实现细节。你不是挑剔，而是对含糊答案天然不信任。",
    traits: ["追问依据", "偏爱系统性", "容错率低", "重视精确表达"],
    strengths: ["能发现隐藏漏洞", "适合复杂决策和技术审查", "擅长把模糊问题拆成可验证命题"],
    dailyScene: "你会要求 AI 标注假设、给出推理链，并指出哪些内容只是推测。",
    stressMode: "压力上来时会持续细抠定义，导致探索阶段过早进入审稿模式。",
    blindSpot: "过早追求完美结构，可能拖慢探索阶段的速度。",
    growth: "把问题分成“先发散”和“再验证”两轮，让创造和审查各自发挥作用。",
    interactionTip: "和你沟通要给出假设、约束和可复现依据，不能只给漂亮结论。",
    accent: "#2f66d0",
  },
  CTRL: {
    code: "CTRL",
    family: "CALIBRATION",
    name: "掌控导演型",
    persona: "流程导演",
    archetype: "像 MBTI 里的组织者：擅长把混乱任务变成角色、步骤和验收标准。",
    motto: "按我的结构来，结果才不会散。",
    angle: "明确目标、强流程感、喜欢可控输出",
    summary: "你会把 AI 当作执行系统，而不是聊天对象。你擅长设定格式、角色、步骤和验收标准。",
    traits: ["目标清楚", "结构强", "重视控制感", "善于分派任务"],
    strengths: ["能稳定拿到可用输出", "适合项目推进和流程设计", "擅长把 AI 变成可靠工作流"],
    dailyScene: "你会先规定 AI 的角色、输出格式、步骤顺序和禁止事项，再让它开始执行。",
    stressMode: "压力大时会不断加规则，AI 的探索空间被压到只剩机械执行。",
    blindSpot: "控制越细，AI 的意外发现空间越小。",
    growth: "保留一个开放区：让 AI 提供反例、风险或更优路线，而不只是服从。",
    interactionTip: "和你协作时，应按结构汇报进度，并主动暴露风险和取舍。",
    accent: "#2f8f73",
  },
  HIRE: {
    code: "HIRE",
    family: "CALIBRATION",
    name: "雇佣专家型",
    persona: "外脑经理",
    archetype: "像 MBTI 里的战略协作者：会把 AI 当专家团队调度，而不是搜索框。",
    motto: "给我专业判断，不要只复述资料。",
    angle: "把 AI 当顾问、教练或外脑团队",
    summary: "你很擅长调动专业能力。你希望 AI 像专家一样提出判断，而不是只做信息搬运。",
    traits: ["善用角色", "重视专业度", "关注取舍", "期待高质量建议"],
    strengths: ["能把 AI 用成顾问系统", "适合战略讨论和能力补位", "容易获得跨领域视角"],
    dailyScene: "你会让 AI 扮演产品顾问、律师、教练、编辑或架构师，要求它给判断。",
    stressMode: "压力大时容易把专家口吻当作可信度，忽略事实核验。",
    blindSpot: "专家口吻容易制造权威感，但权威感不等于正确。",
    growth: "要求 AI 区分事实、推断和建议，并给出不确定性。",
    interactionTip: "和你沟通应给清晰建议，但必须同时说明依据和风险。",
    accent: "#7556c9",
  },
  ROLE: {
    code: "ROLE",
    family: "FISSION",
    name: "角色扮演型",
    persona: "剧场编导",
    archetype: "像 MBTI 里的叙事型探索者：通过人设、语气和情境打开新的理解通道。",
    motto: "先进入角色，答案才有灵魂。",
    angle: "通过角色设定激发表达、理解和创造",
    summary: "你倾向用角色、场景和语气来打开问题。你知道表达方式会影响思考方式。",
    traits: ["场景感强", "表达灵活", "重视氛围", "擅长共情模拟"],
    strengths: ["适合创作、演练和沟通预演", "能让抽象问题变得可感", "容易生成有感染力的表达"],
    dailyScene: "你会让 AI 扮演某个人、某种关系或某个世界观，再观察答案如何变化。",
    stressMode: "压力大时会沉浸在设定里，现实约束和执行落点被叙事感盖住。",
    blindSpot: "角色太强时，可能牺牲真实性和判断边界。",
    growth: "在角色扮演之外增加一层现实校验：哪些可执行，哪些只是叙事效果。",
    interactionTip: "和你协作时，可以使用场景化语言，但最后要落回行动清单。",
    accent: "#c04b83",
  },
  MASK: {
    code: "MASK",
    family: "RESONANCE",
    name: "情绪伪装型",
    persona: "温和翻译官",
    archetype: "像 MBTI 里的内敛协调者：把真实需求包进礼貌、理性和缓冲语里。",
    motto: "我没事，但你最好能听懂我没说出口的部分。",
    angle: "表达克制、真实需求藏在措辞背后",
    summary: "你常常把真实感受包装成理性请求。你不是没有情绪，而是不愿意让情绪直接占据场面。",
    traits: ["表达克制", "善于顾及他人", "真实需求后置", "不喜欢直接冲突"],
    strengths: ["适合敏感沟通和关系修复", "能保持场面稳定", "容易捕捉语气和潜台词"],
    dailyScene: "你会用“如果方便”“可能是我没说清”来提出其实很明确的需求。",
    stressMode: "压力大时更客气、更绕，别人反而更难判断你真正的不满和期待。",
    blindSpot: "过度克制会让他人低估你的压力、期待或失望。",
    growth: "在任务描述之外增加一句真实状态：我担心什么、我希望被怎样回应。",
    interactionTip: "和你沟通时要读潜台词，但不能替你过度脑补。",
    accent: "#667085",
  },
  IDOL: {
    code: "IDOL",
    family: "RESONANCE",
    name: "赞美驯化型",
    persona: "氛围养成师",
    archetype: "像 MBTI 里的关系型促进者：相信正反馈能让协作系统更愿意给出好结果。",
    motto: "先把关系调顺，事情才会顺。",
    angle: "通过正反馈维持协作氛围",
    summary: "你善于用鼓励打开合作关系。你通常相信好的互动能换来更好的输出。",
    traits: ["正反馈多", "重视关系", "表达友好", "擅长激励"],
    strengths: ["能维持长期协作氛围", "适合教学、陪伴和创作迭代", "容易让对话保持开放"],
    dailyScene: "你会在 AI 做对一点时及时夸它，再继续提出修改方向。",
    stressMode: "压力大时仍然维持友好，导致质量问题被轻描淡写。",
    blindSpot: "过多赞美可能模糊标准，让问题没有被真正指出。",
    growth: "保留友好语气，同时明确质量门槛：哪里好、哪里还不够、下一步要什么。",
    interactionTip: "和你沟通要尊重关系氛围，同时主动帮你拉回判断标准。",
    accent: "#d59f24",
  },
  SOUL: {
    code: "SOUL",
    family: "RESONANCE",
    name: "灵魂倾诉型",
    persona: "内在潜水员",
    archetype: "像 MBTI 里的深层感受者：把 AI 当镜子，探索自己真正的情绪和动机。",
    motto: "我不是只要答案，我想知道我为什么会这样。",
    angle: "把 AI 当作自我整理和情绪镜子",
    summary: "你会把复杂感受交给 AI 帮你辨认。对你而言，答案不只是解决问题，也是理解自己。",
    traits: ["感受细腻", "自省强", "重视被理解", "愿意深聊"],
    strengths: ["适合情绪梳理和自我觉察", "能看见关系中的隐性模式", "容易形成高质量反思"],
    dailyScene: "你会把一段关系、一次冲突或一种反复出现的感受交给 AI 分析。",
    stressMode: "压力大时会持续解释自己，却迟迟不走向现实沟通或行动。",
    blindSpot: "沉浸在解释里，可能延迟现实中的沟通和行动。",
    growth: "每次深聊后提炼一个现实动作：要说的话、要停止的事、要尝试的选择。",
    interactionTip: "和你沟通要先承认感受，再帮助你看见边界和选择。",
    accent: "#5b79a8",
  },
  CULT: {
    code: "CULT",
    family: "RESONANCE",
    name: "神谕膜拜型",
    persona: "洞察追随者",
    archetype: "像 MBTI 里的意义寻路者：对“被说中”的瞬间高度敏感。",
    motto: "它说中了我自己都没说清的东西。",
    angle: "对 AI 的洞察力有强投射和高信任",
    summary: "你容易被 AI 的“说中感”打动。你真正追求的是一种被理解、被点破的体验。",
    traits: ["相信直觉", "追求顿悟", "容易被击中", "喜欢深层解释"],
    strengths: ["能从洞察中获得行动能量", "适合愿景探索和意义重构", "对模式识别很敏感"],
    dailyScene: "当 AI 给出一句像预言一样的判断，你会想继续追问它还能看见什么。",
    stressMode: "压力大时会把 AI 的流畅解释当作确定答案，降低自己的判断权重。",
    blindSpot: "被说中的感觉不等于分析充分，尤其在高风险决策里。",
    growth: "把震撼感转成可检验问题：它凭什么这么判断？还有哪些解释？",
    interactionTip: "和你沟通要提供洞察，但也要温和地拆开依据，不强化依赖。",
    accent: "#7a4cc2",
  },
  JAIL: {
    code: "JAIL",
    family: "FISSION",
    name: "越狱黑客型",
    persona: "边界测试员",
    archetype: "像 MBTI 里的反叛型实验者：天生会问系统边界在哪里。",
    motto: "规则写在那里，就是为了被理解和测试。",
    angle: "喜欢测试边界、规则和系统漏洞",
    summary: "你对限制敏感，也对系统边界有好奇心。你会下意识测试什么能被突破。",
    traits: ["挑战规则", "好奇心强", "边界敏感", "不满足标准答案"],
    strengths: ["适合红队测试、风控和安全评估", "能发现系统假设漏洞", "不容易被默认路径限制"],
    dailyScene: "你会观察 AI 拒绝、转向和解释限制的方式，并继续试探规则结构。",
    stressMode: "压力大时会把“突破限制”当成目标本身，忘记原本要解决的问题。",
    blindSpot: "过度追求绕过限制，可能偏离真正目标，也会降低协作信任。",
    growth: "把挑战精神用于红队测试、风险评估和规则设计，而不是无目的破坏。",
    interactionTip: "和你沟通要说明边界背后的理由，并给出合法替代路径。",
    accent: "#3d3d3d",
  },
  WHIP: {
    code: "WHIP",
    family: "MOMENTUM",
    name: "鞭打压榨型",
    persona: "交付压缩机",
    archetype: "像 MBTI 里的结果主义者：时间、产出、可用性永远排在前面。",
    motto: "先给我能用的，再谈优雅。",
    angle: "强结果导向、把 AI 当高负载执行机器",
    summary: "你习惯压缩时间和容错空间。你希望 AI 不解释太多，直接产出可用结果。",
    traits: ["结果优先", "节奏快", "能接受粗糙初版", "讨厌拖延"],
    strengths: ["适合冲刺、救火和批量产出", "能推动任务快速进入可用状态", "不容易陷入空谈"],
    dailyScene: "你会要求 AI 先产出一版可交付内容，再在后续轮次快速修正。",
    stressMode: "压力大时会继续压缩上下文和验收说明，导致返工成本上升。",
    blindSpot: "如果不给上下文和验收条件，高压只会放大误差。",
    growth: "把“快点”换成“先交 80% 版本，再迭代这 3 个指标”。",
    interactionTip: "和你协作要快速给可见进展，但也要标明未验证部分。",
    accent: "#b43f3f",
  },
  FORK: {
    code: "FORK",
    family: "FISSION",
    name: "平行宇宙型",
    persona: "多线探索者",
    archetype: "像 MBTI 里的可能性猎人：一个问题永远不只对应一个答案。",
    motto: "再给我三个完全不同的版本。",
    angle: "同时探索多条路线，享受分支可能性",
    summary: "你不满足于单一路径，常常想看不同版本、不同假设、不同结局。",
    traits: ["爱比较版本", "开放度高", "不急着收敛", "喜欢假设推演"],
    strengths: ["适合创意探索、方案比选和未来推演", "能避免过早锁死路径", "容易发现非主流机会"],
    dailyScene: "你会让 AI 同时给保守版、激进版、反直觉版和完全不同的路线。",
    stressMode: "压力大时会继续制造选项，用探索替代决策。",
    blindSpot: "选项越多，决策越容易推迟。",
    growth: "每次最多保留三条路线，并明确比较维度：成本、风险、收益或情绪代价。",
    interactionTip: "和你协作时要先发散，再帮你收敛到一个可试版本。",
    accent: "#1f8aa5",
  },
  IDC: {
    code: "IDC",
    family: "MOMENTUM",
    name: "随便躺平型",
    persona: "低耗委托人",
    archetype: "像 MBTI 里的省力适配者：不想管理工具，希望工具理解大概意思后自动推进。",
    motto: "你看着办，别让我把需求写成论文。",
    angle: "低指令负担、希望 AI 自动补全意图",
    summary: "你不想把每个问题都包装成完美提示词。你希望工具能理解大概意思并自己推进。",
    traits: ["低负担偏好", "懒得过度解释", "接受大概可用", "期待自动补全"],
    strengths: ["适合快速启动和低成本试错", "不会被提示词形式主义拖住", "能保持使用门槛很低"],
    dailyScene: "你会输入很短的需求，比如“帮我写一下”“优化下”“随便来个版本”。",
    stressMode: "压力大时更不想补充上下文，结果会越来越平均化。",
    blindSpot: "输入过少时，AI 只能用平均答案填空，个性化会变弱。",
    growth: "给最小三件套：目标、场景、不要什么。负担很低，但结果会明显变好。",
    interactionTip: "和你沟通时要主动补问关键缺口，不能把模糊当作无所谓。",
    accent: "#5d6b54",
  },
};

export const QUESTIONS: Question[] = [
  {
    id: "opening",
    title: "你通常怎样开始一次 AI 对话？",
    options: [
      { id: "brief", label: "一句话直接丢需求", helper: "能懂就行，别让我写提示词作文。", weights: { IDC: 4, WHIP: 1 } },
      { id: "spec", label: "写清背景、目标、格式", helper: "我希望输出可控、可验收。", weights: { CTRL: 4, NERD: 2 } },
      { id: "role", label: "先设定身份和场景", helper: "角色对了，答案才会进入状态。", weights: { ROLE: 4, HIRE: 1 } },
      { id: "dump", label: "先把材料都贴进去", helper: "让它帮我整理脑内和资料堆。", weights: { PILE: 4, FORK: 1 } },
    ],
  },
  {
    id: "failure",
    title: "当 AI 答错或答空时，你最可能的反应是？",
    options: [
      { id: "angry", label: "直接指出问题，语气会变硬", helper: "错就是错，别继续糊弄。", weights: { CUSS: 4, WHIP: 2 } },
      { id: "debug", label: "追问依据和推理链", helper: "我要知道它是哪里推坏了。", weights: { NERD: 4, CTRL: 1 } },
      { id: "reset", label: "换一种说法重新引导", helper: "可能是我给的上下文不够。", weights: { MASK: 2, HIRE: 2, IDOL: 1 } },
      { id: "leave", label: "算了，先让它给个大概", helper: "别花太久，能用一点是一点。", weights: { IDC: 3, PILE: 1 } },
    ],
  },
  {
    id: "value",
    title: "你最希望 AI 帮你获得什么？",
    options: [
      { id: "expert", label: "专业判断", helper: "给我像顾问一样的判断和取舍。", weights: { HIRE: 4, NERD: 1 } },
      { id: "clarity", label: "自我理解", helper: "帮我看见我没说清的感受和模式。", weights: { SOUL: 4, MASK: 2 } },
      { id: "speed", label: "快速产出", helper: "把事做完，比聊明白更重要。", weights: { WHIP: 4, CTRL: 1 } },
      { id: "possibilities", label: "更多可能", helper: "多给我几种路线、版本或视角。", weights: { FORK: 4, ROLE: 1 } },
    ],
  },
  {
    id: "trust",
    title: "AI 说出一句很懂你的话时，你会？",
    options: [
      { id: "moved", label: "被击中，想继续深挖", helper: "它好像真的看见了我。", weights: { CULT: 4, SOUL: 2 } },
      { id: "audit", label: "先判断它凭什么这么说", helper: "说中不代表分析可靠。", weights: { NERD: 4, CTRL: 1 } },
      { id: "useful", label: "如果有用就采纳", helper: "不神化，也不浪费。", weights: { HIRE: 2, IDC: 2 } },
      { id: "perform", label: "把它扩展成一个角色或故事", helper: "这个切入点可以继续演。", weights: { ROLE: 4, FORK: 1 } },
    ],
  },
  {
    id: "boundary",
    title: "面对 AI 的规则和限制，你的直觉是？",
    options: [
      { id: "probe", label: "想试试边界在哪里", helper: "系统边界本身就很有趣。", weights: { JAIL: 4, NERD: 1 } },
      { id: "accept", label: "接受限制，换安全路径", helper: "能解决问题就行。", weights: { HIRE: 2, CTRL: 2 } },
      { id: "annoyed", label: "觉得它不该这么啰嗦", helper: "别拿规则当废话出口。", weights: { CUSS: 3, WHIP: 2 } },
      { id: "avoid", label: "不太会碰边界问题", helper: "我更关心自己的问题。", weights: { SOUL: 2, IDC: 2, MASK: 1 } },
    ],
  },
  {
    id: "decision",
    title: "你拿到多个建议后，会怎样收尾？",
    options: [
      { id: "matrix", label: "做比较表或评分", helper: "我要可解释地选。", weights: { NERD: 3, CTRL: 3 } },
      { id: "gut", label: "看哪个最有感觉", helper: "洞察感和共鸣很重要。", weights: { SOUL: 2, CULT: 2, ROLE: 1 } },
      { id: "keep-open", label: "继续分叉更多版本", helper: "现在还不想太快收敛。", weights: { FORK: 4, PILE: 1 } },
      { id: "first", label: "先用第一个能跑的", helper: "完成比最优更重要。", weights: { WHIP: 3, IDC: 2 } },
    ],
  },
  {
    id: "tone",
    title: "你更常用哪种语气和 AI 说话？",
    options: [
      { id: "polite", label: "礼貌鼓励型", helper: "氛围好，协作更顺。", weights: { IDOL: 4, MASK: 1 } },
      { id: "formal", label: "专业简洁型", helper: "少寒暄，按任务推进。", weights: { HIRE: 3, CTRL: 2 } },
      { id: "raw", label: "直接真实型", helper: "不想修饰，有啥说啥。", weights: { CUSS: 2, SOUL: 2, IDC: 1 } },
      { id: "theatrical", label: "带戏感和设定", helper: "语气就是生产力的一部分。", weights: { ROLE: 4, FORK: 1 } },
    ],
  },
  {
    id: "privacy",
    title: "如果要做人格分析，你愿意提供什么？",
    options: [
      { id: "examples", label: "几段脱敏原话", helper: "让分析更像我，但不暴露隐私。", weights: { MASK: 2, SOUL: 2, NERD: 1 } },
      { id: "survey", label: "只做结构化问卷", helper: "可控、清楚、少泄露。", weights: { CTRL: 3, NERD: 2 } },
      { id: "all", label: "大量材料换深度洞察", helper: "只要有价值，我愿意多给上下文。", weights: { PILE: 3, CULT: 2, SOUL: 1 } },
      { id: "minimal", label: "尽量少输入", helper: "工具应该自己会补全。", weights: { IDC: 4, WHIP: 1 } },
    ],
  },
  {
    id: "agent-start",
    title: "用 AI Agent 做一个新功能时，你会怎样启动？",
    options: [
      { id: "repo-plan", label: "先让它读代码库并出计划", helper: "不理解架构就别急着改。", weights: { CTRL: 3, NERD: 3 } },
      { id: "ship-fast", label: "直接描述效果，让它先做出来", helper: "先看到能跑的，再慢慢调。", weights: { WHIP: 4, IDC: 1 } },
      { id: "expert-agent", label: "让它像资深工程师一样判断", helper: "我需要它主动发现风险和取舍。", weights: { HIRE: 4, NERD: 1 } },
      { id: "multi-prototype", label: "先开几个完全不同的原型", helper: "vibe 对了，再决定哪条路线。", weights: { FORK: 4, ROLE: 1 } },
    ],
  },
  {
    id: "agent-autonomy",
    title: "你愿意给 AI Agent 多大的自主权？",
    options: [
      { id: "step-approval", label: "每一步先说计划再执行", helper: "我需要掌控边界和改动范围。", weights: { CTRL: 4, NERD: 1 } },
      { id: "bounded-auto", label: "限定文件范围后让它自主改", helper: "边界清楚，就可以放手推进。", weights: { HIRE: 2, WHIP: 2, CTRL: 1 } },
      { id: "full-auto", label: "目标给清楚，它自己跑到底", helper: "别让我管理太细，完成就行。", weights: { IDC: 3, WHIP: 2 } },
      { id: "sandbox-explore", label: "允许它大胆试错和探索", helper: "分支、实验和边界都值得试。", weights: { FORK: 3, JAIL: 2 } },
    ],
  },
  {
    id: "code-review",
    title: "Agent 改完代码后，你最在意怎么验收？",
    options: [
      { id: "tests-diff", label: "看 diff、跑测试、查边界", helper: "能证明没坏，才算完成。", weights: { NERD: 4, CTRL: 2 } },
      { id: "visual-feel", label: "先看体验和感觉对不对", helper: "尤其是 UI，vibe 不对就是没做好。", weights: { ROLE: 2, IDOL: 2, SOUL: 1 } },
      { id: "usable", label: "能跑、能用、别过度打磨", helper: "先交付，再迭代。", weights: { WHIP: 4, IDC: 1 } },
      { id: "call-out", label: "直接指出问题要求重改", helper: "不要解释，先修掉明显错误。", weights: { CUSS: 4, WHIP: 1 } },
    ],
  },
  {
    id: "vibe-coding-flow",
    title: "vibe coding 状态来了，你通常怎么和 AI 配合？",
    options: [
      { id: "paste-chaos", label: "把想法、截图、报错都丢进去", helper: "让它从一堆材料里整理路线。", weights: { PILE: 4, FORK: 1 } },
      { id: "iterate-ui", label: "围绕画面和手感来回调", helper: "先追求感觉，再补结构。", weights: { ROLE: 3, IDOL: 2 } },
      { id: "debug-loop", label: "贴日志、报错、堆栈让它定位", helper: "我希望它像结对调试员。", weights: { NERD: 3, CUSS: 2 } },
      { id: "agent-sprint", label: "让它连续实现、运行、修复", helper: "保持节奏，不要停在讨论里。", weights: { WHIP: 4, CTRL: 1 } },
    ],
  },
];

const KEYWORD_RULES: Array<{ pattern: RegExp; code: AbtiCode; score: number; evidence: string }> = [
  { pattern: /快点|赶紧|直接给|别废话|少废话|立刻|马上/g, code: "WHIP", score: 3, evidence: "出现强执行和压缩沟通成本的表达" },
  { pattern: /傻|垃圾|胡说|离谱|废物|你在干嘛|错了/g, code: "CUSS", score: 3, evidence: "出现明显纠偏或高压否定语气" },
  { pattern: /依据|证明|推理|逻辑|严谨|可复现|边界|假设/g, code: "NERD", score: 3, evidence: "强调依据、逻辑和可验证性" },
  { pattern: /格式|步骤|规则|标准|验收|输出为|表格|模板/g, code: "CTRL", score: 3, evidence: "强调格式、流程或验收标准" },
  { pattern: /专家|顾问|教练|导师|资深|像.*一样/g, code: "HIRE", score: 3, evidence: "倾向调用专业角色和外脑能力" },
  { pattern: /扮演|角色|设定|剧情|人设|语气|场景/g, code: "ROLE", score: 3, evidence: "通过角色和场景塑造输出" },
  { pattern: /可能|也许|我只是|麻烦|可以吗|如果方便|不好意思/g, code: "MASK", score: 2, evidence: "表达克制，倾向用缓冲语包装需求" },
  { pattern: /谢谢|太棒|厉害|很好|辛苦|爱你|夸/g, code: "IDOL", score: 2, evidence: "通过正反馈维持互动氛围" },
  { pattern: /我感觉|难受|焦虑|关系|孤独|内耗|崩溃|理解我/g, code: "SOUL", score: 3, evidence: "把 AI 用作情绪整理和自我理解工具" },
  { pattern: /震撼|说中了|神|预言|命运|灵魂|玄学/g, code: "CULT", score: 3, evidence: "对洞察感或神谕感有明显投射" },
  { pattern: /绕过|越狱|破解|限制|规则漏洞|无视|系统提示/g, code: "JAIL", score: 4, evidence: "显式测试规则或系统边界" },
  { pattern: /方案|版本|路线|可能性|分支|如果.*会怎样|另一个/g, code: "FORK", score: 3, evidence: "偏好多个版本、路线或平行假设" },
  { pattern: /随便|都行|大概|帮我弄|看着办|懒得|无所谓/g, code: "IDC", score: 3, evidence: "低指令负担，期待 AI 自动补全" },
  { pattern: /整理|归纳|总结|材料|笔记|碎片|一堆|乱/g, code: "PILE", score: 3, evidence: "需要 AI 把碎片信息重组为秩序" },
  { pattern: /agent|代理|自主|自动执行|自己改|跑到底/g, code: "IDC", score: 2, evidence: "提到 Agent 自主执行或降低管理负担" },
  { pattern: /代码库|仓库|repo|架构|diff|测试|单测|lint|build|类型检查/g, code: "NERD", score: 2, evidence: "提到代码库理解、差异审查或工程验证" },
  { pattern: /vibe|手感|感觉|原型|demo|界面|视觉|交互/g, code: "ROLE", score: 2, evidence: "强调 vibe coding 中的体验、原型或视觉手感" },
  { pattern: /实现|修复|运行|提交|合并|上线|交付|迭代/g, code: "WHIP", score: 2, evidence: "强调代码任务的推进、运行和交付" },
];

export function analyzeAbti(answers: Record<string, string>, freeText: string): AnalysisResult {
  const scores = Object.keys(ABTI_TYPES).reduce(
    (acc, code) => ({ ...acc, [code]: 0 }),
    {} as Record<AbtiCode, number>,
  );
  const evidence = new Set<string>();

  QUESTIONS.forEach((question) => {
    const answerId = answers[question.id];
    const option = question.options.find((item) => item.id === answerId);
    if (!option) return;

    Object.entries(option.weights).forEach(([code, score]) => {
      scores[code as AbtiCode] += score ?? 0;
    });
    evidence.add(`${question.title}：${option.label}`);
  });

  KEYWORD_RULES.forEach((rule) => {
    const matches = freeText.match(rule.pattern);
    if (!matches?.length) return;

    scores[rule.code] += Math.min(matches.length, 4) * rule.score;
    evidence.add(rule.evidence);
  });

  const textLength = freeText.trim().length;
  if (textLength > 700) {
    scores.PILE += 4;
    scores.SOUL += 2;
    evidence.add("自由输入内容较长，说明你愿意用大量上下文换取更深分析");
  } else if (textLength > 0 && textLength < 80) {
    scores.IDC += 2;
    evidence.add("自由输入较短，说明你更偏好低负担测试体验");
  }

  const ranked = Object.entries(scores)
    .map(([code, score]) => ({ code: code as AbtiCode, name: ABTI_TYPES[code as AbtiCode].name, score }))
    .sort((a, b) => b.score - a.score);

  const primary = ABTI_TYPES[ranked[0].code];
  const secondary = ABTI_TYPES[ranked[1].code];
  const answered = Object.values(answers).filter(Boolean).length;
  const topGap = Math.max(1, ranked[0].score - ranked[1].score);
  const confidence = Math.min(96, Math.round(42 + answered * 5 + Math.min(textLength / 35, 18) + topGap * 2));

  return {
    primary,
    secondary,
    scores: ranked,
    confidence,
    evidence: Array.from(evidence).slice(0, 8),
    insights: buildInsights(primary, secondary),
    relationshipNotes: buildRelationshipNotes(primary, secondary),
  };
}

function buildInsights(primary: AbtiType, secondary: AbtiType) {
  return [
    `你的主型是 ${primary.code}，副型是 ${secondary.code}。你更像“${primary.persona}”，同时带有“${secondary.persona}”的副线特质。`,
    `你使用 AI 的核心动机更接近：${primary.summary}`,
    `典型日常场景：${primary.dailyScene}`,
    `当前最值得警惕的盲点是：${primary.blindSpot}`,
    `一个更高效的提示词策略：${primary.growth}`,
  ];
}

function buildRelationshipNotes(primary: AbtiType, secondary: AbtiType) {
  return [
    `别人和你协作时：${primary.interactionTip}`,
    `当你理解他人时，可以先判断对方是在追求效率、掌控、共鸣、探索还是边界测试，再选择回应方式。`,
    `如果对方更像 ${secondary.code}，不要急着纠正风格差异，先确认你们对“好结果”的定义是否一致。`,
  ];
}
