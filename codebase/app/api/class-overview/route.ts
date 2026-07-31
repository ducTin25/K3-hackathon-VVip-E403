// Route MỚI, chỉ đọc — tổng hợp thống kê từ các lượt làm đã lưu qua /api/attempts.
// Không AI, không đụng lib/quiz-generator.ts hay lib/diagnosis.ts. Thuần đếm.
import { computeClassOverviewStats } from "../../../lib/class-overview-stats";

export async function GET() {
  const stats = await computeClassOverviewStats();
  return Response.json({
    ok: true,
    summary: {
      totalAttempts: stats.totalAttempts,
      averageScorePercent: stats.averageScorePercent,
    },
    slides: stats.slides,
  });
}
