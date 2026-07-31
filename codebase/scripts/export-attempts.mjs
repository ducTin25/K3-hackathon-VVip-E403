// Xuất dữ liệu "Tổng quan lớp" (đang lưu trong R2) ra 1 file JSON thật để xem tay.
// Chạy Node thường (ngoài Workers) nên ghi file được bình thường.
// Chạy: node scripts/export-attempts.mjs [http://localhost:PORT]
import { writeFile } from "node:fs/promises";

const base = process.argv[2] || "http://localhost:3000";
const res = await fetch(`${base}/api/class-overview`);
if (!res.ok) {
  console.error(`Gọi ${base}/api/class-overview thất bại: HTTP ${res.status}`);
  process.exit(1);
}
const data = await res.json();
const outPath = "data/attempts-export.json";
await writeFile(outPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Đã xuất ${data.summary?.totalAttempts ?? 0} lượt làm ra ${outPath}`);
