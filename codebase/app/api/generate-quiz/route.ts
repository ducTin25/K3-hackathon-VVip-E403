import { generateDiagnosticQuiz } from "../../../lib/quiz-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await generateDiagnosticQuiz({
      sourceId: String(body.sourceId ?? ""),
      page: typeof body.page === "number" ? body.page : null,
      slideText: String(body.slideText ?? ""),
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 400;
    return Response.json({ ok: false, error: message }, { status });
  }
}
