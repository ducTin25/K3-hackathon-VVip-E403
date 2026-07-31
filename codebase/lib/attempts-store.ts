// Lưu trữ lượt làm quiz cho trang "Tổng quan lớp" (giảng viên) — 1 file JSON
// thật, sống sót qua restart server. File MỚI, KHÔNG đụng lib/diagnosis.ts hay
// lib/quiz-generator.ts đã hoàn thiện.
//
// Đã thử 3 cách trước khi chọn cách này:
//  1. node:fs ghi file -> lỗi "operation not permitted": Workers runtime không
//     có filesystem ghi được kể cả khi bật nodejs_compat.
//  2. Cloudflare D1 (getDb() có sẵn trong db/index.ts) -> bảng chỉ tạo được khi
//     DEPLOY thật lên platform (cần migration áp dụng phía server) — không chạy
//     local, không áp dụng cho hackathon (không yêu cầu deploy).
//  3. Biến trong bộ nhớ (đã dùng tạm) -> mất khi restart server.
// -> Cloudflare R2 (lưu object/file, KHÔNG cần migration như D1) mô phỏng được
//    cục bộ qua Miniflare mà không cần deploy thật — bật ở .openai/hosting.json
//    ("r2": "BUCKET"). Đây chính là "file JSON" người dùng muốn, chỉ khác chỗ
//    lưu vật lý là R2 (bind tên BUCKET) thay vì đĩa cục bộ, vì Workers không có
//    đĩa cục bộ thật.
import { env } from "cloudflare:workers";

export type AttemptAnswer = {
  questionId: string;
  topic: string;
  sourceSlideId: string;
  isCorrect: boolean;
  isSkipped: boolean;
  misconception: string;
  level: "understand" | "apply";
  confidence: "high" | "medium";
};

export type AttemptRecord = {
  id: string;
  scopeType: "lesson" | "chapter" | "slide";
  scopeId: string;
  createdAt: string;
  score: number;
  answeredQuestions: number;
  skippedQuestions: number;
  totalQuestions: number;
  answers: AttemptAnswer[];
};

const FILE_KEY = "attempts.json";

interface Env {
  BUCKET: R2Bucket;
}

export function bucket(): R2Bucket {
  const bound = (env as unknown as Env).BUCKET;
  if (!bound) {
    throw new Error(
      "R2 binding `BUCKET` không khả dụng. Kiểm tra .openai/hosting.json có \"r2\": \"BUCKET\" và đã restart dev server chưa.",
    );
  }
  return bound;
}

async function readAll(): Promise<AttemptRecord[]> {
  const object = await bucket().get(FILE_KEY);
  if (!object) return [];
  const parsed = await object.json<unknown>();
  return Array.isArray(parsed) ? (parsed as AttemptRecord[]) : [];
}

export async function saveAttempt(
  record: Omit<AttemptRecord, "id" | "createdAt">,
): Promise<AttemptRecord> {
  const all = await readAll();
  const saved: AttemptRecord = {
    ...record,
    id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(saved);
  await bucket().put(FILE_KEY, JSON.stringify(all, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
  return saved;
}

export async function getAllAttempts(): Promise<AttemptRecord[]> {
  return readAll();
}
