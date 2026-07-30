import day03 from "../data/lessons/DAY03.json";

export type QuizScope =
  | { type: "lesson"; lessonId: string }
  | { type: "chapter"; lessonId: string; chapterId: string }
  | { type: "slide"; lessonId: string; slideId: string };

export type LessonSlide = (typeof day03.slides)[number];
export type LessonData = typeof day03;

export const lessonData: LessonData = day03;
export const lessonPdfPath =
  "/slides/day03-tu-chatbot-den-agentic-agent-react-v7.pdf";

export function resolveScope(scope: QuizScope): LessonSlide[] {
  if (scope.lessonId !== lessonData.lesson.lessonId) {
    throw new Error("Không tìm thấy bài học");
  }

  return lessonData.slides.filter((slide) => {
    if (!slide.quizEligible || slide.reviewStatus !== "approved") return false;
    if (scope.type === "chapter" && slide.chapterId !== scope.chapterId) return false;
    if (scope.type === "slide" && slide.slideId !== scope.slideId) return false;
    return true;
  });
}

export function allowedReviewResources(slides: LessonSlide[]) {
  return slides.map((slide) => ({
    knowledgePointId: slide.slideId,
    title: slide.title,
    slideIds: [slide.slideId],
  }));
}

export function publicLessonCatalog() {
  return {
    course: lessonData.course,
    lesson: lessonData.lesson,
    chapters: lessonData.chapters,
    pdfPath: lessonPdfPath,
    slides: lessonData.slides.map((slide) => ({
      slideId: slide.slideId,
      pdfPage: slide.pdfPage,
      displaySlideNumber: slide.displaySlideNumber,
      chapterId: slide.chapterId,
      title: slide.title,
      quizEligible: slide.quizEligible,
      reviewStatus: slide.reviewStatus,
    })),
  };
}
