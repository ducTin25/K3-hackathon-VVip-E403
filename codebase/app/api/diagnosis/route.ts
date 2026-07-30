import { analyzeAttempt, type SubmittedAttempt } from "../../../lib/diagnosis";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmittedAttempt;
    const response = await analyzeAttempt(body);
    return Response.json({ ok: true, ...response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi không xác định";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
}
