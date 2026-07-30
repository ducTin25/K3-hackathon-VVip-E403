import { generateQuiz } from "../../../lib/quiz-generator";
import type { QuizScope } from "../../../lib/lesson";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      scope?: QuizScope;
      questionCount?: number;
    };
    if (!body.scope || !["lesson", "chapter", "knowledge_point"].includes(body.scope.type)) {
      throw new Error("Phạm vi quiz không hợp lệ");
    }
    if (body.questionCount !== 5 && body.questionCount !== 10) {
      throw new Error("Số câu hỏi chỉ có thể là 5 hoặc 10");
    }
    const response = await generateQuiz({
      scope: body.scope,
      questionCount: body.questionCount,
    });
    return Response.json({ ok: true, ...response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi không xác định";
    const status = message.includes("DEEPSEEK_API_KEY") ? 503 : 400;
    return Response.json({ ok: false, error: message }, { status });
  }
}
