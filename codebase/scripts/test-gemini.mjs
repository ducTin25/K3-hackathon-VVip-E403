// Kiểm tra GEMINI_API_KEY hợp lệ + xem model nào khả dụng (có vision hay không).
// Chạy: node --env-file=.env scripts/test-gemini.mjs
// KHÔNG bao giờ in giá trị key ra console/log.
const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("Thiếu GEMINI_API_KEY trong .env");
  process.exit(1);
}

const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
  headers: { "x-goog-api-key": key },
});

if (!res.ok) {
  console.error(`Key KHÔNG hợp lệ hoặc lỗi khác — HTTP ${res.status}`);
  const body = await res.text();
  console.error(body.slice(0, 300));
  process.exit(1);
}

const data = await res.json();
const models = (data.models || []).map((m) => m.name.replace("models/", ""));
const visionCandidates = models.filter((m) => /flash|pro|vision/i.test(m));

console.log(`Key hợp lệ. Tổng ${models.length} model khả dụng.`);
console.log("Vài model có khả năng dùng cho đọc ảnh:", visionCandidates.slice(0, 8).join(", "));
