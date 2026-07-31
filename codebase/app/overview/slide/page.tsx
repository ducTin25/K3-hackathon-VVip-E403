"use client";

// Trang xem slide RIÊNG cho giảng viên — route mới, giao diện riêng, KHÔNG dùng
// lại app/page.tsx (trang học viên). Chỉ tái dùng component hiển thị thuần
// SlideViewer (không phải logic trang học viên) + đọc /api/lesson (route đọc
// sẵn có, không sửa). Có sidebar chọn chương/slide + nút trước/sau để xem hết
// mọi slide trong bài giảng, không chỉ đúng 1 trang đã bấm vào từ dashboard.
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { SlideViewer } from "../../components/slide-viewer";
import "../overview.css";

type LessonCatalog = {
  lesson: { lessonId: string; lessonTitle: string; totalSlides: number };
  chapters: Array<{ chapterId: string; order: number; title: string }>;
  slides: Array<{
    slideId: string;
    pdfPage: number;
    displaySlideNumber: string | null;
    chapterId: string;
    title: string;
  }>;
  pdfPath: string;
};

function SlideViewInner() {
  const params = useSearchParams();
  const initialPage = Number(params.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);
  const [catalog, setCatalog] = useState<LessonCatalog | null>(null);
  const [error, setError] = useState("");
  const [sidebarMode, setSidebarMode] = useState<"chapter" | "slide">("chapter");

  useEffect(() => {
    let active = true;
    fetch("/api/lesson")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error ?? "Không tải được dữ liệu bài giảng");
        if (active) setCatalog(payload.catalog as LessonCatalog);
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Không tải được dữ liệu bài giảng");
      });
    return () => {
      active = false;
    };
  }, []);

  const totalSlides = catalog?.lesson.totalSlides ?? currentPage;
  const slide = catalog?.slides.find((s) => s.pdfPage === currentPage) ?? null;
  const chapter = slide ? catalog?.chapters.find((c) => c.chapterId === slide.chapterId) : null;

  return (
    <div className="ovv-root">
      <header className="ovv-top">
        <a className="ovv-back" href="/overview">
          <ArrowLeft size={16} /> Về bảng điều khiển
        </a>
        <div className="ovv-brand">
          <div className="ovv-brand-icon">
            <Layers size={19} />
          </div>
          <div>
            <h1>Xem slide — góc nhìn giảng viên</h1>
            <p>Chỉ để đối chiếu nội dung, không phải giao diện học viên.</p>
          </div>
        </div>
      </header>

      {error && (
        <main className="ovv-body">
          <div className="ovv-error">{error}</div>
        </main>
      )}
      {!catalog && !error && (
        <main className="ovv-body">
          <div className="ovv-loading">Đang tải...</div>
        </main>
      )}

      {catalog && (
        <div className="ovv-slide-layout">
          <aside className="ovv-slide-sidebar">
            <div className="ovv-sidebar-title">
              <BookOpen size={14} /> {catalog.lesson.lessonTitle}
            </div>
            <div className="ovv-sidebar-toggle">
              <button
                type="button"
                className={sidebarMode === "chapter" ? "active" : ""}
                onClick={() => setSidebarMode("chapter")}
              >
                Chương
              </button>
              <button
                type="button"
                className={sidebarMode === "slide" ? "active" : ""}
                onClick={() => setSidebarMode("slide")}
              >
                Slide
              </button>
            </div>

            {sidebarMode === "chapter" &&
              catalog.chapters.map((ch) => {
                const firstSlide = catalog.slides.find((s) => s.chapterId === ch.chapterId);
                const isActiveChapter = chapter?.chapterId === ch.chapterId;
                return (
                  <button
                    key={ch.chapterId}
                    className={isActiveChapter ? "ovv-sidebar-slide active" : "ovv-sidebar-slide"}
                    onClick={() => firstSlide && setCurrentPage(firstSlide.pdfPage)}
                  >
                    {ch.title}
                  </button>
                );
              })}

            {sidebarMode === "slide" &&
              catalog.slides.map((s) => (
                <button
                  key={s.slideId}
                  className={s.pdfPage === currentPage ? "ovv-sidebar-slide active" : "ovv-sidebar-slide"}
                  onClick={() => setCurrentPage(s.pdfPage)}
                >
                  {s.title}
                </button>
              ))}
          </aside>

          <main className="ovv-slide-main">
            <div className="ovv-card">
              <div className="ovv-slide-toolbar">
                <div className="ovv-slide-meta">
                  {chapter && <span className="ovv-lesson-chip">{chapter.title}</span>}
                </div>
                <div className="ovv-slide-nav">
                  <button
                    type="button"
                    className="ovv-icon-btn"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Trang trước"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="ovv-slide-count">
                    Trang {currentPage} / {totalSlides}
                  </span>
                  <button
                    type="button"
                    className="ovv-icon-btn"
                    disabled={currentPage >= totalSlides}
                    onClick={() => setCurrentPage((p) => Math.min(totalSlides, p + 1))}
                    aria-label="Trang sau"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <h2 style={{ marginTop: 12 }}>
                {slide?.title ?? `Trang PDF ${currentPage} (không dùng để tạo quiz)`}
              </h2>
              <div className="ovv-slide-frame">
                <SlideViewer
                  pdfPath={catalog.pdfPath}
                  pageNumber={currentPage}
                  label={slide?.title ?? `Trang PDF ${currentPage}`}
                />
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default function TeacherSlideViewPage() {
  return (
    <Suspense fallback={<div className="ovv-root ovv-loading">Đang tải...</div>}>
      <SlideViewInner />
    </Suspense>
  );
}
