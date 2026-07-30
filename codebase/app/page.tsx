"use client";

import { useMemo, useState } from "react";
import type { LearningDiagnosis } from "../lib/diagnosis";
import type { QuizScope } from "../lib/lesson";
import type { QuizQuestion } from "../lib/quiz-generator";

type Phase = "learn" | "generating" | "quiz" | "diagnosing" | "result";

const chapters = [
  { id: "DAY03-CH-01", title: "Nền tảng AI Agent", slides: "Trang 8–12" },
  { id: "DAY03-CH-02", title: "ReAct và công cụ", slides: "Trang 23–38" },
  { id: "DAY03-CH-03", title: "Quản lý ngữ cảnh", slides: "Trang 45" },
];

const knowledgePoints = [
  { id: "DAY03-KP-AGENT-VS-CHATBOT", title: "AI Agent và Chatbot", page: "8" },
  { id: "DAY03-KP-AGENT-CYCLE", title: "Chu trình AI Agent", page: "12" },
  { id: "DAY03-KP-REACT-LOOP", title: "Vòng lặp ReAct", page: "23" },
  { id: "DAY03-KP-TOOL-CALLING", title: "Tool Calling", page: "31" },
  { id: "DAY03-KP-FUNCTION-CALLING", title: "Function Calling", page: "38" },
  { id: "DAY03-KP-CONTEXT-COMPRESS", title: "Nén context", page: "45" },
];

function Logo() {
  return (
    <div className="brand" aria-label="VLearn">
      <span className="logo-mark"><i /><b /></span>
      <strong><em>V</em>Learn</strong>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("learn");
  const [scopeType, setScopeType] = useState<QuizScope["type"]>("lesson");
  const [scopeId, setScopeId] = useState("DAY03");
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState(false);
  const [diagnosis, setDiagnosis] = useState<LearningDiagnosis | null>(null);
  const [score, setScore] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);
  const [error, setError] = useState("");

  const scope = useMemo<QuizScope>(() => {
    if (scopeType === "chapter") {
      return { type: "chapter", lessonId: "DAY03", chapterId: scopeId };
    }
    if (scopeType === "knowledge_point") {
      return {
        type: "knowledge_point",
        lessonId: "DAY03",
        knowledgePointId: scopeId,
      };
    }
    return { type: "lesson", lessonId: "DAY03" };
  }, [scopeId, scopeType]);

  function changeScopeType(next: QuizScope["type"]) {
    setScopeType(next);
    setScopeId(
      next === "chapter"
        ? chapters[0].id
        : next === "knowledge_point"
          ? knowledgePoints[0].id
          : "DAY03",
    );
  }

  async function generateQuiz() {
    setError("");
    setPhase("generating");
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scope, questionCount }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Không thể tạo quiz");
      }
      if (payload.result.status === "insufficient_source") {
        setError(payload.result.insufficiencyReason);
        setPhase("learn");
        return;
      }
      setQuestions(payload.result.questions);
      setAnswers(Array(payload.result.questions.length).fill(null));
      setCurrent(0);
      setChecked(false);
      setDiagnosis(null);
      setPhase("quiz");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể tạo quiz");
      setPhase("learn");
    }
  }

  function selectAnswer(option: number) {
    if (checked) return;
    setAnswers((previous) =>
      previous.map((answer, index) => (index === current ? option : answer)),
    );
  }

  async function nextQuestion() {
    if (!checked) {
      setChecked(true);
      return;
    }
    if (current < questions.length - 1) {
      setCurrent((value) => value + 1);
      setChecked(false);
      return;
    }
    await finishQuiz();
  }

  async function finishQuiz() {
    setPhase("diagnosing");
    setError("");
    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scope, questions, selectedOptions: answers }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Không thể phân tích kết quả");
      }
      setScore(payload.score);
      setDiagnosis(payload.diagnosis);
      setUsedFallback(Boolean(payload.fallback));
      setPhase("result");
    } catch (cause) {
      const calculated = questions.filter(
        (question, index) => answers[index] === question.correctOption,
      ).length;
      setScore(calculated);
      setDiagnosis(buildClientFallback(questions, answers, calculated));
      setUsedFallback(true);
      setError(cause instanceof Error ? cause.message : "AI chưa thể phân tích");
      setPhase("result");
    }
  }

  function retryQuiz() {
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setChecked(false);
    setDiagnosis(null);
    setPhase("quiz");
  }

  return (
    <main>
      <Header phase={phase} onHome={() => setPhase("learn")} />
      {phase === "learn" && (
        <LearnScreen
          scopeType={scopeType}
          scopeId={scopeId}
          questionCount={questionCount}
          error={error}
          onScopeType={changeScopeType}
          onScopeId={setScopeId}
          onCount={setQuestionCount}
          onGenerate={generateQuiz}
        />
      )}
      {(phase === "generating" || phase === "diagnosing") && (
        <LoadingScreen diagnosis={phase === "diagnosing"} />
      )}
      {phase === "quiz" && questions[current] && (
        <QuizScreen
          question={questions[current]}
          index={current}
          total={questions.length}
          selected={answers[current]}
          checked={checked}
          onSelect={selectAnswer}
          onNext={nextQuestion}
          onExit={() => setPhase("learn")}
        />
      )}
      {phase === "result" && diagnosis && (
        <ResultScreen
          questions={questions}
          answers={answers}
          score={score}
          diagnosis={diagnosis}
          fallback={usedFallback}
          error={error}
          onRetry={retryQuiz}
          onNew={() => setPhase("learn")}
        />
      )}
    </main>
  );
}

function Header({ phase, onHome }: { phase: Phase; onHome: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button" onClick={onHome} aria-label="Về bài học">←</button>
        <Logo />
        <nav>
          <button className="active" onClick={onHome}>▣ Không gian học</button>
          <button disabled>⌁ Tổng quan lớp</button>
        </nav>
      </div>
      <div className="topbar-actions">
        <span className="system-pill"><i /> {phase === "generating" || phase === "diagnosing" ? "AI đang xử lý" : "Hệ thống sẵn sàng"}</span>
        <span className="language">VI</span>
        <div className="profile"><span>NĐ</span><div><b>Nguyễn Đức Tín</b><small>Học viên</small></div></div>
      </div>
    </header>
  );
}

function LearnScreen({
  scopeType,
  scopeId,
  questionCount,
  error,
  onScopeType,
  onScopeId,
  onCount,
  onGenerate,
}: {
  scopeType: QuizScope["type"];
  scopeId: string;
  questionCount: 5 | 10;
  error: string;
  onScopeType: (value: QuizScope["type"]) => void;
  onScopeId: (value: string) => void;
  onCount: (value: 5 | 10) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="learn-layout">
      <aside className="course-sidebar">
        <div className="side-title"><span>▤</span><div><b>Học liệu môn học</b><small>Slide đã được đối chiếu</small></div></div>
        <div className="day muted">▷ <b>Day 1</b><small>Đã học</small></div>
        <div className="day muted">▷ <b>Day 2</b><small>Đã học</small></div>
        <div className="day open">▼ <b>Day 3</b><small>Đang học</small>
          <div className="file active"><span>▧</span><div><b>Từ Chatbot đến Agentic Agent</b><small>50 trang · Approved</small></div></div>
        </div>
        <div className="day">▷ <b>Day 4</b><small>Chưa học</small></div>
      </aside>

      <section className="reader">
        <div className="reader-toolbar">
          <button className="active">⌖ Đọc</button><button>✎ Bút</button><button>⌁ Highlight</button>
          <span>Trang 23 · ReAct Loop</span><b>100%</b>
        </div>
        <div className="slide-stage">
          <article className="slide">
            <div className="slide-brand"><Logo /><span>23</span></div>
            <div className="red-rule" />
            <p className="eyebrow">CORE CONCEPT</p>
            <h1>ReAct Loop</h1>
            <p className="subtitle">Thought → Action → Observation</p>
            <div className="loop">
              {["User Input", "Thought", "Action", "Observation"].map((label, index) => (
                <div className={`loop-node n${index}`} key={label}>
                  <b>{label}</b>
                  <small>{["Mục tiêu", "Phân tích", "Gọi công cụ", "Nhận kết quả"][index]}</small>
                </div>
              ))}
            </div>
            <div className="slide-insight"><b>Vì sao ReAct mạnh?</b><p>Agent quan sát kết quả thật sau mỗi hành động rồi mới quyết định bước tiếp theo.</p></div>
          </article>
          <p className="approved-note">✓ Nguồn đã được người phụ trách đối chiếu và phê duyệt</p>
        </div>
      </section>

      <aside className="study-panel">
        <div className="panel-heading"><span>✦</span><div><b>Tạo quiz từ bài học</b><small>DeepSeek · Có dẫn nguồn</small></div></div>
        {error && <div className="error-banner" role="alert">! {error}</div>}
        <label>Phạm vi kiểm tra</label>
        <div className="segmented">
          <button className={scopeType === "lesson" ? "active" : ""} onClick={() => onScopeType("lesson")}>Cả bài</button>
          <button className={scopeType === "chapter" ? "active" : ""} onClick={() => onScopeType("chapter")}>Chương</button>
          <button className={scopeType === "knowledge_point" ? "active" : ""} onClick={() => onScopeType("knowledge_point")}>Điểm kiến thức</button>
        </div>
        {scopeType === "chapter" && (
          <select value={scopeId} onChange={(event) => onScopeId(event.target.value)}>
            {chapters.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.title} · {chapter.slides}</option>)}
          </select>
        )}
        {scopeType === "knowledge_point" && (
          <select value={scopeId} onChange={(event) => onScopeId(event.target.value)}>
            {knowledgePoints.map((point) => <option value={point.id} key={point.id}>{point.title} · Trang {point.page}</option>)}
          </select>
        )}
        <label>Số câu hỏi</label>
        <div className="count-options">
          {[5, 10].map((count) => (
            <button key={count} className={questionCount === count ? "active" : ""} onClick={() => onCount(count as 5 | 10)}>
              <b>{count} câu</b><small>{count === 5 ? "Khoảng 4 phút" : "Khoảng 8 phút"}</small>
            </button>
          ))}
        </div>
        <div className="source-summary">
          <span>▤</span><div><b>Nguồn cố định đã duyệt</b><small>6 slide · 8 điểm kiến thức · Không dùng Internet</small></div>
        </div>
        <button className="primary wide" onClick={onGenerate}>Tạo quiz bằng AI <span>→</span></button>
        <p className="fine-print">Điểm do hệ thống tính. AI chỉ tạo câu hỏi và phân tích phần cần ôn.</p>
      </aside>
    </div>
  );
}

function LoadingScreen({ diagnosis }: { diagnosis: boolean }) {
  return (
    <section className="loading-page">
      <div className="loading-card">
        <div className="ai-orbit"><span>✦</span><i /><i /></div>
        <p className="eyebrow">{diagnosis ? "LEARNING DIAGNOSTIC" : "ASSESSMENT GENERATOR"}</p>
        <h1>{diagnosis ? "Đang tổng hợp kết quả của bạn" : "Đang tạo quiz có căn cứ"}</h1>
        <p>{diagnosis ? "AI đối chiếu câu đúng, câu sai và misconception với danh sách slide được phép gợi ý." : "AI chỉ sử dụng các slide đã được duyệt trong phạm vi bạn chọn."}</p>
        <div className="loading-steps"><span className="done">✓ Lấy nguồn</span><span className="active">● {diagnosis ? "Phân tích evidence" : "Tạo câu hỏi"}</span><span>○ Kiểm tra đầu ra</span></div>
      </div>
    </section>
  );
}

function QuizScreen({
  question,
  index,
  total,
  selected,
  checked,
  onSelect,
  onNext,
  onExit,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: number | null;
  checked: boolean;
  onSelect: (option: number) => void;
  onNext: () => void;
  onExit: () => void;
}) {
  return (
    <section className="quiz-page">
      <div className="quiz-header">
        <div><p className="eyebrow">KIỂM TRA NHANH · DAY 3</p><h1>Kiểm tra mức độ hiểu</h1></div>
        <button className="secondary" onClick={onExit}>Thoát ×</button>
      </div>
      <div className="progress-row"><div><i style={{ width: `${((index + (checked ? 1 : 0)) / total) * 100}%` }} /></div><b>{index + 1}/{total}</b></div>
      <div className="question-grid">
        <article className="question-card">
          <div className="tags"><span>{question.topic}</span><span>{question.level === "apply" ? "Áp dụng" : "Hiểu"}</span><span>▤ Trang {question.sourceRef.displaySlideNumber}</span></div>
          <h2>{question.question}</h2>
          <div className="options">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrect = checked && optionIndex === question.correctOption;
              const isWrong = checked && isSelected && !isCorrect;
              return (
                <button
                  key={`${optionIndex}-${option}`}
                  className={`${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                  onClick={() => onSelect(optionIndex)}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span><b>{option}</b>{isCorrect && <i>✓</i>}{isWrong && <i>×</i>}
                </button>
              );
            })}
          </div>
          {checked && (
            <div className={`feedback ${selected === question.correctOption ? "good" : "bad"}`}>
              <b>{selected === question.correctOption ? "✓ Chính xác" : "! Chưa chính xác"}</b>
              <p>{question.explanation}</p>
              <span>Đối chiếu Trang {question.sourceRef.displaySlideNumber}</span>
            </div>
          )}
          <footer>
            <span>{checked ? "Giải thích được tạo từ slide nguồn" : "Chọn một đáp án để tiếp tục"}</span>
            <button className="primary" disabled={selected === null} onClick={onNext}>
              {!checked ? "Kiểm tra đáp án" : index === total - 1 ? "Xem kết quả" : "Câu tiếp theo"} →
            </button>
          </footer>
        </article>
        <aside className="source-card">
          <p className="eyebrow">TRÍCH TỪ TRANG {question.sourceRef.displaySlideNumber}</p>
          <h3>{question.topic}</h3>
          <div className="source-visual"><i /><i /><i /><i /></div>
          <p>Câu hỏi có mã nguồn <b>{question.sourceRef.slideId}</b>. Bạn có thể quay lại slide để tự kiểm chứng.</p>
          <span className={`confidence ${question.confidence}`}>Độ tin cậy: {question.confidence === "high" ? "cao" : "trung bình"}</span>
        </aside>
      </div>
    </section>
  );
}

function ResultScreen({
  questions,
  answers,
  score,
  diagnosis,
  fallback,
  error,
  onRetry,
  onNew,
}: {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  score: number;
  diagnosis: LearningDiagnosis;
  fallback: boolean;
  error: string;
  onRetry: () => void;
  onNew: () => void;
}) {
  const percent = Math.round((score / questions.length) * 100);
  return (
    <section className="result-page">
      <div className="result-hero">
        <div><p className="eyebrow">KẾT QUẢ KIỂM TRA · DAY 3</p><h1>Bạn đã hoàn thành!</h1><p>{diagnosis.overallSummary}</p>
          <div className="actions"><button className="primary" onClick={onNew}>Ôn phần còn yếu →</button><button className="secondary" onClick={onRetry}>Làm lại quiz</button></div>
        </div>
        <div className="score-ring" style={{ "--score": `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{score}/{questions.length}</strong><span>câu đúng</span></div></div>
      </div>
      {(fallback || error) && <div className="fallback-note">ℹ Đang hiển thị phân tích dự phòng bằng luật. Điểm số và đáp án vẫn chính xác.</div>}
      <div className="diagnosis-card">
        <div className="diagnosis-title"><span>✦</span><div><p className="eyebrow">NHẬN XÉT KIẾN THỨC CÁ NHÂN CỦA AI</p><h2>Những gì bạn đã hiểu và cần củng cố</h2></div><em>Confidence: {diagnosis.confidence}</em></div>
        <div className="diagnosis-columns">
          <div className="strength-box"><b>✓ Bạn đã làm tốt</b>{diagnosis.strengths.length ? diagnosis.strengths.map((item) => <p key={item.topic}>{item.topic} <small>· {item.evidenceQuestionIds.join(", ")}</small></p>) : <p>Chưa đủ câu đúng để xác định điểm mạnh.</p>}</div>
          <div className="weakness-box"><b>! Nên tập trung tiếp theo</b>{diagnosis.weaknesses.length ? diagnosis.weaknesses.map((item) => <p key={`${item.topic}-${item.misconception}`}>{item.topic}: {item.misconception}</p>) : <p>Không phát hiện điểm yếu trong lượt làm này.</p>}</div>
        </div>
      </div>
      <div className="result-grid">
        <section className="answer-summary">
          <div className="section-title"><div><span>▤</span><div><h2>Tổng hợp câu trả lời</h2><p>Xem kết quả và nguồn của từng câu.</p></div></div><b>{score}/{questions.length} câu đúng</b></div>
          {questions.map((question, index) => {
            const correct = answers[index] === question.correctOption;
            return (
              <div className={`answer-row ${correct ? "pass" : "fail"}`} key={question.id}>
                <span>{correct ? "✓" : "!"}</span>
                <div><small>Câu {index + 1} · {question.topic} · Trang {question.sourceRef.displaySlideNumber}</small><b>{question.question}</b><p>{correct ? "Bạn trả lời đúng." : `Bạn chọn: ${answers[index] === null ? "Bỏ qua" : question.options[answers[index]!]}. Đáp án đúng: ${question.options[question.correctOption]}`}</p></div>
                <em>{correct ? "Đúng" : "Cần ôn"}</em>
              </div>
            );
          })}
        </section>
        <aside className="recommend-card">
          <p className="eyebrow">GỢI Ý ÔN TẬP TIẾP THEO</p>
          <h2>Kế hoạch ngắn cho bạn</h2>
          {diagnosis.recommendations.length ? diagnosis.recommendations.map((item) => (
            <div className="recommendation" key={item.knowledgePointId}><span>{item.priority}</span><div><b>{item.suggestedAction}</b><p>{item.reason}</p><small>Trang {item.slideIds.map((id) => id.split("S")[1]).join(", ")}</small></div></div>
          )) : <p>Bạn chưa cần ôn lại phần nào trong phạm vi này. Hãy thử bộ 10 câu để kiểm tra sâu hơn.</p>}
          {diagnosis.limitations.map((item) => <small className="limitation" key={item}>• {item}</small>)}
          <button className="primary wide" onClick={onNew}>Mở lại bài học →</button>
        </aside>
      </div>
    </section>
  );
}

function buildClientFallback(
  questions: QuizQuestion[],
  answers: Array<number | null>,
  score: number,
): LearningDiagnosis {
  const correct = questions.filter((question, index) => answers[index] === question.correctOption);
  const wrong = questions.filter((question, index) => answers[index] !== question.correctOption);
  return {
    overallSummary: `Bạn trả lời đúng ${score}/${questions.length} câu. Kết quả được tổng hợp bằng luật vì AI phân tích tạm thời chưa sẵn sàng.`,
    strengths: correct.map((question) => ({ topic: question.topic, evidenceQuestionIds: [question.id] })),
    weaknesses: wrong.map((question) => ({
      topic: question.topic,
      misconception: "Cần xem lại khái niệm trong câu trả lời chưa đúng.",
      severity: "low",
      evidenceQuestionIds: [question.id],
      sourceSlideIds: [question.sourceRef.slideId],
    })),
    recommendations: wrong.slice(0, 3).map((question, index) => ({
      priority: index + 1,
      knowledgePointId: question.topic,
      reason: `Bạn chưa trả lời đúng câu ${question.id}.`,
      slideIds: [question.sourceRef.slideId],
      suggestedAction: `Xem lại Trang ${question.sourceRef.displaySlideNumber}`,
    })),
    confidence: "low",
    limitations: ["Phân tích dự phòng không suy luận sâu về misconception."],
  };
}
