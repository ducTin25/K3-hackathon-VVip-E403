"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleHelp,
  ClipboardList,
  FileCheck,
  FileText,
  Info,
  LayoutGrid,
  Library,
  Sparkles,
  X,
} from "lucide-react";
import { SlideViewer } from "./components/slide-viewer";
import type { LearningDiagnosis } from "../lib/diagnosis";
import type { QuizScope } from "../lib/lesson";
import type { QuizQuestion } from "../lib/quiz-generator";

type Phase = "learn" | "generating" | "quiz" | "diagnosing" | "result";

type CatalogSlide = {
  slideId: string;
  pdfPage: number;
  displaySlideNumber: string | null;
  chapterId: string;
  title: string;
  quizEligible: boolean;
  reviewStatus: string;
};

type LessonCatalog = {
  lesson: {
    lessonId: string;
    lessonTitle: string;
    totalSlides: number;
  };
  chapters: Array<{
    chapterId: string;
    order: number;
    title: string;
    description: string;
  }>;
  slides: CatalogSlide[];
  pdfPath: string;
};

const defaultPdfPath =
  "/slides/day03-tu-chatbot-den-agentic-agent-react-v7.pdf";

// Dropdown tự vẽ thay cho <select> mặc định của trình duyệt (chỉ đổi cách hiển
// thị — vẫn gọi đúng onChange như <select> cũ, không đổi logic chọn phạm vi).
function ScopeDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value);
  return (
    <div className="scope-dropdown">
      <button
        type="button"
        className="scope-dropdown-trigger"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      >
        <span>{current?.label ?? "Chọn..."}</span>
        <ChevronDown size={16} className={open ? "open" : ""} />
      </button>
      {open && (
        <div className="scope-dropdown-panel">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={option.value === value ? "scope-dropdown-option active" : "scope-dropdown-option"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function slidePageLabel(
  displaySlideNumber: string | null,
  pdfPage: number,
) {
  return displaySlideNumber
    ? `Trang ${displaySlideNumber}`
    : `Trang PDF ${pdfPage}`;
}

function slideHref(_pdfPath: string, pdfPage: number) {
  return `/?pdfPage=${pdfPage}`;
}

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
  const [catalog, setCatalog] = useState<LessonCatalog | null>(null);
  const [catalogError, setCatalogError] = useState("");
  const [viewerPage, setViewerPage] = useState(1);

  const quizSlides = useMemo(
    () =>
      catalog?.slides.filter(
        (slide) => slide.quizEligible && slide.reviewStatus === "approved",
      ) ?? [],
    [catalog],
  );

  useEffect(() => {
    let active = true;
    fetch("/api/lesson")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error ?? "Không thể tải dữ liệu bài học");
        }
        if (active) setCatalog(payload.catalog as LessonCatalog);
      })
      .catch((cause) => {
        if (active) {
          setCatalogError(
            cause instanceof Error
              ? cause.message
              : "Không thể tải dữ liệu bài học",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const requestedPage = Number(
      new URLSearchParams(window.location.search).get("pdfPage"),
    );
    if (Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= 78) {
      const timer = window.setTimeout(() => setViewerPage(requestedPage), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const scope = useMemo<QuizScope>(() => {
    if (scopeType === "chapter") {
      return { type: "chapter", lessonId: "DAY03", chapterId: scopeId };
    }
    if (scopeType === "slide") {
      return { type: "slide", lessonId: "DAY03", slideId: scopeId };
    }
    return { type: "lesson", lessonId: "DAY03" };
  }, [scopeId, scopeType]);

  function changeScopeType(next: QuizScope["type"]) {
    if (!catalog) return;
    setScopeType(next);
    if (next === "chapter") {
      const chapter = catalog.chapters[0];
      setScopeId(chapter?.chapterId ?? "DAY03");
      const firstSlide = catalog.slides.find(
        (slide) => slide.chapterId === chapter?.chapterId,
      );
      if (firstSlide) setViewerPage(firstSlide.pdfPage);
    } else if (next === "slide") {
      const firstSlide = quizSlides[0];
      setScopeId(firstSlide?.slideId ?? "DAY03");
      if (firstSlide) setViewerPage(firstSlide.pdfPage);
    } else {
      setScopeId("DAY03");
      setViewerPage(1);
    }
  }

  function changeScopeId(next: string) {
    setScopeId(next);
    const slide =
      scopeType === "chapter"
        ? catalog?.slides.find((item) => item.chapterId === next)
        : catalog?.slides.find((item) => item.slideId === next);
    if (slide) setViewerPage(slide.pdfPage);
  }

  function selectChapter(chapterId: string) {
    setScopeType("chapter");
    setScopeId(chapterId);
    const firstSlide = catalog?.slides.find(
      (slide) => slide.chapterId === chapterId,
    );
    if (firstSlide) setViewerPage(firstSlide.pdfPage);
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

  function skipAnswer() {
    if (checked) return;
    setAnswers((previous) =>
      previous.map((answer, index) => (index === current ? null : answer)),
    );
    setChecked(true);
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
      recordAttemptForOverview(payload.score);
    } catch (cause) {
      const calculated = questions.filter(
        (question, index) => answers[index] === question.correctOption,
      ).length;
      setScore(calculated);
      setDiagnosis(buildClientFallback(questions, answers, calculated));
      setUsedFallback(true);
      setError(cause instanceof Error ? cause.message : "AI chưa thể phân tích");
      setPhase("result");
      recordAttemptForOverview(calculated);
    }
  }

  // Lưu lượt làm cho trang "Tổng quan lớp" (giảng viên) — fire-and-forget,
  // KHÔNG được phép ảnh hưởng trải nghiệm học viên nếu lưu lỗi. Không đụng gì
  // đến /api/diagnosis hay logic chấm điểm ở trên, chỉ đọc lại state đã có sẵn.
  function recordAttemptForOverview(finalScore: number) {
    try {
      const skippedQuestions = answers.filter((answer) => answer === null).length;
      const answeredQuestions = questions.length - skippedQuestions;
      const attemptAnswers = questions.map((question, index) => {
        const selected = answers[index];
        const isSkipped = selected === null;
        const isCorrect = !isSkipped && selected === question.correctOption;
        return {
          questionId: question.id,
          topic: question.topic,
          sourceSlideId: question.sourceRef.slideId,
          isCorrect,
          isSkipped,
          misconception:
            isSkipped || isCorrect ? "" : question.misconceptions[selected as number],
          level: question.level,
          confidence: question.confidence,
        };
      });
      void fetch("/api/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scopeType: scope.type,
          scopeId: scope.type === "lesson" ? scope.lessonId : scope.type === "chapter" ? scope.chapterId : scope.slideId,
          score: finalScore,
          answeredQuestions,
          skippedQuestions,
          totalQuestions: questions.length,
          answers: attemptAnswers,
        }),
      }).catch(() => {
        // Im lặng bỏ qua — không ảnh hưởng trải nghiệm học viên.
      });
    } catch {
      // Không để lỗi tính toán ở đây làm vỡ luồng xem kết quả của học viên.
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
          error={error || catalogError}
          catalog={catalog}
          quizSlides={quizSlides}
          viewerPage={viewerPage}
          onViewerPage={setViewerPage}
          onScopeType={changeScopeType}
          onScopeId={changeScopeId}
          onChapter={selectChapter}
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
          pdfPath={catalog?.pdfPath ?? defaultPdfPath}
          onSelect={selectAnswer}
          onSkip={skipAnswer}
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
          pdfPath={catalog?.pdfPath ?? defaultPdfPath}
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
        <button className="icon-button" onClick={onHome} aria-label="Về bài học"><ArrowLeft size={18} /></button>
        <Logo />
        <nav>
          <button className="active" onClick={onHome}><LayoutGrid size={16} /> Không gian học</button>
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
  catalog,
  quizSlides,
  viewerPage,
  onViewerPage,
  onScopeType,
  onScopeId,
  onChapter,
  onCount,
  onGenerate,
}: {
  scopeType: QuizScope["type"];
  scopeId: string;
  questionCount: 5 | 10;
  error: string;
  catalog: LessonCatalog | null;
  quizSlides: CatalogSlide[];
  viewerPage: number;
  onViewerPage: (page: number) => void;
  onScopeType: (value: QuizScope["type"]) => void;
  onScopeId: (value: string) => void;
  onChapter: (chapterId: string) => void;
  onCount: (value: 5 | 10) => void;
  onGenerate: () => void;
}) {
  const pdfPath = catalog?.pdfPath ?? defaultPdfPath;
  const currentSlide =
    catalog?.slides.find((slide) => slide.pdfPage === viewerPage) ?? null;

  return (
    <div className="learn-layout">
      <aside className="course-sidebar">
        <div className="side-title">
          <span><Library size={20} /></span>
          <div><b>Học liệu môn học</b><small>Slide đã được đối chiếu</small></div>
        </div>
        <div className="lesson-summary">
          <b>{catalog?.lesson.lessonTitle ?? "Từ Chatbot Đến Agentic Agent"}</b>
          <small>{catalog?.lesson.totalSlides ?? 78} trang PDF · Approved</small>
        </div>
        <div className="chapter-list" aria-label="Danh sách chương">
          {catalog?.chapters.map((chapter) => {
            const firstSlide = catalog.slides.find(
              (slide) => slide.chapterId === chapter.chapterId,
            );
            return (
              <button
                type="button"
                className={
                  scopeType === "chapter" && scopeId === chapter.chapterId
                    ? "chapter-item active"
                    : "chapter-item"
                }
                key={chapter.chapterId}
                onClick={() => onChapter(chapter.chapterId)}
              >
                <span>{String(chapter.order).padStart(2, "0")}</span>
                <div>
                  <b>{chapter.title}</b>
                  <small>
                    {firstSlide
                      ? slidePageLabel(firstSlide.displaySlideNumber, firstSlide.pdfPage)
                      : "Chưa có slide"}
                  </small>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="reader">
        <div className="reader-toolbar">
          <span className="reader-mode"><FileText size={16} /> Xem slide</span>
          <div className="slide-navigation" aria-label="Điều hướng slide">
            <button
              type="button"
              disabled={viewerPage <= 1}
              onClick={() => onViewerPage(viewerPage - 1)}
              aria-label="Slide trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              disabled={viewerPage >= (catalog?.lesson.totalSlides ?? 78)}
              onClick={() => onViewerPage(viewerPage + 1)}
              aria-label="Slide tiếp theo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <span>
            {currentSlide
              ? `${slidePageLabel(currentSlide.displaySlideNumber, currentSlide.pdfPage)} · ${currentSlide.title}`
              : `Trang PDF ${viewerPage}`}
          </span>
          <a href={slideHref(pdfPath, viewerPage)} target="_blank" rel="noreferrer">
            Mở slide ở tab mới ↗
          </a>
        </div>
        <div className="slide-stage">
          <SlideViewer
            pdfPath={pdfPath}
            pageNumber={viewerPage}
            label={
              currentSlide
                ? `${slidePageLabel(currentSlide.displaySlideNumber, currentSlide.pdfPage)}: ${currentSlide.title}`
                : `Trang PDF ${viewerPage}`
            }
          />
          <p className="approved-note"><CheckCircle2 size={14} /> Nguồn gồm 78 trang đã được đối chiếu và phê duyệt</p>
        </div>
      </section>

      <aside className="study-panel">
        <div className="panel-heading"><span><Sparkles size={20} /></span><div><b>Tạo quiz từ bài học</b><small>DeepSeek · Có dẫn nguồn</small></div></div>
        {error && <div className="error-banner" role="alert"><AlertTriangle size={16} /> {error}</div>}
        <label>Phạm vi kiểm tra</label>
        <div className="segmented">
          <button className={scopeType === "lesson" ? "active" : ""} onClick={() => onScopeType("lesson")}>Cả bài</button>
          <button className={scopeType === "chapter" ? "active" : ""} onClick={() => onScopeType("chapter")}>Chương</button>
          <button className={scopeType === "slide" ? "active" : ""} onClick={() => onScopeType("slide")}>Slide kiến thức</button>
        </div>
        {scopeType === "chapter" && (
          <ScopeDropdown
            value={scopeId}
            onChange={onScopeId}
            options={
              catalog?.chapters.map((chapter) => ({
                value: chapter.chapterId,
                label: chapter.title,
              })) ?? []
            }
          />
        )}
        {scopeType === "slide" && (
          <ScopeDropdown
            value={scopeId}
            onChange={onScopeId}
            options={quizSlides.map((slide) => ({
              value: slide.slideId,
              label: `${slide.title} · ${slidePageLabel(slide.displaySlideNumber, slide.pdfPage)}`,
            }))}
          />
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
          <span><FileCheck size={20} /></span><div><b>Nguồn cố định đã duyệt</b></div>
        </div>
        <button className="primary wide" disabled={!catalog} onClick={onGenerate}>Tạo quiz bằng AI <span>→</span></button>
        <p className="fine-print">Điểm do hệ thống tính. AI chỉ tạo câu hỏi và phân tích phần cần ôn.</p>
      </aside>
    </div>
  );
}

function LoadingScreen({ diagnosis }: { diagnosis: boolean }) {
  return (
    <section className="loading-page">
      <div className="loading-card">
        <div className="ai-orbit"><span><Sparkles size={26} /></span><i /><i /></div>
        <p className="eyebrow">{diagnosis ? "LEARNING DIAGNOSTIC" : "ASSESSMENT GENERATOR"}</p>
        <h1>{diagnosis ? "Đang tổng hợp kết quả của bạn" : "Đang tạo quiz có căn cứ"}</h1>
        <p>{diagnosis ? "AI đối chiếu câu đúng, câu sai và misconception với danh sách slide được phép gợi ý." : "AI chỉ sử dụng các slide đã được duyệt trong phạm vi bạn chọn."}</p>
        <div className="loading-steps"><span className="done"><CheckCircle2 size={14} /> Lấy nguồn</span><span className="active"><Circle size={14} fill="currentColor" /> {diagnosis ? "Phân tích evidence" : "Tạo câu hỏi"}</span><span><Circle size={14} /> Kiểm tra đầu ra</span></div>
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
  pdfPath,
  onSelect,
  onSkip,
  onNext,
  onExit,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selected: number | null;
  checked: boolean;
  pdfPath: string;
  onSelect: (option: number) => void;
  onSkip: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  return (
    <section className="quiz-page">
      <div className="quiz-header">
        <div><p className="eyebrow">KIỂM TRA NHANH · DAY 3</p><h1>Kiểm tra mức độ hiểu</h1></div>
        <button className="secondary" onClick={onExit}>Thoát <X size={14} /></button>
      </div>
      <div className="progress-row"><div><i style={{ width: `${((index + (checked ? 1 : 0)) / total) * 100}%` }} /></div><b>{index + 1}/{total}</b></div>
      <div className="question-grid">
        <article className="question-card">
          <div className="tags">
            <span>{question.topic}</span>
            <span>{question.level === "apply" ? "Áp dụng" : "Hiểu"}</span>
            <a
              href={slideHref(pdfPath, question.sourceRef.pdfPage)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Mở ${slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)} trong tab mới`}
            >
              <FileText size={12} /> {slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)} ↗
            </a>
          </div>
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
                  <span>{String.fromCharCode(65 + optionIndex)}</span><b>{option}</b>{isCorrect && <i><Check size={16} /></i>}{isWrong && <i><X size={16} /></i>}
                </button>
              );
            })}
          </div>
          {checked && (
            <div className={`feedback ${selected === null ? "skipped" : selected === question.correctOption ? "good" : "bad"}`}>
              <b>
                {selected === null ? (
                  <><Circle size={14} /> Đã bỏ qua · Ghi nhận hổng kiến thức</>
                ) : selected === question.correctOption ? (
                  <><CheckCircle2 size={14} /> Chính xác</>
                ) : (
                  <><AlertTriangle size={14} /> Chưa chính xác</>
                )}
              </b>
              <p>{question.explanation}</p>
              <a
                href={slideHref(pdfPath, question.sourceRef.pdfPage)}
                target="_blank"
                rel="noreferrer"
              >
                Đối chiếu {slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)} ↗
              </a>
            </div>
          )}
          <footer>
            <span>{checked ? "Giải thích được tạo từ slide nguồn" : "Chọn đáp án hoặc bỏ qua nếu chưa biết"}</span>
            <div className="question-actions">
              {!checked && (
                <button className="skip-button" onClick={onSkip}>
                  Bỏ qua · Chưa biết
                </button>
              )}
              <button className="primary" disabled={!checked && selected === null} onClick={onNext}>
                {!checked ? "Kiểm tra đáp án" : index === total - 1 ? "Xem kết quả" : "Câu tiếp theo"} →
              </button>
            </div>
          </footer>
        </article>
        <aside className="source-card">
          <p className="eyebrow">TRÍCH TỪ {slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)}</p>
          <h3>{question.topic}</h3>
          <div className="source-visual"><i /><i /><i /><i /></div>
          <p>Câu hỏi có mã nguồn <b>{question.sourceRef.slideId}</b>.</p>
          <a
            className="source-link"
            href={slideHref(pdfPath, question.sourceRef.pdfPage)}
            target="_blank"
            rel="noreferrer"
          >
            Mở slide nguồn ↗
          </a>
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
  pdfPath,
  onRetry,
  onNew,
}: {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  score: number;
  diagnosis: LearningDiagnosis;
  fallback: boolean;
  error: string;
  pdfPath: string;
  onRetry: () => void;
  onNew: () => void;
}) {
  const skippedCount = answers.filter((answer) => answer === null).length;
  const answeredCount = questions.length - skippedCount;
  const percent =
    answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;
  return (
    <section className="result-page">
      <div className="result-hero">
        <div><p className="eyebrow">KẾT QUẢ KIỂM TRA · DAY 3</p><h1>Bạn đã hoàn thành!</h1><p>{diagnosis.overallSummary}</p>
          <div className="actions"><button className="primary" onClick={onNew}>Ôn phần còn yếu →</button><button className="secondary" onClick={onRetry}>Làm lại quiz</button></div>
        </div>
        <div className="score-ring" style={{ "--score": `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{score}/{answeredCount}</strong><span>câu đã trả lời đúng</span>{skippedCount > 0 && <small>{skippedCount} câu bỏ qua</small>}</div></div>
      </div>
      {(fallback || error) && <div className="fallback-note"><Info size={16} /> Đang hiển thị phân tích dự phòng bằng luật. Điểm số và đáp án vẫn chính xác.</div>}
      <div className="diagnosis-card">
        <div className="diagnosis-title"><span><Sparkles size={22} /></span><div><p className="eyebrow">NHẬN XÉT KIẾN THỨC CÁ NHÂN CỦA AI</p><h2>Những gì bạn đã hiểu và cần củng cố</h2></div><em>Confidence: {diagnosis.confidence}</em></div>
        <div className="diagnosis-columns">
          <div className="strength-box"><b><CheckCircle2 size={16} /> Bạn đã làm tốt</b>{diagnosis.strengths.length ? diagnosis.strengths.map((item) => <p key={item.topic}>{item.topic} <small>· {item.evidenceQuestionIds.join(", ")}</small></p>) : <p>Chưa đủ câu đúng để xác định điểm mạnh.</p>}</div>
          <div className="weakness-box"><b><AlertTriangle size={16} /> Nên tập trung tiếp theo</b>{diagnosis.weaknesses.length ? diagnosis.weaknesses.map((item) => <p key={`${item.topic}-${item.misconception}`}>{item.topic}: {item.misconception}</p>) : <p>Không phát hiện điểm yếu trong lượt làm này.</p>}</div>
          <div className="gap-box"><b><CircleHelp size={16} /> Hổng kiến thức cần kiểm tra</b>{diagnosis.knowledgeGaps.length ? diagnosis.knowledgeGaps.map((item) => <p key={`${item.topic}-${item.evidenceQuestionIds.join("-")}`}>{item.topic}: {item.reason}</p>) : <p>Không có câu nào bị bỏ qua.</p>}</div>
        </div>
      </div>
      <div className="result-grid">
        <section className="answer-summary">
          <div className="section-title"><div><span><ClipboardList size={20} /></span><div><h2>Tổng hợp câu trả lời</h2><p>Xem kết quả và nguồn của từng câu.</p></div></div><b>{score}/{answeredCount} đúng · {skippedCount} bỏ qua</b></div>
          {questions.map((question, index) => {
            const correct = answers[index] === question.correctOption;
            const skipped = answers[index] === null;
            return (
              <div className={`answer-row ${skipped ? "skipped" : correct ? "pass" : "fail"}`} key={question.id}>
                <span>{skipped ? <Circle size={18} /> : correct ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}</span>
                <div>
                  <small>Câu {index + 1} · {question.topic}</small>
                  <a
                    className="answer-source-link"
                    href={slideHref(pdfPath, question.sourceRef.pdfPage)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Mở ${slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)} cho câu ${index + 1} trong tab mới`}
                  >
                    <FileText size={12} /> {slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)} ↗
                  </a>
                  <b>{question.question}</b>
                  <p>{skipped ? "Bạn đã bỏ qua câu này. Hệ thống ghi nhận đây là hổng kiến thức cần kiểm tra thêm." : correct ? "Bạn trả lời đúng." : `Bạn chọn: ${question.options[answers[index]!]}. Đáp án đúng: ${question.options[question.correctOption]}`}</p>
                </div>
                <em>{skipped ? "Hổng kiến thức" : correct ? "Đúng" : "Cần ôn"}</em>
              </div>
            );
          })}
        </section>
        <aside className="recommend-card">
          <p className="eyebrow">GỢI Ý ÔN TẬP TIẾP THEO</p>
          <h2>Kế hoạch ngắn cho bạn</h2>
          {diagnosis.recommendations.length ? diagnosis.recommendations.map((item) => {
            const sourceQuestions = questions.filter((question) =>
              item.slideIds.includes(question.sourceRef.slideId),
            ).filter(
              (question, index, matches) =>
                matches.findIndex(
                  (candidate) =>
                    candidate.sourceRef.slideId === question.sourceRef.slideId,
                ) === index,
            );
            return (
              <div className="recommendation" key={item.knowledgePointId}>
                <span>{item.priority}</span>
                <div>
                  <b>{item.suggestedAction}</b>
                  <p>{item.reason}</p>
                  <div className="recommendation-links">
                    {sourceQuestions.map((question) => (
                      <a
                        key={question.sourceRef.slideId}
                        href={slideHref(pdfPath, question.sourceRef.pdfPage)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          }) : <p>Bạn chưa cần ôn lại phần nào trong phạm vi này. Hãy thử bộ 10 câu để kiểm tra sâu hơn.</p>}
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
  const wrong = questions.filter(
    (question, index) =>
      answers[index] !== null && answers[index] !== question.correctOption,
  );
  const skipped = questions.filter((_, index) => answers[index] === null);
  const answeredCount = questions.length - skipped.length;
  return {
    overallSummary:
      answeredCount === 0
        ? `Bạn đã bỏ qua toàn bộ ${skipped.length} câu. Các nội dung này được ghi nhận là hổng kiến thức cần kiểm tra thêm.`
        : `Bạn trả lời đúng ${score}/${answeredCount} câu đã trả lời và bỏ qua ${skipped.length} câu. Kết quả được tổng hợp bằng luật vì AI phân tích tạm thời chưa sẵn sàng.`,
    strengths: correct.map((question) => ({ topic: question.topic, evidenceQuestionIds: [question.id] })),
    weaknesses: wrong.map((question) => ({
      topic: question.topic,
      misconception: "Cần xem lại khái niệm trong câu trả lời chưa đúng.",
      severity: "low",
      evidenceQuestionIds: [question.id],
      sourceSlideIds: [question.sourceRef.slideId],
    })),
    knowledgeGaps: skipped.map((question) => ({
      topic: question.topic,
      reason:
        "Bạn đã bỏ qua câu hỏi này; hệ thống chưa đủ bằng chứng để xác nhận mức độ hiểu.",
      evidenceQuestionIds: [question.id],
      sourceSlideIds: [question.sourceRef.slideId],
    })),
    recommendations: [...wrong, ...skipped].slice(0, 3).map((question, index) => ({
      priority: index + 1,
      knowledgePointId: question.topic,
      reason: skipped.includes(question)
        ? `Bạn đã bỏ qua câu ${question.id}; hãy xem lại nội dung nguồn rồi tự kiểm tra lại.`
        : `Bạn chưa trả lời đúng câu ${question.id}.`,
      slideIds: [question.sourceRef.slideId],
      suggestedAction: `Xem lại ${slidePageLabel(question.sourceRef.displaySlideNumber, question.sourceRef.pdfPage)}`,
    })),
    confidence: "low",
    limitations: ["Phân tích dự phòng không suy luận sâu về misconception."],
  };
}
