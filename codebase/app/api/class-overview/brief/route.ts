// Route MỚI — "Lớp 2" trong plan (docs/teacher-overview-plan.md): AI gom các
// misconception đã thống kê (Lớp 1, thuần đếm) thành nhận định ngắn cho giảng
// viên. Dùng lại callDeepSeekJson() có sẵn (không sửa file đó) — cùng key
// DEEPSEEK_API_KEY server đã cấu hình cho phần quiz, KHÔNG cần giảng viên dán
// key riêng. Đây là quyết định AI RIÊNG (khác user, khác job so với quiz cho
// học viên) — chỉ tổng hợp lại dữ liệu đã có, không tự bịa slide/số liệu mới.
//
// GET tự quyết định: nếu số lượt làm quiz hiện tại khác số lượt lúc bản lưu
// gần nhất được tạo -> có dữ liệu mới -> tự phân tích lại. Giống nhau -> trả
// bản đã lưu, KHÔNG gọi AI thêm. Nhờ vậy: mở lại trang không tốn AI nếu không
// có gì mới, nhưng vẫn tự cập nhật khi học viên làm quiz thêm — không cần nút.
import { callDeepSeekJson } from "../../../../lib/deepseek";
import { computeClassOverviewStats, type ClassOverviewStats } from "../../../../lib/class-overview-stats";
import { getLatestBrief, saveLatestBrief } from "../../../../lib/brief-store";

type Brief = {
  summary: string;
  priorityActions: Array<{
    slideId: string;
    reason: string;
    suggestedAction: string;
  }>;
};

function buildPrompt(stats: ClassOverviewStats) {
  const weakSlides = stats.slides
    .filter((slide) => slide.totalAnswered >= 1)
    .slice(0, 8)
    .map((slide) => ({
      slideId: slide.slideId,
      title: slide.title,
      chapterTitle: slide.chapterTitle,
      correctCount: slide.correctCount,
      wrongCount: slide.wrongCount,
      skippedCount: slide.skippedCount,
      misconceptions: slide.topMisconceptions.map((m) => m.text),
      // wrongByLevel.understand cao -> chưa nắm khái niệm, cần dạy lại từ đầu.
      // wrongByLevel.apply cao (understand thấp) -> đã hiểu nhưng chưa vận
      // dụng được, nên cho luyện bài tập thay vì giảng lại lý thuyết.
      wrongByLevel: slide.wrongByLevel,
    }));

  return `Bạn là trợ lý phân tích dữ liệu lớp học cho giảng viên VLearn.

NHIỆM VỤ
Từ SLIDE_STATS (đã đếm sẵn từ lượt làm quiz thật của học viên), viết nhận định ngắn gọn giúp giảng viên biết nên dạy lại phần nào.

KHUNG PHÂN TÍCH BẮT BUỘC — 3 loại tín hiệu nghĩa khác nhau, không được gộp chung:
- correctCount (trả lời đúng) = học viên hiểu đúng vấn đề. Không cần hành động.
- wrongCount (trả lời sai) = học viên CÓ hiểu lầm cụ thể (xem misconceptions) — cần SỬA hiểu lầm đó, không phải dạy lại từ đầu.
- skippedCount (bỏ qua) = học viên KHÔNG biết/chưa tiếp cận được vấn đề, không phải hiểu lầm — cần DẠY LẠI TỪ ĐẦU, không phải "sửa hiểu lầm" vì học viên chưa từng hiểu gì để mà sửa.
Một slide có skippedCount cao hơn hẳn wrongCount thì bản chất vấn đề khác hẳn slide có wrongCount cao hơn hẳn skippedCount — phải nói rõ sự khác biệt này trong reason/suggestedAction, không dùng chung 1 kiểu gợi ý cho cả hai.

RANH GIỚI
- CHỈ dùng số liệu và slideId có trong SLIDE_STATS. Không suy đoán học viên nào, không bịa số liệu mới.
- CẤM TUYỆT ĐỐI trong summary và reason: không viết mã slideId thô (vd "DAY03-S007"), không viết tên trường JSON (vd "correctRate", "wrongByLevel", "wrongCount", "skippedCount"). Đây là văn bản giảng viên đọc trực tiếp, phải là câu tiếng Việt tự nhiên hoàn toàn — nhắc đến slide thì gọi bằng title (vd "slide Spectrum: Bot → Chatbot → Agent") kèm số trang (vd "trang 5"), không bao giờ bằng mã nội bộ.
- summary: 2-3 câu tổng quan tình hình lớp, bằng tiếng Việt tự nhiên, gọi tên slide bằng title/số trang như trên.
- priorityActions: tối đa 3 mục, mỗi mục PHẢI dùng đúng 1 slideId có trong SLIDE_STATS (field slideId dùng để nối dữ liệu, không phải để in ra chữ). SLIDE_STATS đã được sắp sẵn theo mức độ nghiêm trọng giảm dần — giữ nguyên thứ tự đó.
- reason: giải thích ngắn vì sao đáng chú ý, viết lại bằng lời tự nhiên (vd "6 học viên trả lời sai", "5 học viên bỏ qua không trả lời"), theo đúng khung phân tích ở trên — nói rõ đây là hiểu lầm cụ thể hay hoàn toàn chưa biết gì.
- suggestedAction: gợi ý hành động cụ thể theo đúng khung phân tích: wrongCount trội -> nêu rõ hiểu lầm là gì và cách sửa; skippedCount trội -> đề xuất dạy lại/giới thiệu lại nội dung từ đầu, không giả định học viên đã hiểu sai gì. Nếu cả hai đều cao, nêu cả hai hướng. Ngoài ra dùng wrongByLevel để tinh chỉnh thêm (không nhắc tên trường trong câu trả lời): hiểu sai khái niệm nhiều hơn áp dụng sai -> dạy lại lý thuyết; áp dụng sai nhiều hơn -> cho luyện bài tập tình huống thay vì giảng lại lý thuyết.
- Nếu SLIDE_STATS rỗng, trả summary giải thích chưa đủ dữ liệu và priorityActions=[].

JSON_OUTPUT
{"summary":"string","priorityActions":[{"slideId":"string","reason":"string","suggestedAction":"string"}]}

SLIDE_STATS=${JSON.stringify(weakSlides)}`;
}

function validateBrief(value: unknown, allowedSlideIds: Set<string>): Brief {
  if (!value || typeof value !== "object") throw new Error("Brief không phải object");
  const record = value as Record<string, unknown>;
  const summary = record.summary;
  if (typeof summary !== "string" || !summary.trim()) {
    throw new Error("summary không hợp lệ");
  }
  const rawActions = record.priorityActions;
  if (!Array.isArray(rawActions)) throw new Error("priorityActions không hợp lệ");
  const priorityActions = rawActions.slice(0, 3).map((item) => {
    if (!item || typeof item !== "object") throw new Error("priorityAction không hợp lệ");
    const action = item as Record<string, unknown>;
    const slideId = action.slideId;
    if (typeof slideId !== "string" || !allowedSlideIds.has(slideId)) {
      throw new Error("priorityAction trích slideId ngoài dữ liệu thật");
    }
    const reason = action.reason;
    const suggestedAction = action.suggestedAction;
    if (typeof reason !== "string" || !reason.trim()) throw new Error("reason không hợp lệ");
    if (typeof suggestedAction !== "string" || !suggestedAction.trim()) {
      throw new Error("suggestedAction không hợp lệ");
    }
    return { slideId, reason, suggestedAction };
  });
  return { summary, priorityActions };
}

async function generateFreshBrief(stats: ClassOverviewStats) {
  if (stats.totalAttempts === 0) {
    const empty = { summary: "Chưa có lượt làm quiz nào để phân tích.", priorityActions: [] };
    await saveLatestBrief(empty, 0);
    return { brief: empty, meta: null };
  }
  const allowedSlideIds = new Set(stats.slides.map((slide) => slide.slideId));
  const response = await callDeepSeekJson(buildPrompt(stats), { maxTokens: 1800 });
  const brief = validateBrief(response.value, allowedSlideIds);

  const enriched = {
    summary: brief.summary,
    priorityActions: brief.priorityActions.map((action) => {
      const slide = stats.slides.find((s) => s.slideId === action.slideId);
      return {
        ...action,
        title: slide?.title ?? action.slideId,
        chapterTitle: slide?.chapterTitle ?? "",
        pdfPage: slide?.pdfPage ?? null,
        displaySlideNumber: slide?.displaySlideNumber ?? null,
        correctRate: slide?.correctRate ?? null,
      };
    }),
  };

  await saveLatestBrief(enriched, stats.totalAttempts);
  return { brief: enriched, meta: response.meta };
}

// Luôn phân tích lại (không kiểm tra cache) — dùng nếu sau này cần nút làm mới thủ công.
export async function POST() {
  try {
    const stats = await computeClassOverviewStats();
    const result = await generateFreshBrief(stats);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi không xác định";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

// Tự quyết định dùng bản lưu hay phân tích lại, dựa trên số lượt làm quiz đã đổi chưa.
export async function GET() {
  try {
    const stats = await computeClassOverviewStats();
    const saved = await getLatestBrief();
    if (saved && saved.basedOnAttemptCount === stats.totalAttempts) {
      return Response.json({ ok: true, brief: saved.brief, stale: false });
    }
    const result = await generateFreshBrief(stats);
    return Response.json({ ok: true, brief: result.brief, stale: false, refreshed: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi không xác định";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
