"use client";

// Trang RIÊNG cho giảng viên — không import/không đụng bất kỳ state hay
// component nào trong app/page.tsx (luồng học viên). Chỉ đọc dữ liệu qua
// /api/class-overview (thuần đếm) và /api/class-overview/brief (AI tổng hợp,
// dùng key server sẵn có, không cần dán tay). "Mở slide" trỏ sang
// /overview/slide (route riêng của giảng viên), không dùng lại trang học viên.
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, ExternalLink, Loader2, Sparkles } from "lucide-react";
import "./overview.css";

type SlideStat = {
  slideId: string;
  title: string;
  chapterTitle: string;
  pdfPage: number | null;
  displaySlideNumber: string | null;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  correctRate: number;
  topMisconceptions: Array<{ text: string; count: number }>;
};

type OverviewResponse = {
  ok: boolean;
  summary: { totalAttempts: number; averageScorePercent: number };
  slides: SlideStat[];
  error?: string;
};

type BriefAction = {
  slideId: string;
  reason: string;
  suggestedAction: string;
  title: string;
  chapterTitle: string;
  pdfPage: number | null;
  displaySlideNumber: string | null;
  correctRate: number | null;
};

type BriefResponse = {
  ok: boolean;
  brief?: { summary: string; priorityActions: BriefAction[] };
  error?: string;
};

// LUÔN dùng pdfPage để hiển thị — đây là số thật SlideViewer dùng để điều
// hướng. displaySlideNumber là số đánh dấu riêng trong data, KHÔNG khớp 1-1
// với pdfPage (vd slide "Trang 5" theo displaySlideNumber thực ra nằm ở
// pdfPage=7) — dùng nó làm nhãn từng gây lệch "bấm Trang 5 nhưng ra Trang 7".
function slidePageLabel(_displaySlideNumber: string | null, pdfPage: number | null) {
  return pdfPage ? `Trang ${pdfPage}` : "";
}

function slideViewHref(pdfPage: number) {
  return `/overview/slide?page=${pdfPage}`;
}

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<BriefResponse["brief"] | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/class-overview")
      .then(async (response) => {
        const payload = (await response.json()) as OverviewResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error ?? "Không thể tải dữ liệu tổng quan");
        }
        if (active) setData(payload);
      })
      .catch((cause) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Không thể tải dữ liệu tổng quan");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Nạp lại brief lần gần nhất đã lưu (nếu có) — để quay lại trang này (vd bấm
  // Back từ trang xem slide, hay F5) vẫn thấy nhận định cũ, không mất trắng.
  // Chưa từng có brief nào (lần đầu) thì tự tạo luôn, không cần bấm nút.
  useEffect(() => {
    let active = true;
    setBriefLoading(true);
    fetch("/api/class-overview/brief")
      .then(async (response) => {
        const payload = (await response.json()) as BriefResponse;
        if (!active) return;
        if (response.ok && payload.ok && payload.brief) {
          setBrief(payload.brief);
          setBriefLoading(false);
        } else {
          await generateBrief();
        }
      })
      .catch(async () => {
        if (active) await generateBrief();
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateBrief() {
    setBriefLoading(true);
    setBriefError("");
    try {
      const response = await fetch("/api/class-overview/brief", { method: "POST" });
      const payload = (await response.json()) as BriefResponse;
      if (!response.ok || !payload.ok || !payload.brief) {
        throw new Error(payload.error ?? "AI chưa thể phân tích");
      }
      setBrief(payload.brief);
    } catch (cause) {
      setBriefError(cause instanceof Error ? cause.message : "AI chưa thể phân tích");
    } finally {
      setBriefLoading(false);
    }
  }

  return (
    <div className="ovv-root">
      <header className="ovv-top">
        <a className="ovv-icon-btn" href="/" aria-label="Về không gian học">
          <ArrowLeft size={18} />
        </a>
        <div className="ovv-brand">
          <div className="ovv-brand-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <h1>Bảng điều khiển giảng viên</h1>
            <p>Học viên hiểu đúng đâu, hổng kiến thức đâu — tính từ các lượt làm quiz thật.</p>
          </div>
        </div>
      </header>

      <main className="ovv-body">
        {error && (
          <div className="ovv-error">
            <AlertTriangle size={16} /> {error}
          </div>
        )}
        {!data && !error && (
          <div className="ovv-loading">
            <Loader2 size={18} className="ovv-spin" /> Đang tải dữ liệu...
          </div>
        )}

        {data && data.summary.totalAttempts === 0 && (
          <div className="ovv-empty">
            Chưa có lượt làm quiz nào được ghi nhận. Vào lại sau khi học viên hoàn thành ít
            nhất 1 lượt.
          </div>
        )}

        {data && data.summary.totalAttempts > 0 && (
          <>
            <section className="ovv-metrics">
              <div className="ovv-metric">
                <small>Tổng số lượt làm quiz</small>
                <strong>{data.summary.totalAttempts}</strong>
              </div>
              <div className="ovv-metric">
                <small>Điểm trung bình</small>
                <strong>{data.summary.averageScorePercent}%</strong>
              </div>
              <div className="ovv-metric">
                <small>Số slide có dữ liệu</small>
                <strong>{data.slides.length}</strong>
              </div>
            </section>

            <div className="ovv-columns">
              <section className="ovv-card">
                <h2>Slide cả lớp còn yếu nhất</h2>
                <p className="ovv-card-sub">
                  Sắp theo mức độ đáng lo nhất lên đầu — bấm để xem đúng slide đó.
                </p>
                <div className="ovv-table-scroll">
                  <table className="ovv-table">
                    <colgroup>
                      <col className="ovv-col-slide" />
                      <col className="ovv-col-chapter" />
                      <col className="ovv-col-count" />
                      <col className="ovv-col-misc" />
                      <col className="ovv-col-action" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Slide</th>
                        <th>Chương</th>
                        <th>Đúng/Sai/Bỏ qua</th>
                        <th>Hiểu lầm phổ biến</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slides.map((slide) => (
                        <tr key={slide.slideId}>
                          <td>
                            <b className="ovv-clip" title={slide.title}>{slide.title}</b>
                            <small>{slidePageLabel(slide.displaySlideNumber, slide.pdfPage) || slide.slideId}</small>
                          </td>
                          <td>
                            <span className="ovv-clip" title={slide.chapterTitle || undefined}>
                              {slide.chapterTitle || "—"}
                            </span>
                          </td>
                          <td>
                            <span className="ovv-count-cell">
                              <b className="c-good">{slide.correctCount}</b>
                              <b className="c-critical">{slide.wrongCount}</b>
                              <b className="c-warn">{slide.skippedCount}</b>
                            </span>
                          </td>
                          <td>
                            {slide.topMisconceptions.length ? (
                              slide.topMisconceptions.map((item) => (
                                <div className="ovv-misc ovv-clip" key={item.text} title={item.text}>
                                  {item.text} <small>× {item.count}</small>
                                </div>
                              ))
                            ) : (
                              <span className="ovv-muted">Chưa ghi nhận</span>
                            )}
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {slide.pdfPage && (
                              <a className="ovv-open-link" href={slideViewHref(slide.pdfPage)}>
                                <ExternalLink size={13} /> Xem
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="ovv-card">
                <div className="ovv-brief-header">
                  <div>
                    <span className="ovv-brief-badge">
                      <Sparkles size={12} /> AI phân tích
                    </span>
                    <h2 style={{ marginTop: 10 }}>Nhận định &amp; gợi ý dạy lại</h2>
                    <p className="ovv-card-sub">
                      AI chỉ tổng hợp lại đúng số liệu bên cạnh, không suy đoán thêm.
                    </p>
                  </div>
                  {briefLoading && <Loader2 size={18} className="ovv-spin" />}
                </div>

                {briefError && (
                  <div className="ovv-error" style={{ marginTop: 16 }}>
                    <AlertTriangle size={16} /> {briefError}
                  </div>
                )}

                {!brief && !briefLoading && !briefError && (
                  <p className="ovv-card-sub" style={{ marginTop: 16 }}>
                    Chưa có nhận định.
                  </p>
                )}

                {brief && (
                  <>
                    <p className="ovv-brief-summary">{brief.summary}</p>
                    {brief.priorityActions.length > 0 && (
                      <div className="ovv-actions">
                        {brief.priorityActions.map((action, index) => (
                          <div className="ovv-action" key={action.slideId}>
                            <span className="ovv-action-rank">{index + 1}</span>
                            <div>
                              <b>{action.title}</b>
                              <p>{action.reason}</p>
                              <p>
                                <strong>Gợi ý: </strong>
                                {action.suggestedAction}
                              </p>
                              <span className="ovv-tag">
                                {action.chapterTitle}
                                {action.correctRate !== null ? ` · ${action.correctRate}% đúng` : ""}
                              </span>
                            </div>
                            {action.pdfPage && (
                              <a className="ovv-open-link" href={slideViewHref(action.pdfPage)}>
                                <ExternalLink size={13} />
                                {slidePageLabel(action.displaySlideNumber, action.pdfPage)}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
