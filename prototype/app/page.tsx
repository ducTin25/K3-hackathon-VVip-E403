"use client";

import { useMemo, useState } from "react";

type Screen = "learn" | "quiz" | "result" | "dashboard" | "topic";

const questions = [
  {
    topic: "AI Agent",
    source: "Trang 8",
    level: "Hiểu",
    question: "Điểm nào phân biệt rõ nhất một AI Agent với LLM chatbot thông thường?",
    options: [
      "Agent luôn dùng một mô hình lớn hơn",
      "Agent có thể lập kế hoạch, hành động và quan sát kết quả",
      "Agent luôn có giao diện trò chuyện",
      "Agent trả lời nhanh hơn chatbot",
    ],
    correct: 1,
    why: "Agent không chỉ sinh câu trả lời. Nó vận hành theo vòng lặp plan → act → observe → adapt để chủ động hoàn thành mục tiêu.",
  },
  {
    topic: "ReAct Loop",
    source: "Trang 23",
    level: "Áp dụng",
    question: "Trong ReAct, điều gì nên xảy ra ngay sau khi agent gọi tool search_docs(query)?",
    options: [
      "Kết thúc và trả lời người dùng ngay",
      "Viết lại system prompt",
      "Nhận Observation rồi quyết định bước tiếp theo",
      "Xóa toàn bộ context",
    ],
    correct: 2,
    why: "Kết quả tool trở thành Observation. Agent dùng tín hiệu này để xác định đã đủ thông tin hay cần hành động tiếp.",
  },
  {
    topic: "Tool Calling",
    source: "Trang 31",
    level: "Phân biệt",
    question: "Function Calling cải thiện điểm gì so với action dạng chuỗi text của ReAct gốc?",
    options: [
      "Đảm bảo model không bao giờ hallucinate",
      "Giảm nhu cầu parse action bằng regex và chuẩn hóa tham số",
      "Loại bỏ hoàn toàn vòng lặp agent",
      "Cho model quyền truy cập mọi công cụ",
    ],
    correct: 1,
    why: "Function Calling dùng schema có cấu trúc để mô tả tool và tham số, giảm lỗi cú pháp và việc parse chuỗi bằng regex.",
  },
  {
    topic: "Context",
    source: "Trang 45",
    level: "Áp dụng",
    question: "Khi lịch sử hội thoại quá dài, chiến lược nào trực tiếp giúp giữ thông tin chính mà giảm số token?",
    options: ["Write", "Select", "Compress", "Isolate"],
    correct: 2,
    why: "Compress tóm tắt lịch sử và tool output, giữ tín hiệu quan trọng nhưng giảm lượng nội dung trong context.",
  },
];

const weakTopics = [
  { name: "ReAct Loop", mastery: 43, wrong: 57, affected: 612, color: "red" },
  { name: "Tool Calling", mastery: 51, wrong: 49, affected: 526, color: "orange" },
  { name: "AI Agent vs Chatbot", mastery: 58, wrong: 42, affected: 451, color: "orange" },
  { name: "Context Management", mastery: 71, wrong: 29, affected: 311, color: "blue" },
  { name: "Prompt Engineering", mastery: 82, wrong: 18, affected: 193, color: "green" },
];

function VLogo() {
  return (
    <div className="brand" aria-label="VLearn">
      <span className="mark"><i /><b /></span>
      <strong><em>V</em>Learn</strong>
    </div>
  );
}

function Icon({ children }: { children: string }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("learn");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [showBrief, setShowBrief] = useState(false);

  const score = useMemo(
    () => questions.reduce((sum, item, index) => sum + (answers[index] === item.correct ? 1 : 0), 0),
    [answers],
  );

  function switchRole(next: "student" | "teacher") {
    setRole(next);
    setScreen(next === "student" ? "learn" : "dashboard");
    setShowBrief(false);
  }

  function startQuiz() {
    setQuestion(0);
    setAnswers({});
    setChecked(false);
    setScreen("quiz");
  }

  function nextQuestion() {
    if (!checked) {
      setChecked(true);
      return;
    }
    if (question === questions.length - 1) {
      setScreen("result");
    } else {
      setQuestion(question + 1);
      setChecked(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <div className="top-left">
          <button className="back" aria-label="Quay lại">‹</button>
          <VLogo />
          <nav>
            <button className={role === "student" ? "active" : ""} onClick={() => switchRole("student")}>
              <Icon>▣</Icon> Không gian học
            </button>
            <button className={role === "teacher" ? "active" : ""} onClick={() => switchRole("teacher")}>
              <Icon>⌁</Icon> Tổng quan lớp
            </button>
          </nav>
        </div>
        <div className="top-actions">
          <span className="live-dot">AI đang tổng hợp</span>
          <button className="language">VI</button>
          <button className="profile">
            <span>{role === "student" ? "NĐ" : "GV"}</span>
            <div><b>{role === "student" ? "Nguyễn Đức Tín" : "Giảng viên COMP2010"}</b><small>{role === "student" ? "Học viên" : "1074 học viên"}</small></div>
            <i>⌄</i>
          </button>
        </div>
      </header>

      {role === "student" && screen === "learn" && <LearnScreen onQuiz={startQuiz} />}
      {role === "student" && screen === "quiz" && (
        <QuizScreen
          index={question}
          selected={answers[question]}
          checked={checked}
          onSelect={(option) => !checked && setAnswers({ ...answers, [question]: option })}
          onNext={nextQuestion}
          onExit={() => setScreen("learn")}
        />
      )}
      {role === "student" && screen === "result" && (
        <ResultScreen
          score={score}
          answers={answers}
          onRetry={startQuiz}
          onLearn={() => setScreen("learn")}
          onTeacher={() => switchRole("teacher")}
        />
      )}
      {role === "teacher" && screen === "dashboard" && (
        <Dashboard
          onTopic={() => setScreen("topic")}
          showBrief={showBrief}
          onBrief={() => setShowBrief(!showBrief)}
        />
      )}
      {role === "teacher" && screen === "topic" && (
        <TopicDetail onBack={() => setScreen("dashboard")} />
      )}
    </main>
  );
}

function LearnScreen({ onQuiz }: { onQuiz: () => void }) {
  return (
    <div className="learn-layout">
      <aside className="course-sidebar">
        <div className="course-heading">
          <Icon>▤</Icon>
          <div><b>Học liệu môn học</b><small>Chương, slide và tài liệu đã upload</small></div>
        </div>
        <div className="day muted"><span>▷</span><b>Day 1</b><small>2 tài liệu · Đã học</small><i>⌄</i></div>
        <div className="day muted"><span>▷</span><b>Day 2</b><small>1 tài liệu · Đã học</small><i>⌄</i></div>
        <div className="day open">
          <span>▶</span><b>Day 3</b><small>2 tài liệu · Đang học</small><i>⌃</i>
          <div className="file selected"><span>▧</span><div><b>day03-tu-chatbot-den-agentic.pdf</b><small>50 trang</small></div><i>✓</i></div>
          <div className="file"><span>▧</span><div><b>agent-react-practice.pdf</b><small>24 trang</small></div></div>
        </div>
        <div className="day"><span>▷</span><b>Day 4</b><small>3 tài liệu · Chưa học</small><i>⌄</i></div>
        <div className="day"><span>▷</span><b>Day 5</b><small>3 tài liệu · Chưa học</small><i>⌄</i></div>
      </aside>

      <section className="reader">
        <div className="reader-toolbar">
          <button className="tool active"><Icon>⌖</Icon> Đọc</button>
          <button className="tool"><Icon>✎</Icon> Bút</button>
          <button className="tool"><Icon>⌁</Icon> Highlight</button>
          <span className="divider" />
          <span className="page-note">Trang 23 · 1 note</span>
          <div className="zoom"><button>−</button><b>100%</b><button>＋</button></div>
          <span className="spacer" />
          <button className="square">↓</button><button className="square">↗</button>
        </div>

        <div className="slide-wrap">
          <div className="slide-number">DAY 03 · TỪ CHATBOT ĐẾN AGENTIC AGENT</div>
          <article className="slide">
            <div className="slide-brand"><VLogo /><span>23</span></div>
            <div className="red-rule" />
            <p className="eyebrow">CORE CONCEPT</p>
            <h1>ReAct Loop</h1>
            <p className="subtitle">Thought → Action → Observation</p>
            <div className="loop">
              <div className="loop-node start"><b>User Input</b><small>Mục tiêu cần hoàn thành</small></div>
              <span>→</span>
              <div className="loop-node"><b>Thought</b><small>Phân tích bước tiếp</small></div>
              <span>→</span>
              <div className="loop-node blue"><b>Action</b><small>tool_name(args)</small></div>
              <span>→</span>
              <div className="loop-node amber"><b>Observation</b><small>Kết quả từ tool</small></div>
              <span className="return">↶ chưa đủ</span>
            </div>
            <div className="slide-insight">
              <b>Vì sao ReAct mạnh?</b>
              <p>Agent quan sát kết quả thật sau mỗi hành động, rồi mới quyết định tiếp tục hay tạo Final Answer.</p>
            </div>
          </article>
          <div className="reader-pager"><button>‹</button><span>Trang <b>23</b> / 50</span><button>›</button></div>
        </div>
      </section>

      <aside className="study-panel">
        <div className="panel-title"><div><span className="spark">✦</span><b>Kiểm tra mức độ hiểu</b></div><button>×</button></div>
        <div className="quiz-card">
          <span className="new-badge">Mới · AI tạo từ slide</span>
          <h2>Bạn đã thật sự hiểu Day 3?</h2>
          <p>4 câu hỏi ngắn về những phần học viên thường nhầm: Agent, ReAct, Tool Calling và Context.</p>
          <div className="quiz-meta">
            <span><Icon>◷</Icon><b>3 phút</b></span>
            <span><Icon>◎</Icon><b>4 câu</b></span>
            <span><Icon>▤</Icon><b>Trang 8–45</b></span>
          </div>
          <button className="primary wide" onClick={onQuiz}>Bắt đầu kiểm tra <span>→</span></button>
          <small>Kết quả dùng để cá nhân hoá nội dung ôn tập. Không tính điểm.</small>
        </div>
        <div className="why-card">
          <b>Vì sao có quiz này?</b>
          <p>AI nhận thấy <strong>ReAct và Tool Calling</strong> là hai nội dung dễ nhầm trong lớp.</p>
          <div className="source-chip">✓ Câu hỏi có dẫn nguồn slide</div>
        </div>
      </aside>
    </div>
  );
}

function QuizScreen({
  index, selected, checked, onSelect, onNext, onExit,
}: {
  index: number; selected?: number; checked: boolean;
  onSelect: (index: number) => void; onNext: () => void; onExit: () => void;
}) {
  const item = questions[index];
  return (
    <div className="quiz-page">
      <div className="quiz-shell">
        <div className="quiz-head">
          <div>
            <span className="quiz-label">KIỂM TRA NHANH · DAY 3</span>
            <h1>Kiểm tra mức độ hiểu</h1>
          </div>
          <button className="exit" onClick={onExit}>Thoát ×</button>
        </div>
        <div className="progress-row">
          <div className="progress"><i style={{ width: `${((index + (checked ? 1 : 0)) / questions.length) * 100}%` }} /></div>
          <b>{index + 1}/{questions.length}</b>
        </div>
        <div className="question-grid">
          <section className="question-card">
            <div className="question-tags"><span>{item.topic}</span><span>{item.level}</span><span>▤ {item.source}</span></div>
            <h2>{item.question}</h2>
            <div className="options">
              {item.options.map((option, optionIndex) => {
                const chosen = selected === optionIndex;
                const correct = checked && optionIndex === item.correct;
                const wrong = checked && chosen && optionIndex !== item.correct;
                return (
                  <button
                    key={option}
                    className={`${chosen ? "chosen" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
                    onClick={() => onSelect(optionIndex)}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    <b>{option}</b>
                    {correct && <i>✓</i>}{wrong && <i>×</i>}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className={`feedback ${selected === item.correct ? "good" : "bad"}`}>
                <div><span>{selected === item.correct ? "✓" : "!"}</span><b>{selected === item.correct ? "Chính xác!" : "Chưa chính xác"}</b></div>
                <p>{item.why}</p>
                <button>↗ Xem lại {item.source}</button>
              </div>
            )}
            <div className="quiz-footer">
              <span>{checked ? "AI giải thích dựa trên nội dung slide" : "Chọn một đáp án để tiếp tục"}</span>
              <button className="primary" disabled={selected === undefined} onClick={onNext}>
                {!checked ? "Kiểm tra đáp án" : index === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo"} →
              </button>
            </div>
          </section>
          <aside className="quiz-side">
            <div className="mini-slide">
              <span>TRÍCH TỪ {item.source.toUpperCase()}</span>
              <h3>{item.topic}</h3>
              <div className="mini-diagram"><i /><i /><i /><i /></div>
              <p>Nội dung nguồn được đánh dấu để bạn có thể kiểm tra lại câu trả lời của AI.</p>
            </div>
            <div className="privacy-note"><span>◉</span><p><b>Không tính điểm</b>Kết quả chỉ dùng để tìm phần bạn cần ôn tập.</p></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  score, answers, onRetry, onLearn, onTeacher,
}: { score: number; answers: Record<number, number>; onRetry: () => void; onLearn: () => void; onTeacher: () => void }) {
  const percent = Math.round((score / questions.length) * 100);
  const missed = questions.filter((item, index) => answers[index] !== item.correct);
  const mastered = questions.filter((item, index) => answers[index] === item.correct);
  const reviewPages = [...new Set(missed.map((item) => item.source))].join(", ");
  const aiComment = score === questions.length
    ? "Bạn hiểu chắc cả bốn nội dung của Day 3 và đã áp dụng đúng vào tình huống. Hãy chuyển sang bài tập thực hành để kiểm tra khả năng vận dụng."
    : score >= 2
      ? `Bạn đã nắm được ${mastered.map((item) => item.topic).join(" và ")}. Tuy nhiên, câu trả lời cho thấy bạn còn nhầm ở ${missed.map((item) => item.topic).join(" và ")}; nên ôn lại cơ chế trước khi làm bài thực hành.`
      : `Bạn đã nhận ra một phần nội dung, nhưng còn nhầm ${missed.length} khái niệm quan trọng. Đừng học lại toàn bộ Day 3; hãy tập trung vào ${missed.map((item) => item.topic).join(", ")} theo thứ tự gợi ý bên dưới.`;
  return (
    <div className="result-page">
      <section className="result-hero">
        <div className="result-copy">
          <span className="quiz-label">KẾT QUẢ KIỂM TRA · DAY 3</span>
          <h1>Bạn đã hoàn thành!</h1>
          <p>Bạn nắm chắc nền tảng về AI Agent, nhưng cần củng cố thêm cách ReAct sử dụng Observation.</p>
          <div className="result-actions">
            <button className="primary" onClick={onLearn}>Ôn lại phần còn yếu →</button>
            <button className="secondary" onClick={onRetry}>Làm lại quiz</button>
          </div>
        </div>
        <div className="score-ring" style={{ "--score": `${percent * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{score}/{questions.length}</strong><span>câu đúng</span></div>
        </div>
      </section>
      <section className="ai-assessment">
        <div className="assessment-mark">✦</div>
        <div className="assessment-copy">
          <div className="section-heading">
            <div><div><span className="assessment-label">NHẬN XÉT KIẾN THỨC CÁ NHÂN CỦA AI</span><h2>Những gì bạn đã hiểu và cần củng cố</h2></div></div>
            <span className="updated">Vừa tổng hợp</span>
          </div>
          <p>{aiComment}</p>
          <div className="assessment-points">
            <div className="strength">
              <span>✓</span>
              <div><b>Bạn đã làm tốt</b><p>{mastered.length ? mastered.map((item) => item.topic).join(" · ") : "Bạn đã hoàn thành toàn bộ quiz và sẵn sàng xem lại kiến thức."}</p></div>
            </div>
            <div className="focus">
              <span>!</span>
              <div><b>Nên tập trung tiếp theo</b><p>{missed.length ? missed.map((item) => item.topic).join(" · ") : "Thử bài tập tình huống nâng cao để củng cố khả năng áp dụng."}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="answer-summary">
        <div className="section-heading">
          <div><span className="summary-icon">▤</span><div><h2>Tổng hợp câu trả lời của bạn</h2><p>Xem lại kết quả và nội dung cần nhớ trong từng câu.</p></div></div>
          <span className="summary-score">{score}/{questions.length} câu đúng</span>
        </div>
        <div className="answer-list">
          {questions.map((item, index) => {
            const isCorrect = answers[index] === item.correct;
            return (
              <div className={`answer-row ${isCorrect ? "is-correct" : "is-wrong"}`} key={item.question}>
                <span className="answer-status">{isCorrect ? "✓" : "×"}</span>
                <div className="answer-content">
                  <div><span>Câu {index + 1} · {item.topic}</span><span className="answer-source">{item.source}</span></div>
                  <b>{item.question}</b>
                  <p>
                    {isCorrect
                      ? `Bạn trả lời đúng: ${item.options[item.correct]}`
                      : `Bạn chọn: ${item.options[answers[index]]}. Đáp án đúng: ${item.options[item.correct]}`}
                  </p>
                </div>
                <span className="answer-label">{isCorrect ? "Đúng" : "Cần xem lại"}</span>
              </div>
            );
          })}
        </div>
        <div className="next-study">
          <div className="rec-icon">↻</div>
          <div>
            <span>GỢI Ý ÔN TẬP TIẾP THEO</span>
            <h3>{missed.length ? `Xem lại ${missed.map((item) => item.topic).join(" và ")}` : "Thử bài luyện tập nâng cao"}</h3>
            <p>{missed.length ? `Đọc lại ${reviewPages}, chú ý phần giải thích đáp án đúng, sau đó làm 2 câu mới để kiểm tra lại mức độ hiểu.` : "Bạn đã trả lời đúng toàn bộ. Hãy chuyển sang một tình huống thực tế để vận dụng các khái niệm vừa học."}</p>
          </div>
          <button className="primary" onClick={onLearn}>{missed.length ? `Mở ${missed[0].source}` : "Mở bài thực hành"} →</button>
        </div>
      </section>
      <button className="demo-link" onClick={onTeacher}>Xem dữ liệu này được tổng hợp cho giảng viên như thế nào →</button>
    </div>
  );
}

function Dashboard({ onTopic, showBrief, onBrief }: { onTopic: () => void; showBrief: boolean; onBrief: () => void }) {
  return (
    <div className="dashboard-page">
      <section className="dashboard-heading">
        <div><span className="eyebrow red">VLEARN · VINUNI AI THỰC CHIẾN</span><h1>Tổng quan mức độ hiểu của lớp</h1><p>COMP2010 · Khoá 3 + 4 Phase 1 · Day 3</p></div>
        <div className="heading-actions"><button className="secondary">7 ngày gần nhất ⌄</button><button className="primary" onClick={onBrief}>✦ {showBrief ? "Ẩn AI Brief" : "Tạo AI Brief"}</button></div>
      </section>

      {showBrief && (
        <section className="ai-brief">
          <div className="brief-mark">✦</div>
          <div>
            <div className="brief-title"><span>AI BRIEF · VỪA TỔNG HỢP</span><button onClick={onBrief}>×</button></div>
            <h2>Điều giảng viên cần biết trước buổi học tiếp theo</h2>
            <p><strong>ReAct Loop là lỗ hổng lớn nhất:</strong> 57% học viên trả lời sai, chủ yếu vì nhầm rằng agent có thể trả lời ngay sau Action mà không cần đọc Observation. Sai lệch tập trung ở câu áp dụng, không phải câu ghi nhớ.</p>
            <div className="brief-actions"><div><b>Khuyến nghị 10 phút đầu giờ</b><span>Demo một agent booking thất bại khi bỏ qua Observation, sau đó cho lớp dự đoán bước tiếp theo.</span></div><button onClick={onTopic}>Xem phân tích →</button></div>
          </div>
        </section>
      )}

      <section className="metric-grid">
        <Metric icon="◉" label="Học viên đã làm quiz" value="862" note="/ 1.074 học viên" trend="80,3%" />
        <Metric icon="✓" label="Điểm trung bình" value="61%" note="2,4 / 4 câu" trend="−8% so với Day 2" warn />
        <Metric icon="△" label="Chủ đề cần giảng lại" value="3" note="trên tổng số 5" trend="Ưu tiên ReAct" danger />
        <Metric icon="⌁" label="Câu hỏi với Tutor" value="127" note="sau khi làm quiz" trend="+34% về ReAct" warn />
      </section>

      <div className="dashboard-grid">
        <section className="weak-card">
          <div className="card-head"><div><h2>Học viên đang yếu phần nào?</h2><p>Xếp hạng theo tỷ lệ trả lời sai và số học viên bị ảnh hưởng.</p></div><span>862 lượt làm</span></div>
          <div className="topic-table">
            <div className="table-head"><span>CHỦ ĐỀ</span><span>MỨC ĐỘ NẮM VỮNG</span><span>HỌC VIÊN ẢNH HƯỞNG</span><span /></div>
            {weakTopics.map((topic, index) => (
              <button className="topic-row" key={topic.name} onClick={onTopic}>
                <span className="topic-name"><i>{index + 1}</i><b>{topic.name}</b>{index === 0 && <em>Ưu tiên</em>}</span>
                <span className="topic-progress"><b>{topic.mastery}%</b><i><u style={{ width: `${topic.mastery}%` }} className={topic.color} /></i><small>{topic.wrong}% trả lời sai</small></span>
                <span><strong>{topic.affected}</strong><small>học viên</small></span>
                <span>›</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="signals-card">
          <div className="card-head"><div><h2>Tín hiệu cần chú ý</h2><p>AI phát hiện từ quiz + chatlog.</p></div></div>
          <div className="signal danger">
            <span>!</span><div><b>Misconception phổ biến</b><p>“Có Tool Calling là đủ để trở thành Agent”</p><small>31% học viên · 267 lượt chọn</small></div>
          </div>
          <div className="signal warn">
            <span>?</span><div><b>Hỏi lại nhiều sau quiz</b><p>“Observation dùng để làm gì?”</p><small>43 câu hỏi · tăng 2,1×</small></div>
          </div>
          <div className="signal blue">
            <span>↗</span><div><b>Đã cải thiện</b><p>Context Management tăng 14 điểm sau phần giải thích.</p><small>So với lần kiểm tra đầu</small></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, note, trend, warn, danger }: { icon: string; label: string; value: string; note: string; trend: string; warn?: boolean; danger?: boolean }) {
  return (
    <div className="metric-card">
      <span className={`metric-icon ${danger ? "danger" : warn ? "warn" : ""}`}>{icon}</span>
      <div><small>{label}</small><strong>{value}</strong><p>{note}</p><span className={danger ? "red-text" : warn ? "amber-text" : "blue-text"}>{trend}</span></div>
    </div>
  );
}

function TopicDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="topic-page">
      <button className="breadcrumb" onClick={onBack}>‹ Tổng quan lớp</button>
      <section className="topic-hero">
        <div><span className="priority">ƯU TIÊN GIẢNG LẠI</span><h1>ReAct Loop</h1><p>Thought → Action → Observation · Nguồn: Day 3, trang 23–31</p></div>
        <div className="topic-score"><strong>43%</strong><span>mức độ nắm vững</span><small>−18 điểm so với trung bình Day 3</small></div>
      </section>
      <section className="diagnosis-grid">
        <div className="diagnosis-main">
          <div className="card-head"><div><h2>Học viên đang nhầm ở đâu?</h2><p>Phân tích từ 862 lượt làm và 43 câu hỏi với Tutor.</p></div><span className="source-chip">✓ Đủ dữ liệu</span></div>
          <div className="misconception-list">
            <div className="misconception top"><span>01</span><div><b>Bỏ qua Observation sau khi gọi tool</b><p>Học viên cho rằng Action có thể trực tiếp tạo Final Answer, nên không kiểm tra kết quả thật từ công cụ.</p><div><i style={{ width: "57%" }} /><strong>57%</strong><small>491 học viên</small></div></div></div>
            <div className="misconception"><span>02</span><div><b>Nhầm Thought với nội dung phải hiển thị cho người dùng</b><p>Học viên chưa phân biệt reasoning nội bộ và phần giải thích an toàn có thể quan sát.</p><div><i style={{ width: "36%" }} /><strong>36%</strong><small>310 học viên</small></div></div></div>
            <div className="misconception"><span>03</span><div><b>Cho rằng mọi tác vụ đều cần nhiều vòng lặp</b><p>Học viên chưa nhận ra agent có thể dừng ngay khi Observation đã đủ để trả lời.</p><div><i style={{ width: "22%" }} /><strong>22%</strong><small>190 học viên</small></div></div></div>
          </div>
        </div>
        <aside className="intervention">
          <span className="spark">✦</span><h2>Gợi ý can thiệp</h2><p>AI đề xuất dựa trên dạng sai, không tự thay đổi nội dung khoá học.</p>
          <div><span>1</span><p><b>Demo lỗi trong 5 phút</b>Cho agent booking trả lời trước khi đọc kết quả lịch trống.</p></div>
          <div><span>2</span><p><b>Cho lớp dự đoán bước kế</b>Dừng trace sau Action và hỏi: “Cần gì để quyết định tiếp?”</p></div>
          <div><span>3</span><p><b>Kiểm tra lại bằng 2 câu mới</b>Dùng tình huống khác slide để đo mức hiểu, không đo ghi nhớ.</p></div>
          <button className="primary">Tạo mini-quiz củng cố →</button>
          <small>Giảng viên sẽ được duyệt câu hỏi trước khi gửi.</small>
        </aside>
      </section>
      <section className="evidence-section">
        <div className="card-head"><div><h2>Bằng chứng theo câu hỏi</h2><p>Mỗi kết luận có thể truy ngược về câu quiz và trang nguồn.</p></div><button className="secondary">Xuất báo cáo</button></div>
        <table>
          <thead><tr><th>CÂU HỎI</th><th>ĐANG KIỂM TRA</th><th>TỶ LỆ ĐÚNG</th><th>NGUỒN</th><th>ĐỘ TIN CẬY</th></tr></thead>
          <tbody>
            <tr><td><b>Sau Action, bước nào cần diễn ra?</b><small>862 lượt trả lời</small></td><td>Thứ tự ReAct</td><td><strong className="red-text">43%</strong></td><td><span className="source-chip">Trang 23</span></td><td><span className="confidence">Cao</span></td></tr>
            <tr><td><b>Khi nào agent nên kết thúc vòng lặp?</b><small>809 lượt trả lời</small></td><td>Điều kiện dừng</td><td><strong className="amber-text">58%</strong></td><td><span className="source-chip">Trang 23</span></td><td><span className="confidence">Cao</span></td></tr>
            <tr><td><b>Function Calling thay đổi Action thế nào?</b><small>776 lượt trả lời</small></td><td>ReAct vs tool schema</td><td><strong>64%</strong></td><td><span className="source-chip">Trang 31</span></td><td><span className="confidence medium">Vừa</span></td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
