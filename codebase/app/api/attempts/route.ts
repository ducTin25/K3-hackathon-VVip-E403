// Route MỚI — lưu 1 lượt làm quiz đã hoàn thành. Không đụng /api/generate-quiz
// hay /api/diagnosis. Học viên gọi route này SAU khi đã có kết quả, không nằm
// trên đường xử lý AI trung tâm — lỗi ở đây không được phép ảnh hưởng trải
// nghiệm học viên (client gọi fire-and-forget, xem app/page.tsx).
import { saveAttempt, type AttemptAnswer } from "../../../lib/attempts-store";

type AttemptPayload = {
  scopeType: "lesson" | "chapter" | "slide";
  scopeId: string;
  score: number;
  answeredQuestions: number;
  skippedQuestions: number;
  totalQuestions: number;
  answers: AttemptAnswer[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AttemptPayload>;
    if (
      !body ||
      typeof body.scopeType !== "string" ||
      typeof body.scopeId !== "string" ||
      !Array.isArray(body.answers)
    ) {
      return Response.json({ ok: false, error: "Payload không hợp lệ" }, { status: 400 });
    }
    const saved = await saveAttempt({
      scopeType: body.scopeType as AttemptPayload["scopeType"],
      scopeId: body.scopeId,
      score: Number(body.score) || 0,
      answeredQuestions: Number(body.answeredQuestions) || 0,
      skippedQuestions: Number(body.skippedQuestions) || 0,
      totalQuestions: Number(body.totalQuestions) || 0,
      answers: body.answers as AttemptAnswer[],
    });
    return Response.json({ ok: true, id: saved.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi không xác định";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
