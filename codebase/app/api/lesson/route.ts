import { publicLessonCatalog } from "../../../lib/lesson";

export async function GET() {
  return Response.json({ ok: true, catalog: publicLessonCatalog() });
}
