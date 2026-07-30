import { callDeepSeekJson } from "./deepseek";
import {
  allowedReviewResources,
  lessonData,
  type QuizScope,
} from "./lesson";
import type { QuizQuestion } from "./quiz-generator";

export type SubmittedAttempt = {
  scope: QuizScope;
  questions: QuizQuestion[];
  selectedOptions: Array<number | null>;
};

export type LearningDiagnosis = {
  overallSummary: string;
  strengths: Array<{
    topic: string;
    evidenceQuestionIds: string[];
  }>;
  weaknesses: Array<{
    topic: string;
    misconception: string;
    severity: "high" | "medium" | "low";
    evidenceQuestionIds: string[];
    sourceSlideIds: string[];
  }>;
  recommendations: Array<{
    priority: number;
    knowledgePointId: string;
    reason: string;
    slideIds: string[];
    suggestedAction: string;
  }>;
  confidence: "high" | "medium" | "low";
  limitations: string[];
};

export function buildAttemptEvidence(attempt: SubmittedAttempt) {
  if (
    attempt.questions.length === 0 ||
    attempt.questions.length !== attempt.selectedOptions.length
  ) {
    throw new Error("Dữ liệu lượt làm bài không hợp lệ");
  }

  const validSlides = new Set(lessonData.slides.map((slide) => slide.slideId));
  const answers = attempt.questions.map((question, index) => {
    if (!validSlides.has(question.sourceRef.slideId)) {
      throw new Error("Câu hỏi chứa nguồn không hợp lệ");
    }
    const selectedOption = attempt.selectedOptions[index];
    if (
      selectedOption !== null &&
      (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption > 3)
    ) {
      throw new Error("Lựa chọn của học viên không hợp lệ");
    }
    const isCorrect = selectedOption === question.correctOption;
    return {
      questionId: question.id,
      topic: question.topic,
      selectedOption,
      correctOption: question.correctOption,
      isCorrect,
      selectedMisconception:
        selectedOption === null || isCorrect
          ? ""
          : question.misconceptions[selectedOption],
      sourceSlideId: question.sourceRef.slideId,
    };
  });
  return {
    score: answers.filter((answer) => answer.isCorrect).length,
    totalQuestions: answers.length,
    answers,
  };
}

export async function analyzeAttempt(attempt: SubmittedAttempt) {
  const evidence = buildAttemptEvidence(attempt);
  const slideIds = new Set(attempt.questions.map((q) => q.sourceRef.slideId));
  const slides = lessonData.slides.filter((slide) => slideIds.has(slide.slideId));
  const resources = allowedReviewResources(slides);
  const fallback = buildFallbackDiagnosis(evidence, resources);

  try {
    const response = await callDeepSeekJson(
      buildDiagnosisPrompt(evidence, resources),
      { maxTokens: 3500 },
    );
    const diagnosis = validateDiagnosis(response.value, evidence, resources);
    return {
      score: evidence.score,
      totalQuestions: evidence.totalQuestions,
      diagnosis,
      fallback: false,
      meta: response.meta,
    };
  } catch (error) {
    return {
      score: evidence.score,
      totalQuestions: evidence.totalQuestions,
      diagnosis: fallback,
      fallback: true,
      warning:
        error instanceof Error
          ? `AI chưa thể phân tích: ${error.message}`
          : "AI chưa thể phân tích kết quả",
    };
  }
}

function buildDiagnosisPrompt(
  evidence: ReturnType<typeof buildAttemptEvidence>,
  resources: ReturnType<typeof allowedReviewResources>,
) {
  return `Bạn là Learning Diagnostic Analyzer của hệ thống VLearn.

NHIỆM VỤ
Phân tích ATTEMPT_EVIDENCE và tạo kế hoạch ôn tập ngắn gọn bằng tiếng Việt.

QUY TẮC
- Không tính lại hoặc thay đổi score.
- Chỉ dùng đúng/sai, misconception, topic, sourceSlideId và ALLOWED_REVIEW_RESOURCES.
- Không suy luận về trí thông minh, thái độ hoặc năng lực tổng quát của học viên.
- Mỗi weakness phải dẫn ít nhất một questionId thực sự sai.
- Mỗi recommendation chỉ được dùng knowledgePointId và slideIds trong allowlist.
- Một câu sai chỉ tạo tín hiệu confidence thấp; ưu tiên hiểu sai lặp lại.
- Không khuyên học lại toàn bài nếu chỉ sai một điểm kiến thức.
- Chỉ trả một JSON object, không thêm Markdown.

JSON_OUTPUT
{
  "overallSummary": "string",
  "strengths": [{"topic":"string","evidenceQuestionIds":["string"]}],
  "weaknesses": [{
    "topic":"string",
    "misconception":"string",
    "severity":"high|medium|low",
    "evidenceQuestionIds":["string"],
    "sourceSlideIds":["string"]
  }],
  "recommendations": [{
    "priority":1,
    "knowledgePointId":"string",
    "reason":"string",
    "slideIds":["string"],
    "suggestedAction":"string"
  }],
  "confidence":"high|medium|low",
  "limitations":["string"]
}

ATTEMPT_EVIDENCE=${JSON.stringify(evidence)}
ALLOWED_REVIEW_RESOURCES=${JSON.stringify(resources)}`;
}

function validateDiagnosis(
  value: unknown,
  evidence: ReturnType<typeof buildAttemptEvidence>,
  resources: ReturnType<typeof allowedReviewResources>,
): LearningDiagnosis {
  if (!isRecord(value)) throw new Error("Diagnosis không phải object");
  const wrongIds = new Set(
    evidence.answers.filter((answer) => !answer.isCorrect).map((answer) => answer.questionId),
  );
  const correctIds = new Set(
    evidence.answers.filter((answer) => answer.isCorrect).map((answer) => answer.questionId),
  );
  const resourceMap = new Map(resources.map((resource) => [resource.knowledgePointId, resource]));

  const strengths = requireArray(value.strengths, "strengths").map((item) => {
    if (!isRecord(item)) throw new Error("Strength không hợp lệ");
    const ids = requireTextArray(item.evidenceQuestionIds, "evidenceQuestionIds");
    if (ids.some((id) => !correctIds.has(id))) {
      throw new Error("Strength trích câu không đúng");
    }
    return { topic: requireText(item.topic, "topic"), evidenceQuestionIds: ids };
  });
  const weaknesses = requireArray(value.weaknesses, "weaknesses").map((item) => {
    if (!isRecord(item)) throw new Error("Weakness không hợp lệ");
    const ids = requireTextArray(item.evidenceQuestionIds, "evidenceQuestionIds");
    if (ids.length === 0 || ids.some((id) => !wrongIds.has(id))) {
      throw new Error("Weakness không có bằng chứng câu sai");
    }
    const sourceSlideIds = requireTextArray(item.sourceSlideIds, "sourceSlideIds");
    if (
      sourceSlideIds.some(
        (slideId) => !evidence.answers.some((answer) => answer.sourceSlideId === slideId),
      )
    ) {
      throw new Error("Weakness trích slide ngoài lượt làm");
    }
    if (!["high", "medium", "low"].includes(String(item.severity))) {
      throw new Error("Severity không hợp lệ");
    }
    return {
      topic: requireText(item.topic, "topic"),
      misconception: requireText(item.misconception, "misconception"),
      severity: item.severity as "high" | "medium" | "low",
      evidenceQuestionIds: ids,
      sourceSlideIds,
    };
  });
  const recommendations = requireArray(value.recommendations, "recommendations").map(
    (item, index) => {
      if (!isRecord(item)) throw new Error("Recommendation không hợp lệ");
      const knowledgePointId = requireText(item.knowledgePointId, "knowledgePointId");
      const resource = resourceMap.get(knowledgePointId);
      if (!resource) throw new Error("Recommendation ngoài allowlist");
      const slideIds = requireTextArray(item.slideIds, "slideIds");
      if (slideIds.some((slideId) => !resource.slideIds.includes(slideId))) {
        throw new Error("Recommendation chứa slide ngoài allowlist");
      }
      return {
        priority:
          Number.isInteger(item.priority) && Number(item.priority) > 0
            ? Number(item.priority)
            : index + 1,
        knowledgePointId,
        reason: requireText(item.reason, "reason"),
        slideIds,
        suggestedAction: requireText(item.suggestedAction, "suggestedAction"),
      };
    },
  );
  if (!["high", "medium", "low"].includes(String(value.confidence))) {
    throw new Error("Confidence không hợp lệ");
  }

  return {
    overallSummary: requireText(value.overallSummary, "overallSummary"),
    strengths,
    weaknesses,
    recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    confidence: value.confidence as "high" | "medium" | "low",
    limitations: requireTextArray(value.limitations, "limitations"),
  };
}

function buildFallbackDiagnosis(
  evidence: ReturnType<typeof buildAttemptEvidence>,
  resources: ReturnType<typeof allowedReviewResources>,
): LearningDiagnosis {
  const correct = evidence.answers.filter((answer) => answer.isCorrect);
  const wrong = evidence.answers.filter((answer) => !answer.isCorrect);
  const correctTopics = [...new Set(correct.map((answer) => answer.topic))];
  const wrongTopics = [...new Set(wrong.map((answer) => answer.topic))];
  const recommendations = resources
    .filter((resource) =>
      wrong.some((answer) => resource.slideIds.includes(answer.sourceSlideId)),
    )
    .slice(0, 3)
    .map((resource, index) => ({
      priority: index + 1,
      knowledgePointId: resource.knowledgePointId,
      reason: `Có câu trả lời chưa đúng liên quan đến ${resource.title}.`,
      slideIds: resource.slideIds,
      suggestedAction: `Xem lại ${resource.title} và thử làm lại câu liên quan.`,
    }));

  return {
    overallSummary:
      wrong.length === 0
        ? "Bạn đã trả lời đúng toàn bộ câu hỏi trong lượt kiểm tra này."
        : `Bạn trả lời đúng ${evidence.score}/${evidence.totalQuestions} câu. Hãy tập trung vào ${wrongTopics.join(", ")}.`,
    strengths: correctTopics.map((topic) => ({
      topic,
      evidenceQuestionIds: correct
        .filter((answer) => answer.topic === topic)
        .map((answer) => answer.questionId),
    })),
    weaknesses: wrongTopics.map((topic) => {
      const matching = wrong.filter((answer) => answer.topic === topic);
      return {
        topic,
        misconception:
          matching.map((answer) => answer.selectedMisconception).filter(Boolean)[0] ??
          "Cần xem lại khái niệm liên quan.",
        severity: matching.length > 1 ? "medium" : "low",
        evidenceQuestionIds: matching.map((answer) => answer.questionId),
        sourceSlideIds: [...new Set(matching.map((answer) => answer.sourceSlideId))],
      };
    }),
    recommendations,
    confidence: wrong.length > 1 ? "medium" : "low",
    limitations: ["Đây là thống kê dự phòng bằng luật vì AI chưa thể phân tích lượt làm."],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${field} phải là mảng`);
  return value;
}
function requireText(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} phải là chuỗi không rỗng`);
  }
  return value.trim();
}
function requireTextArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} phải là mảng chuỗi`);
  }
  return value;
}
