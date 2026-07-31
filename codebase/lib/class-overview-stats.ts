// Gom logic thống kê dùng chung cho /api/class-overview và /api/class-overview/brief.
// File MỚI, chỉ đọc dữ liệu đã lưu qua lib/attempts-store.ts — không đụng
// lib/quiz-generator.ts, lib/diagnosis.ts.
import { getAllAttempts } from "./attempts-store";
import { lessonData } from "./lesson";

export type SlideStat = {
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
  // Sai vì chưa hiểu khái niệm (level="understand") khác sai vì chưa áp dụng
  // được (level="apply") dù đã hiểu — hai loại cần cách dạy lại khác nhau.
  wrongByLevel: { understand: number; apply: number };
};

export type ClassOverviewStats = {
  totalAttempts: number;
  averageScorePercent: number;
  slides: SlideStat[];
};

export async function computeClassOverviewStats(): Promise<ClassOverviewStats> {
  const attempts = await getAllAttempts();
  const slideMap = new Map(lessonData.slides.map((slide) => [slide.slideId, slide]));
  const chapterMap = new Map(
    lessonData.chapters.map((chapter) => [chapter.chapterId, chapter.title]),
  );

  const bySlide = new Map<
    string,
    {
      correct: number;
      wrong: number;
      skipped: number;
      misconceptions: Map<string, number>;
      wrongByLevel: { understand: number; apply: number };
    }
  >();

  let totalScore = 0;
  let totalAnswered = 0;

  for (const attempt of attempts) {
    totalScore += attempt.score;
    totalAnswered += attempt.answeredQuestions;
    for (const answer of attempt.answers) {
      const bucket = bySlide.get(answer.sourceSlideId) ?? {
        correct: 0,
        wrong: 0,
        skipped: 0,
        misconceptions: new Map<string, number>(),
        wrongByLevel: { understand: 0, apply: 0 },
      };
      if (answer.isSkipped) bucket.skipped += 1;
      else if (answer.isCorrect) bucket.correct += 1;
      else {
        bucket.wrong += 1;
        bucket.wrongByLevel[answer.level] += 1;
        if (answer.misconception) {
          bucket.misconceptions.set(
            answer.misconception,
            (bucket.misconceptions.get(answer.misconception) ?? 0) + 1,
          );
        }
      }
      bySlide.set(answer.sourceSlideId, bucket);
    }
  }

  const slides: SlideStat[] = [...bySlide.entries()].map(([slideId, stat]) => {
    const slide = slideMap.get(slideId);
    const total = stat.correct + stat.wrong + stat.skipped;
    return {
      slideId,
      title: slide?.title ?? slideId,
      chapterTitle: slide ? (chapterMap.get(slide.chapterId) ?? "") : "",
      pdfPage: slide?.pdfPage ?? null,
      displaySlideNumber: slide?.displaySlideNumber ?? null,
      totalAnswered: total,
      correctCount: stat.correct,
      wrongCount: stat.wrong,
      skippedCount: stat.skipped,
      correctRate: total > 0 ? Math.round((stat.correct / total) * 100) : 0,
      topMisconceptions: [...stat.misconceptions.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([text, count]) => ({ text, count })),
      wrongByLevel: stat.wrongByLevel,
    };
  });

  slides.sort((a, b) => a.correctRate - b.correctRate);

  return {
    totalAttempts: attempts.length,
    averageScorePercent:
      attempts.length > 0 && totalAnswered > 0
        ? Math.round((totalScore / totalAnswered) * 100)
        : 0,
    slides,
  };
}
