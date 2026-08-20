import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Braces,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Layers3,
  LockKeyhole,
  Network,
  RotateCcw,
  Route,
  Sparkles,
  TerminalSquare,
  TestTube2,
  TimerReset,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import './styles.css';
import { lessons, lessonsByPhase } from './course-data';
import { LessonPage } from './LessonPage';

type Phase = {
  id: string;
  index: string;
  weeks: string;
  title: string;
  subtitle: string;
  color: string;
  topics: string[];
  output: string;
  checks: string[];
};

const phases: Phase[] = [
  {
    id: 'foundation', index: '01', weeks: 'W01—02', title: 'LLM 应用基础', subtitle: '先把模型当成一种不稳定的计算接口', color: '#d8ff3e',
    topics: ['Token 与上下文窗口', 'Prompt 结构', '流式输出', 'Structured Outputs', '成本与限流'],
    output: '结构化需求提取器',
    checks: ['完成一个流式 React 页面', '用 Zod 校验模型输出', '记录 token、延迟和错误'],
  },
  {
    id: 'tools', index: '02', weeks: 'W03—04', title: 'Tool Calling', subtitle: '让模型获取信息，并在边界内采取行动', color: '#ff8d70',
    topics: ['工具 Schema', '多轮工具循环', '超时与重试', '幂等设计', '读写权限分离'],
    output: '开发知识助手 v1',
    checks: ['实现至少 4 个模拟工具', '工具输入全部经过校验', '写操作增加确认步骤'],
  },
  {
    id: 'ui', index: '03', weeks: 'W05—07', title: 'Agent 产品交互', subtitle: '把不可见的推理过程变成可信的用户体验', color: '#7dd3fc',
    topics: ['SSE / WebSocket', '工具状态渲染', '中断与继续', '引用展示', '会话持久化'],
    output: '可解释的 Agent 工作台',
    checks: ['展示当前执行步骤', '支持失败重试', '实现审批和继续执行'],
  },
  {
    id: 'rag', index: '04', weeks: 'W08—10', title: 'RAG 知识系统', subtitle: '检索证据，而不是让模型凭记忆作答', color: '#c4a7ff',
    topics: ['文档解析与切分', 'Embedding', 'pgvector', '混合检索', 'Reranking 与引用'],
    output: '代码库 / 文档问答系统',
    checks: ['回答附带可点击来源', '准备 30 条评测问题', '统计召回率与正确率'],
  },
  {
    id: 'workflow', index: '05', weeks: 'W11—13', title: 'Agent Workflow', subtitle: '用确定性流程托住模型的不确定性', color: '#f7c948',
    topics: ['Agent Loop', 'Router', '状态机', 'Checkpoint', 'Human-in-the-loop'],
    output: '前端需求分析 Agent',
    checks: ['拆分可观察的工作节点', '设计停止条件', '支持暂停后恢复'],
  },
  {
    id: 'mcp', index: '06', weeks: 'W14—15', title: 'MCP 与系统集成', subtitle: '让能力成为可复用、可发现的标准接口', color: '#78e5b5',
    topics: ['Host / Client / Server', 'Tools / Resources', 'Transport', '鉴权', '信任边界'],
    output: '一个可运行的 MCP Server',
    checks: ['实现 3—5 个只读工具', '实现一个需确认的写工具', '补齐日志和错误响应'],
  },
  {
    id: 'backend', index: '07', weeks: 'W16—18', title: '全栈生产能力', subtitle: '让一分钟任务和一万次请求都能正确结束', color: '#fe77aa',
    topics: ['PostgreSQL', 'Redis / Queue', '后台 Worker', 'Auth / RBAC', 'Docker / CI/CD'],
    output: '可部署的多服务系统',
    checks: ['任务异步执行', '状态持久化', 'Docker Compose 一键启动'],
  },
  {
    id: 'production', index: '08', weeks: 'W19—24', title: '评测、安全与作品', subtitle: '从“能跑”走向“可证明地可靠”', color: '#ff8d70',
    topics: ['Evals', 'Tracing', 'Prompt Injection', '最小权限', '作品集与面试'],
    output: '前端研发协作 Agent',
    checks: ['50—100 条回归样本', '完成威胁模型', '发布 Demo 与评测报告'],
  },
];

const competencies = [
  { icon: Braces, label: '模型接口', value: 'Prompt · Schema · Tool', level: 78 },
  { icon: Database, label: '知识系统', value: 'RAG · Memory · Search', level: 64 },
  { icon: Route, label: 'Agent 运行时', value: 'State · Loop · HITL', level: 72 },
  { icon: TerminalSquare, label: '后端工程', value: 'API · Queue · Auth', level: 68 },
  { icon: TestTube2, label: '可靠性', value: 'Eval · Trace · Cost', level: 82 },
  { icon: LockKeyhole, label: '安全边界', value: 'Guardrail · Audit · RBAC', level: 76 },
];

const resources = [
  { type: 'CORE', title: 'OpenAI Agents SDK', desc: '用 TypeScript 学习 Agent、工具、handoff、guardrail 与 tracing。', href: 'https://openai.github.io/openai-agents-js/', color: '#d8ff3e' },
  { type: 'PROTOCOL', title: 'Model Context Protocol', desc: '理解 Host、Client、Server 以及工具和资源的标准化连接。', href: 'https://modelcontextprotocol.io/docs/getting-started/intro', color: '#78e5b5' },
  { type: 'RUNTIME', title: 'LangGraph JS', desc: '在需要持久执行、中断恢复和复杂状态时再引入。', href: 'https://docs.langchain.com/oss/javascript/langgraph/overview', color: '#c4a7ff' },
  { type: 'UI', title: 'Vercel AI SDK', desc: '发挥前端优势，做好流式消息、工具状态和生成式 UI。', href: 'https://ai-sdk.dev/docs/agents', color: '#7dd3fc' },
  { type: 'SECURITY', title: 'OWASP LLM Top 10', desc: '系统学习 Prompt Injection、数据泄漏与过度代理风险。', href: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', color: '#ff8d70' },
  { type: 'DEPLOY', title: 'Cloudflare Workers', desc: '掌握边缘运行时、静态资产和生产部署。', href: 'https://developers.cloudflare.com/workers/', color: '#f7c948' },
];

const stack = [
  ['LANG', 'TypeScript', '主语言'], ['UI', 'React + Vite', '产品界面'], ['AGENT', 'OpenAI Agents SDK', '运行时'],
  ['DATA', 'PostgreSQL + pgvector', '数据与检索'], ['ASYNC', 'Redis + BullMQ', '后台任务'], ['SHIP', 'Docker + Cloudflare', '交付部署'],
];

function App() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('agent-shift-course-progress-v1') || '[]'); } catch { return []; }
  });
  const [openPhase, setOpenPhase] = useState('foundation');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => localStorage.setItem('agent-shift-course-progress-v1', JSON.stringify(completed)), [completed]);
  useEffect(() => {
    const onHashChange = () => { setHash(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const percent = Math.round((completed.length / lessons.length) * 100);
  const currentLesson = lessons.find((item) => !completed.includes(item.id)) ?? lessons[lessons.length - 1];
  const currentPhase = phases.find((phase) => phase.id === currentLesson.phaseId) ?? phases[phases.length - 1];
  const circumference = 2 * Math.PI * 52;

  const progressText = useMemo(() => {
    if (percent === 100) return '路线完成，去交付真实价值。';
    if (percent >= 50) return '已经过半，开始把可靠性做深。';
    if (percent > 0) return '保持节奏，作品比教程更重要。';
    return '从第一个可运行的调用开始。';
  }, [percent]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const togglePhase = (phaseId: string) => {
    const ids = lessonsByPhase(phaseId).map((item) => item.id);
    setCompleted((prev) => ids.every((id) => prev.includes(id)) ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };

  const lessonId = hash.startsWith('#lesson/') ? hash.slice('#lesson/'.length) : '';
  const activeLesson = lessons.find((item) => item.id === lessonId);
  if (activeLesson) {
    const index = lessons.indexOf(activeLesson);
    return <LessonPage lesson={activeLesson} completed={completed.includes(activeLesson.id)} previous={lessons[index - 1]} next={lessons[index + 1]} onToggle={toggleComplete} />;
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Agent Shift 首页">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span>AGENT <i>SHIFT</i></span>
        </a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a href="#map" onClick={() => setMenuOpen(false)}>能力地图</a>
          <a href="#roadmap" onClick={() => setMenuOpen(false)}>24 周路线</a>
          <a href="#course" onClick={() => setMenuOpen(false)}>每周课程</a>
          <a href="#stack" onClick={() => setMenuOpen(false)}>技术栈</a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>资料库</a>
        </nav>
        <a className="header-cta" href="#roadmap">开始学习 <ArrowRight size={15} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="切换菜单">{menuOpen ? <X /> : <span>MENU</span>}</button>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-noise" />
          <div className="eyebrow"><span>ROADMAP / 2026</span><span className="eyebrow-line" /><span>FOR FRONTEND ENGINEERS</span></div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>从前端，<br />到能交付的<br /><em>Agent 工程师</em></h1>
              <p>不是重学一遍计算机，也不是把职业押在 Prompt 上。用你已有的产品与工程能力，补齐模型、工具、后端和可靠性。</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#roadmap">查看 24 周计划 <ArrowDown size={18} /></a>
                <a className="button button-ghost" href="#capstone">看毕业作品 <ArrowRight size={18} /></a>
              </div>
            </div>

            <aside className="progress-card">
              <div className="progress-top"><span>YOUR PROGRESS</span><span>LOCAL / PRIVATE</span></div>
              <div className="progress-visual">
                <svg viewBox="0 0 120 120" aria-label={`已完成 ${percent}%`}>
                  <circle className="ring-base" cx="60" cy="60" r="52" />
                  <circle className="ring-value" cx="60" cy="60" r="52" style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - percent / 100) }} />
                </svg>
                <strong>{percent}<small>%</small></strong>
              </div>
              <p>{progressText}</p>
              <div className="next-up">
                <span>NEXT UP</span>
                <b>W{String(currentLesson.week).padStart(2, '0')} / {currentLesson.title}</b>
                <small>{currentPhase.title}</small>
              </div>
              {completed.length > 0 && <button className="reset-button" onClick={() => setCompleted([])}><RotateCcw size={13} /> 重置进度</button>}
            </aside>
          </div>

          <div className="hero-stats">
            <div><strong>24</strong><span>周学习周期</span></div>
            <div><strong>10<small>h</small></strong><span>建议每周投入</span></div>
            <div><strong>08</strong><span>能力阶段</span></div>
            <div><strong>04</strong><span>可展示作品</span></div>
          </div>
        </section>

        <section className="manifesto section-pad">
          <div className="section-label">00 / 定位</div>
          <div className="manifesto-copy">
            <p>AI Agent 工程师不是“会调模型的人”。</p>
            <h2>你要成为的是<br /><span>全栈工程师</span> × <span>LLM 应用工程师</span><br />× <span>自动化工作流工程师</span></h2>
          </div>
          <div className="manifesto-note"><Bot size={24} /><p>目标：让 Agent 在真实业务里<span>做对事、用对工具、守住权限，并且失败后能恢复。</span></p></div>
        </section>

        <section className="capability section-pad" id="map">
          <div className="section-head">
            <div><div className="section-label">01 / 能力地图</div><h2>六块能力，<br />组成一个完整交付者</h2></div>
            <p>数字不是考试分数，而是投入权重。前端体验依然是你的锋芒，后端与可靠性决定你能走多远。</p>
          </div>
          <div className="capability-grid">
            {competencies.map(({ icon: Icon, label, value, level }, i) => (
              <article className="capability-card" key={label}>
                <div className="capability-icon"><Icon size={22} /></div>
                <span className="card-index">0{i + 1}</span>
                <h3>{label}</h3>
                <p>{value}</p>
                <div className="meter"><span style={{ width: `${level}%` }} /></div>
                <small>LEARNING WEIGHT / {level}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="roadmap section-pad" id="roadmap">
          <div className="section-head roadmap-head">
            <div><div className="section-label">02 / 24 周路线</div><h2>一路构建，<br />一路留下作品</h2></div>
            <div className="roadmap-rule"><span>学习原则</span><b>60% 项目</b><b>20% 文档</b><b>20% 评测复盘</b></div>
          </div>
          <div className="phase-list">
            {phases.map((phase) => {
              const isOpen = openPhase === phase.id;
              const phaseLessons = lessonsByPhase(phase.id);
              const isDone = phaseLessons.every((item) => completed.includes(item.id));
              return (
                <article className={`phase ${isOpen ? 'is-open' : ''} ${isDone ? 'is-done' : ''}`} key={phase.id} style={{ '--phase-color': phase.color } as React.CSSProperties}>
                  <button className="phase-summary" onClick={() => setOpenPhase(isOpen ? '' : phase.id)} aria-expanded={isOpen}>
                    <span className="phase-index">{phase.index}</span>
                    <span className="phase-weeks">{phase.weeks}</span>
                    <span className="phase-title"><b>{phase.title}</b><small>{phase.subtitle}</small></span>
                    <span className="phase-output"><small>BUILD</small>{phase.output}</span>
                    <span className="phase-chevron"><ChevronDown size={20} /></span>
                  </button>
                  <div className="phase-detail">
                    <div className="topic-cluster">
                      <span className="detail-label">WHAT TO LEARN</span>
                      <div>{phase.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                    </div>
                    <div className="acceptance">
                      <span className="detail-label">DEFINITION OF DONE</span>
                      {phase.checks.map((check) => <p key={check}><Check size={14} />{check}</p>)}
                    </div>
                    <a className="phase-course-link" href={`#lesson/${phaseLessons[0].id}`}>查看本阶段课程 <ArrowRight size={14}/></a>
                    <button className={isDone ? 'complete-button done' : 'complete-button'} onClick={() => togglePhase(phase.id)}>
                      {isDone ? <CheckCircle2 size={17} /> : <Circle size={17} />}{isDone ? '已完成此阶段' : '标记为完成'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="course section-pad" id="course">
          <div className="section-head">
            <div><div className="section-label">03 / 每周课程</div><h2>不是目录，<br />是 24 份行动手册</h2></div>
            <p>每周都有核心知识、参考代码、动手实验、交付物、自测问题和可核验的完成标准。进度仅保存在当前浏览器。</p>
          </div>
          <div className="course-progress"><span>{completed.length} / {lessons.length} WEEKS</span><i><b style={{width:`${percent}%`}} /></i><strong>{percent}%</strong></div>
          <div className="week-grid">
            {lessons.map((item) => {
              const phase = phases.find((entry) => entry.id === item.phaseId)!;
              const done = completed.includes(item.id);
              return <a className={done ? 'week-card is-done' : 'week-card'} href={`#lesson/${item.id}`} key={item.id} style={{'--week-color':phase.color} as React.CSSProperties}>
                <div><span>W{String(item.week).padStart(2,'0')}</span>{done ? <CheckCircle2 size={17}/> : <ArrowRight size={17}/>}</div>
                <small>{phase.title}</small><h3>{item.title}</h3><p>{item.subtitle}</p>
                <footer><b>{item.deliverable}</b><span>{item.practice.length} 个实验</span></footer>
              </a>;
            })}
          </div>
        </section>

        <section className="stack-section section-pad" id="stack">
          <div className="stack-copy">
            <div className="section-label light">03 / 推荐技术栈</div>
            <h2>TypeScript 优先，<br /><em>Python 第二。</em></h2>
            <p>先用熟悉的语言把 Agent 做成完整产品，再用 Python 打开数据处理和更广的 AI 生态。</p>
            <div className="stack-path"><span>NOW</span><b>TS 全栈 Agent</b><ArrowRight /><b>Python 补强</b><ArrowRight /><b>生产系统</b></div>
          </div>
          <div className="stack-table">
            {stack.map(([type, name, use]) => <div className="stack-row" key={type}><span>{type}</span><b>{name}</b><small>{use}</small><ArrowRight size={16} /></div>)}
          </div>
        </section>

        <section className="capstone section-pad" id="capstone">
          <div className="section-label">04 / 毕业作品</div>
          <div className="capstone-grid">
            <div className="capstone-title">
              <span className="mini-chip"><GraduationCap size={15} /> CAPSTONE</span>
              <h2>前端研发<br /><em>协作 Agent</em></h2>
              <p>把你的行业经验变成壁垒：让 Agent 读需求、查代码、跑检查、生成自测报告，但把关键动作留给人。</p>
            </div>
            <div className="workflow">
              {[
                [Code2, '01', '读取需求与仓库'], [Network, '02', '检索文档与接口'], [Layers3, '03', '分析影响与计划'],
                [Wrench, '04', '生成 Patch'], [TestTube2, '05', '运行质量检查'], [LockKeyhole, '06', '人工确认交付'],
              ].map(([Icon, n, text]) => {
                const FlowIcon = Icon as typeof Code2;
                return <div className="workflow-node" key={String(n)}><span>{String(n)}</span><FlowIcon size={22} /><b>{String(text)}</b></div>;
              })}
            </div>
          </div>
          <div className="proof-strip">
            <div><GitBranch /><span><b>完整 README</b><small>架构、运行、权衡</small></span></div>
            <div><TestTube2 /><span><b>评测报告</b><small>质量、成本、延迟</small></span></div>
            <div><LockKeyhole /><span><b>威胁模型</b><small>权限、审批、审计</small></span></div>
            <div><Cloud /><span><b>在线 Demo</b><small>真实、稳定、可体验</small></span></div>
          </div>
        </section>

        <section className="resources section-pad" id="resources">
          <div className="section-head">
            <div><div className="section-label">05 / 官方资料库</div><h2>少追热点，<br />多读一手资料</h2></div>
            <p>框架会变，基本问题不会：模型能看到什么、工具能做什么、失败后怎么恢复、结果如何被证明。</p>
          </div>
          <div className="resource-grid">
            {resources.map((resource) => (
              <a className="resource-card" href={resource.href} target="_blank" rel="noreferrer" key={resource.title} style={{ '--resource-color': resource.color } as React.CSSProperties}>
                <span>{resource.type}</span><ExternalLink size={17} />
                <h3>{resource.title}</h3><p>{resource.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="closing section-pad">
          <div className="closing-orbit"><Zap size={30} /></div>
          <p>YOUR EXISTING EXPERIENCE IS NOT BAGGAGE.</p>
          <h2>别重新成为一个初级工程师。<br /><em>升级你已经擅长的事。</em></h2>
          <a className="button button-primary" href="#roadmap">从第一阶段开始 <ArrowRight size={18} /></a>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>AGENT <i>SHIFT</i></span></div>
        <p>24-WEEK ROADMAP FOR FRONTEND ENGINEERS</p>
        <span>Progress is stored only in your browser.</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
