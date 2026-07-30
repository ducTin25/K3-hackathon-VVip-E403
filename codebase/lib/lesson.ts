import day03 from "../data/lessons/DAY03.json";

export type QuizScope =
  | { type: "lesson"; lessonId: string }
  | { type: "chapter"; lessonId: string; chapterId: string }
  | { type: "knowledge_point"; lessonId: string; knowledgePointId: string };

export type LessonSlide = (typeof day03.slides)[number];
export type LessonData = typeof day03;

export const lessonData: LessonData = day03;

export function resolveScope(scope: QuizScope): LessonSlide[] {
  if (scope.lessonId !== lessonData.lesson.lessonId) {
    throw new Error("Không tìm thấy bài học");
  }

  let slideIds: string[] | null = null;
  if (scope.type === "knowledge_point") {
    const point = lessonData.knowledgePoints.find(
      (item) => item.knowledgePointId === scope.knowledgePointId,
    );
    if (!point) throw new Error("Không tìm thấy điểm kiến thức");
    slideIds = point.slideIds;
  }

  return lessonData.slides.filter((slide) => {
    if (!slide.quizEligible || slide.reviewStatus !== "approved") return false;
    if (scope.type === "chapter" && slide.chapterId !== scope.chapterId) return false;
    if (slideIds && !slideIds.includes(slide.slideId)) return false;
    return true;
  });
}

export function allowedReviewResources(slides: LessonSlide[]) {
  const slideIds = new Set(slides.map((slide) => slide.slideId));
  return lessonData.knowledgePoints
    .map((point) => ({
      ...point,
      slideIds: point.slideIds.filter((slideId) => slideIds.has(slideId)),
    }))
    .filter((point) => point.slideIds.length > 0);
}

export function publicLessonCatalog() {
  return {
    course: lessonData.course,
    lesson: lessonData.lesson,
    chapters: lessonData.chapters,
    knowledgePoints: lessonData.knowledgePoints,
    slides: lessonData.slides.map((slide) => ({
      slideId: slide.slideId,
      displaySlideNumber: slide.displaySlideNumber,
      chapterId: slide.chapterId,
      title: slide.title,
      summary: slide.summary,
      knowledgePointIds: slide.knowledgePointIds,
    })),
  };
}
