// Lưu kết quả AI Brief lần gần nhất, KÈM số lượt làm quiz đã dùng để phân
// tích — để biết dữ liệu có mới hơn bản đã lưu không (dùng ở route brief để
// tự làm mới khi có học viên làm quiz thêm, không cần bấm nút, cũng không gọi
// AI thừa khi chưa có gì đổi). Dùng chung R2 bucket với attempts-store.ts.
import { bucket } from "./attempts-store";

const FILE_KEY = "brief-latest.json";

type StoredBrief = {
  brief: unknown;
  basedOnAttemptCount: number;
  savedAt: string;
};

export async function saveLatestBrief(brief: unknown, basedOnAttemptCount: number): Promise<void> {
  const record: StoredBrief = { brief, basedOnAttemptCount, savedAt: new Date().toISOString() };
  await bucket().put(FILE_KEY, JSON.stringify(record, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
}

export async function getLatestBrief(): Promise<StoredBrief | null> {
  const object = await bucket().get(FILE_KEY);
  if (!object) return null;
  const parsed = await object.json<StoredBrief>();
  return parsed ?? null;
}
