import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clipboard, X } from 'lucide-react';
import type { Lesson } from './course-data';

type Props = {
  lesson: Lesson;
  completed: boolean;
  previous?: Lesson;
  next?: Lesson;
  onToggle: (id: string) => void;
};

export function LessonPage({ lesson, completed, previous, next, onToggle }: Props) {
  const copyCode = async () => navigator.clipboard.writeText(lesson.code);
  return (
    <div className="lesson-page">
      <header className="lesson-topbar">
        <a href="#course"><ArrowLeft size={17}/> 返回课程目录</a>
        <span>WEEK {String(lesson.week).padStart(2, '0')} / 24</span>
        <a href="#course" aria-label="关闭课程"><X size={18}/></a>
      </header>
      <main className="lesson-main">
        <section className="lesson-intro">
          <span className="lesson-kicker">WEEK {String(lesson.week).padStart(2, '0')} · HANDS-ON COURSE</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
          <div className="lesson-goals">
            {lesson.acceptance.slice(0,3).map((goal, index) => <div key={goal}><b>0{index + 1}</b>{goal}</div>)}
          </div>
        </section>

        <section className="lesson-section">
          <span className="lesson-section-no">01 / 核心知识</span>
          <h2>先理解，再动手</h2>
          <div className="concept-list">
            {lesson.concepts.map((concept, index) => <article key={concept}><b>{String(index + 1).padStart(2, '0')}</b><p>{concept}</p></article>)}
          </div>
        </section>

        <section className="lesson-section">
          <span className="lesson-section-no">02 / 参考实现</span>
          <div className="lesson-section-title"><h2>把概念落到代码</h2><button onClick={copyCode}><Clipboard size={14}/> 复制代码</button></div>
          <pre className="lesson-code"><code>{lesson.code}</code></pre>
        </section>

        <section className="lesson-section">
          <span className="lesson-section-no">03 / 本周实验</span>
          <h2>按顺序完成这组任务</h2>
          <ol className="practice-list">
            {lesson.practice.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}
          </ol>
          <div className="deliverable"><small>DELIVERABLE</small><b>{lesson.deliverable}</b></div>
        </section>

        <section className="lesson-section">
          <span className="lesson-section-no">04 / 验收与复盘</span>
          <div className="acceptance-panel">
            <div><h2>Definition of Done</h2>{lesson.acceptance.map(item => <p key={item}><Check size={15}/>{item}</p>)}</div>
            <aside><small>SELF CHECK</small><p>{lesson.selfCheck}</p></aside>
          </div>
          <button className={completed ? 'lesson-complete is-done' : 'lesson-complete'} onClick={() => onToggle(lesson.id)}>
            {completed ? <CheckCircle2/> : <Circle/>}{completed ? '本周已完成' : '完成实验后标记本周'}
          </button>
        </section>

        <nav className="lesson-nav">
          {previous ? <a href={`#lesson/${previous.id}`}><ArrowLeft size={16}/><span><small>上一周</small>{previous.title}</span></a> : <span />}
          {next ? <a href={`#lesson/${next.id}`}><span><small>下一周</small>{next.title}</span><ArrowRight size={16}/></a> : <a href="#course"><span><small>课程完成</small>返回目录</span><Check size={16}/></a>}
        </nav>
      </main>
    </div>
  );
}
